import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import {
	FiArrowRight,
	FiX,
	FiTarget,
	FiList,
	FiMessageSquare,
	FiDollarSign,
	FiSend,
	FiHash,
	FiMapPin,
	FiRefreshCw,
} from "react-icons/fi";

const API_BASE_URL = "https://exunhack.onrender.com";

type TabView = "OPS" | "UPLINK" | "ALLOCATION";

interface Mission {
	mission_id: string;
	hash: string;
	location: string;
	date: string;
	time: string;
	status?: string; // keep ts front for now
}

interface Conversation {
	participant_hash: string;
	participant_type: string;
	last_message: string;
	last_message_time: string;
	unread_count: number;
}

interface Message {
	id: string;
	from_hash: string;
	to_hash: string;
	content: string;
	created_at: string;
	from_type: string;
}

const Backdoor = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
	const [view, setView] = useState<"auth" | "portal">("auth");
	const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
	const [activeTab, setActiveTab] = useState<TabView>("OPS");

	const [userHash, setUserHash] = useState<string | null>(null);
	const [authForm, setAuthForm] = useState({
		username: "",
		email: "",
		password: "",
		hash: "",
	});
	const [output, setOutput] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [missions, setMissions] = useState<Mission[]>([]);
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [activeConversation, setActiveConversation] = useState<string | null>(
		null,
	);
	const [messages, setMessages] = useState<Message[]>([]);
	const [chatInput, setChatInput] = useState("");
	const [newWorkerHash, setNewWorkerHash] = useState("");
	const [missionForm, setMissionForm] = useState({
		location: "noobhay the II square",
		date: "2025-11-11",
		time: "",
	});
	const [allocForm, setAllocForm] = useState({
		venue: "shadowy soul lake",
		game_type: "Texas Hold'em",
		buy_in: "",
		date: "",
		start_time: "",
		duration: "",
		payment_type: "gold_coins",
	});

	const [mounted, setMounted] = useState(false);
	const [isExiting, setIsExiting] = useState(false);
	const [sysInfo, setSysInfo] = useState<{
		ua: string;
		res: string;
		cores: number;
		cpu?: number | null;
		battery?: string | null;
	}>({ ua: "", res: "", cores: 0, cpu: null, battery: null });

	const outputEndRef = useRef<HTMLDivElement>(null);
	const chatEndRef = useRef<HTMLDivElement>(null);

	const gridCells = useMemo(() => {
		return Array.from({ length: 244 }).map((_, i) => ({
			id: i,
			delay: Math.random() * 0.7,
		}));
	}, []);

	const [hexStream, setHexStream] = useState<string[]>([]);
	const addOutput = (line: string) =>
		setOutput((prev) => [...prev.slice(-6), line]);

	const apiCall = async (
		endpoint: string,
		method = "GET",
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		body: any = null,
	) => {
		try {
			const options: RequestInit = {
				method,
				headers: { "Content-Type": "application/json" },
			};
			if (body) options.body = JSON.stringify(body);

			const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
			const data = await res.json();

			if (!res.ok)
				throw new Error(data.error || data.message || "Request failed");
			return data;
		} catch (err: any) {
			addOutput(`ERROR: ${err.message}`);
			throw err;
		}
	};

	useEffect(() => {
		const bootTimer = setTimeout(() => setMounted(true), 50);

		setSysInfo({
			ua: `${navigator.userAgent.replace(/[\(\)]/g, "").substring(0, 40)}...`,
			res: `${window.screen.width}x${window.screen.height}`,
			cores: navigator.hardwareConcurrency || 4,
			cpu: navigator.hardwareConcurrency || 4,
			battery: null,
		});

		// Asynchronously fetch battery status if the browser supports the API.
		(async () => {
			try {
				const nav: any = navigator;
				if (typeof nav.getBattery === "function") {
					const bat = await nav.getBattery();
					setSysInfo((prev) => ({
						...prev,
						battery: `${Math.round((bat.level || 0) * 100)}%${bat.charging ? " (charging)" : ""}`,
					}));
				} else if (nav.battery && typeof nav.battery.level === "number") {
					setSysInfo((prev) => ({
						...prev,
						battery: `${Math.round((nav.battery.level || 0) * 100)}%`,
					}));
				} else {
					setSysInfo((prev) => ({ ...prev, battery: null }));
				}
			} catch (e) {
				setSysInfo((prev) => ({ ...prev, battery: null }));
			}
		})();

		const interval = setInterval(() => {
			setHexStream((prev) => {
				const next = [
					...prev,
					Math.random().toString(16).substr(2, 8).toUpperCase(),
				];
				if (next.length > 15) return next.slice(1);
				return next;
			});
		}, 200);

		// Check local storage
		const storedHash = localStorage.getItem("nmipc_user_hash");
		if (storedHash) {
			setUserHash(storedHash);
			setView("portal");
			addOutput(`IDENTITY_VERIFIED: ${storedHash.substring(0, 8)}...`);
		} else {
			addOutput("GATEWAY_LOCKED // AWAITING_CREDENTIALS");
		}

		return () => {
			clearTimeout(bootTimer);
			clearInterval(interval);
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		let pollInterval: ReturnType<typeof setInterval>;

		if (view === "portal" && userHash && activeTab === "UPLINK") {
			const pollChat = async () => {
				try {
					const convData = await apiCall(`/chat/conversations/${userHash}`);
					if (convData.conversations) {
						setConversations(convData.conversations);
					}

					if (activeConversation) {
						const msgData = await apiCall(
							`/chat/messages/${userHash}?with=${activeConversation}`,
						);
						if (msgData.messages) {
							setMessages(msgData.messages);
						}
					}
				} catch (e) {
					console.error(e);
				}
			};

			pollChat();
			pollInterval = setInterval(pollChat, 2000);
		}

		return () => clearInterval(pollInterval);
	}, [view, userHash, activeTab, activeConversation]);

	useEffect(() => {
		outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [output]);

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, activeTab]);

	const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAuthForm({ ...authForm, [e.target.name]: e.target.value });
	};

	const handleLogout = () => {
		addOutput("TERMINATING_UPLINK...");
		setIsExiting(true);
		setTimeout(() => {
			localStorage.removeItem("nmipc_user_hash");
			setUserHash(null);
			onNavigate("home");
		}, 1000);
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (authMode === "signup") {
				addOutput("CREATING_IDENTITY_PACKET...");
				const res = await apiCall("/auth/signup", "POST", {
					username: authForm.username,
					email: authForm.email,
					password: authForm.password,
				});

				const newHash = res.user.hash;
				localStorage.setItem("nmipc_user_hash", newHash);
				setUserHash(newHash);
				addOutput(`> IDENTITY_CREATED: ${newHash}`);
				setView("portal");
			} else {
				addOutput("VERIFYING_HASH_SIGNATURE...");
				// lowk shouldn't bother
				if (authForm.hash.length < 5) throw new Error("INVALID_HASH_LENGTH");

				localStorage.setItem("nmipc_user_hash", authForm.hash);
				setUserHash(authForm.hash);
				addOutput(`> ACCESS_GRANTED: ${authForm.hash}`);
				setView("portal");
			}
		} catch (error: any) {
			addOutput(`> ERROR: ${error.message}`);
		}
		setIsLoading(false);
	};

	const handleCreateMission = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!userHash) return;

		addOutput("UPLOADING_MISSION_MANIFEST...");
		try {
			const res = await apiCall("/mission", "POST", {
				user_hash: userHash,
				date: missionForm.date,
				time: missionForm.time,
				location: missionForm.location,
			});

			const newMission: Mission = {
				...res.mission,
				status: "ACTIVE", // derived
			};

			setMissions((prev) => [newMission, ...prev]);
			setMissionForm({ location: "", date: "", time: "" });
			addOutput(`> OP_ESTABLISHED: ${res.mission.mission_id}`);
		} catch (e) {}
	};

	const handleCreateGambling = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!userHash) return;

		addOutput("SECURING_ALLOCATION_CONTRACT...");
		try {
			const res = await apiCall("/gambling", "POST", {
				user_hash: userHash,
				...allocForm,
				agree_to_terms: true,
			});

			addOutput(
				`> CONTRACT_SIGNED: ${res.contract.contract_id} @ ${res.contract.venue}`,
			);

			setAllocForm({
				venue: "",
				game_type: "Texas Hold'em",
				buy_in: "",
				date: "",
				start_time: "",
				duration: "",
				payment_type: "gold_coins",
			});
		} catch (e) {}
	};

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!chatInput.trim() || !userHash || !activeConversation) return;

		const content = chatInput;
		setChatInput("");

		try {
			await apiCall("/chat/send", "POST", {
				from_hash: userHash,
				to_hash: activeConversation,
				content: content,
			});
			// poll and pickup
		} catch (e) {
			setChatInput(content); // Restore on fail
		}
	};

	const startNewChat = () => {
		if (newWorkerHash.trim()) {
			setActiveConversation(newWorkerHash.trim());
			setNewWorkerHash("");
			addOutput(`> COMM_LINK_TARGETED: ${newWorkerHash}`);
		}
	};

	const accentColor = "text-[#ff003c]";
	const accentBg = "bg-[#ff003c]";
	const amberText = "text-amber-400";

	return (
		<div
			className={`fixed inset-0 z-[9999] bg-[#030303] text-white overflow-hidden flex flex-col selection:bg-[#ff003c] selection:text-black transition-opacity duration-1000 ease-in-out ${isExiting ? "opacity-0" : "opacity-100"}`}
			style={{ fontFamily: "'Azeret Mono', monospace" }}
		>
			<div className="absolute inset-0 z-[10000] grid grid-cols-8 md:grid-cols-12 grid-rows-12 pointer-events-none h-full w-full">
				{gridCells.map((cell) => (
					<div
						key={cell.id}
						className="bg-[#030303] w-full h-full border-[0.5px] border-black/20"
						style={{
							opacity: mounted ? 0 : 1,
							transition: `opacity 0.5s ease-in-out ${cell.delay}s`,
						}}
					/>
				))}
			</div>
			<div
				className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
				style={{
					backgroundImage:
						"linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>
			<div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] bg-[length:100%_2px,3px_100%] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" />

			<div className="relative z-20 px-6 py-4 flex justify-between items-center border-b border-white/10 h-16 shrink-0 bg-[#030303]">
				<div className="flex items-center gap-4">
					<h1 className="text-xl md:text-2xl font-black tracking-tighter leading-none uppercase whitespace-nowrap flex items-center gap-2">
						<span className="opacity-40">NMIPC</span>
						<span className={accentColor}>HQ</span>
					</h1>
					<div className="hidden md:block h-4 w-[1px] bg-white/20" />
					<span className="hidden md:block text-[10px] text-gray-500 tracking-widest">
						{userHash ? `HASH: ${userHash}` : "NODE_UNSECURED"}
					</span>
				</div>

				<button
					type="button"
					onClick={handleLogout}
					className="group flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest hover:text-[#ff003c] transition-colors"
				>
					[ ESC ]{" "}
					<FiX className="text-base group-hover:rotate-90 transition-transform" />
				</button>
			</div>

			<div className="relative z-10 flex-grow flex flex-col lg:flex-row overflow-hidden">
				<div className="hidden lg:flex w-[20%] min-w-[250px] border-r border-white/10 flex-col relative overflow-hidden bg-black/60 backdrop-blur-sm">
					<div className="absolute top-0 left-0 right-0 h-[2px] bg-[#ff003c] shadow-[0_0_15px_rgba(255,0,60,1)] z-20 animate-[float_3s_ease-in-out_infinite]" />
					<div className="p-8 flex flex-col h-full gap-6 z-10">
						<div className="space-y-1">
							<p className="text-[9px] text-gray-500 tracking-widest uppercase">
								System Integrity
							</p>
							<div className="flex gap-1">
								<div className={`h-1 w-4 ${accentBg}`} />
								<div className={`h-1 w-4 ${accentBg}`} />
								<div className={`h-1 w-4 ${accentBg}`} />
								<div className="h-1 w-4 bg-gray-800" />
							</div>
						</div>
						<div className="border border-white/10 bg-black/80 p-3 text-[10px] text-[#ff003c] leading-tight shadow-inner">
							<div className="flex items-center justify-between mb-2 border-b border-[#ff003c]/30 pb-1">
								<span className="animate-pulse">SCANNING...</span> <FiTarget />
							</div>
							<div className="opacity-70 space-y-1 break-all text-gray-400">
								<p>UA: {sysInfo.ua.substring(0, 20)}...</p>
								<p>RES: {sysInfo.res}</p>
								<p>CORE: {sysInfo.cores}</p>
								<p>JUICE: {sysInfo.battery}</p>
							</div>
						</div>
						<div className="flex-grow overflow-hidden relative">
							<p className="text-[9px] text-gray-500 tracking-widest uppercase mb-2">
								Memory_Dump
							</p>
							<div className="text-[10px] text-gray-600 space-y-1 font-mono">
								{hexStream.map((hex, i) => (
									<div key={i} className="flex justify-between opacity-60">
										<span>0x{i}F</span>
										<span>{hex}</span>
									</div>
								))}
							</div>
							<div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent" />
						</div>
					</div>
				</div>

				<div className="flex-1 flex flex-col relative bg-transparent">
					<div className="h-auto min-h-[4rem] border-b border-white/10 p-4 text-[10px] text-gray-400 bg-black/40 backdrop-blur-sm font-mono">
						<div className="flex flex-col justify-end h-full gap-1">
							{output.map((line, i) => (
								<p
									key={i}
									className="uppercase tracking-wider flex items-center gap-2 break-all"
								>
									<span className={accentColor}>{">"}</span>
									<span
										className={
											i === output.length - 1
												? "text-white animate-pulse"
												: "text-gray-500"
										}
									>
										{line}
									</span>
								</p>
							))}
							<div ref={outputEndRef} />
						</div>
					</div>

					{view === "auth" ? (
						<div className="flex-grow flex items-center justify-center p-6 animate-fade-in">
							<form
								onSubmit={handleSignup}
								className="w-full max-w-md space-y-8"
							>
								<div>
									<div className="flex gap-4 mb-6">
										<button
											type="button"
											onClick={() => setAuthMode("signup")}
											className={`text-xs uppercase tracking-widest pb-1 border-b-2 ${authMode === "signup" ? "text-white border-[#ff003c]" : "text-gray-600 border-transparent"}`}
										>
											New Identity
										</button>
										<button
											type="button"
											onClick={() => setAuthMode("login")}
											className={`text-xs uppercase tracking-widest pb-1 border-b-2 ${authMode === "login" ? "text-white border-[#ff003c]" : "text-gray-600 border-transparent"}`}
										>
											Existing Hash
										</button>
									</div>
									<h2 className="text-3xl lg:text-5xl font-black text-white mb-2 tracking-tighter">
										{authMode === "signup" ? "INITIALIZE" : "RECONNECT"}
									</h2>
									<p className="text-gray-500 text-xs uppercase tracking-widest">
										{authMode === "signup"
											? "Generate new secure credentials"
											: "Enter your unique identity hash"}
									</p>
								</div>

								<div className="space-y-6">
									{authMode === "signup" ? (
										<>
											<input
												type="text"
												name="username"
												placeholder="Alias / ID"
												value={authForm.username}
												onChange={handleAuthChange}
												required
												className="w-full bg-transparent border-b border-white/20 py-3 text-xl font-medium text-white placeholder-gray-700 focus:outline-none focus:border-[#ff003c] transition-all"
											/>
											<input
												type="email"
												name="email"
												placeholder="Secure Comms (Email)"
												value={authForm.email}
												onChange={handleAuthChange}
												required
												className="w-full bg-transparent border-b border-white/20 py-3 text-xl font-medium text-white placeholder-gray-700 focus:outline-none focus:border-[#ff003c] transition-all"
											/>
											<input
												type="password"
												name="password"
												placeholder="Access Key"
												value={authForm.password}
												onChange={handleAuthChange}
												required
												className="w-full bg-transparent border-b border-white/20 py-3 text-xl font-medium text-white placeholder-gray-700 focus:outline-none focus:border-[#ff003c] transition-all"
											/>
										</>
									) : (
										<input
											type="text"
											name="hash"
											placeholder="Enter User Hash (e.g. 1A2B3C...)"
											value={authForm.hash}
											onChange={handleAuthChange}
											required
											className="w-full bg-transparent border-b border-white/20 py-3 text-xl font-medium text-white placeholder-gray-700 focus:outline-none focus:border-[#ff003c] transition-all"
										/>
									)}
								</div>

								<button
									type="submit"
									disabled={isLoading}
									className={`w-full ${accentBg} text-black py-4 font-black uppercase text-sm tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3`}
								>
									{isLoading ? (
										<span className="animate-pulse">Handshaking...</span>
									) : (
										"Establish Link"
									)}{" "}
									<FiArrowRight />
								</button>
							</form>
						</div>
					) : (
						<div className="flex-grow flex flex-col overflow-hidden animate-fade-in">
							<div className="flex border-b border-white/10 bg-white/5">
								<button
									type="button"
									onClick={() => setActiveTab("OPS")}
									className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors ${activeTab === "OPS" ? `${accentColor} border-b-2 border-[#ff003c]` : "text-gray-500"}`}
								>
									<FiTarget size={14} /> Operations
								</button>

								<button
									type="button"
									onClick={() => setActiveTab("UPLINK")}
									className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors ${activeTab === "UPLINK" ? `${accentColor} border-b-2 border-[#ff003c]` : "text-gray-500"}`}
								>
									<FiMessageSquare size={14} /> Uplink
								</button>

								<button
									type="button"
									onClick={() => setActiveTab("ALLOCATION")}
									className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors ${activeTab === "ALLOCATION" ? `${accentColor} border-b-2 border-[#ff003c]` : "text-gray-500"}`}
								>
									<FiDollarSign size={14} /> Allocation
								</button>
							</div>

							<div className="flex-grow overflow-y-auto p-6 custom-scrollbar relative">
								{activeTab === "OPS" && (
									<div className="max-w-4xl mx-auto space-y-8">
										<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
											<div>
												<h3 className="text-2xl font-bold text-white uppercase tracking-tight">
													Selective Outcome Engineering
												</h3>
												<p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
													Carefully place a hitjob
												</p>
											</div>
										</div>

										<div className="grid md:grid-cols-2 gap-6">
											<div className="bg-white/5 border border-white/10 p-6">
												<h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2">
													<FiList /> Create Contract
												</h4>
												<form
													onSubmit={handleCreateMission}
													className="space-y-4"
												>
													<div className="relative">
														<FiMapPin className="absolute left-3 top-3.5 text-gray-500" />
														<input
															type="text"
															placeholder="TARGET LOCATION"
															value={missionForm.location}
															onChange={(e) =>
																setMissionForm({
																	...missionForm,
																	location: e.target.value,
																})
															}
															className="w-full bg-black/50 border border-white/20 p-3 pl-10 text-sm text-white placeholder-gray-600 focus:border-[#ff003c] focus:outline-none"
															required
														/>
													</div>
													<div className="grid grid-cols-2 gap-4">
														<input
															type="date"
															value={missionForm.date}
															onChange={(e) =>
																setMissionForm({
																	...missionForm,
																	date: e.target.value,
																})
															}
															className="w-full bg-black/50 border border-white/20 p-3 text-sm text-white placeholder-gray-600 focus:border-[#ff003c] focus:outline-none"
															required
														/>
														<input
															type="time"
															value={missionForm.time}
															onChange={(e) =>
																setMissionForm({
																	...missionForm,
																	time: e.target.value,
																})
															}
															className="w-full bg-black/50 border border-white/20 p-3 text-sm text-white placeholder-gray-600 focus:border-[#ff003c] focus:outline-none"
															required
														/>
													</div>
													<button
														type="submit"
														className={`w-full ${accentBg} text-black py-3 text-xs font-black uppercase tracking-widest hover:bg-white transition-colors`}
													>
														Broadcast Contract
													</button>
												</form>
											</div>

											<div className="space-y-3">
												{missions.length === 0 && (
													<div className="border border-white/10 p-4 text-center text-gray-600 text-xs uppercase tracking-widest">
														No Active Operations
													</div>
												)}
												{missions.map((m) => (
													<div
														key={m.mission_id}
														className="border border-white/10 bg-black/40 p-4 flex justify-between items-center hover:border-[#ff003c]/50 transition-colors"
													>
														<div>
															<div className="flex items-center gap-2">
																<span
																	className={`${accentColor} font-bold text-xs`}
																>
																	{m.mission_id}
																</span>
																<span className="text-[10px] bg-white/10 px-1 text-gray-400">
																	{m.status}
																</span>
															</div>
															<p className="text-xs text-gray-500 mt-1">
																{m.location}
															</p>
														</div>
														<div className="text-right">
															<p className="text-[10px] text-gray-600">
																{m.date} {m.time}
															</p>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								)}

								{activeTab === "UPLINK" && (
									<div className="h-full flex flex-col md:flex-row max-w-6xl mx-auto gap-4 md:h-[60vh]">
										<div className="w-full md:w-1/3 bg-white/5 border border-white/10 flex flex-col">
											<div className="p-3 border-b border-white/10 flex justify-between items-center">
												<span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
													Encrypted Channels
												</span>
												<FiRefreshCw className="text-gray-600" size={12} />
											</div>
											<div className="flex-grow overflow-y-auto p-2 space-y-2">
												{conversations.map((conv) => (
													<button
														type="button"
														key={conv.participant_hash}
														onClick={() =>
															setActiveConversation(conv.participant_hash)
														}
														className={`w-full text-left p-3 border transition-colors ${activeConversation === conv.participant_hash ? "border-[#ff003c] bg-[#ff003c]/10" : "border-white/5 hover:border-white/20"}`}
													>
														<div className="flex justify-between items-center mb-1">
															<span className="text-xs font-bold text-gray-300 truncate w-24">
																{conv.participant_hash.substring(0, 8)}...
															</span>
															{conv.unread_count > 0 && (
																<span className="bg-[#ff003c] text-black text-[9px] px-1 font-bold">
																	{conv.unread_count}
																</span>
															)}
														</div>
														<p className="text-[10px] text-gray-500 truncate">
															{conv.last_message}
														</p>
													</button>
												))}
												{conversations.length === 0 && (
													<p className="text-[10px] text-gray-600 text-center mt-4">
														NO ACTIVE LINKS
													</p>
												)}
											</div>
											<div className="p-3 border-t border-white/10">
												<div className="flex gap-2">
													<input
														className="w-full bg-black border border-white/10 p-2 text-[10px] text-white focus:border-[#ff003c] outline-none"
														placeholder="ENTER TARGET HASH"
														value={newWorkerHash}
														onChange={(e) => setNewWorkerHash(e.target.value)}
													/>

													<button
														type="button"
														onClick={startNewChat}
														className="bg-white/10 px-3 hover:bg-white hover:text-black text-white text-xs"
													>
														<FiHash />
													</button>
												</div>
											</div>
										</div>

										<div className="w-full md:w-2/3 bg-black/20 border border-white/10 flex flex-col relative">
											{!activeConversation ? (
												<div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs uppercase tracking-widest">
													Select a frequency to transmit
												</div>
											) : (
												<>
													<div className="p-3 border-b border-white/10 bg-black/40 flex justify-between items-center">
														<span className="text-xs text-[#ff003c]">
															LINKED: {activeConversation}
														</span>
														<div className="flex items-center gap-2 text-[10px] text-gray-500">
															<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />{" "}
															LIVE
														</div>
													</div>
													<div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
														{messages.map((msg) => {
															const isMe = msg.from_hash === userHash;
															return (
																<div
																	key={msg.id}
																	className={`flex ${isMe ? "justify-end" : "justify-start"}`}
																>
																	<div
																		className={`max-w-[80%] p-3 border ${isMe ? "border-[#ff003c]/30 bg-[#ff003c]/10" : "border-white/10 bg-white/5"}`}
																	>
																		<div className="flex items-center gap-2 mb-1">
																			<span
																				className={`text-[9px] font-bold uppercase tracking-widest ${isMe ? accentColor : "text-amber-400"}`}
																			>
																				{isMe ? "HQ" : "AGENT"}
																			</span>
																			<span className="text-[8px] text-gray-600">
																				{new Date(
																					msg.created_at,
																				).toLocaleTimeString()}
																			</span>
																		</div>
																		<p className="text-xs md:text-sm text-gray-200 font-mono leading-relaxed break-words">
																			{msg.content}
																		</p>
																	</div>
																</div>
															);
														})}
														<div ref={chatEndRef} />
													</div>
													<form
														onSubmit={handleSendMessage}
														className="flex gap-0 border-t border-white/10 bg-black/40"
													>
														<input
															type="text"
															value={chatInput}
															onChange={(e) => setChatInput(e.target.value)}
															placeholder="TRANSMIT DATA PACKET..."
															className="flex-grow bg-transparent p-4 text-sm text-white placeholder-gray-600 focus:outline-none font-mono"
														/>
														<button
															type="submit"
															className="px-6 bg-white/5 border-l border-white/10 hover:bg-[#ff003c] hover:text-black transition-colors"
														>
															<FiSend />
														</button>
													</form>
												</>
											)}
										</div>
									</div>
								)}

								{activeTab === "ALLOCATION" && (
									<div className="max-w-2xl mx-auto pt-8">
										<div className="text-center mb-10">
											<h3 className="text-3xl font-black text-white uppercase tracking-tighter">
												Money Allocation
											</h3>
											<p className="text-xs text-gray-500 uppercase tracking-widest mt-2">
												Secure resources via high-risk contracts
											</p>
										</div>

										<form
											onSubmit={handleCreateGambling}
											className="border border-white/10 p-8 bg-white/5 space-y-6 relative overflow-hidden"
										>
											<div className="absolute top-0 right-0 p-2 bg-[#ff003c] text-black text-[10px] font-bold uppercase tracking-widest">
												Gambling Market
											</div>

											<div className="grid md:grid-cols-2 gap-6">
												<div className="space-y-2">
													{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
													<label className="text-[10px] text-gray-500 uppercase tracking-widest">
														Venue
													</label>
													<input
														type="text"
														value={allocForm.venue}
														onChange={(e) =>
															setAllocForm({
																...allocForm,
																venue: e.target.value,
															})
														}
														className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff003c] outline-none"
														placeholder="e.g. Casino Royale"
														required
													/>
												</div>
												<div className="space-y-2">
													{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
													<label className="text-[10px] text-gray-500 uppercase tracking-widest">
														Game Type
													</label>
													<select
														value={allocForm.game_type}
														onChange={(e) =>
															setAllocForm({
																...allocForm,
																game_type: e.target.value,
															})
														}
														className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff003c] outline-none"
													>
														<option value="Texas Hold'em">Texas Hold'em</option>
														<option value="Blackjack">Blackjack</option>
														<option value="Roulette">Roulette</option>
													</select>
												</div>
											</div>

											<div className="grid md:grid-cols-2 gap-6">
												<div className="space-y-2">
													{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
													<label className="text-[10px] text-gray-500 uppercase tracking-widest">
														Buy In
													</label>
													<div className="relative">
														<FiDollarSign
															className="absolute left-3 top-3.5 text-gray-500"
															size={14}
														/>
														<input
															type="text"
															value={allocForm.buy_in}
															onChange={(e) =>
																setAllocForm({
																	...allocForm,
																	buy_in: e.target.value,
																})
															}
															className="w-full bg-black border border-white/20 p-3 pl-8 text-white focus:border-[#ff003c] outline-none"
															placeholder="Amount"
															required
														/>
													</div>
												</div>
												<div className="space-y-2">
													{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
													<label className="text-[10px] text-gray-500 uppercase tracking-widest">
														Currency
													</label>
													<select
														value={allocForm.payment_type}
														onChange={(e) =>
															setAllocForm({
																...allocForm,
																payment_type: e.target.value,
															})
														}
														className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff003c] outline-none"
													>
														<option value="gold_coins">Gold Coins</option>
														<option value="gems">Gems</option>
														<option value="credits">Credits</option>
													</select>
												</div>
											</div>

											<div className="grid md:grid-cols-3 gap-4">
												<div className="space-y-2">
													{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
													<label className="text-[10px] text-gray-500 uppercase tracking-widest">
														Date
													</label>
													<input
														type="date"
														value={allocForm.date}
														onChange={(e) =>
															setAllocForm({
																...allocForm,
																date: e.target.value,
															})
														}
														className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff003c] outline-none"
														required
													/>
												</div>
												<div className="space-y-2">
													{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
													<label className="text-[10px] text-gray-500 uppercase tracking-widest">
														Time
													</label>
													<input
														type="time"
														value={allocForm.start_time}
														onChange={(e) =>
															setAllocForm({
																...allocForm,
																start_time: e.target.value,
															})
														}
														className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff003c] outline-none"
														required
													/>
												</div>
												<div className="space-y-2">
													{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
													<label className="text-[10px] text-gray-500 uppercase tracking-widest">
														Duration
													</label>
													<input
														type="text"
														placeholder="e.g. 2h"
														value={allocForm.duration}
														onChange={(e) =>
															setAllocForm({
																...allocForm,
																duration: e.target.value,
															})
														}
														className="w-full bg-black border border-white/20 p-3 text-white focus:border-[#ff003c] outline-none"
														required
													/>
												</div>
											</div>

											<button
												type="submit"
												className="w-full bg-white text-black py-4 font-black uppercase text-sm tracking-widest hover:bg-[#ff003c] hover:text-white transition-all flex justify-center items-center gap-2"
											>
												Confirm Allocation
											</button>
										</form>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="relative z-20 border-t border-white/10 py-2 px-4 flex justify-between items-center bg-[#030303] shrink-0">
				<div className="flex gap-6 text-[9px] text-gray-600 uppercase tracking-widest">
					<span className="flex items-center gap-1">
						<div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />{" "}
						ONLINE
					</span>
					<span className="hidden md:inline">
						LATENCY: {Math.floor(Math.random() * 20) + 10}ms
					</span>
					<span className="hidden md:inline">ENCRYPTION: 256-BIT AES</span>
				</div>
				<div className="text-[9px] text-[#ff003c] opacity-50">
					NMIPC_SECURE_GATEWAY_V3.1.0
				</div>
			</div>
		</div>
	);
};

export default Backdoor;
