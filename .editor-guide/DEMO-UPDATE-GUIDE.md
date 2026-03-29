# Demo Site Update Guide

> suneditor 라이브러리 변경 시 demo 사이트에 반영하는 방법을 정리한 문서.
> API/옵션 docs는 스크립트로 자동 생성되므로 여기서는 **수동 반영이 필요한 부분**만 다룬다.

---

## 목차

1. [수정 대상 파일 요약](#1-수정-대상-파일-요약)
2. [시나리오별 수정 가이드](#2-시나리오별-수정-가이드)
3. [파일별 상세 구조](#3-파일별-상세-구조)
4. [데이터 흐름도](#4-데이터-흐름도)
5. [URL 파라미터 시스템](#5-url-파라미터-시스템)
6. [자동 생성 영역 (참고)](#6-자동-생성-영역-참고)

---

## 1. 수정 대상 파일 요약

| 파일 | 역할 | 수정 빈도 |
|------|------|-----------|
| `src/data/snippets/featureDemoSnippets.ts` | 기능 데모 HTML 콘텐츠 | 기능 추가/변경 시 |
| `src/data/snippets/featureDemoCategories.ts` | 기능 카테고리 & 키 목록 | 기능 추가/삭제 시 |
| `src/data/snippets/editorPresets.ts` | BASIC/STANDARD/FULL 버튼 리스트 프리셋 | 버튼 추가/삭제 시 |
| `src/app/[locale]/feature-demo/_lib/featurePlaygroundLinks.ts` | 기능 → playground 연결 매핑 | 기능 추가 시 |
| `src/app/[locale]/feature-demo/page.tsx` | 기능 카드 아이콘 매핑 | 기능 추가 시 (아이콘) |
| `src/app/[locale]/playground/_lib/playgroundState.ts` | 옵션 인터페이스, 기본값, URL 매핑 | 옵션 추가/변경 시 |
| `src/app/[locale]/playground/_lib/codeGenerator.ts` | 코드 생성 로직 | 옵션 추가/변경 시 |
| `src/app/[locale]/playground/_components/PlaygroundControls.tsx` | 옵션 UI 컨트롤 | 옵션 추가/변경 시 |
| `src/messages/{en,ko,ar}.json` | i18n (기능 이름/설명) | 기능/옵션 추가 시 |

---

## 2. 시나리오별 수정 가이드

### A. 새 기능(Feature) 추가

기능 데모 카드에 표시할 새 기능을 추가할 때.

**수정 순서:**

1. **`featureDemoSnippets.ts`** — `DEMO_XXX` 상수 추가 (데모 HTML)
2. **`featureDemoCategories.ts`** — 해당 카테고리 `features` 배열에 키 추가
3. **`featurePlaygroundLinks.ts`** — `fl()` 호출로 playground 링크 매핑 추가 (import도 추가)
4. **`feature-demo/page.tsx`** — `FEATURE_ICONS` 객체에 lucide 아이콘 매핑 추가
5. **`messages/{en,ko,ar}.json`** — `featureDemo` 섹션에 `"키": "이름"`, `"키Desc": "설명"` 추가

**예시 (finder 추가):**
```typescript
// 1. featureDemoSnippets.ts
export const DEMO_FINDER = `<p>Press <strong>Ctrl+F</strong>...</p>`;

// 2. featureDemoCategories.ts — advanced 카테고리
features: ["math", "mention", ..., "finder", "charCounter", "undoRedo"]

// 3. featurePlaygroundLinks.ts
import { ..., DEMO_FINDER } from "@/data/snippets/featureDemoSnippets";
finder: fl(
  { p: "standard", val: DEMO_FINDER },
  [["bold", "italic", "underline"]],
),

// 4. page.tsx
finder: <Search className={ICON} />,

// 5. messages/en.json
"finder": "Find / Replace",
"finderDesc": "Find/Replace panel with live search..."
```

### B. 새 옵션(Option) 추가

playground에서 조작 가능한 새 에디터 옵션을 추가할 때.

**수정 파일 (4곳):**

1. **`playgroundState.ts`**
   - `PlaygroundState` 인터페이스에 타입 추가
   - `DEFAULTS` 객체에 기본값 추가
   - `stateToEditorOptions()` — state → editor 옵션 변환 로직 추가
   - `PARAM_MAP` — URL 단축키 매핑 추가 (기존 키와 충돌 주의)

2. **`codeGenerator.ts`** — `buildOptionsBody()` 에서 코드 생성 로직 추가
   - 기본값과 다를 때만 출력
   - 타입에 맞게 포맷팅 (`"string"`, `number`, `true/false`, 배열 등)

3. **`PlaygroundControls.tsx`** — 해당 섹션(Accordion)에 UI 컨트롤 추가
   - `TextInput` (문자열), `NumberInput` (숫자), `SwitchField` (불리언), `SelectField` (enum)

4. **`messages/{en,ko,ar}.json`** — `playground.sections.*` 라벨 (필요 시)

**예시 (toolbar_position 추가):**
```typescript
// 1. playgroundState.ts
// 인터페이스
toolbar_position: "top" | "bottom";
// 기본값
toolbar_position: "top",
// stateToEditorOptions
opts.toolbar_position = state.toolbar_position;
// PARAM_MAP
tpo: "toolbar_position",

// 2. codeGenerator.ts
if (state.toolbar_position !== "top") add("toolbar_position", `"${state.toolbar_position}"`);

// 3. PlaygroundControls.tsx
<SelectField
  label='toolbar_position'
  value={state.toolbar_position}
  options={[
    { value: "top", label: "top" },
    { value: "bottom", label: "bottom" },
  ]}
  onChange={set("toolbar_position") as (v: string) => void}
/>
```

### C. 툴바 버튼 추가/삭제

새 플러그인 버튼이 추가되거나 기존 버튼이 삭제/이름변경될 때.

**수정 파일:**

1. **`editorPresets.ts`** — `STANDARD_BUTTON_LIST`, `FULL_BUTTON_LIST`에 버튼 추가/삭제
   - 반응형 breakpoint별(`%768`, `%576` 등) 각각 반영 필요
2. **`featurePlaygroundLinks.ts`** — 해당 기능의 `buttonList` 배열 수정 (필요 시)

### D. 옵션 이름 변경 (rename)

기존 옵션이 이름이 바뀔 때 (예: `codeLangs` → `codeBlock`).

**영향 범위 (전부 검색 후 교체):**
- `playgroundState.ts` — 인터페이스, DEFAULTS, stateToEditorOptions, PARAM_MAP
- `codeGenerator.ts` — buildOptionsBody
- `PlaygroundControls.tsx` — 라벨, 바인딩
- `featureDemoCategories.ts` — features 배열 키
- `featureDemoSnippets.ts` — 상수명, 내용
- `featurePlaygroundLinks.ts` — 키, import
- `feature-demo/page.tsx` — 아이콘 매핑 키
- `messages/{en,ko,ar}.json` — i18n 키
- `option-descriptions.{en,ko,ar}.json` — 옵션 설명 키
- `api-docs.{en,ko,ar}.json` — API 문서 (subgroups 키, optionDescriptions 키, 타입 정의 내 참조)
- `.api-docs-hashes.json` — 해시 키

> **Tip:** `grep -r "oldName" src/` 으로 전수 검색 후 교체.

### E. 플러그인 삭제 → 새 플러그인 대체

기존 플러그인이 삭제되고 새 플러그인으로 대체될 때 (예: `codelang` → `codeBlock`).
시나리오 D(이름변경) + A(기능추가) 의 조합.

---

## 3. 파일별 상세 구조

### `featureDemoSnippets.ts`

기능 데모에서 에디터에 로드할 HTML 콘텐츠 상수 모음.

```
카테고리별 섹션:
  텍스트/서식 → DEMO_BOLD_ITALIC, DEMO_FONT_FAMILY, ...
  미디어       → DEMO_IMAGE, DEMO_VIDEO, ...
  테이블/구조  → DEMO_TABLE, DEMO_LISTS, ...
  고급 기능    → DEMO_MATH, DEMO_CODE_BLOCK, DEMO_FINDER, ...
  모드/레이아웃 → DEMO_CLASSIC, DEMO_TOOLBAR_BOTTOM, ...
  플랫폼       → DEMO_RTL, DEMO_EXPORT_PDF, ...
```

### `featureDemoCategories.ts`

6개 카테고리 정의. 각 카테고리: `{ key, color, features[] }`.

```
textFormatting — 텍스트 서식 (blue)
media          — 미디어 (violet)
tableStructure — 테이블/구조 (green)
advanced       — 고급 기능 (amber)
modesLayout    — 모드/레이아웃 (teal)
platform       — 플랫폼 (rose)
```

### `featurePlaygroundLinks.ts`

`fl()` 헬퍼로 기능 → playground URL 매핑 생성.

```typescript
fl(
  params: Record<string, string>,  // URL 파라미터 (단축키 사용)
  buttonList: unknown[],           // 데모용 버튼 리스트
  editorOptions?: Record<string, unknown>  // 추가 에디터 옵션
): FeatureLink
```

**자주 쓰는 URL 파라미터 단축키:**
- `p` — buttonListPreset (basic/standard/full)
- `m` — mode (classic/inline/balloon/balloon-always)
- `val` — 초기 에디터 HTML 콘텐츠
- `tpo` — toolbar_position
- `i.uu` — image.uploadUrl
- `fu.uu` — fileUpload.uploadUrl
- `mn.au` — mention.apiUrl
- `ep.au` — exportPDF.apiUrl
- `cc` — charCounter, `ccm` — charCounter_max
- `sm` — strictMode
- `dir` — textDirection
- `mr` — multiroot

### `editorPresets.ts`

3단계 버튼 프리셋 + 유틸리티.

- `BASIC_BUTTON_LIST` — 최소 (undo/redo, bold/italic/underline, link/image)
- `STANDARD_BUTTON_LIST` — 일반 (반응형 %768, %576)
- `FULL_BUTTON_LIST` — 전체 (반응형 %1200, %992, %768, %576)
- `fmtButtonList()` — 버튼 배열 → JS 코드 문자열 포맷팅 함수

**버튼 리스트 문법:**
- `["bold", "italic"]` — 버튼 그룹
- `"|"` — 그룹 구분선
- `"/"` — 줄바꿈
- `["%768", [...]]` — 반응형 breakpoint

### `playgroundState.ts`

playground 상태 관리의 핵심.

**주요 구성:**
1. `PlaygroundState` 인터페이스 — 300+ 옵션 타입 정의
2. `DEFAULTS` — 모든 옵션 기본값
3. `stateToEditorOptions()` — state → SunEditor 옵션 객체 변환
4. `PARAM_MAP` — URL 단축키 ↔ state 키 매핑
5. `urlToState()` — URL params → state 파싱
6. `stateToUrl()` — state → URL params 직렬화

**옵션 카테고리 (인터페이스 내 주석 구분):**
```
Mode & Theme / Layout & Sizing / Toolbar / Sub-Toolbar /
Statusbar & Counter / Content & Behavior / Features /
Filtering & Strictmode / Plugin: Image / Plugin: Video /
Plugin: Audio / Plugin: Embed / Plugin: Drawing /
Plugin: Link / Plugin: Mention / Plugin: Math /
Plugin: FileUpload / Plugin: ExportPDF / Plugin: Table /
Plugin: Template / Plugin: Layout
```

### `codeGenerator.ts`

playground state → 프레임워크별 코드 스니펫 생성.

**`buildOptionsBody(state)`의 처리 순서:**
```
layout → toolbar → subToolbar → statusbar & counter →
content & behavior → features → filtering → plugins →
(각 플러그인: image, video, audio, embed, drawing, link,
 mention, math, fileUpload, exportPDF, table, template, layout)
```

**지원 프레임워크:**
javascript-cdn, javascript-npm, react, vue, angular, svelte, webcomponents

### `PlaygroundControls.tsx`

Accordion 기반 옵션 UI. 섹션별로 컨트롤 그룹화.

**사용 가능한 필드 컴포넌트:**
- `SelectField` — enum/choice (`{ value, label }[]`)
- `TextInput` — 문자열 (debounce 적용)
- `NumberInput` — 숫자
- `SwitchField` — 불리언 토글
- `TextareaField` — JSON 등 긴 텍스트

**타입 주의사항:**
- `SelectField.onChange`는 `(v: string) => void` 타입
- union 타입 옵션은 `set("key") as (v: string) => void` 캐스팅 필요

### `feature-demo/page.tsx`

`FEATURE_ICONS` 객체에서 기능 키 → lucide-react 아이콘 매핑.
- 아이콘은 `lucide-react`에서 import
- 기능 추가 시 아이콘 import + 매핑 추가 필요

---

## 4. 데이터 흐름도

```
┌─────────────────────────────────────────────────────────┐
│                    Feature Demo Page                     │
│                                                         │
│  featureDemoCategories.ts ──→ 카테고리 탭 렌더링         │
│  featureDemoSnippets.ts  ──→ Quick Try 에디터 콘텐츠     │
│  page.tsx (FEATURE_ICONS) ──→ 기능 카드 아이콘            │
│  messages/{locale}.json   ──→ 기능 이름/설명 텍스트       │
│                                                         │
│  사용자가 "Try in Playground" 클릭                        │
│           ↓                                             │
│  featurePlaygroundLinks.ts → URL query 생성              │
│           ↓                                             │
│  /playground?p=standard&val=<HTML>&... 로 이동           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                    Playground Page                        │
│                                                         │
│  playgroundState.ts                                     │
│    urlToState() ──→ URL params → PlaygroundState 변환    │
│    DEFAULTS     ──→ 기본값 병합                          │
│    stateToEditorOptions() ──→ state → SunEditor 옵션     │
│           ↓                                             │
│  PlaygroundEditor  ──→ SunEditor 인스턴스 생성            │
│  PlaygroundControls ──→ 옵션 UI (Accordion 섹션)         │
│  codeGenerator.ts  ──→ 코드 스니펫 생성/표시              │
│  editorPresets.ts  ──→ 버튼 리스트 프리셋 제공            │
└─────────────────────────────────────────────────────────┘
```

---

## 5. URL 파라미터 시스템

playground URL은 단축키 기반. `playgroundState.ts`의 `PARAM_MAP`에서 전체 매핑 관리.

**타입별 직렬화 규칙:**
- `boolean` → `"1"` (true) / `"0"` (false)
- `number` → 문자열로 변환
- `string` → 그대로

**새 파라미터 추가 시 주의:**
- 기존 키와 충돌 검사 필수 (`PARAM_MAP` 내 grep)
- 플러그인 옵션은 dot notation 사용 (예: `i.uu` = `image_uploadUrl`)
- 값이 기본값과 같으면 URL에서 생략됨

---

## 6. 자동 생성 영역 (참고)

아래 파일들은 스크립트로 자동 생성되므로 직접 수정하지 않아도 됨.
단, **옵션 이름 변경(rename)** 시에는 수동 수정 필요.

| 파일 | 생성 스크립트 | 용도 |
|------|-------------|------|
| `api-docs.{en,ko,ar}.json` | `scripts/generate-api-docs.cjs` | API 문서 (타입, 메소드, 설명) |
| `option-descriptions.{en,ko,ar}.json` | docs 스크립트 + 번역 | 옵션 설명 |
| `.api-docs-hashes.json` | docs 스크립트 | 번역 변경 감지용 해시 |
| `plugin-guide--examples/_generated.ts` | `scripts/generate-framework-snippets.cjs` | 플러그인 예제 코드 |

**실행 명령:**
```bash
npm run docs:generate    # API 문서 재생성
npm run docs:translate   # 번역 업데이트
npm run build:prod       # 전체 빌드 (docs + next build)
```
