export default function Loading() {
	return (
		<div className='flex items-center justify-center min-h-[60vh]'>
			<div className='flex flex-col items-center gap-4'>
				<div className='h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
				<p className='text-sm text-muted-foreground animate-pulse'>Loading...</p>
			</div>
		</div>
	);
}
