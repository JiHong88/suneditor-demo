/**
 * @fileoverview feature-demo 페이지의 기능별 데모 HTML 콘텐츠
 *
 * 사용처:
 * - feature-demo 페이지 > featurePlaygroundLinks.ts
 *   → 각 기능 카드의 "Quick Try" 미니 에디터 초기 콘텐츠 (demoHtml)
 *   → Playground로 이동 시 URL의 val 파라미터로 전달되는 에디터 초기값
 *
 * 각 상수는 해당 기능을 시각적으로 보여주는 HTML 문자열.
 * 사용자가 기능 카드에서 "바로해보기" 클릭 시 에디터에 이 HTML이 로드됨.
 *
 * 분류:
 *   텍스트 서식     → DEMO_BOLD_ITALIC ~ DEMO_COPY_FORMAT (9개)
 *   미디어          → DEMO_IMAGE ~ DEMO_FILE_UPLOAD (7개)
 *   테이블 & 구조    → DEMO_TABLE ~ DEMO_PAGE_BREAK (7개)
 *   고급 기능       → DEMO_MATH ~ DEMO_UNDO_REDO (6개)
 *   모드 & 레이아웃  → DEMO_CLASSIC ~ DEMO_FULLSCREEN (7개)
 *   플랫폼          → DEMO_RTL ~ DEMO_KEYBOARD (5개, 일부 인라인 정의)
 */

/* ══ 텍스트 서식 ══════════════════════════════════════ */

/** 볼드/이탈릭/밑줄/취소선 서식 데모 */
export const DEMO_BOLD_ITALIC = `<p><strong>Bold text</strong>, <em>Italic text</em>, <u>Underline</u>, <del>Strikethrough</del></p><p><strong><em>Bold + Italic combined</em></strong></p><p>Select text and try the formatting buttons in the toolbar.</p>`;

/** 폰트 패밀리 변경 데모 */
export const DEMO_FONT_FAMILY = `<p><span style="font-family: Arial;">This is Arial font.</span></p><p><span style="font-family: Georgia;">This is Georgia font.</span></p><p><span style="font-family: &quot;Courier New&quot;;">This is Courier New font.</span></p><p>Select text and change the font family from the toolbar.</p>`;

/** 폰트 크기 변경 데모 */
export const DEMO_FONT_SIZE = `<p><span style="font-size: 12px;">Small text (12px)</span></p><p><span style="font-size: 16px;">Normal text (16px)</span></p><p><span style="font-size: 24px;">Large text (24px)</span></p><p><span style="font-size: 36px;">Extra Large (36px)</span></p>`;

/** 글자 색상 변경 데모 */
export const DEMO_FONT_COLOR = `<p><span style="color: #e74c3c;">Red text</span>, <span style="color: #3498db;">Blue text</span>, <span style="color: #2ecc71;">Green text</span></p><p>Select text and pick a color from the toolbar.</p>`;

/** 배경 색상 하이라이트 데모 */
export const DEMO_BG_COLOR = `<p><span style="background-color: #f1c40f;">Highlighted in yellow</span></p><p><span style="background-color: #a8e6cf;">Highlighted in green</span></p><p>Select text and apply background colors.</p>`;

/** 텍스트 정렬 (좌/중앙/우/양쪽) 데모 */
export const DEMO_ALIGNMENT = `<p style="text-align: left;">Left aligned text</p><p style="text-align: center;">Center aligned text</p><p style="text-align: right;">Right aligned text</p><p style="text-align: justify;">Justified text — this paragraph is justified so the text stretches to fill the full width of the container evenly on both sides.</p>`;

/** 블록 스타일 (H1~H3, pre) 데모 */
export const DEMO_BLOCK_STYLES = `<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><p>Normal paragraph text</p><pre>Preformatted code block</pre>`;

/** 줄 간격 변경 데모 */
export const DEMO_LINE_HEIGHT = `<p style="line-height: 1;">Line height 1.0 — compact spacing for dense text layouts.</p><p style="line-height: 1.5;">Line height 1.5 — standard comfortable reading spacing.</p><p style="line-height: 2.5;">Line height 2.5 — extra wide spacing for emphasis or special layouts.</p>`;

