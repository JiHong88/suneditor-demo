/**
 * Maps each feature-demo key to a playground URL query string.
 * - Playground params set the relevant options/plugins.
 * - `val` param sets initial editor content to demonstrate the feature.
 * - Upload URLs use "xxx" as placeholder for the user to replace later.
 */

export type FeatureLink = {
	/** URL query string (without leading ?) */
	query: string;
	/** Raw demo HTML for Quick Try preview */
	demoHtml: string;
	/** Toolbar buttons shown in the Quick Try editor */
	buttonList: (string | string[])[];
	/** Extra SunEditor options for the Quick Try editor */
	editorOptions?: Record<string, unknown>;
};

/** Build a query string from key-value pairs, encoding values */
function qs(params: Record<string, string>): string {
	return new URLSearchParams(params).toString();
}

/** Build a FeatureLink */
function fl(
	params: Record<string, string>,
	buttonList: (string | string[])[],
	editorOptions?: Record<string, unknown>,
): FeatureLink {
	return {
		query: qs(params),
		demoHtml: params.val || "",
		buttonList,
		editorOptions,
	};
}

/* ── Demo HTML content per feature ─────────────────────── */

const DEMO_BOLD_ITALIC = `<p><strong>Bold text</strong>, <em>Italic text</em>, <u>Underline</u>, <del>Strikethrough</del></p><p><strong><em>Bold + Italic combined</em></strong></p><p>Select text and try the formatting buttons in the toolbar.</p>`;

const DEMO_FONT_FAMILY = `<p><span style="font-family: Arial;">This is Arial font.</span></p><p><span style="font-family: Georgia;">This is Georgia font.</span></p><p><span style="font-family: &quot;Courier New&quot;;">This is Courier New font.</span></p><p>Select text and change the font family from the toolbar.</p>`;

