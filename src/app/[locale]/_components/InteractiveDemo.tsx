"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function InteractiveDemo() {
	return (
		<section className='container mx-auto px-6 pb-20'>
			<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className='mx-auto max-w-5xl'>
				<Card className='overflow-hidden shadow-2xl shadow-primary/10'>
					<div className='flex h-10 items-center gap-1.5 border-b bg-muted/60 px-3'>
						<span className='h-3 w-3 rounded-full bg-red-400'></span>
						<span className='h-3 w-3 rounded-full bg-yellow-400'></span>
						<span className='h-3 w-3 rounded-full bg-green-400'></span>
					</div>
					<CardContent className='p-2 md:p-4'>
						<div className='aspect-video w-full rounded-md border bg-background p-4 overflow-hidden'>
							
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</section>
	);
}
