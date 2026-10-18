import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SUNEDITOR_VERSION } from "@/store/version";
import { TROUBLESHOOTING_CATEGORIES, TROUBLESHOOTING_ITEMS, TROUBLESHOOTING_VERIFIED_VERSION } from "@/data/troubleshooting";
import TroubleshootingList, { PrefilledIssueLink, type ResolvedItem } from "./_components/TroubleshootingList";

export default function TroubleshootingPage() {
	const t = useTranslations("Troubleshooting");
	const t_menus = useTranslations("Main.Menus");
	const t_common = useTranslations("Common");

	// Resolve all text on the server so the full list is in the initial HTML (search engines, no-JS readers).
	const items: ResolvedItem[] = TROUBLESHOOTING_ITEMS.map(({ id, category, code, related }) => ({
		id,
		category,
		code,
		title: t(`items.${id}.title`),
		symptom: t(`items.${id}.symptom`),
		cause: t(`items.${id}.cause`),
		fix: t(`items.${id}.fix`),
		related: related && { href: `/${related}`, label: t_menus(related) },
	}));

	const labels = {
		contents: t("contents"),
		symptom: t("symptom"),
		cause: t("cause"),
		fix: t("fix"),
		searchLabel: t("searchLabel"),
		searchPlaceholder: t("searchPlaceholder"),
		all: t("all"),
		categories: Object.fromEntries(TROUBLESHOOTING_CATEGORIES.map((c) => [c, t(`categories.${c}`)])) as Record<(typeof TROUBLESHOOTING_CATEGORIES)[number], string>,
		noResults: t("noResults"),
		helpful: t("helpful"),
		yes: t("yes"),
		no: t("no"),
		thanks: t("thanks"),
		stillStuck: t("stillStuck"),
		openPrefilledIssue: t("openPrefilledIssue"),
		copyPermalink: t_common("copyPermalink"),
		copied: t_common("copied"),
	};

	return (
		<div className='min-h-screen'>
			<section className='container mx-auto px-6 py-12'>
				<div className='mx-auto max-w-3xl text-center'>
					<h1 className='text-4xl font-bold tracking-tight md:text-5xl'>{t("title")}</h1>
					<p className='mt-4 text-lg text-muted-foreground'>{t("subtitle")}</p>
					<p className='mt-3 text-xs text-muted-foreground'>{t("verified", { version: TROUBLESHOOTING_VERIFIED_VERSION })}</p>
				</div>
			</section>

			<div className='container mx-auto max-w-4xl px-6 pb-20'>
				<TroubleshootingList items={items} categories={TROUBLESHOOTING_CATEGORIES} labels={labels} version={SUNEDITOR_VERSION} />

				<section className='mt-16 rounded-lg border bg-muted/30 p-6 text-center'>
					<h2 className='text-lg font-semibold'>{t("notListed")}</h2>
					<p className='mt-2 text-sm text-muted-foreground'>{t("notListedDesc")}</p>
					<div className='mt-4 flex flex-wrap justify-center gap-6 text-sm'>
						<PrefilledIssueLink version={SUNEDITOR_VERSION} label={t("openIssue")} />
						<Link href='/playground' className='inline-flex items-center gap-1.5 font-medium text-primary hover:underline'>
							{t("tryPlayground")}
							<ArrowRight className='h-3.5 w-3.5' />
						</Link>
					</div>
				</section>
			</div>
		</div>
	);
}
