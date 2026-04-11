#!/bin/bash
set -euo pipefail

FUNCTION_NAME="suneditor-pdf-generator"
REGION="${AWS_REGION:-ap-northeast-2}"
ROLE_NAME="${FUNCTION_NAME}-role"
S3_BUCKET="suneditor-files"
S3_KEY="lambda/function.zip"
API_NAME="${FUNCTION_NAME}-api"
MEMORY=1536
TIMEOUT=60
EPHEMERAL_STORAGE=1024
RUNTIME="nodejs20.x"
ARCHITECTURE="x86_64"

echo "=== Building Lambda package ==="
npm ci --omit=dev
zip -r -q function.zip index.mjs node_modules package.json

echo "=== Uploading to S3 ==="
aws s3 cp function.zip "s3://${S3_BUCKET}/${S3_KEY}" --region "$REGION"

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
    --code S3Bucket="$S3_BUCKET",S3Key="$S3_KEY" \
    --role "$ROLE_ARN" \
    --region "$REGION"
else
  echo "Updating function..."
  aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --s3-bucket "$S3_BUCKET" \
    --s3-key "$S3_KEY" \
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

echo "=== Configuring API Gateway ==="
API_ID=$(aws apigatewayv2 get-apis --region "$REGION" \
  --query "Items[?Name=='${API_NAME}'].ApiId" --output text 2>/dev/null || true)

LAMBDA_ARN="arn:aws:lambda:${REGION}:$(aws sts get-caller-identity --query Account --output text):function:${FUNCTION_NAME}"

if [ -z "$API_ID" ]; then
  echo "Creating HTTP API..."
  API_ID=$(aws apigatewayv2 create-api \
    --name "$API_NAME" \
    --protocol-type HTTP \
    --cors-configuration '{
      "AllowOrigins": ["*"],
      "AllowMethods": ["POST"],
      "AllowHeaders": ["Content-Type"]
    }' \
    --region "$REGION" \
    --query 'ApiId' --output text)

  # Create Lambda integration
  INTEGRATION_ID=$(aws apigatewayv2 create-integration \
    --api-id "$API_ID" \
    --integration-type AWS_PROXY \
    --integration-uri "$LAMBDA_ARN" \
    --payload-format-version "2.0" \
    --region "$REGION" \
    --query 'IntegrationId' --output text)

  # Create POST route
  aws apigatewayv2 create-route \
    --api-id "$API_ID" \
    --route-key "POST /" \
    --target "integrations/${INTEGRATION_ID}" \
    --region "$REGION" > /dev/null

  # Create default stage with auto-deploy
  aws apigatewayv2 create-stage \
    --api-id "$API_ID" \
    --stage-name '$default' \
    --auto-deploy \
    --region "$REGION" > /dev/null

  # Grant API Gateway permission to invoke Lambda
  aws lambda add-permission \
    --function-name "$FUNCTION_NAME" \
    --statement-id "ApiGatewayInvoke" \
    --action "lambda:InvokeFunction" \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:${REGION}:$(aws sts get-caller-identity --query Account --output text):${API_ID}/*" \
    --region "$REGION" 2>/dev/null || true
else
  echo "API Gateway already exists: $API_ID"
fi

API_URL="https://${API_ID}.execute-api.${REGION}.amazonaws.com"

# Cleanup
rm -f function.zip

echo ""
echo "=== Done ==="
echo "API URL: $API_URL"
echo ""
echo "Add this to Vercel environment variables:"
echo "  PDF_LAMBDA_URL=$API_URL"
