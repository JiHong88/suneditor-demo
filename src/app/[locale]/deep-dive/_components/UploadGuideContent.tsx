"use client";

import { useTranslations } from "next-intl";
import CodeBlock from "@/components/common/CodeBlock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

/* ── Code constants ───────────────────────────────────── */

const UPLOAD_BASIC = `const editor = suneditor.create(textarea, {
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

const SERVER_RESPONSE = `// Success response — SunEditor expects this format:
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

const SERVER_EXPRESS = `// Express.js example
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

const CUSTOM_HANDLER = `// Full custom upload handling (skip built-in XHR)
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

const UPLOAD_BEFORE = `// Validate & modify before upload
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

const UPLOAD_ERROR = `// Custom error handling
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

const LIFECYCLE_TRACKING = `// Track all media across the editor
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

const MEDIA_TYPES = [
	{ type: "image", option: "image.uploadUrl", events: 6, handler: "imageUploadHandler" },
	{ type: "video", option: "video.uploadUrl", events: 6, handler: "videoUploadHandler" },
	{ type: "audio", option: "audio.uploadUrl", events: 6, handler: "audioUploadHandler" },
	{ type: "file", option: "fileUpload.uploadUrl", events: 5, handler: "-" },
	{ type: "embed", option: "-", events: 2, handler: "-" },
];

/* ── Component ────────────────────────────────────────── */

export default function UploadGuideContent() {
	const t = useTranslations("DeepDive.upload");

	return (
		<div className='space-y-6'>
			<Accordion type='multiple' defaultValue={["overview", "options"]} className='space-y-1'>
				{/* 1. Overview */}
				<AccordionItem value='overview'>
					<AccordionTrigger className='text-base font-semibold'>{t("overview")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("overviewDesc")}</p>
						<div className='overflow-x-auto'>
							<table className='w-full text-xs border-collapse'>
								<thead>
									<tr>
										<th className='border border-border bg-muted/50 px-3 py-2 text-start font-semibold'>{t("mediaType")}</th>
										<th className='border border-border bg-muted/50 px-3 py-2 text-start font-semibold'>{t("optionKey")}</th>
										<th className='border border-border bg-muted/50 px-3 py-2 text-start font-semibold'>{t("events")}</th>
										<th className='border border-border bg-muted/50 px-3 py-2 text-start font-semibold'>{t("customHandler")}</th>
									</tr>
								</thead>
								<tbody>
									{MEDIA_TYPES.map((m) => (
										<tr key={m.type}>
											<td className='border border-border px-3 py-2'>
												<Badge variant='outline' className='text-[10px]'>{m.type}</Badge>
											</td>
											<td className='border border-border px-3 py-2'>
												<code className='text-[11px] font-mono'>{m.option}</code>
											</td>
											<td className='border border-border px-3 py-2 text-center'>{m.events}</td>
											<td className='border border-border px-3 py-2'>
												<code className='text-[11px] font-mono'>{m.handler}</code>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 2. Upload Options */}
				<AccordionItem value='options'>
					<AccordionTrigger className='text-base font-semibold'>{t("options")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("optionsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={UPLOAD_BASIC} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 3. Server Response */}
				<AccordionItem value='server'>
					<AccordionTrigger className='text-base font-semibold'>{t("serverResponse")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("serverResponseDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={SERVER_RESPONSE} lang='json' />
						</div>
						<h4 className='text-sm font-semibold'>{t("serverExample")}</h4>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={SERVER_EXPRESS} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 4. Custom Upload Handler */}
				<AccordionItem value='custom-handler'>
					<AccordionTrigger className='text-base font-semibold'>{t("customUploadHandler")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("customHandlerDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={CUSTOM_HANDLER} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 5. Upload Before (validation) */}
				<AccordionItem value='validation'>
					<AccordionTrigger className='text-base font-semibold'>{t("validation")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("validationDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={UPLOAD_BEFORE} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 6. Error Handling */}
				<AccordionItem value='errors'>
					<AccordionTrigger className='text-base font-semibold'>{t("errors")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("errorsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={UPLOAD_ERROR} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 7. Lifecycle Tracking */}
				<AccordionItem value='lifecycle'>
					<AccordionTrigger className='text-base font-semibold'>{t("lifecycle")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("lifecycleDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={LIFECYCLE_TRACKING} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