/** 서식 복사/붙여넣기 데모 */
export const DEMO_COPY_FORMAT = `<p><strong style="color: #e74c3c; font-size: 20px;">Copy this format</strong> — click the "Copy Format" button after selecting this text, then apply it to the text below.</p><p>Apply the copied format to this plain text.</p>`;

/* ══ 미디어 ══════════════════════════════════════════ */

/** 이미지 업로드/삽입 데모 */
export const DEMO_IMAGE = `<p>Click the image button in the toolbar to upload or insert an image.</p><p>You can drag &amp; drop images directly into the editor.</p>`;

/** 이미지 리사이즈 데모 */
export const DEMO_IMAGE_RESIZE = `<p>Insert an image and try resizing it by dragging the corner handles.</p>`;

/** 비디오 임베드/업로드 데모 */
export const DEMO_VIDEO = `<p>Click the video button to embed a video from YouTube, Vimeo, or upload a video file.</p>`;

/** 오디오 임베드/업로드 데모 */
export const DEMO_AUDIO = `<p>Click the audio button to embed or upload audio files.</p>`;

/** iframe 임베드 데모 */
export const DEMO_EMBED = `<p>Click the embed button to insert an iframe embed (YouTube, maps, etc).</p>`;

/** 그리기 캔버스 데모 */
export const DEMO_DRAWING = `<p>Click the drawing button to open the drawing canvas. Draw freely and insert into the editor.</p>`;

/** 파일 업로드 데모 */
export const DEMO_FILE_UPLOAD = `<p>Click the file upload button to attach files to the editor content.</p>`;

/* ══ 테이블 & 구조 ════════════════════════════════════ */

/** 테이블 삽입 데모 */
export const DEMO_TABLE = `<p>Click the table button in the toolbar to insert a table.</p><table><thead><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr></thead><tbody><tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr><tr><td>Cell 4</td><td>Cell 5</td><td>Cell 6</td></tr></tbody></table>`;

/** 셀 병합 데모 */
export const DEMO_CELL_MERGE = `<p>Select multiple cells in the table below and use the cell merge function.</p><table><thead><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td><td>7</td><td>8</td></tr><tr><td>9</td><td>10</td><td>11</td><td>12</td></tr></tbody></table>`;

/** 행/열 추가·삭제 데모 */
export const DEMO_ROW_COL = `<p>Click on a table cell to see row/column operation buttons.</p><table><thead><tr><th>Name</th><th>Age</th><th>City</th></tr></thead><tbody><tr><td>Alice</td><td>30</td><td>Seoul</td></tr><tr><td>Bob</td><td>25</td><td>Tokyo</td></tr></tbody></table>`;

/** 순서/비순서 리스트 데모 */
export const DEMO_LISTS = `<ol><li>First ordered item</li><li>Second ordered item</li><li>Third ordered item</li></ol><ul><li>Unordered item A</li><li>Unordered item B</li><li>Unordered item C</li></ul>`;

/** 인용문 데모 */
export const DEMO_BLOCKQUOTE = `<blockquote><p>This is a blockquote. Use it to highlight important quotes or references.</p></blockquote><p>Normal paragraph after blockquote.</p>`;

/** 수평선 데모 */
export const DEMO_HR = `<p>Content above the horizontal rule.</p><hr/><p>Content below the horizontal rule.</p>`;

/** 페이지 나누기 데모 */
export const DEMO_PAGE_BREAK = `<p>Page 1 content — try the page break button in the toolbar to insert a page break below.</p>`;

/* ══ 고급 기능 ════════════════════════════════════════ */

/** 수학 공식 (KaTeX) 데모 */
export const DEMO_MATH = `<p>Click the math button to insert mathematical formulas using KaTeX notation.</p><p>Example: Try inserting a formula like E = mc²</p>`;

/** 멘션(@) 팝업 데모 */
export const DEMO_MENTION = `<p>Type @ to trigger the mention popup and select a user.</p>`;

