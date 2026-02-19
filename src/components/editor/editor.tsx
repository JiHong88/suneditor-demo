"use client";

import React, { useEffect, useRef } from "react";
import suneditor, { plugins, interfaces } from "suneditor";
import type { SunEditor } from "suneditor/types";
import "suneditor/css";
import "suneditor/css/contents";
import "suneditor/src/themes/dark.css";
import "suneditor/src/themes/blue.css";
import { FullButtonList } from "../editor/buttonList";

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
	value?: SunEditor.InitOptions["value"];
	theme?: "dark" | "default";
	options?: SunEditor.InitOptions;
}

const Editor: React.FC<SunEditorProps> = ({ value, theme, options = {} }) => {
	const editorRef = useRef<HTMLTextAreaElement>(null);
	const instanceRef = useRef<SunEditor.Instance | null>(null);
	const mountedRef = useRef(true);

	// Editor
	useEffect(() => {
		mountedRef.current = true;

		if (instanceRef.current) return;

		const instance = suneditor.create(editorRef.current!, {
			plugins,
			value: value || options.value || "",
			theme,
			buttonList: FullButtonList,
			...options,
		});

		instanceRef.current = instance;

		return () => {
			mountedRef.current = false;
			const currentInstance = instanceRef.current;

			requestAnimationFrame(() => {
				if (!mountedRef.current && currentInstance) {
					console.log("destroy");
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

	return (
		<div>
			<textarea ref={editorRef} style={{ visibility: "hidden" }} />
		</div>
	);
};

export default Editor;
