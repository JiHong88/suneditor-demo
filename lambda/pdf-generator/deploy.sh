#!/bin/bash
set -euo pipefail

FUNCTION_NAME="suneditor-pdf-generator"
REGION="${AWS_REGION:-us-east-1}"
ROLE_NAME="${FUNCTION_NAME}-role"
MEMORY=1536
TIMEOUT=60
EPHEMERAL_STORAGE=1024
RUNTIME="nodejs20.x"
ARCHITECTURE="x86_64"

echo "=== Building Lambda package ==="
npm ci --omit=dev
zip -r -q function.zip index.mjs node_modules package.json

echo "=== Checking IAM role ==="
ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query 'Role.Arn' --output text 2>/dev/null || true)

if [ -z "$ROLE_ARN" ] || [ "$ROLE_ARN" = "None" ]; then
  echo "Creating IAM role..."
  ROLE_ARN=$(aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{ "Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole" }]
    }' \
    --query 'Role.Arn' --output text)

  aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

  echo "Waiting for role propagation..."
  sleep 10
fi

echo "Role ARN: $ROLE_ARN"

echo "=== Deploying Lambda function ==="
EXISTING=$(aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" 2>/dev/null || true)

if [ -z "$EXISTING" ]; then
  echo "Creating function..."
  aws lambda create-function \
    --function-name "$FUNCTION_NAME" \
    --runtime "$RUNTIME" \
    --architecture "$ARCHITECTURE" \
    --handler index.handler \
    --memory-size "$MEMORY" \
    --timeout "$TIMEOUT" \
    --ephemeral-storage "Size=$EPHEMERAL_STORAGE" \
    --zip-file fileb://function.zip \
    --role "$ROLE_ARN" \
    --region "$REGION"
else
  echo "Updating function..."
  aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --zip-file fileb://function.zip \
    --region "$REGION"

  # Wait for update to complete before updating config
  aws lambda wait function-updated --function-name "$FUNCTION_NAME" --region "$REGION"

  aws lambda update-function-configuration \
    --function-name "$FUNCTION_NAME" \
    --runtime "$RUNTIME" \
    --memory-size "$MEMORY" \
    --timeout "$TIMEOUT" \
    --ephemeral-storage "Size=$EPHEMERAL_STORAGE" \
    --region "$REGION"
fi

echo "=== Configuring Function URL ==="
FUNC_URL=$(aws lambda get-function-url-config --function-name "$FUNCTION_NAME" --region "$REGION" 2>/dev/null || true)

if [ -z "$FUNC_URL" ]; then
  aws lambda add-permission \
    --function-name "$FUNCTION_NAME" \
    --statement-id "FunctionURLAllowPublicAccess" \
    --action "lambda:InvokeFunctionUrl" \
    --principal "*" \
    --function-url-auth-type NONE \
    --region "$REGION" 2>/dev/null || true

  FUNC_URL=$(aws lambda create-function-url-config \
    --function-name "$FUNCTION_NAME" \
    --auth-type NONE \
    --cors '{
      "AllowOrigins": ["*"],
      "AllowMethods": ["POST"],
      "AllowHeaders": ["Content-Type"]
    }' \
    --region "$REGION" \
    --query 'FunctionUrl' --output text)
else
  FUNC_URL=$(echo "$FUNC_URL" | python3 -c "import sys,json; print(json.load(sys.stdin)['FunctionUrl'])" 2>/dev/null || echo "$FUNC_URL")

  aws lambda update-function-url-config \
    --function-name "$FUNCTION_NAME" \
    --auth-type NONE \
    --cors '{
      "AllowOrigins": ["*"],
      "AllowMethods": ["POST"],
      "AllowHeaders": ["Content-Type"]
    }' \
    --region "$REGION" > /dev/null
fi

# Cleanup
rm -f function.zip

echo ""
echo "=== Done ==="
echo "Function URL: $FUNC_URL"
echo ""
echo "Add this to Vercel environment variables:"
echo "  PDF_LAMBDA_URL=$FUNC_URL"
