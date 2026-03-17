"use client";

import React, { useEffect, useRef } from "react";
import suneditor, { plugins, interfaces } from "suneditor";
import type { SunEditor } from "suneditor/types";
import "suneditor/css/editor";
import "suneditor/css/contents";
import { FullButtonList } from "./buttonList";
import { resizeImageFiles } from "@/lib/resizeImage";

class A extends interfaces.PluginModal implements interfaces.ModuleModal, interfaces.PluginDropdown, interfaces.EditorComponent {
	constructor(kernel: SunEditor.Kernel) {
		super(kernel);
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
		void target;
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
	value?: SunEditor.InitOptions["value"];
	theme?: string;
	options?: SunEditor.InitOptions;
	onInstance?: (instance: SunEditor.Instance) => void;
	toolbarContainerRef?: React.RefObject<HTMLDivElement | null>;
	statusbarContainerRef?: React.RefObject<HTMLDivElement | null>;
}

const Editor: React.FC<SunEditorProps> = ({ value, theme, options = {}, onInstance, toolbarContainerRef, statusbarContainerRef }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const instanceRef = useRef<SunEditor.Instance | null>(null);
	const mountedRef = useRef(true);

	// Editor — textarea를 imperative하게 생성해서 React DOM reconciliation 충돌 방지
	useEffect(() => {
		mountedRef.current = true;

		if (instanceRef.current || !containerRef.current) return;

		const textarea = document.createElement("textarea");
		containerRef.current.appendChild(textarea);

		// Merge custom plugins with built-in plugins instead of replacing
		const mergedPlugins = options.plugins
			? { ...(plugins as Record<string, unknown>), ...(options.plugins as Record<string, unknown>) }
			: plugins;
		const { plugins: _omit, events: userEvents, ...restOptions } = options;

		// 사용자 이벤트에 이미지 리사이즈 핸들러를 주입
		const mergedEvents = {
			...(userEvents as Record<string, unknown>),
			onImageUploadBefore: async ({ info, handler }: { info: { files: FileList }; handler: (newInfo?: unknown) => void }) => {
				const resizedFiles = await resizeImageFiles(info.files);
				handler({ ...info, files: resizedFiles });
			},
		} as SunEditor.InitOptions["events"];

		const instance = suneditor.create(textarea, {
			plugins: mergedPlugins,
			value: value || options.value || "",
			theme,
			buttonList: FullButtonList,
			...(toolbarContainerRef?.current && { toolbar_container: toolbarContainerRef.current }),
			...(statusbarContainerRef?.current && { statusbar_container: statusbarContainerRef.current }),
			...restOptions,
			events: mergedEvents,
		});

		instanceRef.current = instance;
		onInstance?.(instance);

		return () => {
			mountedRef.current = false;
			const currentInstance = instanceRef.current;

			requestAnimationFrame(() => {
				if (!mountedRef.current && currentInstance) {
					currentInstance.destroy();
					instanceRef.current = null;
				}
			});
		};
	}, []);

	// Theme
	useEffect(() => {
		if (instanceRef.current && theme) {
			instanceRef.current.$.ui.setTheme(theme);
		}
	}, [theme]);

	return <div ref={containerRef} />;
};

export default Editor;
