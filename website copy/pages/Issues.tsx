import type React from "react";
import { FadeInSection } from "../components/Fade";
import { FiAlertTriangle, FiXCircle, FiTarget } from "react-icons/fi";

interface InfoCardProps {
	icon: React.ReactNode;
	title: string;
	children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, children }) => (
	<div className="border border-white/10 rounded-2xl p-8 bg-black/20 backdrop-blur-sm">
		<div className="text-amber-400 mb-4 text-3xl">{icon}</div>
		<h3 className="text-2xl text-white font-medium mb-3">{title}</h3>
		<p className="text-gray-400 leading-relaxed">{children}</p>
	</div>
);

const Issues = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
	return (
		<div className="pt-32">
			<header className="text-center max-w-4xl mx-auto px-6">
				<h1 className="text-5xl md:text-7xl text-white tracking-tighter mb-4">
					Constitutional Initiative & Civic Inclusion
				</h1>
				<p className="text-lg text-gray-400 leading-relaxed">
					We are pursuing formal government support to draft a constitution that
					recognizes etinuxE rights, to conduct public polling and
					consultations, and to create responsible pathways for willing NuxeLand
					residents to shrink and join our community.
				</p>
			</header>

			<FadeInSection className="py-20 sm:py-32 px-6 md:px-12 max-w-7xl mx-auto">
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					<InfoCard icon={<FiAlertTriangle />} title="What It Is">
						A program of civic reform: drafting legal protections, organizing
						transparent public polling, and removing policy and technical
						barriers so willing NuxeLand residents can safely choose to shrink
						and join our community.
					</InfoCard>
					<InfoCard icon={<FiXCircle />} title="The Threat">
						Existing legal and administrative obstacles deny equal civic
						recognition and prevent meaningful public consultation. Without
						reform, willing participants remain excluded and unprotected.
					</InfoCard>
					<InfoCard icon={<FiTarget />} title="Our Stance">
						The NMIPC seeks partnership with government to draft an inclusive
						constitution, deploy broad public polling, and implement safe,
						voluntary pathways for people of NuxeLand who wish to shrink. We
						demand transparency, accountability, and legally protected rights.
					</InfoCard>
				</div>
			</FadeInSection>

			<FadeInSection>
				<div className="relative py-20 sm:py-32">
					<div
						className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
						style={{
							backgroundImage:
								"url('https://placehold.co/1920x1080/1F2937/1F2937')",
						}}
					/>
					<div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-black" />
					<div className="relative z-10 max-w-7xl mx-auto text-center px-6">
						<h2 className="text-4xl md:text-5xl text-white tracking-tight mb-4">
							This Is Our Moment to Build Consensus.
						</h2>
						<p className="max-w-3xl mx-auto text-gray-400 mb-10 leading-relaxed">
							Achieving constitutional recognition and meaningful public
							consultation requires resources and sustained public engagement.
							Your support funds legal drafting, civic polling, and programs
							that enable willing participants to transition safely.
						</p>
						<button
							type="button"
							onClick={() => onNavigate("donate")}
							className="inline-block bg-amber-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-amber-300 transition-colors duration-300"
						>
							Contribute to the Initiative
						</button>
					</div>
				</div>
			</FadeInSection>
		</div>
	);
};

export default Issues;
