import React, { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Foot from "./components/Foot";
import Home from "./pages/Home";
import Donate from "./pages/Donate";
import Issues from "./pages/Issues";
import Backdoor from "./components/Backdoor";

export default function App() {
	const [page, setPage] = useState("home");
	const [isFading, setIsFading] = useState(false);

	useEffect(() => {
		setIsFading(false);
	}, []);

	const handleNavigate = (newPage: string) => {
		if (page === newPage) return;

		setIsFading(true);
		setTimeout(() => {
			setPage(newPage);
			window.scrollTo(0, 0);
			requestAnimationFrame(() => {
				setTimeout(() => {
					setIsFading(false);
				}, 50);
			});
		}, 500);
	};

	const navItems = [
		{ label: "About", page: "home" },
		{ label: "Our Agenda", page: "issues" },
		{ label: "Donate", page: "donate" },
	];

	if (page === "backdoor") {
		return <Backdoor onNavigate={handleNavigate} />;
	}

	return (
		<div className="min-h-screen bg-black">
			<div
				className="fixed inset-0 z-0 opacity-[0.03]"
				style={{
					backgroundImage:
						"radial-gradient(circle at center, #fff 1px, transparent 1px)",
					backgroundSize: "20px 20px",
				}}
			/>

			<Nav items={navItems} onNavigate={handleNavigate} currentPage={page} />

			<main
				className={`relative z-10 transition-all duration-500 ease-in-out ${isFading ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"}`}
			>
				{page === "home" && <Home onNavigate={handleNavigate} />}
				{page === "issues" && <Issues onNavigate={handleNavigate} />}
				{page === "donate" && <Donate onNavigate={handleNavigate} />}
			</main>

			<Foot onNavigate={handleNavigate} />
		</div>
	);
}
