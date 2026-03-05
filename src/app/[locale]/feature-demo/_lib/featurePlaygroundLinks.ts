/**
 * Maps each feature-demo key to a playground URL query string.
 * - Playground params set the relevant options/plugins.
 * - `val` param sets initial editor content to demonstrate the feature.
 * - Upload URLs use "xxx" as placeholder for the user to replace later.
 */

type FeatureLink = {
	/** URL query string (without leading ?) */
	query: string;
};

/** Build a query string from key-value pairs, encoding values */
function qs(params: Record<string, string>): string {
	return new URLSearchParams(params).toString();
}

/* ── Demo HTML content per feature ─────────────────────── */

const DEMO_BOLD_ITALIC = `<p><strong>Bold text</strong>, <em>Italic text</em>, <u>Underline</u>, <del>Strikethrough</del></p><p><strong><em>Bold + Italic combined</em></strong></p><p>Select text and try the formatting buttons in the toolbar.</p>`;

const DEMO_FONT_FAMILY = `<p style="font-family: Arial;">This is Arial font.</p><p style="font-family: Georgia;">This is Georgia font.</p><p style="font-family: 'Courier New';">This is Courier New font.</p><p>Select text and change the font family from the toolbar.</p>`;

const DEMO_FONT_SIZE = `<p style="font-size: 12px;">Small text (12px)</p><p style="font-size: 16px;">Normal text (16px)</p><p style="font-size: 24px;">Large text (24px)</p><p style="font-size: 36px;">Extra Large (36px)</p>`;

const DEMO_FONT_COLOR = `<p><span style="color: #e74c3c;">Red text</span>, <span style="color: #3498db;">Blue text</span>, <span style="color: #2ecc71;">Green text</span></p><p>Select text and pick a color from the toolbar.</p>`;

const DEMO_BG_COLOR = `<p><span style="background-color: #f1c40f;">Highlighted in yellow</span></p><p><span style="background-color: #a8e6cf;">Highlighted in green</span></p><p>Select text and apply background colors.</p>`;

const DEMO_ALIGNMENT = `<p style="text-align: left;">Left aligned text</p><p style="text-align: center;">Center aligned text</p><p style="text-align: right;">Right aligned text</p><p style="text-align: justify;">Justified text — this paragraph is justified so the text stretches to fill the full width of the container evenly on both sides.</p>`;

const DEMO_BLOCK_STYLES = `<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><p>Normal paragraph text</p><pre>Preformatted code block</pre>`;

const DEMO_LINE_HEIGHT = `<p style="line-height: 1;">Line height 1.0 — compact spacing for dense text layouts.</p><p style="line-height: 1.5;">Line height 1.5 — standard comfortable reading spacing.</p><p style="line-height: 2.5;">Line height 2.5 — extra wide spacing for emphasis or special layouts.</p>`;

const DEMO_COPY_FORMAT = `<p><strong style="color: #e74c3c; font-size: 20px;">Copy this format</strong> — click the "Copy Format" button after selecting this text, then apply it to the text below.</p><p>Apply the copied format to this plain text.</p>`;

const DEMO_IMAGE = `<p>Click the image button in the toolbar to upload or insert an image.</p><p>You can drag &amp; drop images directly into the editor.</p>`;

const DEMO_IMAGE_RESIZE = `<p>Insert an image and try resizing it by dragging the corner handles.</p>`;

const DEMO_VIDEO = `<p>Click the video button to embed a video from YouTube, Vimeo, or upload a video file.</p>`;

const DEMO_AUDIO = `<p>Click the audio button to embed or upload audio files.</p>`;

const DEMO_EMBED = `<p>Click the embed button to insert an iframe embed (YouTube, maps, etc).</p>`;

const DEMO_DRAWING = `<p>Click the drawing button to open the drawing canvas. Draw freely and insert into the editor.</p>`;

const DEMO_FILE_UPLOAD = `<p>Click the file upload button to attach files to the editor content.</p>`;

const DEMO_TABLE = `<p>Click the table button in the toolbar to insert a table.</p><table><thead><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr></thead><tbody><tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr><tr><td>Cell 4</td><td>Cell 5</td><td>Cell 6</td></tr></tbody></table>`;

const DEMO_CELL_MERGE = `<p>Select multiple cells in the table below and use the cell merge function.</p><table><thead><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td><td>7</td><td>8</td></tr><tr><td>9</td><td>10</td><td>11</td><td>12</td></tr></tbody></table>`;

const DEMO_ROW_COL = `<p>Click on a table cell to see row/column operation buttons.</p><table><thead><tr><th>Name</th><th>Age</th><th>City</th></tr></thead><tbody><tr><td>Alice</td><td>30</td><td>Seoul</td></tr><tr><td>Bob</td><td>25</td><td>Tokyo</td></tr></tbody></table>`;

