import { ArrowRight, Github } from "lucide-react";
// shadcn/ui
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function FinalCTA() {
	const t = useTranslations("Home.FinalCTA");
	const t_main = useTranslations("Main");
	const t_menus = useTranslations("Main.Menus");

	return (
		<section className='relative bg-gray-900 py-20'>
			<div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f630,transparent)]' />
			<div className='container mx-auto px-6 text-center'>
				<h2 className='text-3xl font-bold tracking-tight text-white md:text-4xl'>{t("title")}</h2>
				<p className='mx-auto mt-4 max-w-2xl text-lg text-slate-300'>{t("desc")}</p>
				<div className='mt-8 flex flex-wrap items-center justify-center gap-4'>
					<Button asChild size='lg' className='group bg-blue-600 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-blue-700'>
						<a href='/getting-started'>
							{t_menus("getting-started")}
							<ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
						</a>
					</Button>
					<Button asChild size='lg' variant='outline' className='gap-2 border-slate-600 bg-slate-800/50 text-white backdrop-blur-sm hover:bg-slate-700 hover:text-white'>
						<a href='https://github.com/JiHong88/SunEditor' target='_blank' rel='noopener noreferrer'>
							<Github className='h-5 w-5' />
							{t_main("starOnGitHub")}
						</a>
					</Button>
				</div>
			</div>
		</section>
	);
}
