import { ArrowRight, Github } from "lucide-react";
import { Link } from "@/i18n/navigation";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function FinalCTA() {
	const t = useTranslations("Home.FinalCTA");
	const t_main = useTranslations("Main");
	const t_menus = useTranslations("Main.Menus");

	return (
		<section className='border-t py-20'>
			<div className='container mx-auto px-6 text-center'>
				<h2 className='text-2xl font-bold tracking-tight md:text-3xl'>{t("title")}</h2>
				<p className='mx-auto mt-3 max-w-xl text-muted-foreground'>{t("desc")}</p>
				<div className='mt-8 flex flex-wrap items-center justify-center gap-4'>
					<Button
						asChild
						size='lg'
						className='group bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl'
					>
						<Link href='/getting-started'>
							{t_menus("getting-started")}
							<ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
						</Link>
					</Button>
					<Button asChild size='lg' variant='outline' className='gap-2'>
						<Link href='https://github.com/JiHong88/SunEditor' target='_blank' rel='noopener noreferrer'>
							<Github className='h-5 w-5' />
							{t_main("starOnGitHub")}
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
