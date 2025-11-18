import React, { useState, useRef, useEffect } from "react";
import { FadeInSection } from "../components/Fade";
// @ary wtf ?? fix ts vro
const FloatingImage = ({
	className,
	label,
	imgSrc,
}: {
	className?: string;
	label: string;
	imgSrc: string;
	animationClass?: string;
}) => {
	return (
		<div
			className={`absolute ${className} z-0  pointer-events-none`}
			aria-hidden
		>
			<p className="sr-only">{label}</p>
			<div className="rounded-xl overflow-hidden bg-gray-900 border border-white/10 shadow-xl aspect-[4/3]">
				<img src={imgSrc} className="w-full h-full object-cover" alt={label} />
			</div>
		</div>
	);
};

const storySections = [
	{
		id: "who",
		img: "https://placehold.co/800x600/1a1a1a/444444?text=Our+Mission",
		title: "Who We Are",
		text: "The NuxeLand Micro Individual Protection Council (NMIPC) advocates for the protection, rights, and civic inclusion of etinuxE. We work to secure government recognition, draft inclusive legal protections, and support voluntary pathways for willing individuals to join our community.",
		linkText: "Learn More About Our Mission",
		linkPage: null,
	},
	{
		id: "what",
		img: "https://placehold.co/800x600/1a1a1a/444444?text=The+Protocol",
		title: "What We Fight For",
		text: "Many existing policies and technical barriers prevent open, safe access to shrinking. We are focused on securing government collaboration to draft a constitution that protects etinuxE, run public consultations, and lift barriers for willing participants.",
		linkText: "See Our Agenda",
		linkPage: "issues",
	},
	{
		id: "join",
		img: "https://placehold.co/800x600/1a1a1a/444444?text=The+Fight",
		title: "Join The Fight",
		text: "Your support funds constitutional advocacy, public polling, and programs that responsibly enable willing NuxeLand residents to shrink and integrate into the micro-individual community.",
		linkText: "Contribute Now",
		linkPage: "donate",
	},
];

