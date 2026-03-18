import Image from "next/image";

interface CustomAdProps {
	imageUrl: string;
	linkUrl: string;
	altText?: string;
	className?: string;
}

export default function CustomAd({ imageUrl, linkUrl, altText = "Advertisement", className }: CustomAdProps) {
	return (
		<a
			href={linkUrl}
			target="_blank"
			rel="noopener noreferrer sponsored"
			className={`block overflow-hidden rounded-lg border border-border/50 transition-opacity hover:opacity-90 ${className ?? ""}`}
		>
			<Image
				src={imageUrl}
				alt={altText}
				width={728}
				height={90}
				className="h-auto w-full object-cover"
				unoptimized
			/>
		</a>
	);
}
