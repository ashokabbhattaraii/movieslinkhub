export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { box: "h-7 w-7", icon: "h-3.5 w-3.5", text: "text-sm", ring: "" },
    md: { box: "h-10 w-10", icon: "h-5 w-5", text: "text-xl", ring: "ring-2 ring-purple-500/20 ring-offset-2 ring-offset-[#08080f]" },
    lg: { box: "h-12 w-12", icon: "h-6 w-6", text: "text-2xl", ring: "ring-2 ring-purple-500/20 ring-offset-2 ring-offset-[#08080f]" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {size !== "sm" && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 blur-lg opacity-40" />
        )}
        <div className={`relative ${s.box} ${s.ring} flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-blue-600 shadow-xl shadow-purple-500/20`}>
          {/* Film reel + play icon */}
          <svg className={`${s.icon} text-white`} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.4" />
            <path d="M9.5 8.5L16 12L9.5 15.5V8.5Z" fill="currentColor" />
          </svg>
        </div>
      </div>
      <span className={`${s.text} font-bold tracking-tight text-white`}>
        Movies<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Link</span>Hub
      </span>
    </div>
  );
}

export function LogoIcon({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { box: "h-7 w-7", icon: "h-3.5 w-3.5" },
    md: { box: "h-9 w-9", icon: "h-4.5 w-4.5" },
    lg: { box: "h-12 w-12", icon: "h-6 w-6" },
  };

  const s = sizes[size];

  return (
    <div className={`${s.box} flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-blue-600 shadow-lg shadow-purple-500/20`}>
      <svg className={`${s.icon} text-white`} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.4" />
        <path d="M9.5 8.5L16 12L9.5 15.5V8.5Z" fill="currentColor" />
      </svg>
    </div>
  );
}
