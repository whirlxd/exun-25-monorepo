import type React from "react";
import { useRef, useEffect } from "react";

export const FadeInSection = ({
	children,
	className,
}: { children: React.ReactNode; className?: string }) => {
	const domRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					domRef.current?.classList.add("is-visible");
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					observer.unobserve(domRef.current!);
				}
			},
			{ threshold: 0.1 },
		);

		const currentRef = domRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, []);

	return (
		<div ref={domRef} className={`fade-in-section ${className || ""}`}>
			{children}
		</div>
	);
};
