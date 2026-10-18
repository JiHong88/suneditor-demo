import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

// Bump when the summary below changes.
const UPDATED = "2026-10-17";
const LICENSE_URL = "https://github.com/JiHong88/SunEditor/blob/master/LICENSE";

const ALLOWED_KEYS = ["commercial", "internal", "selfHost", "modify", "distribute", "noFee"] as const;

// Optional integrations wired through the `externalLibs` option.
const THIRD_PARTY = [
	{ name: "KaTeX", use: "math", license: "MIT" },
	{ name: "MathJax", use: "math", license: "Apache-2.0" },
	{ name: "CodeMirror", use: "code view", license: "MIT" },
];

// Verbatim copy of the LICENSE file shipped in the suneditor package.
const LICENSE_TEXT = `MIT License

Copyright (c) 2017-2025 Yi JiHong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

export default function LicensePage() {
	const t = useTranslations("License");

	return (
		<div className='min-h-screen'>
			<section className='container mx-auto px-6 py-12'>
				<div className='mx-auto max-w-3xl text-center'>
					<h1 className='text-4xl font-bold tracking-tight md:text-5xl'>{t("title")}</h1>
					<p className='mt-4 text-lg text-muted-foreground'>{t("subtitle")}</p>
					<p className='mt-3 text-xs text-muted-foreground'>{t("updated", { date: UPDATED })}</p>
				</div>
			</section>

			<div className='container mx-auto max-w-3xl space-y-12 px-6 pb-20'>
				<section>
					<h2 className='text-xl font-semibold'>{t("allowedTitle")}</h2>
					<ul className='mt-4 grid gap-3 sm:grid-cols-2'>
						{ALLOWED_KEYS.map((key) => (
							<li key={key} className='flex items-start gap-2 rounded-lg border bg-card px-4 py-3 text-sm'>
								<Check className='mt-0.5 size-4 shrink-0 text-emerald-500' />
								{t(`allowed.${key}`)}
							</li>
						))}
					</ul>
				</section>

				<section>
					<h2 className='text-xl font-semibold'>{t("obligationsTitle")}</h2>
					<p className='mt-3 text-muted-foreground'>{t("obligations")}</p>
				</section>

				<section>
					<h2 className='text-xl font-semibold'>{t("warrantyTitle")}</h2>
					<p className='mt-3 text-muted-foreground'>{t("warranty")}</p>
				</section>

				<section>
					<h2 className='text-xl font-semibold'>{t("thirdPartyTitle")}</h2>
					<p className='mt-3 text-muted-foreground'>{t("thirdParty")}</p>
					<ul className='mt-3 space-y-1 text-sm'>
						{THIRD_PARTY.map((lib) => (
							<li key={lib.name}>
								<span className='font-medium'>{lib.name}</span> <span className='text-muted-foreground'>({lib.use})</span> — {lib.license}
							</li>
						))}
					</ul>
				</section>

				<section>
					<h2 className='text-xl font-semibold'>{t("fullTextTitle")}</h2>
					<p className='mt-3 text-sm text-muted-foreground'>{t("disclaimer")}</p>
					<pre className='mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg border bg-muted/40 p-4 text-xs leading-relaxed'>{LICENSE_TEXT}</pre>
					<a
						href={LICENSE_URL}
						target='_blank'
						rel='noopener noreferrer'
						className='mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
					>
						{t("viewOnGitHub")}
						<ExternalLink className='size-3.5' />
					</a>
				</section>

				<div className='text-center'>
					<Button asChild size='lg' className='group bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg'>
						<Link href='/playground'>
							{t("tryPlayground")}
							<ArrowRight className='ms-2 h-5 w-5 transition-transform group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1' />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
