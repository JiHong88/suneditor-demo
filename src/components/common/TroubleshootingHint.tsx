import { LifeBuoy } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** 관련 Troubleshooting 항목으로 가는 문맥 링크 — 제목은 `Troubleshooting.items.<id>.title`을 그대로 쓴다. */
export default function TroubleshootingHint({ ids, className }: { ids: string[]; className?: string }) {
	const t = useTranslations("Troubleshooting");

	return (
		<aside className={cn("flex items-start gap-2.5 rounded-lg border bg-muted/30 px-4 py-3 text-sm", className)}>
			<LifeBuoy className='mt-0.5 size-4 shrink-0 text-muted-foreground' aria-hidden />
			<div className='min-w-0'>
				<span className='font-medium'>{t("hint")}</span>
				<ul className='mt-1 space-y-0.5'>
					{ids.map((id) => (
						<li key={id}>
							<Link href={`/troubleshooting#${id}`} className='text-muted-foreground hover:text-foreground hover:underline'>
								{t(`items.${id}.title`)}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</aside>
	);
}
