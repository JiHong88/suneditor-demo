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

/** 이미지 업로드/삽입 데모 — 이미지 컴포넌트 포함 */
export const DEMO_IMAGE = `<p>Click the image to see resize handles and controls.</p><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin:0"><img src="xxxxx" alt="sample" style="width:300px"></figure></div><p>You can also drag &amp; drop images directly into the editor.</p>`;

/** 이미지 리사이즈 데모 — 리사이즈 가능한 이미지 포함 */
export const DEMO_IMAGE_RESIZE = `<p>Click the image and drag the corner handles to resize.</p><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin:0"><img src="xxxxx" alt="resizable" style="width:400px"></figure></div>`;

/** 비디오 임베드/업로드 데모 — 비디오 컴포넌트 포함 */
export const DEMO_VIDEO = `<p>A video component is embedded below. Click it to see the controller.</p><div class="se-component se-video-container" contenteditable="false"><figure style="margin:0"><video src="xxxxx" controls style="width:100%;max-width:560px"></video></figure></div>`;

/** 오디오 임베드/업로드 데모 — 오디오 컴포넌트 포함 */
export const DEMO_AUDIO = `<p>An audio player is embedded below. Click it to see the controller.</p><div class="se-component se-audio-container" contenteditable="false"><figure style="margin:0"><audio src="xxxxx" controls style="width:300px"></audio></figure></div>`;

/** iframe 임베드 데모 — iframe 컴포넌트 포함 */
export const DEMO_EMBED = `<p>An iframe embed is shown below. Click it to see resize and alignment controls.</p><div class="se-component se-embed-container" contenteditable="false"><figure style="margin:0"><iframe src="xxxxx" style="width:100%;max-width:560px;height:315px" frameborder="0"></iframe></figure></div>`;

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

/* ══ 고급 기능 ════════════════════════════════════════ */

/** 수학 공식 (KaTeX) 데모 */
export const DEMO_MATH = `<p>Click the math button to insert mathematical formulas using KaTeX notation.</p><p>Example: Try inserting a formula like E = mc²</p>`;

/** 자동완성(@, :, #) 팝업 데모 */
export const DEMO_AUTOCOMPLETE = `<p>Type <strong>@</strong> to mention a user, <strong>:</strong> to insert an emoji, or <strong>#</strong> to add a hashtag.</p>`;

/** 링크 삽입 데모 */
export const DEMO_LINKS = `<p>Select text and click the link button: <a href="https://example.com">Example Link</a></p><p>Try creating a new link by selecting this text.</p>`;

/** 코드뷰 토글 데모 */
export const DEMO_CODE_VIEW = `<p><strong>Toggle code view</strong> to see and edit the raw HTML source.</p><p>Click the <code>&lt;/&gt;</code> button in the toolbar.</p>`;

/** 마크다운뷰 토글 데모 */
export const DEMO_MARKDOWN_VIEW = `<p><strong>Toggle markdown view</strong> to edit content in Markdown syntax.</p><p>Click the markdown button in the toolbar to switch between WYSIWYG and Markdown editing modes.</p>`;

/** 코드 블록 플러그인 데모 */
export const DEMO_CODE_BLOCK = `<p>Hover over the code block below to see the language selector dropdown and hover UI.</p><pre>const greeting = "Hello, World!";\nconsole.log(greeting);</pre><p>The <code>codeBlock</code> plugin provides a language selector dropdown and hover UI for code blocks.</p>`;

/** 찾기/바꾸기 패널 데모 */
export const DEMO_FINDER = `<p>Press <strong>Ctrl+F</strong> (or <strong>Cmd+F</strong> on Mac) to open the <em>Find/Replace</em> panel.</p><p>Features include <strong>live search</strong>, <strong>regex</strong>, <strong>match case</strong>, and <strong>whole word</strong> options.</p><p>Uses the CSS Custom Highlight API with a &lt;mark&gt; fallback for iframe mode.</p>`;

