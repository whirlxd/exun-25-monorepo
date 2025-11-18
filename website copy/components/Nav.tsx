import type React from "react";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

interface NavItem {
	label: string;
	page: string;
}

interface NavProps {
	items: NavItem[];
	onNavigate: (page: string) => void;
	currentPage: string;
}

const Nav: React.FC<NavProps> = ({ items, onNavigate, currentPage }) => {
	const [menuOpen, setMenuOpen] = useState(false);

	const handleMobileNav = (page: string) => {
		onNavigate(page);
		setMenuOpen(false);
	};

	return (
		<>
			<nav className="fixed top-0 left-0 right-0 z-50 p-4">
				<div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 rounded-full border border-white/10 bg-black/50 backdrop-blur-xl shadow-lg shadow-black/30">
					<button
						type="button"
						onClick={() => onNavigate("home")}
						className="text-xl font-medium tracking-wider text-gray-100 font-serif"
					>
						NMIPC — NuxeLand Advocacy
					</button>
					<div className="hidden md:flex items-center space-x-8">
						{items.map((item) => (
							<button
								type="button"
								key={item.label}
								onClick={() => onNavigate(item.page)}
								className={`text-sm transition-colors duration-300 ${currentPage === item.page ? "text-amber-400" : "text-gray-300 hover:text-amber-400"}`}
							>
								{item.label}
							</button>
						))}
					</div>
					<div className="md:hidden">
						<button
							type="button"
							onClick={() => setMenuOpen(true)}
							className="h-10 w-10 flex items-center justify-center text-gray-300 rounded-full hover:bg-white/10 transition-colors"
						>
							<FiMenu size={22} />
						</button>
					</div>
				</div>
			</nav>

			<div
				className={`fixed inset-0 z-[60] bg-black/80 backdrop-blur-lg transition-opacity duration-300 ease-in-out md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
			>
				<div className="flex flex-col items-center justify-center h-full space-y-8">
					{items.map((item) => (
						<button
							type="button"
							key={item.label}
							onClick={() => handleMobileNav(item.page)}
							className={`text-3xl font-thin tracking-tight transition-colors ${currentPage === item.page ? "text-amber-400" : "text-gray-200 hover:text-amber-400"}`}
						>
							{item.label}
						</button>
					))}
				</div>
				<button
					type="button"
					onClick={() => setMenuOpen(false)}
					className="absolute top-6 right-6 h-12 w-12 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
					aria-label="Close menu"
				>
					<FiX size={28} />
				</button>
			</div>
		</>
	);
};

export default Nav;
