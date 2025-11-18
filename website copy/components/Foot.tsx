import type React from "react";

interface FootProps {
	onNavigate: (page: string) => void;
}

const Foot: React.FC<FootProps> = ({ onNavigate }) => {
	return (
		<footer className="relative z-10 border-t border-white/10 mt-20">
			<div className="max-w-7xl mx-auto py-12 px-6 md:px-12 text-gray-500">
				<div className="grid md:grid-cols-3 gap-8">
					<div className="col-span-1">
						<h3 className="text-2xl font-medium text-gray-200">NMIPC</h3>
						<p className="text-sm mt-2">
							NuxeLand Micro Individual Protection Council (NMIPC) is dedicated
							to protecting the rights, safety, and representation of etinuxE
							throughout NuxeLand. Founded in response to the unique challenges
							faced by etinuxE after the Shrink, NMIPC advocates for legal
							safeguards, equitable access to resources, and community-driven
							policy to ensure dignity and inclusion.
						</p>
					</div>
					<div className="col-span-1 flex space-x-8">
						<div>
							<h4 className="font-semibold text-gray-400 mb-2">Navigate</h4>
							<ul className="space-y-1">
								<li>
									<button
										type="button"
										onClick={() => onNavigate("home")}
										className="hover:text-amber-400 transition-colors"
									>
										About
									</button>
								</li>

								<li>
									<button
										type="button"
										onClick={() => onNavigate("issues")}
										className="hover:text-amber-400 transition-colors"
									>
										Issues
									</button>
								</li>

								<li>
									<button
										type="button"
										onClick={() => onNavigate("donate")}
										className="hover:text-amber-400 transition-colors"
									>
										Donate
									</button>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between text-sm">
					<p>© 2025 NMIPC. All rights reserved.</p>
					<p className="mt-2 sm:mt-0">
						Advocacy, protection, and solidarity for etinuxE.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Foot;
