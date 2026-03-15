/**
 * @fileoverview JSON 문서 저장/조회 (기존 files.js의 create/readFiles 기능)
 *
 * 미디어 업로드와는 별도 — 구조화된 JSON 데이터의 CRUD
 */

import { promises as fs, readdirSync, readFileSync } from "fs";
import path from "path";
import type { ServiceResponse } from "../types";

const STORAGE_PATH = "public";

/** JSON 파일 생성/추가 */
export async function create(folder: string, fileName: string, content: string): Promise<ServiceResponse> {
	try {
		const dir = path.join(STORAGE_PATH, folder);
		await fs.mkdir(dir, { recursive: true });
		await fs.writeFile(path.join(dir, `${fileName}.json`), content);
		console.log(`Saved: ${folder}/${fileName}`);
		return { status: 200 };
	} catch (err) {
		return {
			status: 500,
			message: (err as Error).message,
		};
	}
}

/** 폴더 내 모든 JSON 파일 읽기 */
export function readFiles(folder: string): ServiceResponse<unknown[]> {
	const data: unknown[] = [];
	const dir = path.join(STORAGE_PATH, folder);

	try {
		const files = readdirSync(dir);
		for (const filename of files) {
			const content = readFileSync(path.join(dir, filename), "utf-8");
			data.push(JSON.parse(content));
		}
		return { status: 200, data };
	} catch (err) {
		console.log("read files fail", err);
		return { status: 500, data: [] };
	}
}