const StoryScroller = ({
	onNavigate,
}: { onNavigate: (page: string) => void }) => {
	const [activeId, setActiveId] = useState(storySections[0].id);
	const refs = useRef<{ [key: string]: HTMLDivElement | null }>({});

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				// biome-ignore lint/complexity/noForEach: <explanation>
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.getAttribute("data-id") || "");
					}
				});
			},
			{ rootMargin: "-50% 0px -50% 0px" },
		);

		const currentRefs = Object.values(refs.current);
		// biome-ignore lint/complexity/noForEach: <explanation>
		currentRefs.forEach((ref) => {
			if (ref) observer.observe(ref);
		});

		return () => {
			// biome-ignore lint/complexity/noForEach: <explanation>
			currentRefs.forEach((ref) => {
				if (ref) observer.unobserve(ref);
			});
		};
	}, []);

	return (
		<div
			id="the-issues"
			className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-start px-6 md:px-12 py-16"
		>
			<div>
				{storySections.map((section) => (
					<div
						key={section.id}
						ref={(el: HTMLDivElement | null) => {
							if (el) refs.current[section.id] = el;
						}}
						data-id={section.id}
						className="min-h-screen flex items-center"
					>
						<h2
							className={`text-5xl md:text-7xl font-thin tracking-tighter transition-all duration-500 ease-in-out ${activeId === section.id ? "text-amber-400" : "text-gray-700"}`}
						>
							{section.title}
						</h2>
					</div>
				))}
			</div>
			<div className="md:sticky md:top-0 h-screen flex flex-col justify-center">
				<div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
					{storySections.map((section) => (
						<img
							key={section.id}
							src={section.img}
							alt={section.title}
							className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-700 ease-in-out ${activeId === section.id ? "opacity-100" : "opacity-0"}`}
						/>
					))}
				</div>
				<div className="mt-6 relative min-h-56">
					{storySections.map((section) => (
						<div
							key={section.id}
							className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeId === section.id ? "opacity-100" : "opacity-0 pointer-events-none"}`}
						>
							<h3 className="text-3xl font-light text-gray-100 tracking-tight">
								{section.title}
							</h3>
							<p className="mt-3 text-gray-400 leading-relaxed max-w-prose">
								{section.text}
							</p>
							<button
								type="button"
								onClick={(e: { preventDefault: () => void }) => {
									e.preventDefault();
									if (section.linkPage) {
										onNavigate(section.linkPage);
									}
								}}
								className="inline-block mt-6 text-sm text-amber-400 border-b border-amber-800 hover:border-amber-400 transition-colors duration-300 pb-1"
							>
								{section.linkText}
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const Home = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
	return (
		<div>
			<header className="h-screen relative overflow-x-hidden flex items-center justify-center text-center px-4">
				{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
				<svg
					viewBox="0 0 100 100"
					className="absolute inset-0 w-full h-full z-0"
					preserveAspectRatio="none"
				>
					<path
						d="M -10 30 C 15 60, 30 0, 50 25 S 80 80, 110 50"
						stroke="rgba(255,255,255,0.05)"
						strokeWidth="0.5"
						fill="none"
					/>
					<path
						className="animate-pulse-line"
						d="M -10 30 C 15 60, 30 0, 50 25 S 80 80, 110 50"
						stroke="rgba(255,193,7,0.3)"
						strokeWidth="0.5"
						fill="none"
					/>
				</svg>

				{/* Grounded decorative images — hidden on small screens and placed behind the hero */}
				<FloatingImage
					className="hidden sm:block top-[18vh] left-[5vw] w-[20vw] max-w-xs"
					animationClass="animate-float-1"
					label="Abstract representation of the NMIPC"
					imgSrc="/images/1.png"
				/>
				<FloatingImage
					className="hidden sm:block top-[15vh] right-[6vw] w-[18vw] max-w-[22rem]"
					animationClass="animate-float-2"
					label="Policy Agenda"
					imgSrc="/images/2.png"
				/>
				<FloatingImage
					className="hidden md:block bottom-[8vh] left-[12vw] w-[18vw] max-w-xs"
					animationClass="animate-float-3"
					label="Micro-Individual Community"
					imgSrc="/images/3.png"
				/>
				<FloatingImage
					className="hidden md:block bottom-[16vh] right-[10vw] w-[16vw] max-w-sm"
					animationClass="animate-float-4"
					label="Community Integration"
					imgSrc="/images/4.png"
				/>

				{/* Constrain hero content width so it doesn't collide with side imagery */}
				<div className="relative z-20 flex flex-col items-center max-w-[60ch] px-6">
					<img
						src="/favicon.svg"
						alt="NMIPC Logo"
						className="h-20 md:h-24 mb-6  mt-20" // animate-glow wo/ better
					/>
					<h1 className="text-5xl md:text-7xl lg:text-8xl font-thin text-gray-100 tracking-tighter leading-tight">
						A Future
						<br />
						Made Small
						<span
							onClick={() => onNavigate("backdoor")}
							className="cursor-pointer text-amber-400 hover:text-red-500 transition-colors duration-300"
						>
							.
						</span>
					</h1>
					<p className="mt-8 max-w-xl text-gray-400 leading-relaxed">
						NMIPC champions constitutional recognition, public consultation, and
						safe, voluntary pathways for NuxeLand residents who wish to shrink
						and join our community.
					</p>
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						onClick={() => onNavigate("donate")}
						className="mt-10 inline-block bg-amber-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-amber-300 transition-colors duration-300"
					>
						Join the Fight
					</button>
				</div>
			</header>

			<FadeInSection>
				<StoryScroller onNavigate={onNavigate} />
			</FadeInSection>

			<FadeInSection>
				<section className="py-20 sm:py-32 px-6 md:px-12 max-w-7xl mx-auto text-center">
					<h2 className="text-4xl md:text-5xl text-white tracking-tight mb-4">
						Support Our Survival.
					</h2>
					<p className="max-w-3xl mx-auto text-gray-400 mb-10 leading-relaxed">
						Your contribution is more than a donation—it's an investment in our
						future. It funds our lobbying efforts, public outreach, and the
						critical 'operational security' that protects our agents.
					</p>
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						onClick={() => onNavigate("donate")}
						className="inline-block bg-amber-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-amber-300 transition-colors duration-300"
					>
						Contribute Now
					</button>
				</section>
			</FadeInSection>
		</div>
	);
};

export default Home;
