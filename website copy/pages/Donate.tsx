import type React from "react";
import { useState } from "react";
import { FiShield, FiBriefcase, FiGlobe } from "react-icons/fi";

const Section = ({
	children,
	className = "",
}: { children: React.ReactNode; className?: string }) => (
	<section
		className={`py-20 sm:py-32 px-6 md:px-12 max-w-7xl mx-auto ${className}`}
	>
		{children}
	</section>
);

const DonateTier = ({
	icon,
	title,
	amount,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	amount: string;
	description: string;
}) => (
	<div className="border border-white/10 rounded-2xl p-8 text-left bg-black/20 backdrop-blur-sm h-full flex flex-col">
		<div className="text-amber-400 mb-4 text-3xl">{icon}</div>
		<h3 className="text-2xl text-white font-medium">{title}</h3>
		<p className="text-4xl text-white my-3 font-light tracking-tight">
			{amount}
		</p>
		<p className="text-gray-400 text-sm mb-8 flex-grow">{description}</p>
		<a
			href="#donate"
			className="w-full text-center inline-block bg-amber-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-amber-300 transition-colors duration-300"
		>
			Select Tier
		</a>
	</div>
);

const CustomDonateForm = () => {
	const [amount, setAmount] = useState("");
	const presetAmounts = ["25", "50", "100", "500"];

	return (
		<div className="mt-16 pt-12 border-t border-white/10 max-w-3xl mx-auto">
			<h3 className="text-3xl text-white tracking-tight mb-4 text-center">
				Or Give a Custom Amount
			</h3>
			<p className="text-gray-400 text-center mb-8">
				Every contribution helps fund constitution drafting, public polling, and
				community integration efforts.
			</p>
			<div className="flex justify-center gap-3 mb-6">
				{presetAmounts.map((preset) => (
					<button
						type="button"
						key={preset}
						onClick={() => setAmount(preset)}
						className={`px-6 py-2 rounded-full border transition-colors duration-200 ${amount === preset ? "bg-amber-400 text-black border-amber-400" : "border-white/20 text-white hover:border-white/50"}`}
					>
						${preset}
					</button>
				))}
			</div>
			<div className="relative max-w-sm mx-auto">
				<span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500">
					$
				</span>
				<input
					type="number"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					placeholder="Enter amount"
					className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-10 pr-6 text-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow"
				/>
			</div>
			<div className="text-center mt-8">
				<button
					type="button"
					className="w-full max-w-sm text-center inline-block bg-amber-400 text-black px-6 py-4 rounded-full font-semibold text-lg hover:bg-amber-300 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
					disabled={!amount || Number.parseFloat(amount) <= 0}
				>
					Donate Now
				</button>
			</div>
		</div>
	);
};

const Donate = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
	return (
		<div className="pt-32 animate-fade-in">
			<Section className="text-center !pt-0">
				<h1 className="text-5xl md:text-7xl text-white tracking-tighter mb-4">
					Support the Constitutional Initiative.
				</h1>
				<p className="max-w-3xl mx-auto text-gray-400 mb-16 leading-relaxed">
					Your contribution helps NMIPC secure government support to draft a
					constitution recognizing etinuxE, run public consultations, and fund
					programs that safely enable willing NuxeLand residents to shrink and
					integrate.
				</p>
				<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					<DonateTier
						icon={<FiShield />}
						title="Community Outreach"
						amount="$50"
						description="Support local outreach and education so residents can make informed choices about voluntary shrinking programs."
					/>
					<DonateTier
						icon={<FiBriefcase />}
						title="Constitution Fund"
						amount="$250"
						description="Fund legal expertise and advocacy to draft an inclusive constitution recognizing etinuxE rights."
					/>
					<DonateTier
						icon={<FiGlobe />}
						title="Polling & Integration"
						amount="$1,000"
						description="Sponsor large-scale civic polling and safe integration programs for willing participants from NuxeLand."
					/>
				</div>
				<CustomDonateForm />
			</Section>
		</div>
	);
};

export default Donate;
