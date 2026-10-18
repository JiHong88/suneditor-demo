import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { faqPageSchema } from "@/lib/seo/jsonld";

// Plain, always-visible answers (not an accordion) so search engines and LLM crawlers can read them.
const FAQ_KEYS = ["commercial", "dependencies", "frameworks", "features", "cloud", "output"] as const;

export default function HomeFaq() {
	const t = useTranslations("Home.Faq");
	const items = FAQ_KEYS.map((key) => ({ key, q: t(`items.${key}.q`), a: t(`items.${key}.a`) }));

	return (
		<section className='border-t py-20'>
			<JsonLd data={faqPageSchema(items)} />
			<div className='container mx-auto max-w-5xl px-6'>
				<div className='text-center'>
					<h2 className='text-2xl font-bold tracking-tight md:text-3xl'>{t("title")}</h2>
					<p className='mx-auto mt-3 max-w-xl text-muted-foreground'>{t("desc")}</p>
				</div>
				<dl className='mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2'>
					{items.map(({ key, q, a }) => (
						<div key={key}>
							<dt className='font-semibold'>{q}</dt>
							<dd className='mt-2 text-sm leading-relaxed text-muted-foreground'>{a}</dd>
						</div>
					))}
				</dl>
				<div className='mt-10 flex flex-wrap justify-center gap-6 text-sm'>
					<Link href='/license' className='inline-flex items-center gap-1.5 font-medium text-primary hover:underline'>
						{t("licenseLink")}
						<ArrowRight className='h-3.5 w-3.5' />
					</Link>
					<Link href='/troubleshooting' className='inline-flex items-center gap-1.5 font-medium text-primary hover:underline'>
						{t("troubleshootingLink")}
						<ArrowRight className='h-3.5 w-3.5' />
					</Link>
				</div>
			</div>
		</section>
	);
}
