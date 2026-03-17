/**
 * 클라이언트 사이드 이미지 리사이징 유틸리티
 * 서버 업로드 전에 대용량 이미지를 줄여 대역폭과 서버 부하를 절감한다.
 */

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const INITIAL_QUALITY = 0.85;
const MIN_QUALITY = 0.5;
const QUALITY_STEP = 0.1;
const SKIP_TYPES = new Set(["image/svg+xml", "image/gif"]);

function loadImage(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve(img);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Failed to load image"));
		};
		img.src = url;
	});
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
			type,
			quality,
		);
	});
}

async function resizeFile(file: File): Promise<File> {
	if (SKIP_TYPES.has(file.type)) return file;
	if (file.size <= MAX_FILE_SIZE) return file;

	const img = await loadImage(file);

	const canvas = document.createElement("canvas");
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;

	const ctx = canvas.getContext("2d");
	if (!ctx) return file;

	ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

	const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";

	// PNG는 quality 옵션이 없으므로 한 번만 변환
	if (outputType === "image/png") {
		const blob = await canvasToBlob(canvas, outputType);
		return new File([blob], file.name, { type: outputType, lastModified: file.lastModified });
	}

	// JPEG: quality를 점진적으로 낮춰서 목표 크기 이하로 맞춤
	let quality = INITIAL_QUALITY;
	let blob = await canvasToBlob(canvas, outputType, quality);

	while (blob.size > MAX_FILE_SIZE && quality > MIN_QUALITY) {
		quality -= QUALITY_STEP;
		blob = await canvasToBlob(canvas, outputType, quality);
	}

	return new File([blob], file.name, { type: outputType, lastModified: file.lastModified });
}

/**
 * FileList의 모든 이미지를 리사이즈하여 새 FileList를 반환한다.
 */
export async function resizeImageFiles(files: FileList): Promise<FileList> {
	const dt = new DataTransfer();

	for (let i = 0; i < files.length; i++) {
		const resized = await resizeFile(files[i]);
		dt.items.add(resized);
	}

	return dt.files;
}