/** 글자수 카운터 데모 */
export const DEMO_CHAR_COUNTER = `<p>Check the character counter in the statusbar below. Try typing more text to see the count update.</p>`;

/** 실행취소/다시실행 데모 */
export const DEMO_UNDO_REDO = `<p>Make some edits, then use Ctrl+Z (undo) and Ctrl+Y (redo) or the toolbar buttons.</p>`;

/* ══ 모드 & 레이아웃 ═══════════════════════════════════ */

/** Classic 모드 데모 (상단 고정 툴바) */
export const DEMO_CLASSIC = `<p>This is <strong>Classic mode</strong> — the toolbar is fixed at the top of the editor.</p><p>This is the most common editor layout.</p>`;

/** Inline 모드 데모 (포커스 시 툴바 표시) */
export const DEMO_INLINE = `<p>This is <strong>Inline mode</strong> — the toolbar appears at the top when you focus the editor.</p><p>Click here to see the toolbar.</p>`;

/** Balloon 모드 데모 (텍스트 선택 시 플로팅 툴바) — 4줄 이상으로 선택 영역 확보 */
export const DEMO_BALLOON = `<p>This is <strong>Balloon mode</strong> — select text to see the floating toolbar appear above your selection.</p><p>Try selecting any part of this sentence. The toolbar will float right above the selected text.</p><p>You can apply <em>formatting</em>, insert links, and change alignment — all from the floating toolbar.</p><p>This mode is great for distraction-free writing where the toolbar only appears when you need it.</p>`;

/** 하단 툴바 모드 데모 */
export const DEMO_TOOLBAR_BOTTOM = `<p>The toolbar is positioned at the <strong>bottom</strong> of the editor.</p><p>Set <code>toolbar_position: 'bottom'</code> to move the toolbar below the editing area.</p><p>This layout can feel more natural for certain use cases, similar to chat input interfaces.</p>`;

/** Balloon-Always 모드 데모 (클릭 시 항상 플로팅 툴바) — 4줄 이상으로 선택 영역 확보 */
export const DEMO_BALLOON_ALWAYS = `<p>This is <strong>Balloon-Always mode</strong> — the floating toolbar is always visible when you click anywhere in the editor.</p><p>Unlike regular Balloon mode, you don't need to select text first. Just click anywhere.</p><p>The toolbar will appear at your cursor position, ready for immediate use.</p><p>This mode combines the clean look of balloon mode with the convenience of always-available formatting tools.</p>`;

/** Document 레이아웃 데모 (종이 문서 형태, type:'document:page,header' + 페이지 네비게이션) — 2페이지 분량 */
export const DEMO_DOCUMENT = `<h1>SunEditor Document Mode</h1><p>The document type renders the editor as paginated paper — just like a word processor. Each page has a fixed height, and content flows naturally across pages.</p><h2>1. Getting Started</h2><p>To enable document mode, set the <code>type</code> option to <code>"document:page,header"</code>. The editor will display page boundaries and support page navigation.</p><p>You can use the <strong>pageBreak</strong>, <strong>pageNavigator</strong>, <strong>pageUp</strong>, and <strong>pageDown</strong> buttons in the toolbar to navigate between pages.</p><h2>2. Page Layout Features</h2><p>Document mode supports headers that repeat on every page, automatic page breaks when content overflows, and manual page breaks via the toolbar button.</p><p>The page size defaults to A4 dimensions (210mm × 297mm), providing a realistic document editing experience that matches printed output.</p><h3>2.1 Headers</h3><p>When using the <code>header</code> sub-type, a dedicated header area appears at the top of each page. Header content is automatically replicated across all pages.</p><h3>2.2 Page Navigation</h3><p>The <strong>pageNavigator</strong> input in the toolbar shows the current page number. Type a page number and press Enter to jump directly to that page. Use pageUp/pageDown buttons for sequential navigation.</p><h2>3. Use Cases</h2><ul><li>Report generation with consistent formatting</li><li>Letter and document templates</li><li>PDF-ready content editing</li><li>Print-preview style editing</li></ul><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`;

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

