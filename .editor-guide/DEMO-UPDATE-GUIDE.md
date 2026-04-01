# Demo Site Update Guide

> suneditor 라이브러리 변경 시 demo 사이트에 반영하는 방법을 정리한 문서.
> API/옵션 docs는 스크립트로 자동 생성되므로 여기서는 **수동 반영이 필요한 부분**만 다룬다.

---

## 목차

1. [수정 대상 파일 요약](#1-수정-대상-파일-요약)
2. [시나리오별 수정 가이드](#2-시나리오별-수정-가이드)
3. [핵심 개념](#3-핵심-개념)
4. [파일별 상세 구조](#4-파일별-상세-구조)
5. [데이터 흐름도](#5-데이터-흐름도)
6. [URL 파라미터 시스템](#6-url-파라미터-시스템)
7. [자동 생성 영역 (참고)](#7-자동-생성-영역-참고)
8. [테스트](#8-테스트)

---

## 1. 수정 대상 파일 요약

### 기능 데모 (Feature Demo)

| 파일 | 역할 | 수정 시점 |
|------|------|-----------|
| `src/data/snippets/featureDemoSnippets.ts` | 기능 데모 HTML 콘텐츠 | 기능 추가/변경 |
| `src/data/snippets/featureDemoCategories.ts` | 기능 카테고리 & 키 목록 | 기능 추가/삭제 |
| `src/app/[locale]/feature-demo/_lib/featurePlaygroundLinks.ts` | 기능 → playground 연결 매핑 | 기능 추가 |
| `src/app/[locale]/feature-demo/page.tsx` | 기능 카드 아이콘 매핑 | 기능 추가 (아이콘) |
| `src/messages/{en,ko,ar}.json` | i18n (기능 이름/설명) | 기능 추가 |

### 플레이그라운드 (Playground)

| 파일 | 역할 | 수정 시점 |
|------|------|-----------|
| `src/data/snippets/editorPresets.ts` | BASIC/STANDARD/FULL 버튼 리스트 프리셋 | 버튼 추가/삭제 |
| `playground/_components/button-list-builder/buttonCatalog.ts` | ButtonList Builder 버튼 카탈로그 (팔레트) | 버튼 추가/삭제 |
| `playground/_lib/playgroundState.ts` | 옵션 인터페이스, 기본값, URL 매핑, 옵션 변환 | 옵션/플러그인 추가 |
| `playground/_lib/codeGenerator.ts` | 코드 생성 로직 | 옵션/플러그인 추가 |
| `playground/_components/PlaygroundControls.tsx` | 에디터 기본 옵션 UI | 에디터 옵션 추가 |
| `playground/_components/PlaygroundPluginSidebar.tsx` | 플러그인 옵션 UI | 플러그인 옵션 추가 |

> **PlaygroundControls vs PlaygroundPluginSidebar**
> - **Controls**: 모드, 레이아웃, 툴바, 상태바, 콘텐츠, 기능, 필터링 등 에디터 기본 옵션
> - **PluginSidebar**: 플러그인별 옵션 (image, video, codeBlock, mention, math 등)

---

## 2. 시나리오별 수정 가이드

### A. 새 기능(Feature) 추가

기능 데모 카드에 표시할 새 기능을 추가할 때.

**체크리스트:**

- [ ] `featureDemoSnippets.ts` — `DEMO_XXX` 상수 추가
- [ ] `featureDemoCategories.ts` — 해당 카테고리 `features[]`에 키 추가
- [ ] `featurePlaygroundLinks.ts` — `fl()` 호출로 매핑 추가 (import 포함)
- [ ] `feature-demo/page.tsx` — `FEATURE_ICONS`에 lucide 아이콘 매핑
- [ ] `messages/{en,ko,ar}.json` — `FeatureDemo.features`에 `"키"`, `"키Desc"` 추가
- [ ] `npm test` 실행 → `integrity.test.ts`가 누락 감지

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

### B. 새 에디터 옵션(Option) 추가

toolbar, layout, content 등 에디터 기본 옵션을 추가할 때.

**체크리스트:**

- [ ] `playgroundState.ts` — `PlaygroundState` 인터페이스에 타입 추가
- [ ] `playgroundState.ts` — `DEFAULTS`에 기본값 추가
- [ ] `playgroundState.ts` — `stateToEditorOptions()`에 변환 로직 추가
- [ ] `playgroundState.ts` — `PARAM_MAP`에 URL 단축키 추가 (충돌 검사)
- [ ] `codeGenerator.ts` — `buildOptionsBody()`에 코드 생성 로직 추가
- [ ] `PlaygroundControls.tsx` — 해당 Accordion 섹션에 UI 컨트롤 추가

### C. 새 플러그인 추가 (툴바 버튼 + 플러그인 옵션)

새 플러그인이 추가될 때. **버튼과 옵션 양쪽 모두 반영해야 한다.**

**핵심: 플러그인 옵션은 중첩 객체**
```js
// 에디터 기본 옵션 (flat)
{ toolbar_sticky: 50 }

// 플러그인 옵션 (nested object)
{ codeBlock: { langs: ["javascript", "python"] } }
{ mention: { triggerText: "@", limitSize: 5 } }
```

**체크리스트:**

버튼:
- [ ] `editorPresets.ts` — FULL_BUTTON_LIST에 추가 (**모든 반응형 breakpoint 포함**)
- [ ] `buttonCatalog.ts` — ButtonList Builder 팔레트에 추가
- [ ] `plugin-guide/CustomPluginGuide.tsx` — 해당 플러그인 타입의 `examples`/`demoButtons`에 추가

플러그인 옵션:
- [ ] `playgroundState.ts` — 인터페이스: `플러그인명_옵션명: 타입`
- [ ] `playgroundState.ts` — DEFAULTS: 기본값
- [ ] `playgroundState.ts` — `FIXED_PLUGIN_KEYS` 정규식에 플러그인명 추가
- [ ] `playgroundState.ts` — `stateToEditorOptions()`: 중첩 객체 구성
- [ ] `playgroundState.ts` — PARAM_MAP: dot notation 단축키
- [ ] `codeGenerator.ts` — Plugin options 섹션 (`pLines` 이후)
- [ ] `PlaygroundPluginSidebar.tsx` — AccordionItem 추가 (**Controls가 아님!**)

기능 데모 (해당 시):
- [ ] 시나리오 A 체크리스트 전부

**예시 (codeBlock 플러그인):**
```typescript
// buttonCatalog.ts — 새 버튼은 반드시 팔레트에 추가 (finder, codeBlock 등)
{ name: "codeBlock", label: "Code Block", category: "view" },
{ name: "finder", label: "Finder", category: "document" },

// editorPresets.ts — FULL_BUTTON_LIST (모든 breakpoint에 추가!)
["fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView"],

// playgroundState.ts
codeBlock_langs: string;           // 인터페이스
codeBlock_langs: "",               // DEFAULTS
/^(...|codeBlock|...)_/.test(k)    // FIXED_PLUGIN_KEYS
"cb.l": "codeBlock_langs",        // PARAM_MAP
// stateToEditorOptions:
if (state.codeBlock_langs) {
  const langs = state.codeBlock_langs.split(",").map(s => s.trim()).filter(Boolean);
  if (langs.length) opts.codeBlock = { langs };
}

// codeGenerator.ts — pLines 섹션
if (state.codeBlock_langs) {
  const langs = ...;
  pLines.push([`codeBlock: {`, `  langs: [${langs.join(", ")}],`, "},"]);
}

// PlaygroundPluginSidebar.tsx
<AccordionItem value='codeBlock'>
  <AccordionTrigger>Code Block</AccordionTrigger>
  <AccordionContent>
    <TextInput label='langs' value={state.codeBlock_langs}
      onChange={set("codeBlock_langs")} optionKey='codeBlock_langs' />
  </AccordionContent>
</AccordionItem>
```

### D. 툴바 버튼 추가/삭제 (플러그인 옵션 없이)

버튼만 추가/삭제할 때.

**체크리스트:**

- [ ] `editorPresets.ts` — STANDARD/FULL_BUTTON_LIST에 추가/삭제
  - 메인 레이아웃 + 모든 반응형 breakpoint (`%1200`, `%992`, `%768`, `%576`)
  - "more" 그룹 내 (`:View-default.more_view` 등)에도 반영
- [ ] `buttonCatalog.ts` — ButtonList Builder 팔레트에 추가/삭제
- [ ] `featurePlaygroundLinks.ts` — 해당 기능의 `buttonList`에 버튼 포함 (필요 시)

### E. 옵션 이름 변경 (rename)

**영향 범위 (전부 `grep` 검색 후 교체):**

- `playgroundState.ts` — 인터페이스, DEFAULTS, stateToEditorOptions, PARAM_MAP
- `codeGenerator.ts` — buildOptionsBody
- `PlaygroundControls.tsx` 또는 `PlaygroundPluginSidebar.tsx`
- `featureDemoCategories.ts`, `featureDemoSnippets.ts`, `featurePlaygroundLinks.ts`
- `feature-demo/page.tsx` — 아이콘 매핑 키
- `messages/{en,ko,ar}.json`
- `option-descriptions.{en,ko,ar}.json`
- `api-docs.{en,ko,ar}.json`, `.api-docs-hashes.json`

### F. mode 변형 추가

suneditor의 `mode` 옵션은 변형(variant)을 콜론으로 구분한다.
예: `"classic"`, `"classic:bottom"`, `"inline:bottom"`

**체크리스트:**

- [ ] `playgroundState.ts` — `mode` 타입 union에 추가
- [ ] `PlaygroundControls.tsx` — mode SelectField options에 추가
- [ ] 기능 데모 필요 시 — `featurePlaygroundLinks.ts`에서 `{ m: "classic:bottom" }` 등으로 설정

> **주의:** `toolbar_position` 같은 별도 옵션이 아니다. mode 값 자체에 포함된다.
> 현재 지원: `classic`, `classic:bottom`, `inline`, `inline:bottom`, `balloon`, `balloon-always`

---

## 3. 핵심 개념

### 에디터 옵션 vs 플러그인 옵션

| | 에디터 옵션 | 플러그인 옵션 |
|---|---|---|
| 구조 | flat | nested object |
| 예시 | `{ toolbar_sticky: 50 }` | `{ codeBlock: { langs: [...] } }` |
| State 키 | `toolbar_sticky` | `codeBlock_langs` |
| PARAM_MAP | 약어 (`ts`) | dot notation (`cb.l`) |
| UI 위치 | `PlaygroundControls.tsx` | `PlaygroundPluginSidebar.tsx` |
| Code 생성 | `add("key", value)` | `pluginLines()` 또는 `pLines.push()` |

### mode 시스템

suneditor의 mode는 **콜론으로 변형을 구분**한다:
```
classic          — 상단 고정 툴바
classic:bottom   — 하단 고정 툴바
inline           — 포커스 시 상단 툴바
inline:bottom    — 포커스 시 하단 툴바
balloon          — 텍스트 선택 시 플로팅
balloon-always   — 클릭 시 항상 플로팅
```

이건 별도 `toolbar_position` 옵션이 아니라 **mode 값 자체**다.

### 버튼 추가 시 반영 위치 (2곳)

1. **`editorPresets.ts`** — 프리셋 (BASIC/STANDARD/FULL)
   - 실제 에디터에 적용되는 버튼 리스트
   - 반응형 breakpoint마다 별도 배열이므로 **모두 반영**
2. **`buttonCatalog.ts`** — Builder 팔레트
   - 사용자가 드래그&드롭으로 커스텀 버튼 리스트를 만드는 UI
   - 여기에 없으면 Builder에서 해당 버튼을 추가할 수 없음

---

## 4. 파일별 상세 구조

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
- `m` — mode (classic/classic:bottom/inline/inline:bottom/balloon/balloon-always)
- `val` — 초기 에디터 HTML 콘텐츠
- `cb.l` — codeBlock.langs
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
- `[":Label-icon.className", ...]` — "more" 드롭다운 그룹
- `["-right", ...]` — 우측 정렬 그룹

> **주의:** FULL_BUTTON_LIST는 메인 + 4개 breakpoint (%1200, %992, %768, %576)로 총 5개 배열을 관리한다.
> 버튼 추가/삭제 시 **5곳 모두** 반영해야 한다.

### `buttonCatalog.ts`

ButtonList Builder에서 드래그 가능한 버튼 팔레트.

```typescript
{ name: "codeBlock", label: "Code Block", category: "view" }
```

카테고리: `document`, `text`, `format`, `layout`, `insert`, `media`, `gallery`, `view`, `page`

> **editorPresets에 추가했으면 buttonCatalog에도 반드시 추가.**
> 그렇지 않으면 Builder 팔레트에 표시되지 않아 커스텀 빌더에서 해당 버튼을 사용할 수 없다.

### `playgroundState.ts`

playground 상태 관리의 핵심.

**주요 구성:**
1. `PlaygroundState` 인터페이스 — 300+ 옵션 타입 정의
2. `DEFAULTS` — 모든 옵션 기본값
3. `stateToEditorOptions()` — state → SunEditor 옵션 객체 변환
4. `PARAM_MAP` — URL 단축키 ↔ state 키 매핑
5. `urlToState()` — URL params → state 파싱
6. `stateToUrl()` — state → URL params 직렬화
7. `FIXED_PLUGIN_KEYS` — 플러그인 옵션 키 정규식 (에디터 remount 필요)

**옵션 네이밍 규칙:**
- 에디터 기본 옵션: SunEditor API 그대로 (`toolbar_sticky`, `charCounter_max`)
- 플러그인 옵션: `플러그인명_옵션명` (`codeBlock_langs`, `mention_triggerText`)
- flat state → 중첩 객체 변환은 `stateToEditorOptions()`에서 처리

**PARAM_MAP 단축키 규칙:**
- 에디터 기본 옵션: 약어 (`ts` = toolbar_sticky, `m` = mode)
- 플러그인 옵션: dot notation (`cb.l` = codeBlock_langs, `mn.au` = mention_apiUrl)
- **충돌 검사 필수**: PARAM_MAP 내 grep으로 기존 키 확인

### `codeGenerator.ts`

playground state → 프레임워크별 코드 스니펫 생성.

**`buildOptionsBody(state)`의 처리 순서:**
```
layout → toolbar → subToolbar → statusbar & counter →
content & behavior → features → filtering →
Plugin options (pLines[]):
  codeBlock, image, video, audio, embed, drawing,
  link, mention, math, fileUpload, exportPDF,
  table, template, layout, galleries
```

**플러그인 코드 생성 패턴:**
- 단순 값: `pluginLines("mention", [["key", value, default], ...])` → `mention: { key: "..." }`
- 배열/복잡 값: 직접 `pLines.push([...])` → `codeBlock: { langs: [...] }`
- JSON 값: `mergeJsonField(pLines, "mention", "data", rawJson)`

**지원 프레임워크:**
javascript-cdn, javascript-npm, react, vue, angular, svelte, webcomponents

### `PlaygroundControls.tsx` vs `PlaygroundPluginSidebar.tsx`

**Controls (좌측 패널 상단)** — Accordion 기반 에디터 옵션 UI:
```
Mode & Theme / Layout & Sizing / Toolbar / Sub-Toolbar /
Statusbar & Counter / Content & Behavior / Features / Filtering
```

**PluginSidebar (좌측 패널 하단)** — 플러그인별 옵션 UI:
```
Image / Video / Audio / Embed / Drawing / CodeBlock /
Math / Link / Mention / FileUpload / ExportPDF /
Table / Template / Layout / Galleries
```

**사용 가능한 필드 컴포넌트 (양쪽 공통):**
- `SelectField` — enum/choice
- `TextInput` — 문자열
- `NumberInput` — 숫자
- `SwitchField` — 불리언
- `TextareaField` / `ToggleableTextarea` — JSON 등 긴 텍스트
- PluginSidebar의 필드에는 `optionKey` prop으로 option-descriptions 자동 연동

### `feature-demo/page.tsx`

`FEATURE_ICONS` 객체에서 기능 키 → lucide-react 아이콘 매핑.
- 아이콘은 `lucide-react`에서 import
- 기능 추가 시 아이콘 import + 매핑 추가 필요

---

## 5. 데이터 흐름도

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
│  PlaygroundControls ──→ 에디터 기본 옵션 UI               │
│  PlaygroundPluginSidebar ──→ 플러그인 옵션 UI             │
│  codeGenerator.ts  ──→ 코드 스니펫 생성/표시              │
│  editorPresets.ts  ──→ 버튼 리스트 프리셋 제공            │
│  buttonCatalog.ts  ──→ Builder 팔레트 버튼 목록           │
└─────────────────────────────────────────────────────────┘
```

---

## 6. URL 파라미터 시스템

playground URL은 단축키 기반. `playgroundState.ts`의 `PARAM_MAP`에서 전체 매핑 관리.

**타입별 직렬화 규칙:**
- `boolean` → `"1"` (true) / `"0"` (false)
- `number` → 문자열로 변환
- `null` → `"null"`
- `string` → 그대로

**새 파라미터 추가 시 주의:**
- 기존 키와 충돌 검사 필수 (`PARAM_MAP` 내 grep)
- 에디터 기본 옵션: 약어 단축키 (`ts`, `m`)
- 플러그인 옵션: dot notation (`cb.l`, `mn.au`)
- 값이 기본값과 같으면 URL에서 자동 생략

---

## 7. 자동 생성 영역 (참고)

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

---

## 8. 테스트

```bash
npm test          # vitest 전체 실행
npm run test:watch  # watch 모드
```

**테스트 구조:**
```
__tests__/
├── server/
│   ├── upload.test.ts        — 업로드 검증 (해시, MIME, 크기, 처리)
│   ├── mention.test.ts       — 멘션 필터, limit
│   └── download-file.test.ts — path traversal 차단
├── playground/
│   ├── playgroundState.test.ts — URL↔state 변환, 옵션 변환, 프리셋
│   └── codeGenerator.test.ts   — 7개 프레임워크 코드 생성
└── data/
    └── integrity.test.ts     — 카테고리↔링크↔i18n 키 일치 검증
```

**`integrity.test.ts`가 자동으로 잡아주는 것:**
- featureDemoCategories에 키를 추가했는데 featurePlaygroundLinks에 빠진 경우
- messages/{en,ko,ar}.json에 i18n 키가 빠진 경우
- 카테고리 키 중복

> 기능 추가 후 `npm test` 실행하면 누락된 곳을 바로 알 수 있다.
