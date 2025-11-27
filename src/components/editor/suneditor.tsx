"use client";

import React, { useEffect, useRef } from "react";
import suneditor, { plugins, langs, interfaces } from "suneditor";
import type { SunEditor } from "suneditor/types";
import { ModuleModal } from "suneditor/interfaces";
import en from "suneditor/langs/en";
import "suneditor/css";
import "suneditor/css/contents";

class A extends interfaces.PluginModal implements ModuleModal, interfaces.PluginDropdown, interfaces.EditorComponent {
	constructor(editor: SunEditor.Instance) {
		super(editor);
	}

	on(target?: HTMLElement): void {
		void target;
	}

	componentSelect(target: HTMLElement): void {
		void target;
	}

	action(target: HTMLElement): void | Promise<void> {
		void target;
		throw new Error("Method not implemented.");
	}

	open(target?: HTMLElement): void {
		console.log("PluginModal A opened", target);
	}

	async modalAction() {
		return true;
	}

	modalOff(isUpdate: boolean): void {
		void isUpdate;
	}
}

export { A };

interface SunEditorProps {
	value?: string;
	options?: SunEditor.Options;
	onChange?: (content: string) => void;
}

const SunEditor: React.FC<SunEditorProps> = ({ value, options }) => {
	const editorRef = useRef<HTMLTextAreaElement>(null);
	const instanceRef = useRef<SunEditor.Instance | null>(null);
	const isInitializedRef = useRef(false);
	const options_test: SunEditor.InitOptions = {
		lang: en,
		// ================================================================
		// === Frame Options ===
		// ================================================================

		// Content & Editing
		value: "<p>Initial HTML content</p>",
		placeholder: "Enter text here...",
		editableFrameAttributes: { spellcheck: "true", "data-test": "value" },

		// Layout & Sizing
		width: "100%",
		minWidth: "300px",
		maxWidth: "1200px",
		height: "auto",
		minHeight: "200px",
		maxHeight: "600px",
		editorStyle: "border: 1px solid #ccc; border-radius: 4px;",

		// Iframe Mode
		iframe: false,
		iframe_fullPage: false,
		iframe_attributes: { scrolling: "no", sandbox: "allow-scripts" },
		iframe_cssFileName: "suneditor",

		// Statusbar & Character Counter
		statusbar: true,
		statusbar_showPathLabel: true,
		statusbar_resizeEnable: true,
		charCounter: true,
		charCounter_max: 5000,
		charCounter_label: "Characters: {char}/{maxChar}",
		charCounter_type: "char",

		// ================================================================
		// === Base Options ===
		// ================================================================

		// Plugins & Toolbar
		plugins,
		excludedPlugins: ["drawing"],
		buttonList: [
			["undo", "redo"],
			"|",
			["bold", "underline", "italic", "strike"],
			"|",
			["removeFormat"],
			"|",
			["outdent", "indent"],
			"|",
			["fullScreen", "showBlocks", "codeView"],
			"|",
			["preview", "print"],
		],

		// Modes & Themes
		v2Migration: false,
		mode: "classic",
		type: "document:header,page",
		theme: "",
		// lang: en, // import from langs
		icons: {},
		textDirection: "ltr",
		reverseButtons: ["indent-outdent"],

		// Strict Mode & Filtering
		strictMode: {
			tagFilter: true,
			formatFilter: true,
			classFilter: true,
			textStyleTagFilter: true,
			attrFilter: true,
			styleFilter: true,
		},
		scopeSelectionTags: ["td", "table", "li", "ol", "ul", "pre"],

		// Content Filtering & Formatting
		elementWhitelist: "mark|figure",
		elementBlacklist: "script|style",
		allowedEmptyTags: ".custom-component",
		allowedClassName: "custom-class",

		// Attribute Control
		attributeWhitelist: {
			a: "href|target|rel",
			img: "src|alt|title",
			"*": "data-id",
		},
		attributeBlacklist: {
			"*": "onclick|onload",
		},

		// Text & Inline Style Control
		textStyleTags: "mark",
		convertTextTags: {
			bold: "strong",
			underline: "u",
			italic: "em",
			strike: "del",
			subscript: "sub",
			superscript: "sup",
		},
		allUsedStyles: "text-shadow|letter-spacing",
		tagStyles: {
			table: "border|border-collapse",
			th: "background-color|font-weight",
			td: "vertical-align",
		},
		spanStyles: "font-family|font-size|color|background-color",
		lineStyles: "text-align|margin|line-height",
		fontSizeUnits: ["px", "pt", "em", "rem", "%"],
		retainStyleMode: "repeat",

		// Line & Block Formatting
		defaultLine: "p",
		defaultLineBreakFormat: "line",
		lineAttrReset: "id|data-temp",
		formatLine: "section",
		formatBrLine: "code",
		formatClosureBrLine: "",
		formatBlock: "aside",
		formatClosureBlock: "",

		// UI & Interaction
		closeModalOutsideClick: false,
		syncTabIndent: true,
		tabDisable: false,
		toolbar_width: "auto",
		toolbar_sticky: 0,
		toolbar_hide: false,
		subToolbar: {
			buttonList: [["bold", "italic", "underline"]],
			mode: "balloon",
			width: "auto",
		},
		statusbar_container: undefined,
		shortcutsHint: true,
		shortcutsDisable: false,
		shortcuts: {
			bold: ["ctrl+b", "cmd+b"],
			save: ["ctrl+s", "cmd+s"],
		},

		// Advanced Features
		copyFormatKeepOn: false,
		autoLinkify: true,
		autoStyleify: ["bold", "underline", "italic", "strike"],
		historyStackDelayTime: 400,
		printClass: "print-page",
		fullScreenOffset: 0,
		previewTemplate: '<div class="preview-wrapper">{contents}</div>',
		printTemplate: "<html><head><title>Print</title></head><body>{contents}</body></html>",
		componentInsertBehavior: "auto",
		defaultUrlProtocol: "https://",
		toastMessageTime: { copy: 1500 },
		freeCodeViewMode: "default",

		// Dynamic Options
		externalLibs: {
			katex: null,
			mathJax: {
				src: null,
				tex: {},
			},
		},
		allowedExtraTags: {
			script: false,
			style: false,
			meta: false,
		},

		// Advanced Internal Options (prefixed with __)
		__textStyleTags: "mark|label",
		__tagStyles: {
			table: "border-collapse",
		},
		__defaultElementWhitelist: "p|div|span|a|img",
		__defaultAttributeWhitelist: "href|src|alt|class",
		__defaultFormatLine: "P|DIV",
		__defaultFormatBrLine: "PRE",
		__defaultFormatClosureBrLine: "",
		__defaultFormatBlock: "BLOCKQUOTE",
		__defaultFormatClosureBlock: "TH|TD",
		__lineFormatFilter: true,
		__listCommonStyle: ["fontSize", "color", "fontFamily"],
		__pluginRetainFilter: true,

		// ================================================================
		// === Plugin-Specific Options ===
		// ================================================================
		// Plugin options can be added here following their respective types
		// Example: image: { multiple: true, width: '100%' }
		image: {
			controls: [["resize", "mirror??"]],
			uploadUrl: "/api/upload-image",
			uploadSizeLimit: 1,
			insertBehavior: "auto",
		},

		// ================================================================
		// === User Events (Properly Typed) ===
		// ================================================================

		events: {
			// onload: ((params) => {
			// 	console.log("Editor loaded", params.editor);
			// 	// params는 자동으로 { editor: SunEditor.Core } 타입
			// }) as SunEditor.EventHandlers.onload,
			onload: (params) => {
				const { editor } = params;
				console.log("Editor loaded", editor);
				editor.html.get(); // 자동완성 지원!

				// Hook.Event.Active 타입 테스트 - 방법 1: 타입 단언
				// const testActive = ((element, target) => {
				// 	console.log("Active called", element, target);
				// 	return true;
				// }) as SunEditor.Hook.Event.Active;

				// 방법 2: 타입 주석 (더 깔끔함)
				const testActive2: SunEditor.Hook.Event.Active = function (element, target) {
					console.log("Active2 called", element, target);
					return false;
				};

				void testActive2;

				return;
			},
		},
		// events: {
		// 	// Editor lifecycle
		// 	onload: (params) => {
		// 		console.log('Editor loaded', params.editor);
		// 	},
		//
		// 	// Content events - returns Promise<boolean>
		// 	onChange: async (params) => {
		// 		console.log('Content changed', params.editor, params.frameContext, params.data);
		// 		return true;
		// 	},
		//
		// 	// Native events
		// 	onScroll: (params) => {
		// 		console.log('Scroll event', params.event);
		// 	},
		//
		// 	onClick: (params) => {
		// 		console.log('Click event', params.event);
		// 	},
		//
		// 	onKeyDown: (params) => {
		// 		console.log('Key down', params.event);
		// 	},
		//
		// 	onFocus: (params) => {
		// 		console.log('Focus event', params.event);
		// 	},
		//
		// 	onBlur: (params) => {
		// 		console.log('Blur event', params.event);
		// 	},
		//
		// 	// Clipboard events - returns Promise<string | boolean>
		// 	onPaste: async (params) => {
		// 		console.log('Paste event', params.event, params.data, params.maxCharCount);
		// 		return true;
		// 	},
		//
		// 	// Upload events - returns Promise<boolean>
		// 	imageUploadHandler: async (params) => {
		// 		console.log('Image upload handler', params.xmlHttp, params.info, params.editor);
		// 		return true;
		// 	},
		//
		// 	onImageUploadBefore: async (params) => {
		// 		console.log('Before image upload', params.info, params.editor);
		// 		params.handler();
		// 		return true;
		// 	},
		//
		// 	onImageUploadError: async (params) => {
		// 		console.log('Image upload error', params.error, params.editor);
		// 		return 'Error occurred';
		// 	},
		//
		// 	// UI events
		// 	onResizeEditor: (params) => {
		// 		console.log('Editor resized', params.height, params.prevHeight);
		// 	},
		//
		// 	onToggleCodeView: (params) => {
		// 		console.log('Toggle code view', params.is);
		// 	},
		//
		// 	onShowToolbar: (toolbar, mode) => {
		// 		console.log('Show inline toolbar', toolbar, mode);
		// 	}
		// }
	};

	// Editor
	useEffect(() => {
		// 이미 초기화되었거나 textarea ref가 없으면 리턴
		if (isInitializedRef.current || !editorRef.current) return;

		isInitializedRef.current = true;

		const instance = suneditor.create(editorRef.current, {
			...options_test,
			...(options || {}),
			lang: langs.en,
		});

		instanceRef.current = instance;

		// Cleanup: unmount 시 즉시 destroy
		return () => {
			if (instanceRef.current) {
				try {
					instanceRef.current.destroy();
					instanceRef.current = null;
					isInitializedRef.current = false;
				} catch (error) {
					console.warn("Editor destroy error:", error);
					instanceRef.current = null;
					isInitializedRef.current = false;
				}
			}
		};
	}, []);

	useEffect(() => {
		if (instanceRef.current && value !== undefined) {
			const currentContent = instanceRef.current.html.get();
			if (currentContent !== value) {
				console.log("Updating editor content from prop value", instanceRef.current, value);
				// instanceRef.current.html.set(value);
			}
		}
	}, [value]);

	return <textarea ref={editorRef} style={{ visibility: "hidden" }} />;
};

export default SunEditor;
