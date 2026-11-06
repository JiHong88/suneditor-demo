---
name: update-react
description: "@suneditor/suneditor-react(React 래퍼)의 새 버전을 확인·설치하고, 릴리즈 노트를 보고 /react 가이드·플레이그라운드·시작하기의 React 코드를 데모 사이트에 반영한다."
---

## 실행 순서

### 1. 버전 확인 및 업데이트

```bash
# 데모에 반영된 버전 (생성된 가이드 첫 줄)
head -1 src/data/react-guide/react-guide.en.md

# 설치된 버전 / npm 최신 버전
node -e "console.log(require('./node_modules/@suneditor/suneditor-react/package.json').version)"
npm view @suneditor/suneditor-react version
```

세 값을 비교해 판단한다.

- npm 최신 > 설치: `npm i @suneditor/suneditor-react@latest` 후 아래를 계속한다.
- 설치 > 가이드 첫 줄: 설치는 됐지만 반영 전이다. Step 4를 반드시 실행한다.
- 셋이 같으면 할 일이 없다. 사용자에게 알리고 끝낸다.

peer 범위도 확인한다. `npm ls suneditor`에 peer 경고가 나오면 엔진도 올려야 하므로 `update-editor` 스킬을 먼저 돌린다.

### 2. 릴리즈 노트 확인

```bash
cat node_modules/@suneditor/suneditor-react/release-note.md
```

여러 버전을 건너뛴 경우에만 GitHub releases로 보충한다:

```bash
gh api repos/suneditor/suneditor-react/releases --jq '.[] | "\(.tag_name)\n\(.body)\n---"'
```

### 3. 래퍼 API 변경 반영

릴리즈 노트에 props/exports/동작 변경이 있을 때만. 버그 수정만 있으면 건너뛴다.

| 변경                                                        | 확인할 곳                                                                                                                                      |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| props 추가/이름 변경 (`value`, `onChange`, `ref`, `options`) | `src/components/editor/suneditor.tsx`, `playground/_components/PlaygroundEditor.tsx`, `PlaygroundMultiRootEditor.tsx`                           |
| export 변경 (`SunEditorGroup`, `SunEditorRoot`, 타입 이름)   | 위 파일 + `playground/_lib/codeGenerator.ts`의 `generateReactWrapper`, `src/data/snippets/getting-started--frameworks/react.snippet.tsx`        |
| 생성 코드 형태가 바뀌어야 하는 변경                         | `codeGenerator.ts` 수정 후 `__tests__/playground/codeGenerator.test.ts` 보강, 스니펫 수정 후 `npm run snippets:generate`                       |
| peer `suneditor` 범위 변경                                  | 코드 수정 없음. README의 "Requires suneditor x.y.z"가 Step 4에서 가이드로 들어온다                                                              |

버전 배지와 `npm i` 줄의 버전은 `SUNEDITOR_REACT_VERSION`(`src/store/version.ts`)이 설치본에서 읽으므로 손댈 곳이 없다.

### 4. 가이드 재생성 및 번역

버전이 올라가면 README 본문이 그대로여도 둘 다 실행한다. 영어 파일 첫 줄의 버전이 바뀌어야 테스트가 통과하고, 번역 스크립트는 그 줄을 각 로케일 파일에 복사한다. 본문이 같으면 번역 API 호출은 0건이다(문장 해시 캐시).

```bash
npm run docs:generate          # react-guide.en.md를 설치본 README에서 생성 (api-docs도 같이)
npm run react-guide:translate  # 바뀐 문장만 Google 번역, 나머지는 캐시
git diff --stat src/data/react-guide/
```

본문에 변경이 있었으면 ko 등 읽을 수 있는 로케일의 diff를 검토한다. 한 단어 제목, `props`, 브랜드명은 스크립트가 영어로 유지한다.

### 5. 검증

```bash
npm test          # reactGuide.test.ts: 가이드 버전 = 설치 버전, 로케일별 코드 펜스·제목 수 일치
npm run check
```

`/react`, `/playground`(React 탭의 두 토글 + Run Code), `/getting-started`(React 탭)를 브라우저에서 확인한다.
