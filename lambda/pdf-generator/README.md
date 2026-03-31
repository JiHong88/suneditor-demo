# PDF Generator Lambda

Vercel 250MB 제한으로 인해 puppeteer 기반 PDF 생성을 AWS Lambda로 분리.

## 사전 준비

1. AWS CLI 설치 및 설정
```bash
aws configure
# Access Key, Secret Key, Region(us-east-1) 입력
```

2. Node.js 20.x 설치 (Lambda 런타임과 동일)

## 배포

```bash
cd lambda/pdf-generator
chmod +x deploy.sh
bash deploy.sh
```

스크립트가 자동으로 수행하는 작업:
- `npm ci --omit=dev` (puppeteer-core + @sparticuz/chromium 설치)
- `function.zip` 생성
- IAM Role 생성 (`suneditor-pdf-generator-role`)
- Lambda 함수 생성/업데이트 (`suneditor-pdf-generator`)
  - Runtime: Node.js 20.x
  - Memory: 1536MB
  - Timeout: 60s
  - Ephemeral Storage: 1024MB
- Function URL 생성 (HTTPS 엔드포인트)

## 배포 완료 후

스크립트 출력 마지막에 Function URL이 표시됨:
```
Function URL: https://xxxxx.lambda-url.us-east-1.on.aws/
```

이 URL을 **Vercel 환경변수**에 추가:
- Key: `PDF_LAMBDA_URL`
- Value: `https://xxxxx.lambda-url.us-east-1.on.aws/`

경로: Vercel Dashboard → Project → Settings → Environment Variables

## 업데이트

코드 수정 후 동일하게 `bash deploy.sh` 실행하면 자동으로 업데이트됨.

## 삭제

```bash
FUNCTION_NAME="suneditor-pdf-generator"
ROLE_NAME="suneditor-pdf-generator-role"

aws lambda delete-function-url-config --function-name $FUNCTION_NAME
aws lambda delete-function --function-name $FUNCTION_NAME
aws iam detach-role-policy --role-name $ROLE_NAME --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam delete-role --role-name $ROLE_NAME
```

## 구조

```
Browser → Vercel /api/download/pdf (proxy) → Lambda Function URL → PDF 반환
```

- Vercel route는 Lambda로 요청을 전달하고 PDF 바이너리를 그대로 반환
- `PDF_LAMBDA_URL` 미설정 시 로컬 Chrome으로 fallback (개발용)

## 비용

Lambda 사용량 기반 과금. 데모 사이트 수준 트래픽이면 거의 무료.
- 요청당 ~5초 x 1536MB 기준
- 프리티어: 월 100만 요청 + 400,000 GB-초 무료
