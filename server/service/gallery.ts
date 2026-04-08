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
	images: {
		name: "Images",
		default: true,
		_data: [
			{ src: `${PICSUM}/all1/800/600`, name: "featured_1.jpg", thumbnail: `${PICSUM}/all1/200/150`, tag: ["featured", "image"] },
			{ src: `${PICSUM}/all2/800/600`, name: "featured_2.jpg", thumbnail: `${PICSUM}/all2/200/150`, tag: ["featured", "image"] },
		],
		landscape: {
			name: "Landscape",
			_data: Array.from({ length: 6 }, (_, i) => ({
				src: `${PICSUM}/land${i + 1}/800/500`,
				name: `landscape_${i + 1}.jpg`,
				thumbnail: `${PICSUM}/land${i + 1}/200/125`,
				tag: ["landscape", "nature"],
			})),
		},
		portrait: {
			name: "Portrait",
			_data: Array.from({ length: 4 }, (_, i) => ({
				src: `${PICSUM}/port${i + 1}/500/800`,
				name: `portrait_${i + 1}.jpg`,
				thumbnail: `${PICSUM}/port${i + 1}/125/200`,
				tag: ["portrait", "people"],
			})),
		},
		icons: {
			name: "Icons & Logos",
			_data: Array.from({ length: 4 }, (_, i) => ({
				src: `${PICSUM}/icon${i + 1}/400/400`,
				name: `icon_${i + 1}.png`,
				thumbnail: `${PICSUM}/icon${i + 1}/150/150`,
				tag: ["icon", "square"],
			})),
		},
	},
	videos: {
		name: "Videos",
		// 폴더 자체에 _data 없음 — 하위 폴더만
		clips: {
			name: "Clips",
			_data: [
				{ src: `${S3}/sample_video_1.mp4`, name: "sample_video_1.mp4", thumbnail: `${PICSUM}/bv1/200/150`, tag: ["mp4", "clip"] },
				{ src: `${S3}/sample_video_2.mp4`, name: "sample_video_2.mp4", thumbnail: `${PICSUM}/bv2/200/150`, tag: ["mp4", "clip"] },
			],
		},
		tutorials: {
			name: "Tutorials",
			_data: [
				{ src: `${S3}/sample_video_3.mp4`, name: "sample_video_3.mp4", thumbnail: `${PICSUM}/bv3/200/150`, tag: ["mp4", "tutorial"] },
			],
		},
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
			{ src: `${S3}/sample_file_3.pdf`, name: "sample_file_3.pdf", tag: ["pdf", "document"] },
		],
		word: {
			name: "Word",
			_data: [
				{ src: `${S3}/sample_file_1.docx`, name: "sample_file_1.docx", tag: ["docx", "word"] },
				{ src: `${S3}/sample_file_2.docx`, name: "sample_file_2.docx", tag: ["docx", "word"] },
				{ src: `${S3}/sample_file_3.docx`, name: "sample_file_3.docx", tag: ["docx", "word"] },
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