const DEMO_LISTS = `<ol><li>First ordered item</li><li>Second ordered item</li><li>Third ordered item</li></ol><ul><li>Unordered item A</li><li>Unordered item B</li><li>Unordered item C</li></ul>`;

const DEMO_BLOCKQUOTE = `<blockquote><p>This is a blockquote. Use it to highlight important quotes or references.</p></blockquote><p>Normal paragraph after blockquote.</p>`;

const DEMO_HR = `<p>Content above the horizontal rule.</p><hr/><p>Content below the horizontal rule.</p>`;

const DEMO_PAGE_BREAK = `<p>Page 1 content — try the page break button in the toolbar to insert a page break below.</p>`;

const DEMO_MATH = `<p>Click the math button to insert mathematical formulas using KaTeX notation.</p><p>Example: Try inserting a formula like E = mc²</p>`;

const DEMO_MENTION = `<p>Type @ to trigger the mention popup and select a user.</p>`;

const DEMO_LINKS = `<p>Select text and click the link button: <a href="https://example.com">Example Link</a></p><p>Try creating a new link by selecting this text.</p>`;

const DEMO_CODE_VIEW = `<p><strong>Toggle code view</strong> to see and edit the raw HTML source.</p><p>Click the <code>&lt;/&gt;</code> button in the toolbar.</p>`;

const DEMO_CHAR_COUNTER = `<p>Check the character counter in the statusbar below. Try typing more text to see the count update.</p>`;

const DEMO_UNDO_REDO = `<p>Make some edits, then use Ctrl+Z (undo) and Ctrl+Y (redo) or the toolbar buttons.</p>`;

const DEMO_CLASSIC = `<p>This is <strong>Classic mode</strong> — the toolbar is fixed at the top of the editor.</p><p>This is the most common editor layout.</p>`;

const DEMO_INLINE = `<p>This is <strong>Inline mode</strong> — the toolbar appears at the top when you focus the editor.</p><p>Click here to see the toolbar.</p>`;

const DEMO_BALLOON = `<p>This is <strong>Balloon mode</strong> — select text to see the floating toolbar.</p><p>Try selecting this sentence to see the balloon toolbar appear.</p>`;

const DEMO_BALLOON_ALWAYS = `<p>This is <strong>Balloon-Always mode</strong> — the floating toolbar is always visible when you click in the editor.</p><p>Click anywhere in this text.</p>`;

const DEMO_DOCUMENT = `<p>This is <strong>Document layout</strong> — the editor looks like a paper document.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`;

const DEMO_MULTIROOT = `<p>Multi-root editor with separate editable areas (header + body) sharing one toolbar.</p>`;

const DEMO_FULLSCREEN = `<p>Click the fullscreen button in the toolbar to expand the editor to fill the entire screen.</p>`;

const DEMO_RTL = `<p dir="rtl" style="text-align: right;">هذا نص باللغة العربية لاختبار اتجاه الكتابة من اليمين إلى اليسار.</p><p>This demonstrates RTL (Right-to-Left) support along with internationalization.</p>`;

const DEMO_STRICT_MODE = `<p>Strict mode filters and sanitizes pasted content.</p><p>Try pasting formatted content from external sources to see filtering in action.</p>`;

const DEMO_EXPORT_PDF = `<p><strong>Export PDF</strong> — click the export PDF button in the toolbar to download the editor content as a PDF file.</p><p>This feature requires a PDF API endpoint.</p>`;

const DEMO_KEYBOARD = `<p><strong>Keyboard shortcuts:</strong></p><ul><li><code>Ctrl+B</code> — Bold</li><li><code>Ctrl+I</code> — Italic</li><li><code>Ctrl+U</code> — Underline</li><li><code>Ctrl+Z</code> — Undo</li><li><code>Ctrl+Y</code> — Redo</li><li><code>Ctrl+A</code> — Select All</li></ul><p>Try using these shortcuts!</p>`;

/* ── Feature → Playground mapping ──────────────────────── */

