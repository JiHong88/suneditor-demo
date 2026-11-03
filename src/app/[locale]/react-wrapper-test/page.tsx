import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import ReactWrapperDemo from "./_components/ReactWrapperDemo";

// Verification page for the local `@suneditor/react` wrapper (file:../suneditor-react).
// Not linked from navigation or the sitemap.
export default function ReactWrapperTestPage({ params }: { params: Promise<{ locale: string }> }) {
	setRequestLocale(use(params).locale);

	return (
		<div className='container mx-auto max-w-4xl px-6 py-12'>
			<h1 className='text-3xl font-bold tracking-tight'>@suneditor/react test</h1>
			<p className='mt-2 text-sm text-muted-foreground'>Rendered from a server component without next/dynamic.</p>
			<ReactWrapperDemo />
		</div>
	);
}
