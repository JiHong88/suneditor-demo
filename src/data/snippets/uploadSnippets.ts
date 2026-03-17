/**
 * @fileoverview 업로드 가이드 페이지의 코드 스니펫 및 미디어 타입 참조 데이터
 *
 * 사용처:
 * - deep-dive 페이지 > UploadGuideContent.tsx 컴포넌트
 *
 * 구성:
 *   UPLOAD_BASIC       → "업로드 옵션" 아코디언 > 4개 미디어 타입별 업로드 설정 코드
 *   SERVER_RESPONSE    → "서버 응답" 아코디언 > SunEditor가 기대하는 JSON 응답 포맷
 *   SERVER_EXPRESS     → "서버 응답" 아코디언 > Express.js 서버 예제 코드
 *   CUSTOM_HANDLER     → "커스텀 업로드 핸들러" 아코디언 > 내장 XHR 우회 직접 처리 코드
 *   UPLOAD_BEFORE      → "업로드 전 검증" 아코디언 > 파일 크기 검증/리사이즈 코드
 *   UPLOAD_ERROR       → "에러 처리" 아코디언 > 업로드 실패 시 커스텀 에러 메시지
 *   LIFECYCLE_TRACKING → "라이프사이클 추적" 아코디언 > 미디어 생성/수정/삭제 추적 코드
 *   MEDIA_TYPES        → "개요" 아코디언 > 미디어 타입별 옵션키/이벤트수/핸들러 테이블 데이터
 */

/* ── 업로드 옵션: image/video/audio/fileUpload 설정 코드 ── */
export const UPLOAD_BASIC = `const editor = suneditor.create(textarea, {
  buttonList: [['image', 'video', 'audio', 'fileUpload']],
  image: {
    uploadUrl: '/api/upload/image',
    uploadHeaders: { Authorization: 'Bearer xxx' },
    uploadSizeLimit: 10 * 1024 * 1024,  // 10MB
    allowMultiple: true,
    acceptedFormats: 'jpg,jpeg,png,gif,webp',
  },
  video: {
    uploadUrl: '/api/upload/video',
    uploadSizeLimit: 100 * 1024 * 1024, // 100MB
    acceptedFormats: 'mp4,webm',
  },
  audio: {
    uploadUrl: '/api/upload/audio',
    uploadSizeLimit: 20 * 1024 * 1024,  // 20MB
    acceptedFormats: 'mp3,wav,ogg',
  },
  fileUpload: {
    uploadUrl: '/api/upload/file',
    uploadSizeLimit: 50 * 1024 * 1024,  // 50MB
    allowMultiple: true,
  },
  // Events go under the events namespace
  events: {
    onImageUploadBefore: ({ handler, info, files }) => {
      console.log('Files to upload:', files);
      return true;
    },
  },
});`;

/* ── 서버 응답: SunEditor가 기대하는 JSON 포맷 ────── */
export const SERVER_RESPONSE = `// Success response — SunEditor expects this format:
{
  "result": [
    {
      "url": "https://cdn.example.com/uploads/photo.jpg",
      "name": "photo.jpg",
      "size": 204800
    }
  ]
}

// Error response:
{
  "errorMessage": "File too large"
}`;

/* ── 서버 예제: Express.js + multer 업로드 처리 ───── */
export const SERVER_EXPRESS = `// Express.js example
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload/image', upload.array('file-0'), (req, res) => {
  const results = req.files.map(file => ({
    url: \`\${process.env.CDN_URL}/\${file.filename}\`,
    name: file.originalname,
    size: file.size,
  }));
  res.json({ result: results });
});`;

/* ── 커스텀 핸들러: 내장 XHR 우회, fetch로 직접 업로드 ── */
export const CUSTOM_HANDLER = `// Full custom upload handling (skip built-in XHR)
editor.events.imageUploadHandler = async ({ $, xmlHttp, info }) => {
  const formData = new FormData();
  for (const file of info.files) {
    formData.append('images', file);
  }

  const res = await fetch('/api/upload/image', {
    method: 'POST',
    headers: { Authorization: 'Bearer xxx' },
    body: formData,
  });
  const data = await res.json();

  // Insert images into editor
  const result = {
    result: data.urls.map(url => ({ url, name: '', size: 0 }))
  };
  $.image.register(result);

  return true; // Tell SunEditor we handled it
};`;

/* ── 업로드 전 검증: 파일 크기 체크, 리사이즈 후 계속 ── */
export const UPLOAD_BEFORE = `// Validate & modify before upload
editor.events.onImageUploadBefore = async ({ $, info, handler }) => {
  const file = info.files[0];

  // Size check
  if (file.size > 5 * 1024 * 1024) {
    alert('Max 5MB!');
    return false; // Cancel upload
  }

  // Resize before upload (example)
  const resized = await resizeImage(file, 1920);
  handler({ ...info, files: [resized] });
};

// Same pattern for video, audio, file:
editor.events.onVideoUploadBefore = async ({ info }) => { /* ... */ };
editor.events.onAudioUploadBefore = async ({ info }) => { /* ... */ };
editor.events.onFileUploadBefore = async ({ info }) => { /* ... */ };`;