export const FEATURE_PLAYGROUND_LINKS: Record<string, FeatureLink> = {
	// ── Text Formatting ──
	boldItalic: {
		query: qs({ p: "standard", val: DEMO_BOLD_ITALIC }),
	},
	fontFamily: {
		query: qs({ p: "full", val: DEMO_FONT_FAMILY }),
	},
	fontSize: {
		query: qs({ p: "full", val: DEMO_FONT_SIZE }),
	},
	fontColor: {
		query: qs({ p: "standard", val: DEMO_FONT_COLOR }),
	},
	bgColor: {
		query: qs({ p: "standard", val: DEMO_BG_COLOR }),
	},
	alignment: {
		query: qs({ p: "standard", val: DEMO_ALIGNMENT }),
	},
	blockStyles: {
		query: qs({ p: "full", val: DEMO_BLOCK_STYLES }),
	},
	lineHeight: {
		query: qs({ p: "full", val: DEMO_LINE_HEIGHT }),
	},
	copyFormat: {
		query: qs({ p: "full", val: DEMO_COPY_FORMAT }),
	},

	// ── Media ──
	imageUpload: {
		query: qs({ p: "full", "i.uu": "xxx://image-upload-server", val: DEMO_IMAGE }),
	},
	imageResize: {
		query: qs({ p: "full", val: DEMO_IMAGE_RESIZE }),
	},
	video: {
		query: qs({ p: "full", val: DEMO_VIDEO }),
	},
	audio: {
		query: qs({ p: "full", val: DEMO_AUDIO }),
	},
	embed: {
		query: qs({ p: "full", val: DEMO_EMBED }),
	},
	drawing: {
		query: qs({ p: "full", val: DEMO_DRAWING }),
	},
	fileUpload: {
		query: qs({ p: "full", "fu.uu": "xxx://file-upload-server", val: DEMO_FILE_UPLOAD }),
	},

	// ── Table & Structure ──
	tableInsert: {
		query: qs({ p: "standard", val: DEMO_TABLE }),
	},
	cellMerge: {
		query: qs({ p: "standard", val: DEMO_CELL_MERGE }),
	},
	rowColOps: {
		query: qs({ p: "standard", val: DEMO_ROW_COL }),
	},
	lists: {
		query: qs({ p: "standard", val: DEMO_LISTS }),
	},
	blockquote: {
		query: qs({ p: "full", val: DEMO_BLOCKQUOTE }),
	},
	hr: {
		query: qs({ p: "full", val: DEMO_HR }),
	},
	pageBreak: {
		query: qs({ p: "full", val: DEMO_PAGE_BREAK }),
	},

	// ── Advanced ──
	math: {
		query: qs({ p: "full", val: DEMO_MATH }),
	},
	mention: {
		query: qs({ p: "full", "mn.au": "xxx://mention-api", val: DEMO_MENTION }),
	},
	links: {
		query: qs({ p: "standard", val: DEMO_LINKS }),
	},
	codeView: {
		query: qs({ p: "standard", val: DEMO_CODE_VIEW }),
	},
	charCounter: {
		query: qs({ cc: "1", ccm: "500", val: DEMO_CHAR_COUNTER }),
	},
	undoRedo: {
		query: qs({ p: "standard", val: DEMO_UNDO_REDO }),
	},

	// ── Modes & Layout ──
	classicMode: {
		query: qs({ m: "classic", val: DEMO_CLASSIC }),
	},
	inlineMode: {
		query: qs({ m: "inline", val: DEMO_INLINE }),
	},
	balloonMode: {
		query: qs({ m: "balloon", val: DEMO_BALLOON }),
	},
	balloonAlways: {
		query: qs({ m: "balloon-always", val: DEMO_BALLOON_ALWAYS }),
	},
	documentLayout: {
		query: qs({ p: "full", val: DEMO_DOCUMENT }),
	},
	multiRoot: {
		query: qs({ mr: "1", val: DEMO_MULTIROOT }),
	},
	fullScreen: {
		query: qs({ p: "standard", val: DEMO_FULLSCREEN }),
	},

	// ── Platform ──
	zeroDeps: {
		query: qs({ val: "<p>SunEditor has <strong>zero dependencies</strong> — no jQuery, no Bootstrap, nothing else required.</p>" }),
	},
	tsSupport: {
		query: qs({ val: "<p>SunEditor ships with full <strong>TypeScript</strong> type definitions out of the box.</p>" }),
	},
	i18nRtl: {
		query: qs({ dir: "rtl", rb: "all", val: DEMO_RTL }),
	},
	strictMode: {
		query: qs({ sm: "1", val: DEMO_STRICT_MODE }),
	},
	pluginAPI: {
		query: qs({ p: "full", val: "<p>SunEditor provides a powerful <strong>Plugin API</strong> for creating custom plugins.</p><p>Check the Plugin Guide for details.</p>" }),
	},
	exportPdf: {
		query: qs({ p: "full", "ep.au": "xxx://pdf-export-api", val: DEMO_EXPORT_PDF }),
	},
	keyboard: {
		query: qs({ p: "standard", val: DEMO_KEYBOARD }),
	},
};
