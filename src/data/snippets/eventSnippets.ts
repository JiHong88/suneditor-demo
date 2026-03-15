/**
 * @fileoverview 이벤트 가이드 페이지의 코드 스니펫, 이벤트 목록, 카테고리 색상 데이터
 *
 * 사용처:
 * - deep-dive 페이지 > EventsContent.tsx 컴포넌트
 *
 * 구성:
 * ── 코드 스니펫 (각 아코디언 섹션의 CodeBlock에 표시) ──
 *   EVENTS_BASIC     → "기본 이벤트" 아코디언 > onload, onChange, onSave 등록 방법
 *   EVENTS_INPUT     → "인풋 & 키보드" 아코디언 > onBeforeInput, onInput, onKeyDown
 *   EVENTS_CLIPBOARD → "클립보드" 아코디언 > onPaste, onDrop, onCopy 핸들러
 *   EVENTS_IMAGE     → "이미지 업로드" 아코디언 > 업로드 전/후/에러/상태 변경 이벤트
 *   EVENTS_UI        → "UI 이벤트" 아코디언 > 툴바, 컨트롤러, 코드뷰, 풀스크린, 리사이즈
 *   EVENTS_FOCUS     → "포커스 관리" 아코디언 > 관리형 포커스 vs 네이티브 DOM 포커스
 *
 * ── 데이터 (이벤트 개요 테이블 및 카테고리 배지) ──
 *   EVENT_LIST       → "이벤트 개요" 아코디언 > 전체 이벤트 테이블 (이름/카테고리/반환타입)
 *   CATEGORY_COLORS  → 카테고리별 Badge 색상 매핑 (lifecycle, input, focus, mouse 등 8개)
 */

/* ── 기본 이벤트: options 등록 및 events 네임스페이스 할당 ── */
export const EVENTS_BASIC = `const editor = suneditor.create(textarea, {
  // 1. Register via options
  events: {
    onload: ({ $ }) => {
      console.log('Editor ready!');
    },
    onChange: ({ $, frameContext, data }) => {
      console.log('Content changed:', data);
    },
  },
});

// 2. Or assign after creation via events namespace
editor.events.onChange = ({ $, frameContext, data }) => {
  console.log('Content changed:', data);
  // Sync with external state (React, Vue, etc.)
};

editor.events.onSave = async ({ $, data }) => {
  await fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify({ content: data }),
  });
};`;

/* ── 인풋 & 키보드: onBeforeInput, onInput, onKeyDown ── */
export const EVENTS_INPUT = `// Intercept before input (return false to block)
editor.events.onBeforeInput = ({ event, data }) => {
  if (data === '@') {
    // Custom @ handler
    return false;
  }
};

// After input processing
editor.events.onInput = ({ $, event, data }) => {
  // Return false to prevent history push
};

// Keyboard events
editor.events.onKeyDown = ({ $, event }) => {
  if (event.key === 'Enter' && event.shiftKey) {
    // Custom Shift+Enter behavior
    return false; // Prevent default
  }
};`;

/* ── 클립보드: onPaste, onDrop, onCopy 핸들러 ────── */
export const EVENTS_CLIPBOARD = `// Custom paste handler
editor.events.onPaste = async ({ $, event, data, maxCharCount }) => {
  // Return false to cancel paste
  // Return string to replace paste content
  const cleaned = data.replace(/<script[^>]*>.*?<\\/script>/gi, '');
  return cleaned;
};

// Custom drop handler
editor.events.onDrop = async ({ $, event, data }) => {
  // Same as onPaste — return false or replacement string
};

// Copy/Cut events
editor.events.onCopy = ({ $, event, clipboardData }) => {
  // Return false to prevent copy
};`;

/* ── 이미지 업로드: 전/후/에러/상태 변경 이벤트 ──── */
export const EVENTS_IMAGE = `// Before upload — validate or modify
editor.events.onImageUploadBefore = async ({ $, info, handler }) => {
  const { files } = info;
  if (files[0].size > 5 * 1024 * 1024) {
    alert('Image too large!');
    return false; // Cancel upload
  }
  // Or modify and continue:
  // handler(modifiedInfo);
};

// After upload — track loaded images
editor.events.onImageLoad = ({ $, infoList }) => {
  infoList.forEach(img => {
    console.log('Loaded:', img.src, img.name, img.size);
  });
};

// Image state changes (create/update/delete)
editor.events.onImageAction = ({ info, element, state, index }) => {
  console.log(\`Image \${state}:\`, info.src);
  // Sync with external media library
};

// Upload error handling
editor.events.onImageUploadError = async ({ error, limitSize, file }) => {
  return \`Upload failed: \${error}\`; // Custom error message
};`;

/* ── UI 이벤트: 툴바, 컨트롤러, 코드뷰, 풀스크린, 리사이즈 ── */
export const EVENTS_UI = `// Toolbar visibility (balloon/inline mode)
editor.events.onShowToolbar = ({ toolbar, mode }) => {
  console.log(\`\${mode} toolbar shown\`);
};

// Component controller displayed (image/video/table selected)
editor.events.onShowController = ({ caller, info }) => {
  console.log(\`Controller for: \${caller}\`);
};

// Code view toggled
editor.events.onToggleCodeView = ({ is }) => {
  console.log(is ? 'Code view' : 'WYSIWYG view');
};

// Fullscreen toggled
editor.events.onToggleFullScreen = ({ is }) => {
  console.log(is ? 'Fullscreen ON' : 'Fullscreen OFF');
};

// Editor resize
editor.events.onResizeEditor = ({ height, prevHeight }) => {
  console.log(\`Resized: \${prevHeight} → \${height}\`);
};`;

