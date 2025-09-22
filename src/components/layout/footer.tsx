"use client";

import Link from "next/link";
import Image from "next/image";

type FooterProps = {
	version: string;
};

export default function Footer({ version = "" }: FooterProps) {
	const year = new Date().getFullYear();

	return (
		<footer role='contentinfo' className='pb-20 border-t border-slate-200/60 dark:border-slate-700/50 bg-slate-50/60 dark:bg-slate-900/30'>
			<div className='max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 dark:text-slate-300'>
				{/* Demo Hub (버전/소스) */}
				<div>
					<div className='mb-3 flex items-center gap-2'>
						<Image src='/se3_logo_title.svg' alt='SunEditor' width={88} height={24} className='dir-img' />
						<span className='rounded-md border border-slate-300/60 dark:border-slate-600/60 px-2 py-0.5 text-xs'>{version}</span>
					</div>
					<ul className='space-y-1'>
						<li className='my-4'>
							<a
								href='https://github.com/JiHong88/SunEditor'
								target='_blank'
								rel='noreferrer'
								aria-label='Open SunEditor GitHub repository'
								className='hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none focus-visible:ring focus-visible:ring-slate-400/50 dark:focus-visible:ring-slate-500/50 rounded'
							>
								View Source
							</a>
						</li>
						<li className='my-4'>
							<a
								href='https://github.com/JiHong88/suneditor/issues'
								target='_blank'
								rel='noreferrer'
								aria-label='Report an issue on GitHub'
								className='hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none focus-visible:ring focus-visible:ring-slate-400/50 dark:focus-visible:ring-slate-500/50 rounded'
							>
								Report an Issue
							</a>
						</li>
					</ul>
				</div>

				{/* 주요 링크 */}
				<nav aria-label='Resources'>
					<h4 className='font-semibold mb-2 text-slate-900 dark:text-slate-100'>Resources</h4>
					<ul className='space-y-1'>
						<li className='my-4'>
							<Link
								href='/docs'
								className='hover:underline hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none focus-visible:ring focus-visible:ring-slate-400/50 dark:focus-visible:ring-slate-500/50 rounded'
							>
								Docs
							</Link>
						</li>
						<li className='my-4'>
							<Link
								href='/feature-demo'
								className='hover:underline hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none focus-visible:ring focus-visible:ring-slate-400/50 dark:focus-visible:ring-slate-500/50 rounded'
							>
								Feature demo
							</Link>
						</li>
						<li className='my-4'>
							<Link
								href='/playground'
								className='hover:underline hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none focus-visible:ring focus-visible:ring-slate-400/50 dark:focus-visible:ring-slate-500/50 rounded'
							>
								Playground
							</Link>
						</li>
					</ul>
				</nav>

				{/* 라이선스/카피라이트 */}
				<div>
					<h4 className='font-semibold mb-2 text-slate-900 dark:text-slate-100'>
						<svg viewBox='0 0 24 24' width='16' height='16' aria-hidden='true' className='opacity-80 inline-block align-text-bottom mr-1'>
							<path
								fill='currentColor'
								d='M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.19-3.37-1.19-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.9 1.54 2.36 1.1 2.94.84.09-.65.35-1.1.63-1.35-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.67.93.67 1.88v2.79c0 .26.18.58.69.48A10 10 0 0 0 12 2Z'
							/>
						</svg>
						About
					</h4>
					<p className='my-4 mb-2'>
						<Link href='https://github.com/JiHong88/suneditor?tab=MIT-1-ov-file'>Licensed under MIT.</Link>
					</p>
					<p className='my-4 flex items-center gap-2'>
						<Link href='https://github.com/JiHong88/suneditor/graphs/contributors'>
							<span>© Copyright {year} SunEditor Contributors</span>
						</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}
