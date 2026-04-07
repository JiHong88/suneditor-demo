/**
 * @fileoverview 갤러리/브라우저 플러그인 더미 데이터
 *
 * SunEditor Browser 모듈이 기대하는 BrowserFile[] 형식의 샘플 데이터 제공
 * imageGallery, videoGallery, audioGallery, fileGallery, fileBrowser 공통 사용
 */

interface BrowserFile {
	src: string;
	name: string;
	thumbnail?: string;
	alt?: string;
	tag?: string[];
	type?: string;
}

const S3 = "https://suneditor-files.s3.ap-northeast-2.amazonaws.com/sample/media";
const PICSUM = "https://picsum.photos/seed";

const imageItems: BrowserFile[] = Array.from({ length: 12 }, (_, i) => ({
	src: `${PICSUM}/img${i + 1}/800/600`,
	name: `Image ${i + 1}.jpg`,
	thumbnail: `${PICSUM}/img${i + 1}/200/150`,
	alt: `Sample image ${i + 1}`,
	tag: [i % 2 === 0 ? "photo" : "illustration", i < 6 ? "recent" : "archive"],
}));

const videoItems: BrowserFile[] = [
	{
		src: `${S3}/sample_video_1.mp4`,
		name: "Sample Video 1.mp4",
		thumbnail: `${PICSUM}/vid1/200/150`,
		tag: ["sample"],
	},
	{
		src: `${S3}/sample_video_2.mp4`,
		name: "Sample Video 2.mp4",
		thumbnail: `${PICSUM}/vid2/200/150`,
		tag: ["sample"],
	},
	{
		src: `${S3}/sample_video_3.mp4`,
		name: "Sample Video 3.mp4",
		thumbnail: `${PICSUM}/vid3/200/150`,
		tag: ["sample"],
	},
];

const audioItems: BrowserFile[] = [
	{
		src: `${S3}/sample_audio_1.mp3`,
		name: "Sample Audio 1.mp3",
		tag: ["sample"],
	},
];

const fileItems: BrowserFile[] = [
	{ src: `${S3}/sample_file_1.docx`, name: "Sample File 1.docx", tag: ["docx"] },
	{ src: `${S3}/sample_file_2.docx`, name: "Sample File 2.docx", tag: ["docx"] },
	{ src: `${S3}/sample_file_3.docx`, name: "Sample File 3.docx", tag: ["docx"] },
	{ src: `${S3}/sample_file_3.pdf`, name: "Sample File 3.pdf", tag: ["pdf"] },
];

/**
 * fileBrowser는 폴더 구조 — SunEditor Browser 모듈이 기대하는 형식:
 * 각 폴더는 { name, _data: BrowserFile[], default? } + 하위 폴더 중첩
 */
const fileBrowserItems: Record<string, unknown> = {
	root: {
		name: "All Files",
		default: true,
		_data: [
			{ src: `${S3}/sample_file_1.docx`, name: "sample_file_1.docx", tag: ["docx", "document"] },
			{ src: `${S3}/sample_file_2.docx`, name: "sample_file_2.docx", tag: ["docx", "document"] },
			{ src: `${S3}/sample_file_3.docx`, name: "sample_file_3.docx", tag: ["docx", "document"] },
			{ src: `${S3}/sample_file_3.pdf`, name: "sample_file_3.pdf", tag: ["pdf", "document"] },
		],
		images: {
			name: "Images",
			_data: Array.from({ length: 8 }, (_, i) => ({
				src: `${PICSUM}/browse${i + 1}/800/600`,
				name: `photo_${i + 1}.jpg`,
				thumbnail: `${PICSUM}/browse${i + 1}/200/150`,
				tag: [i < 4 ? "landscape" : "portrait", "image"],
			})),
		},
		videos: {
			name: "Videos",
			_data: [
				{ src: `${S3}/sample_video_1.mp4`, name: "sample_video_1.mp4", thumbnail: `${PICSUM}/bv1/200/150`, tag: ["mp4", "video"] },
				{ src: `${S3}/sample_video_2.mp4`, name: "sample_video_2.mp4", thumbnail: `${PICSUM}/bv2/200/150`, tag: ["mp4", "video"] },
				{ src: `${S3}/sample_video_3.mp4`, name: "sample_video_3.mp4", thumbnail: `${PICSUM}/bv3/200/150`, tag: ["mp4", "video"] },
			],
		},
		audio: {
			name: "Audio",
			_data: [
				{ src: `${S3}/sample_audio_1.mp3`, name: "sample_audio_1.mp3", tag: ["mp3", "audio"] },
			],
		},
		documents: {
			name: "Documents",
			_data: [
				{ src: `${S3}/sample_file_1.docx`, name: "sample_file_1.docx", tag: ["docx", "document"] },
				{ src: `${S3}/sample_file_3.pdf`, name: "sample_file_3.pdf", tag: ["pdf", "document"] },
			],
		},
	},
};

export type GalleryType = "image" | "video" | "audio" | "file" | "browse";

const GALLERY_MAP: Record<GalleryType, BrowserFile[] | Record<string, unknown>> = {
	image: imageItems,
	video: videoItems,
	audio: audioItems,
	file: fileItems,
	browse: fileBrowserItems,
};

/** 갤러리 타입별 데이터 반환 */
export function getGalleryData(type: GalleryType): BrowserFile[] | Record<string, unknown> {
	return GALLERY_MAP[type] ?? [];
}