/* ── 포커스 관리: 관리형(onFocus/onBlur) vs 네이티브(onNativeFocus/onNativeBlur) ── */
export const EVENTS_FOCUS = `// Managed focus (recommended)
editor.events.onFocus = ({ $, frameContext }) => {
  // Triggered via editor.focusManager.focus()
  // Toolbar is visible, status flags are set
};

editor.events.onBlur = ({ $, frameContext }) => {
  // Triggered via editor.blur()
  // Balloon toolbar hidden, flags updated
};

// Native DOM focus (raw browser events)
editor.events.onNativeFocus = ({ event }) => {
  // Raw browser focus — fires before managed focus
};

editor.events.onNativeBlur = ({ event }) => {
  // Raw browser blur — fires before managed blur
};`;

/* ── 이벤트 개요 테이블: 전체 이벤트 목록 (이름/카테고리/반환타입) ── */
type EventDef = {
	name: string;
	returnType?: string;
	category: string;
};

export const EVENT_LIST: EventDef[] = [
	// Lifecycle
	{ name: "onload", category: "lifecycle" },
	{ name: "onChange", category: "lifecycle" },
	{ name: "onSave", returnType: "Promise<boolean>", category: "lifecycle" },
	// Input
	{ name: "onBeforeInput", returnType: "false | void", category: "input" },
	{ name: "onInput", returnType: "false | void", category: "input" },
	{ name: "onKeyDown", returnType: "false | void", category: "input" },
	{ name: "onKeyUp", returnType: "false | void", category: "input" },
	// Focus
	{ name: "onFocus", category: "focus" },
	{ name: "onBlur", category: "focus" },
	{ name: "onNativeFocus", category: "focus" },
	{ name: "onNativeBlur", category: "focus" },
	// Mouse
	{ name: "onMouseDown", returnType: "false | void", category: "mouse" },
	{ name: "onClick", returnType: "false | void", category: "mouse" },
	{ name: "onMouseUp", returnType: "false | void", category: "mouse" },
	{ name: "onMouseLeave", returnType: "false | void", category: "mouse" },
	{ name: "onScroll", category: "mouse" },
	// Clipboard
	{ name: "onCopy", returnType: "false | void", category: "clipboard" },
	{ name: "onCut", returnType: "false | void", category: "clipboard" },
	{ name: "onPaste", returnType: "Promise<false | string>", category: "clipboard" },
	{ name: "onDrop", returnType: "Promise<false | string>", category: "clipboard" },
	// UI
	{ name: "onShowToolbar", category: "ui" },
	{ name: "onShowController", category: "ui" },
	{ name: "onBeforeShowController", returnType: "false | void", category: "ui" },
	{ name: "onToggleCodeView", category: "ui" },
	{ name: "onToggleFullScreen", category: "ui" },
	{ name: "onResizeEditor", category: "ui" },
	{ name: "onSetToolbarButtons", category: "ui" },
	{ name: "onResetButtons", category: "ui" },
	// Image
	{ name: "imageUploadHandler", returnType: "Promise<boolean>", category: "media" },
	{ name: "onImageUploadBefore", returnType: "Promise<false | Info>", category: "media" },
	{ name: "onImageLoad", category: "media" },
	{ name: "onImageAction", category: "media" },
	{ name: "onImageUploadError", returnType: "Promise<string>", category: "media" },
	{ name: "onImageDeleteBefore", returnType: "Promise<boolean>", category: "media" },
	// Video
	{ name: "videoUploadHandler", returnType: "Promise<boolean>", category: "media" },
	{ name: "onVideoUploadBefore", returnType: "Promise<false | Info>", category: "media" },
	{ name: "onVideoLoad", category: "media" },
	{ name: "onVideoAction", category: "media" },
	{ name: "onVideoUploadError", returnType: "Promise<string>", category: "media" },
	{ name: "onVideoDeleteBefore", returnType: "Promise<boolean>", category: "media" },
	// Audio
	{ name: "audioUploadHandler", returnType: "Promise<boolean>", category: "media" },
	{ name: "onAudioUploadBefore", returnType: "Promise<false | Info>", category: "media" },
	{ name: "onAudioLoad", category: "media" },
	{ name: "onAudioAction", category: "media" },
	{ name: "onAudioUploadError", returnType: "Promise<string>", category: "media" },
	{ name: "onAudioDeleteBefore", returnType: "Promise<boolean>", category: "media" },
	// File
	{ name: "onFileUploadBefore", returnType: "Promise<false | Info>", category: "media" },
	{ name: "onFileLoad", category: "media" },
	{ name: "onFileAction", category: "media" },
	{ name: "onFileUploadError", returnType: "Promise<string>", category: "media" },
	{ name: "onFileDeleteBefore", returnType: "Promise<boolean>", category: "media" },
	// Embed
	{ name: "onEmbedInputBefore", returnType: "Promise<false | Info>", category: "media" },
	{ name: "onEmbedDeleteBefore", returnType: "Promise<boolean>", category: "media" },
	// Unified
	{ name: "onFileManagerAction", category: "media" },
	{ name: "onExportPDFBefore", returnType: "Promise<boolean>", category: "media" },
	// Plugin
	{ name: "onFontActionBefore", returnType: "Promise<false>", category: "plugin" },
];

/* ── 카테고리별 Badge 색상 매핑 (8개 카테고리) ──── */
export const CATEGORY_COLORS: Record<string, string> = {
	lifecycle: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
	input: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
	focus: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
	mouse: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
	clipboard: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
	ui: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
	media: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
	plugin: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
};