const DEMO_FONT_SIZE = `<p><span style="font-size: 12px;">Small text (12px)</span></p><p><span style="font-size: 16px;">Normal text (16px)</span></p><p><span style="font-size: 24px;">Large text (24px)</span></p><p><span style="font-size: 36px;">Extra Large (36px)</span></p>`;

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
	boldItalic: fl(
		{ p: "standard", val: DEMO_BOLD_ITALIC },
		[["bold", "italic", "underline", "strike", "subscript", "superscript"]],
	),
	fontFamily: fl(
		{ p: "full", val: DEMO_FONT_FAMILY },
		[["font"], "|", ["bold", "italic", "underline"]],
	),
	fontSize: fl(
		{ p: "full", val: DEMO_FONT_SIZE },
		[["fontSize"], "|", ["bold", "italic", "underline"]],
	),
	fontColor: fl(
		{ p: "standard", val: DEMO_FONT_COLOR },
		[["fontColor"], "|", ["bold", "italic"]],
	),
	bgColor: fl(
		{ p: "standard", val: DEMO_BG_COLOR },
		[["backgroundColor"], "|", ["bold", "italic"]],
	),
	alignment: fl(
		{ p: "standard", val: DEMO_ALIGNMENT },
		[["align"], "|", ["bold", "italic"]],
	),
	blockStyles: fl(
		{ p: "full", val: DEMO_BLOCK_STYLES },
		[["blockStyle"], "|", ["bold", "italic", "underline"]],
	),
	lineHeight: fl(
		{ p: "full", val: DEMO_LINE_HEIGHT },
		[["lineHeight"], "|", ["bold", "italic"]],
	),
	copyFormat: fl(
		{ p: "full", val: DEMO_COPY_FORMAT },
		[["copyFormat", "removeFormat"], "|", ["bold", "italic", "fontColor", "fontSize"]],
	),

	// ── Media ──
	imageUpload: fl(
		{ p: "full", "i.uu": "xxx://image-upload-server", val: DEMO_IMAGE },
		[["image"]],
	),
	imageResize: fl(
		{ p: "full", val: DEMO_IMAGE_RESIZE },
		[["image"]],
	),
	video: fl(
		{ p: "full", val: DEMO_VIDEO },
		[["video"]],
	),
	audio: fl(
		{ p: "full", val: DEMO_AUDIO },
		[["audio"]],
	),
	embed: fl(
		{ p: "full", val: DEMO_EMBED },
		[["embed"]],
	),
	drawing: fl(
		{ p: "full", val: DEMO_DRAWING },
		[["drawing"]],
	),
	fileUpload: fl(
		{ p: "full", "fu.uu": "xxx://file-upload-server", val: DEMO_FILE_UPLOAD },
		[["fileUpload"]],
	),

	// ── Table & Structure ──
	tableInsert: fl(
		{ p: "standard", val: DEMO_TABLE },
		[["table"], "|", ["bold", "italic"]],
	),
	cellMerge: fl(
		{ p: "standard", val: DEMO_CELL_MERGE },
		[["table"], "|", ["bold", "italic"]],
	),
	rowColOps: fl(
		{ p: "standard", val: DEMO_ROW_COL },
		[["table"], "|", ["bold", "italic"]],
	),
	lists: fl(
		{ p: "standard", val: DEMO_LISTS },
		[["list_numbered", "list_bulleted"], "|", ["outdent", "indent"]],
	),
	blockquote: fl(
		{ p: "full", val: DEMO_BLOCKQUOTE },
		[["blockquote"], "|", ["bold", "italic"]],
	),
	hr: fl(
		{ p: "full", val: DEMO_HR },
		[["hr"], "|", ["bold", "italic"]],
	),
	pageBreak: fl(
		{ p: "full", val: DEMO_PAGE_BREAK },
		[["pageBreak"], "|", ["bold", "italic"]],
	),

	// ── Advanced ──
	math: fl(
		{ p: "full", val: DEMO_MATH },
		[["math"], "|", ["bold", "italic"]],
	),
	mention: fl(
		{ p: "full", "mn.au": "xxx://mention-api", val: DEMO_MENTION },
		[["bold", "italic"]],
	),
	links: fl(
		{ p: "standard", val: DEMO_LINKS },
		[["link", "anchor"], "|", ["bold", "italic"]],
	),
	codeView: fl(
		{ p: "standard", val: DEMO_CODE_VIEW },
		[["codeView"], "|", ["bold", "italic", "underline"]],
	),
	charCounter: fl(
		{ cc: "1", ccm: "500", val: DEMO_CHAR_COUNTER },
		[["bold", "italic", "underline"]],
		{ charCounter: true, charCounter_max: 500 },
	),
	undoRedo: fl(
		{ p: "standard", val: DEMO_UNDO_REDO },
		[["undo", "redo"], "|", ["bold", "italic", "underline"]],
	),

	// ── Modes & Layout ──
	classicMode: fl(
		{ m: "classic", val: DEMO_CLASSIC },
		[["bold", "italic", "underline"], "|", ["align"], "|", ["link", "image"]],
		{ mode: "classic" },
	),
	inlineMode: fl(
		{ m: "inline", val: DEMO_INLINE },
		[["bold", "italic", "underline"], "|", ["align"], "|", ["link", "image"]],
		{ mode: "inline" },
	),
	balloonMode: fl(
		{ m: "balloon", val: DEMO_BALLOON },
		[["bold", "italic", "underline"], "|", ["align"], "|", ["link"]],
		{ mode: "balloon" },
	),
	balloonAlways: fl(
		{ m: "balloon-always", val: DEMO_BALLOON_ALWAYS },
		[["bold", "italic", "underline"], "|", ["align"], "|", ["link"]],
		{ mode: "balloon-always" },
	),
	documentLayout: fl(
		{ p: "full", val: DEMO_DOCUMENT },
		[["bold", "italic", "underline"], "|", ["blockStyle"], "|", ["align"]],
	),
	multiRoot: fl(
		{ mr: "1", val: DEMO_MULTIROOT },
		[["bold", "italic", "underline"], "|", ["link", "image"]],
	),
	fullScreen: fl(
		{ p: "standard", val: DEMO_FULLSCREEN },
		[["fullScreen"], "|", ["bold", "italic", "underline"]],
	),

	// ── Platform ──
	zeroDeps: fl(
		{ val: "<p>SunEditor has <strong>zero dependencies</strong> — no jQuery, no Bootstrap, nothing else required.</p>" },
		[["bold", "italic", "underline"]],
	),
	tsSupport: fl(
		{ val: "<p>SunEditor ships with full <strong>TypeScript</strong> type definitions out of the box.</p>" },
		[["bold", "italic", "underline"]],
	),
	i18nRtl: fl(
		{ dir: "rtl", rb: "all", val: DEMO_RTL },
		[["bold", "italic", "underline"], "|", ["align"], "|", ["dir"]],
		{ textDirection: "rtl" },
	),
	strictMode: fl(
		{ sm: "1", val: DEMO_STRICT_MODE },
		[["bold", "italic", "underline"], "|", ["link"]],
	),
	pluginAPI: fl(
		{
			p: "full",
			val: "<p>SunEditor provides a powerful <strong>Plugin API</strong> for creating custom plugins.</p><p>Check the Plugin Guide for details.</p>",
		},
		[["bold", "italic", "underline"], "|", ["link", "image"]],
	),
	exportPdf: fl(
		{ p: "full", "ep.au": "xxx://pdf-export-api", val: DEMO_EXPORT_PDF },
		[["exportPDF", "print", "preview"], "|", ["bold", "italic"]],
	),
	keyboard: fl(
		{ p: "standard", val: DEMO_KEYBOARD },
		[["undo", "redo"], "|", ["bold", "italic", "underline"], "|", ["link"]],
	),
};
