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
9. **`src/data/v2-to-v3-options.ts` 갱신 (아래 v2 마이그레이션 섹션 참조)**

**옵션 삭제 시 (removed):**

1. `grep -r "removed_name" src/ server/ __tests__/` 로 모든 참조 제거
2. playgroundState.ts: 인터페이스/DEFAULTS/PARAM_MAP/stateToEditorOptions에서 키 제거
3. codeGenerator.ts: 해당 옵션 생성 로직 제거
4. UI: PlaygroundControls/PluginSidebar에서 컨트롤 제거 (플러그인 전체가 삭제됐다면 FIXED_PLUGIN_KEYS, 카탈로그, 프리셋, 아이콘 매핑까지)
5. i18n: messages/option-descriptions/api-docs JSON에서 키 삭제 (모든 로케일)
6. featureDemoCategories/Snippets/PlaygroundLinks에서 해당 기능 항목 제거
7. **`src/data/v2-to-v3-options.ts`에 `v3: null, note: "Removed in v3.x.x"` 항목 추가** (v2 사용자가 마이그레이션 페이지에서 무엇이 사라졌는지 알 수 있어야 한다)

**옵션 구조 변경 시:**

1. suneditor 타입 정의 확인: `node_modules/suneditor/types/`
2. stateToEditorOptions() 변환 로직 수정
3. codeGenerator.ts 코드 생성 수정
4. `v2-to-v3-options.ts`의 해당 항목 `v3` 경로/`transform` 노트 갱신

**v2 → v3 마이그레이션 매핑 갱신 (`src/data/v2-to-v3-options.ts`):**

이 파일은 `/migration` 페이지(`src/app/[locale]/migration/page.tsx`)가 import하여 v2 사용자에게 옵션 변환표를 보여준다. **v3에서 옵션/버튼/이벤트가 rename·remove·이동되면 반드시 함께 수정**해야 마이그레이션 페이지가 stale 해지지 않는다. 세 개의 export가 있다:

- `OPTION_MAP: MigrationEntry[]` — flat 옵션 + nested 플러그인 옵션 (dot notation, 예: `"image.uploadUrl"`)
- `BUTTON_MAP: Record<string, string>` — 툴바 버튼 이름 변경
- `EVENT_MAP: Record<string, string | null>` — 이벤트 핸들러 이름 변경 (`null` = 제거됨)

체크리스트:

- [ ] **rename**: 해당 항목의 `v3` 값을 새 이름으로 수정하고 `note: "Renamed"` 추가
- [ ] **remove**: `v3: null, note: "Removed in v3.x.x"` (또는 OPTION_MAP의 경우 `MigrationEntry` 그대로 두고 v3만 null로)
- [ ] **moved to plugin option**: `v3: "plugin.subKey", note: "Moved to plugin option"` (예: `mathFontSize` → `math.fontSizeList`)
- [ ] **value transform 필요**: `transform: "..."` 힌트 추가
- [ ] **신규 v3-only 옵션**: OPTION_MAP에는 추가하지 않는다 (v2에 대응 항목이 없으므로). 단, v2에 유사 옵션이 있었다면 매핑 추가 검토.

> 마이그레이션 페이지는 v2 → v3 일방향 안내용이다. v3 내부 패치(3.1 → 3.2 등)에서 옵션이 또 한 번 rename되면 OPTION_MAP의 `v3` 값을 **최신 v3 이름으로 덮어쓰는다** (체이닝하지 않는다 — v2 사용자는 항상 최신 v3로 점프한다).

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

**⚠️ 링크된 하위 md 파일도 반드시 함께 점검한다.**

`GUIDE.md` 및 `DEMO-UPDATE-GUIDE.md`는 다른 md 파일들을 링크로 참조한다 (예: `./ARCHITECTURE.md`, `./guide/custom-plugin.md`, `./guide/external-libraries.md`, `./guide/typedef-guide.md` 등). 이 파일들은 시간이 지나면서 **새로 생기거나, 이름이 바뀌거나, 삭제**될 수 있다. 단순히 GUIDE.md만 수정하면 링크된 파일 내용이 stale 해지는 일이 잦으니 다음을 반드시 수행:

1. **링크 추출 및 존재 여부 검증** — GUIDE.md / DEMO-UPDATE-GUIDE.md 내 모든 상대경로 md 링크를 추출해 실제 파일 존재 여부를 확인한다:

   ```bash
   # GUIDE.md/DEMO-UPDATE-GUIDE.md가 참조하는 md 파일 목록 추출
   grep -oE '\([^)]+\.md\)' .editor-guide/GUIDE.md .editor-guide/DEMO-UPDATE-GUIDE.md \
     | sed -E 's/[():]//g' | sort -u

   # 실제 존재하는 .editor-guide 내 md 파일 목록
   find .editor-guide -name "*.md" -type f
   ```

2. **불일치 처리:**
   - 링크는 있는데 **파일이 없으면** → 실제로 필요한 문서인지 판단하여 생성하거나, 링크를 제거한다.
   - 파일은 있는데 **링크가 없으면** → GUIDE.md에 색인으로 추가한다.
   - 이번 업데이트로 **삭제된 기능**의 가이드 파일이 있으면 함께 제거하고 링크도 정리한다.

3. **링크된 문서 본문 점검** — 새 옵션/플러그인이 추가됐거나 Breaking Change가 있었다면, 링크된 하위 md 파일(특히 custom-plugin.md, typedef-guide.md, external-libraries.md 등) 내부도 갱신 대상이다. 단순히 GUIDE.md만 보지 말고 **링크 타고 들어가서 내용까지 검토**한다.

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