/* ── 에러 처리: 업로드 실패 시 커스텀 에러 메시지 반환 ── */
export const UPLOAD_ERROR = `// Custom error handling
editor.events.onImageUploadError = async ({ error, limitSize, file }) => {
  if (limitSize) {
    return \`File is too large. Max: \${(limitSize / 1024 / 1024).toFixed(0)}MB\`;
  }
  console.error('Upload failed:', error);
  return 'Upload failed. Please try again.';
};

// Same for video, audio, file:
editor.events.onVideoUploadError = async ({ error }) => { /* ... */ };
editor.events.onAudioUploadError = async ({ error }) => { /* ... */ };
editor.events.onFileUploadError = async ({ error }) => { /* ... */ };`;

/* ── 라이프사이클: 미디어 생성/수정/삭제 추적 + 서버 정리 ── */
export const LIFECYCLE_TRACKING = `// Track all media across the editor
editor.events.onFileManagerAction = ({ info, element, state, pluginName }) => {
  switch (state) {
    case 'create':
      console.log(\`[\${pluginName}] Added: \${info.src}\`);
      break;
    case 'update':
      console.log(\`[\${pluginName}] Updated: \${info.src}\`);
      break;
    case 'delete':
      console.log(\`[\${pluginName}] Deleted: \${info.src}\`);
      // Notify server to clean up
      fetch('/api/upload/delete', {
        method: 'DELETE',
        body: JSON.stringify({ url: info.src }),
      });
      break;
  }
};

// Or track per media type:
editor.events.onImageAction = ({ info, state }) => { /* image only */ };
editor.events.onVideoAction = ({ info, state }) => { /* video only */ };

// Prevent deletion with confirmation
editor.events.onImageDeleteBefore = async ({ url }) => {
  return confirm(\`Delete this image? \${url}\`);
};`;

/* ── 이미지 리사이즈: Canvas API로 업로드 전 클라이언트 리사이즈 ── */
export const IMAGE_RESIZE_BEFORE_UPLOAD = `// Resize large images on the client before uploading.
// Reduces bandwidth and server load — especially for phone cameras (10MB+).

const MAX_WIDTH = 1920;
const JPEG_QUALITY = 0.9;
const SKIP_TYPES = new Set(['image/svg+xml', 'image/gif']);

function resizeImage(file) {
  return new Promise((resolve) => {
    if (SKIP_TYPES.has(file.type)) return resolve(file);

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.naturalWidth <= MAX_WIDTH) return resolve(file);

      const ratio = MAX_WIDTH / img.naturalWidth;
      const canvas = document.createElement('canvas');
      canvas.width = MAX_WIDTH;
      canvas.height = Math.round(img.naturalHeight * ratio);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

      const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(
        (blob) => resolve(new File([blob], file.name, { type })),
        type,
        type === 'image/jpeg' ? JPEG_QUALITY : undefined,
      );
    };
    img.src = url;
  });
}

// Hook into SunEditor
const editor = suneditor.create(textarea, {
  image: { uploadUrl: '/api/upload/image' },
  events: {
    onImageUploadBefore: async ({ info, handler }) => {
      const dt = new DataTransfer();
      for (const file of info.files) {
        dt.items.add(await resizeImage(file));
      }
      handler({ ...info, files: dt.files });
    },
  },
});`;

/* ── 파일 관리 UI: onFileManagerAction으로 업로드 파일 목록 관리 ── */
export const FILE_MANAGEMENT_UI = `// Build a file management UI that tracks all uploaded media.
// onFileManagerAction fires for every create / update / delete across all plugins.

import { useState, useCallback } from 'react';

function useFileList() {
  const [files, setFiles] = useState([]);

  const handleFileManagerAction = useCallback(({ info, state, pluginName }) => {
    const entry = {
      src: info.src,
      name: info.name,
      size: info.size,
      pluginName,
      delete: info.delete,  // Call to remove from editor
      select: info.select,  // Call to scroll & select in editor
    };

    setFiles((prev) => {
      if (state === 'create') {
        // Avoid duplicates by src
        if (prev.some((f) => f.src === entry.src)) {
          return prev.map((f) => (f.src === entry.src ? entry : f));
        }
        return [...prev, entry];
      }
      if (state === 'update') {
        return prev.map((f) => (f.src === entry.src ? entry : f));
      }
      if (state === 'delete') {
        return prev.filter((f) => f.src !== entry.src);
      }
      return prev;
    });
  }, []);

  return { files, handleFileManagerAction };
}

// Usage with SunEditor
const { files, handleFileManagerAction } = useFileList();

const editor = suneditor.create(textarea, {
  image: { uploadUrl: '/api/upload/image' },
  events: {
    onFileManagerAction: handleFileManagerAction,
  },
});

// Render the file list
files.map((file) => (
  <div key={file.src}>
    <span>{file.name} ({file.pluginName})</span>
    <button onClick={() => file.select()}>Select</button>
    <button onClick={() => file.delete()}>Delete</button>
  </div>
));`;

/* ── 개요 테이블: 미디어 타입별 옵션키/이벤트수/핸들러 참조 ── */
export const MEDIA_TYPES = [
	{ type: "image", option: "image.uploadUrl", events: 6, handler: "imageUploadHandler" },
	{ type: "video", option: "video.uploadUrl", events: 6, handler: "videoUploadHandler" },
	{ type: "audio", option: "audio.uploadUrl", events: 6, handler: "audioUploadHandler" },
	{ type: "file", option: "fileUpload.uploadUrl", events: 5, handler: "-" },
	{ type: "embed", option: "-", events: 2, handler: "-" },
];
