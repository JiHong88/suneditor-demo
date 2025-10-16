"use client";

import React, { useEffect, useRef } from "react";
import suneditor, { plugins, SunEditorOptions } from "suneditor";

interface SunEditorProps {
	value?: string;
	options?: SunEditorOptions;
	onChange?: (content: string) => void;
}

const SunEditor: React.FC<SunEditorProps> = ({ value, options, onChange }) => {
	const editorRef = useRef<HTMLTextAreaElement>(null);
	const instanceRef = useRef<any>(null);
	const isInitializedRef = useRef(false);

	// Editor 생성 (mount 시 한 번만)
	useEffect(() => {
		// 이미 초기화되었거나 textarea ref가 없으면 리턴
		if (isInitializedRef.current || !editorRef.current) return;

		isInitializedRef.current = true;

		const instance = suneditor.create(editorRef.current, {
			plugins,
			value: value || "",
			...(options || {}),
		});

		// onChange 이벤트 설정
		if (onChange) {
			instance.events.onChange = (content: string) => {
				onChange(content);
			};
		}

		instanceRef.current = instance;

		// Cleanup: 실제 unmount 시에만 destroy
		return () => {
			// StrictMode의 재mount를 구분하기 위해 약간의 지연
			setTimeout(() => {
				if (instanceRef.current && !document.contains(editorRef.current)) {
					try {
						instanceRef.current.destroy();
					} catch (error) {
						// destroy 중 발생하는 에러 무시 (cross-origin, 이미 destroy된 경우 등)
						console.warn("Editor destroy error:", error);
					} finally {
						instanceRef.current = null;
						isInitializedRef.current = false;
					}
				}
			}, 0);
		};
	}, []); // 빈 dependency array: mount/unmount 시에만 실행

	// value prop 변경 시 내용 업데이트 (destroy 없이)
	useEffect(() => {
		if (instanceRef.current && value !== undefined) {
			const currentContent = instanceRef.current.html.get();
			if (currentContent !== value) {
				instanceRef.current.html.set(value);
			}
		}
	}, [value]);

	// onChange prop 변경 시 핸들러 업데이트
	useEffect(() => {
		if (instanceRef.current && onChange) {
			instanceRef.current.events.onChange = (content: string) => {
				onChange(content);
			};
		}
	}, [onChange]);

	return <textarea ref={editorRef} style={{ visibility: "hidden" }} />;
};

export default SunEditor;
