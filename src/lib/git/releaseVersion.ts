import { getSunEditorVersion } from "./version";

const g = globalThis as unknown as { __releaseVersionPromise?: Promise<string> };

async function init() {
	return getSunEditorVersion();
}

g.__releaseVersionPromise ??= init();

export const sunVersionPromise = g.__releaseVersionPromise;

export async function getBootVersion() {
	return await sunVersionPromise;
}
