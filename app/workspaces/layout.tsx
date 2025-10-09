export default function AuthLayout({children}: {children: React.ReactNode}) {
	return (
		<div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
			{/* Left side with oversized Taskly wordmark */}
			<div className="flex items-center justify-center bg-[#f9f6f2]">
				<div className="flex flex-col items-center">
					<div className="flex items-center gap-8">
						{/* Pastel check icon in a rounded box */}
						<div className="flex items-center justify-center w-24 h-24 rounded-3xl border-2 border-[#9ec8ff]">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={3}
								stroke="#f4b8a4"
								className="w-12 h-12"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						</div>

						{/* MASSIVE Taskly word */}
						<h1
							className="font-extrabold tracking-tight text-[#9ec8ff] font-sans"
							style={{ fontSize: 'clamp(4rem, 12vw, 14rem)', lineHeight: 1 }}
						>
							Taskly
						</h1>
					</div>

					<p className="text-lg mt-6 text-[#b8b8b8] tracking-wide">
						Organize. Collaborate. Create.
					</p>
				</div>
			</div>

			{/* Right side with auth form */}
			<div className="flex items-center justify-center p-6">
				<div className="w-full max-w-md border border-[#f1ebe4] rounded-2xl shadow-sm p-6 bg-white">
					{children}
				</div>
			</div>
		</div>
	);
}
