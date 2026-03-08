"use client";

import React, { useEffect, useRef } from "react";
import suneditor, { plugins, interfaces } from "suneditor";
import type { SunEditor } from "suneditor/types";
import "suneditor/css";
import "suneditor/css/contents";
import { FullButtonList } from "./buttonList";

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
}

const Editor: React.FC<SunEditorProps> = ({ value, theme, options = {}, onInstance }) => {
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
		const { plugins: _omit, ...restOptions } = options;

		const instance = suneditor.create(textarea, {
			plugins: mergedPlugins,
			value: value || options.value || "",
			theme,
			buttonList: FullButtonList,
			...restOptions,
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