/** 링크 삽입 데모 */
export const DEMO_LINKS = `<p>Select text and click the link button: <a href="https://example.com">Example Link</a></p><p>Try creating a new link by selecting this text.</p>`;

/** 코드뷰 토글 데모 */
export const DEMO_CODE_VIEW = `<p><strong>Toggle code view</strong> to see and edit the raw HTML source.</p><p>Click the <code>&lt;/&gt;</code> button in the toolbar.</p>`;

/** 글자수 카운터 데모 */
export const DEMO_CHAR_COUNTER = `<p>Check the character counter in the statusbar below. Try typing more text to see the count update.</p>`;

/** 실행취소/다시실행 데모 */
export const DEMO_UNDO_REDO = `<p>Make some edits, then use Ctrl+Z (undo) and Ctrl+Y (redo) or the toolbar buttons.</p>`;

/* ══ 모드 & 레이아웃 ═══════════════════════════════════ */

/** Classic 모드 데모 (상단 고정 툴바) */
export const DEMO_CLASSIC = `<p>This is <strong>Classic mode</strong> — the toolbar is fixed at the top of the editor.</p><p>This is the most common editor layout.</p>`;

/** Inline 모드 데모 (포커스 시 툴바 표시) */
export const DEMO_INLINE = `<p>This is <strong>Inline mode</strong> — the toolbar appears at the top when you focus the editor.</p><p>Click here to see the toolbar.</p>`;

/** Balloon 모드 데모 (텍스트 선택 시 플로팅 툴바) */
export const DEMO_BALLOON = `<p>This is <strong>Balloon mode</strong> — select text to see the floating toolbar.</p><p>Try selecting this sentence to see the balloon toolbar appear.</p>`;

/** Balloon-Always 모드 데모 (클릭 시 항상 플로팅 툴바) */
export const DEMO_BALLOON_ALWAYS = `<p>This is <strong>Balloon-Always mode</strong> — the floating toolbar is always visible when you click in the editor.</p><p>Click anywhere in this text.</p>`;

/** Document 레이아웃 데모 (종이 문서 형태) */
export const DEMO_DOCUMENT = `<p>This is <strong>Document layout</strong> — the editor looks like a paper document.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`;

/** 멀티루트 에디터 데모 (header + body 영역 분리) */
export const DEMO_MULTIROOT = `<p>Multi-root editor with separate editable areas (header + body) sharing one toolbar.</p>`;

/** 풀스크린 모드 데모 */
export const DEMO_FULLSCREEN = `<p>Click the fullscreen button in the toolbar to expand the editor to fill the entire screen.</p>`;

/* ══ 플랫폼 ══════════════════════════════════════════ */

/** RTL (오른쪽→왼쪽) 방향 + 아랍어 데모 */
export const DEMO_RTL = `<p dir="rtl" style="text-align: right;">هذا نص باللغة العربية لاختبار اتجاه الكتابة من اليمين إلى اليسار.</p><p>This demonstrates RTL (Right-to-Left) support along with internationalization.</p>`;

/** Strict 모드 데모 (붙여넣기 필터링) */
export const DEMO_STRICT_MODE = `<p>Strict mode filters and sanitizes pasted content.</p><p>Try pasting formatted content from external sources to see filtering in action.</p>`;

/** PDF 내보내기 데모 */
export const DEMO_EXPORT_PDF = `<p><strong>Export PDF</strong> — click the export PDF button in the toolbar to download the editor content as a PDF file.</p><p>This feature requires a PDF API endpoint.</p>`;

/** 키보드 단축키 안내 데모 */
export const DEMO_KEYBOARD = `<p><strong>Keyboard shortcuts:</strong></p><ul><li><code>Ctrl+B</code> — Bold</li><li><code>Ctrl+I</code> — Italic</li><li><code>Ctrl+U</code> — Underline</li><li><code>Ctrl+Z</code> — Undo</li><li><code>Ctrl+Y</code> — Redo</li><li><code>Ctrl+A</code> — Select All</li></ul><p>Try using these shortcuts!</p>`;
