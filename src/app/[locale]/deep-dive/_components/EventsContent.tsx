"use client";

import { useTranslations } from "next-intl";
import CodeBlock from "@/components/common/CodeBlock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

/* ── Code constants ───────────────────────────────────── */

const EVENTS_BASIC = `const editor = suneditor.create(textarea, {
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

const EVENTS_INPUT = `// Intercept before input (return false to block)
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

const EVENTS_CLIPBOARD = `// Custom paste handler
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

const EVENTS_IMAGE = `// Before upload — validate or modify
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

const EVENTS_UI = `// Toolbar visibility (balloon/inline mode)
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

const EVENTS_FOCUS = `// Managed focus (recommended)
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

type EventDef = {
	name: string;
	returnType?: string;
	category: string;
};

const EVENT_LIST: EventDef[] = [
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

const CATEGORY_COLORS: Record<string, string> = {
	lifecycle: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
	input: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
	focus: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
	mouse: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
	clipboard: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
	ui: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
	media: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
	plugin: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
};

/* ── Component ────────────────────────────────────────── */

export default function EventsContent() {
	const t = useTranslations("DeepDive.events");

	const categories = [...new Set(EVENT_LIST.map((e) => e.category))];

	return (
		<div className='space-y-6'>
			<Accordion type='multiple' defaultValue={["event-overview", "basic-events"]} className='space-y-1'>
				{/* 1. Event Overview */}
				<AccordionItem value='event-overview'>
					<AccordionTrigger className='text-base font-semibold'>{t("overview")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("overviewDesc")}</p>

						<div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
							{categories.map((cat) => {
								const count = EVENT_LIST.filter((e) => e.category === cat).length;
								return (
									<div key={cat} className='flex items-center gap-2 text-xs'>
										<Badge variant='secondary' className={CATEGORY_COLORS[cat]}>
											{t(`cat.${cat}`)}
										</Badge>
										<span className='text-muted-foreground'>{count}</span>
									</div>
								);
							})}
						</div>

						<div className='rounded-lg border overflow-x-auto max-h-[400px] overflow-y-auto'>
							<table className='w-full text-xs'>
								<thead className='sticky top-0 bg-muted/90 backdrop-blur-sm'>
									<tr>
										<th className='text-left px-3 py-2 font-semibold'>Event</th>
										<th className='text-left px-3 py-2 font-semibold'>{t("category")}</th>
										<th className='text-left px-3 py-2 font-semibold'>{t("returnType")}</th>
									</tr>
								</thead>
								<tbody>
									{EVENT_LIST.map((evt) => (
										<tr key={evt.name} className='border-t border-border/50'>
											<td className='px-3 py-1.5'>
												<code className='font-mono text-[11px]'>{evt.name}</code>
											</td>
											<td className='px-3 py-1.5'>
												<Badge variant='secondary' className={`text-[10px] ${CATEGORY_COLORS[evt.category]}`}>
													{t(`cat.${evt.category}`)}
												</Badge>
											</td>
											<td className='px-3 py-1.5 text-muted-foreground'>
												{evt.returnType ? (
													<code className='font-mono text-[10px] bg-muted px-1 rounded'>{evt.returnType}</code>
												) : (
													<span className='text-[10px]'>void</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 2. Basic Events */}
				<AccordionItem value='basic-events'>
					<AccordionTrigger className='text-base font-semibold'>{t("basicEvents")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("basicEventsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={EVENTS_BASIC} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 3. Input & Keyboard */}
				<AccordionItem value='input-events'>
					<AccordionTrigger className='text-base font-semibold'>{t("inputEvents")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("inputEventsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={EVENTS_INPUT} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 4. Clipboard */}
				<AccordionItem value='clipboard-events'>
					<AccordionTrigger className='text-base font-semibold'>{t("clipboardEvents")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("clipboardEventsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={EVENTS_CLIPBOARD} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 5. Image Upload */}
				<AccordionItem value='image-events'>
					<AccordionTrigger className='text-base font-semibold'>{t("imageEvents")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("imageEventsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={EVENTS_IMAGE} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 6. Focus Management */}
				<AccordionItem value='focus-events'>
					<AccordionTrigger className='text-base font-semibold'>{t("focusEvents")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("focusEventsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={EVENTS_FOCUS} lang='javascript' />
						</div>
						<div className='rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4'>
							<h4 className='text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2'>{t("focusTip")}</h4>
							<p className='text-xs text-muted-foreground'>{t("focusTipDesc")}</p>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 7. UI Events */}
				<AccordionItem value='ui-events'>
					<AccordionTrigger className='text-base font-semibold'>{t("uiEvents")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("uiEventsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={EVENTS_UI} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
