---
name: update-editor
description: suneditor 라이브러리를 최신 버전으로 업데이트하고, 릴리즈 노트를 분석하여 데모 사이트에 변경사항을 반영한다.
---

## 실행 순서

### 1. 현재 버전 확인 및 업데이트

```bash
# 현재 설치 버전 확인
node -e "console.log(require('./node_modules/suneditor/package.json').version)"

# npm 최신 버전 확인
npm view suneditor version

# 최신 버전 설치
npm i suneditor@latest
```

설치 후 현재 버전과 새 버전을 기록한다.

**버전 적용 여부 확인:**
사용자가 이미 버전 업데이트 후 이 스킬을 호출하는 경우가 있다. 에디터 버전이 데모에 반영됐는지 확인하려면 `api-docs.en.json`의 `version` 필드와 `node_modules/suneditor/package.json`의 `version`을 비교한다:

```bash
# 데모에 반영된 버전 (api-docs 기준)
node -e "console.log(require('./src/data/api/api-docs.en.json').version)"

# 실제 설치된 suneditor 버전
node -e "console.log(require('./node_modules/suneditor/package.json').version)"
```

- 두 버전이 **같으면**: 이미 docs:generate까지 완료된 상태. 릴리즈 노트 분석부터 진행.
- 두 버전이 **다르면**: npm 업데이트는 됐지만 문서 반영이 안 된 상태. Step 8(docs:generate)을 반드시 실행해야 한다.

### 2. 릴리즈 노트 확인

GitHub releases API로 현재 버전 이후의 모든 릴리즈 노트를 확인한다:

```bash
gh api repos/JiHong88/SunEditor/releases --jq '.[] | "\(.tag_name)\n\(.body)\n---"'
```

**node_modules에 릴리즈 노트 파일이 없으므로** 반드시 GitHub API로 확인한다.

### 3. 변경사항 분류

릴리즈 노트의 각 항목을 분류:

| 유형                   | 키워드                                   | 데모 사이트 반영 방법                                            |
| ---------------------- | ---------------------------------------- | ---------------------------------------------------------------- |
| **Breaking Change**    | `⚠️ Breaking`, rename, removed, replaced | 최우선 처리. `.editor-guide/DEMO-UPDATE-GUIDE.md` 의 Step 3 참조 |
| **New Option**         | new option, added                        | playground state/controls/codeGenerator에 추가                   |
| **New Plugin**         | new plugin                               | 버튼 + 옵션 + 기능데모 전부 추가                                 |
| **Default Change**     | default changed                          | DEFAULTS 값만 수정                                               |
| **Enhancement/Bugfix** | improve, fix                             | 데모 수정 불필요 (대부분)                                        |

### 4. Breaking Changes 처리 (최우선)

Breaking changes가 있으면 **반드시 먼저 처리**한다.

**플러그인/옵션 이름 변경 시:**

1. `grep -r "old_name" src/ server/ __tests__/` 로 모든 참조 찾기
2. 서비스 파일, API 라우트, 테스트 파일 리네임
3. playgroundState.ts: 인터페이스, DEFAULTS, stateToEditorOptions, PARAM_MAP, FIXED_PLUGIN_KEYS
4. codeGenerator.ts: 코드 생성 로직
5. PlaygroundPluginSidebar.tsx 또는 PlaygroundControls.tsx: UI
6. i18n: messages/_.json, option-descriptions._.json, api-docs.\*.json
7. featureDemoCategories, featureDemoSnippets, featurePlaygroundLinks, page.tsx 아이콘
8. plugin-guide, options page

**옵션 구조 변경 시:**

1. suneditor 타입 정의 확인: `node_modules/suneditor/types/`
2. stateToEditorOptions() 변환 로직 수정
3. codeGenerator.ts 코드 생성 수정

### 5. 새 옵션/기능 추가

`.editor-guide/DEMO-UPDATE-GUIDE.md`의 시나리오별 체크리스트를 따른다:

- 시나리오 A: 새 기능 추가
- 시나리오 B: 새 에디터 옵션 추가
- 시나리오 C: 새 플러그인 추가
- 시나리오 D: 툴바 버튼 추가/삭제

### 6. 검증

```bash
npm test                # integrity 테스트로 누락 감지
```

### 7. 가이드 문서 업데이트

변경사항이 가이드 문서에 영향을 주면 함께 수정:

- `.editor-guide/GUIDE.md` — 플러그인 목록, 디렉토리 구조 등
- `.editor-guide/DEMO-UPDATE-GUIDE.md` — 예시, 파일 목록 등

### 8. 문서 자동 생성 및 번역

모든 코드 변경이 끝난 후 마지막에 실행한다.

**`docs:generate`는 버전 업데이트 시 내용에 상관없이 반드시 실행한다.**

```bash
# 1) API 문서 재생성 (suneditor 타입에서 추출) — 항상 실행
npm run docs:generate
```

실행 후 `git diff`로 변경사항을 확인한다. **변경사항이 있으면** 번역을 실행:

```bash
# 2) docs:generate에서 변경사항이 있는 경우에만 실행
npm run docs:translate
```

```bash
# 3) messages/*.json 변경이 있는 경우에만 실행 (i18n 키 추가/변경/삭제 시)
npm run messages:translate
```

**`messages:translate` 실행 조건:**

- `messages/en.json`에 새 키를 추가한 경우
- 기존 키의 영문 텍스트를 변경한 경우
- 키 이름을 변경(rename)한 경우
- 단순 키 삭제만 한 경우는 실행 불필요 (다른 언어에서도 수동 삭제)
