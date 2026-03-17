"use client";

import { useTranslations } from "next-intl";
import CodeBlock from "@/components/common/CodeBlock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import FileListPanel, { type FileEntry } from "@/components/editor/FileListPanel";
import {
	UPLOAD_BASIC,
	SERVER_RESPONSE,
	SERVER_EXPRESS,
	CUSTOM_HANDLER,
	UPLOAD_BEFORE,
	UPLOAD_ERROR,
	LIFECYCLE_TRACKING,
	MEDIA_TYPES,
	IMAGE_RESIZE_BEFORE_UPLOAD,
	FILE_MANAGEMENT_UI,
} from "@/data/snippets/uploadSnippets";

const MOCK_FILES: FileEntry[] = [
	{ src: "/exampleFiles/tiger1.jpg", index: 0, name: "tiger.jpg", size: 704800, pluginName: "image", delete: () => {}, select: () => {} },
	{
		src: "/exampleFiles/spaceBadger.png",
		index: 1,
		name: "spaceBadge.jpg",
		size: 3948576,
		pluginName: "image",
		delete: () => {},
		select: () => {},
	},
	{ src: "/exampleFiles/logo1.svg", index: 2, name: "icon.svg", size: 6020, pluginName: "image", delete: () => {}, select: () => {} },
	{
		src: "/exampleFiles/intro_clip.mp4",
		index: 0,
		name: "intro.mp4",
		size: 5242880,
		pluginName: "video",
		delete: () => {},
		select: () => {},
	},
	{
		src: "/exampleFiles/bgm_loop.mp3",
		index: 0,
		name: "bgm.mp3",
		size: 3145728,
		pluginName: "audio",
		delete: () => {},
		select: () => {},
	},
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
										<th className='border border-border bg-muted/50 px-3 py-2 text-start font-semibold'>
											{t("mediaType")}
										</th>
										<th className='border border-border bg-muted/50 px-3 py-2 text-start font-semibold'>
											{t("optionKey")}
										</th>
										<th className='border border-border bg-muted/50 px-3 py-2 text-start font-semibold'>
											{t("events")}
										</th>
										<th className='border border-border bg-muted/50 px-3 py-2 text-start font-semibold'>
											{t("customHandler")}
										</th>
									</tr>
								</thead>
								<tbody>
									{MEDIA_TYPES.map((m) => (
										<tr key={m.type}>
											<td className='border border-border px-3 py-2'>
												<Badge variant='outline' className='text-[10px]'>
													{m.type}
												</Badge>
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

				{/* 8. Image Resize Before Upload */}
				<AccordionItem value='image-resize'>
					<AccordionTrigger className='text-base font-semibold'>{t("imageResize")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("imageResizeDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={IMAGE_RESIZE_BEFORE_UPLOAD} lang='javascript' />
						</div>
						<div className='rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 px-4 py-3'>
							<p className='text-xs text-muted-foreground'>{t("imageResizeNote")}</p>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 9. File Management UI */}
				<AccordionItem value='file-management'>
					<AccordionTrigger className='text-base font-semibold'>{t("fileManagementUI")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("fileManagementUIDesc")}</p>

						{/* Live preview */}
						<div className='space-y-2'>
							<h4 className='text-sm font-semibold'>{t("fileManagementUIPreview")}</h4>
							<FileListPanel files={MOCK_FILES} />
						</div>

						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={FILE_MANAGEMENT_UI} lang='javascript' />
						</div>
						<div className='rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 px-4 py-3'>
							<p className='text-xs text-muted-foreground'>{t("fileManagementUINote")}</p>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
