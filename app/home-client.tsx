"use client";

import { useState } from "react";
import { Logo, LogoIcon } from "./components/logo";

interface Site {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  status: "online" | "offline" | "unknown";
  featured: boolean;
  rating: number;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <svg
              key={star}
              className={`h-3.5 w-3.5 ${filled ? "text-amber-400" : half ? "text-amber-400" : "text-zinc-700"}`}
              fill={filled || half ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={filled || half ? 0 : 1.5}
            >
              {half ? (
                <>
                  <defs>
                    <linearGradient id={`half-${star}`}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#half-${star})`}
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              )}
            </svg>
          );
        })}
      </div>
      <span className="text-xs text-zinc-500">{rating.toFixed(1)}</span>
    </div>
  );
}

const categoryMeta: Record<string, { icon: string }> = {
  "All": { icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
  "All-in-One": { icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" },
  "Movies & TV": { icon: "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125M12 16.875c0-.621.504-1.125 1.125-1.125" },
  "Anime": { icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" },
  "Asian Drama": { icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" },
  "TV Shows": { icon: "M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" },
};

export default function HomeClient({ sites }: { sites: Site[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", ...Array.from(new Set(sites.map((s) => s.category)))];
  const featuredSites = sites.filter((s) => s.featured);

  const filteredSites = sites.filter((site) => {
    const matchesCategory = activeCategory === "All" || site.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#08080f] relative overflow-hidden">
      {/* === BACKGROUND LAYERS === */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Primary gradient orbs */}
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-purple-900/20 via-violet-800/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute top-[40%] -left-[200px] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] -right-[200px] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />

        {/* Subtle noise texture via dot grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top edge glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </div>

      {/* === NAVIGATION === */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Logo size="md" />

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/30 px-3.5 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-emerald-300">{sites.length} Sites Live</span>
          </div>
        </div>
      </nav>

      {/* === HERO === */}
      <header className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-16 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 backdrop-blur-md">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20">
            <svg className="h-3 w-3 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <span className="text-sm text-zinc-300">Curated &amp; Updated Weekly</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]">
          <span className="text-white">Stream </span>
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-blue-300 bg-clip-text text-transparent">
              Anything
            </span>
            <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5.5C47 2 153 2 199 5.5" stroke="url(#underline-grad)" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a855f7" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#a855f7" />
                  <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="text-white"> Free</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-zinc-400">
          The ultimate curated directory of free streaming sites. Movies, TV shows, anime,
          and Asian dramas — all in one place. No signup required.
        </p>

        {/* Search Bar */}
        <div className="mx-auto mt-10 max-w-md relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-50" />
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sites..."
              className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] pl-12 pr-4 py-4 text-sm text-white placeholder-zinc-500 outline-none backdrop-blur-sm transition-all focus:border-purple-500/30 focus:bg-white/[0.06] focus:shadow-lg focus:shadow-purple-500/5"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const icon = categoryMeta[cat]?.icon;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 backdrop-blur-sm cursor-pointer border ${
                  isActive
                    ? "border-purple-500/40 bg-purple-500/[0.12] text-white shadow-lg shadow-purple-500/10"
                    : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-zinc-200"
                }`}
              >
                {icon && (
                  <svg className={`h-4 w-4 ${isActive ? "text-purple-300" : "text-zinc-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                )}
                {cat}
              </button>
            );
          })}
        </div>
      </header>

      {/* === FEATURED SECTION === */}
      {activeCategory === "All" && featuredSites.length > 0 && searchQuery === "" && (
        <section className="relative z-10 mx-auto max-w-7xl px-6 mb-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
              <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-white">Featured Picks</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSites.map((site) => (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-3xl border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.05] via-transparent to-orange-500/[0.03] p-7 transition-all duration-500 hover:border-amber-400/30 hover:shadow-2xl hover:shadow-amber-500/[0.1] hover:-translate-y-1"
              >
                <div className="absolute top-5 right-5">
                  <svg className="h-5 w-5 text-amber-400/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20">
                    <span className="text-xl font-bold text-amber-300">{site.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-amber-200 transition-colors">{site.name}</h3>
                    <span className="text-[11px] text-amber-500/60 font-medium uppercase tracking-wider">{site.category}</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors mb-4 leading-relaxed">{site.description}</p>
                <div className="mb-5">
                  <StarRating rating={site.rating} />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-amber-500/10">
                  <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors truncate max-w-[200px]">
                    {site.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </span>
                  <svg className="h-5 w-5 text-zinc-700 group-hover:text-amber-400 transition-all group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* === MAIN GRID === */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white">
            {activeCategory === "All" ? "All Sites" : activeCategory}
          </h2>
          <span className="text-xs text-zinc-600">
            {filteredSites.length} {filteredSites.length === 1 ? "site" : "sites"}
          </span>
        </div>

        {filteredSites.length === 0 ? (
          <div className="py-20 text-center">
            <svg className="mx-auto h-12 w-12 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="mt-4 text-sm text-zinc-600">No sites found</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSites.map((site) => (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7 transition-all duration-500 hover:border-purple-500/25 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-purple-500/[0.08] hover:-translate-y-1"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/[0.06] to-blue-500/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  {/* Icon + Status */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] group-hover:border-purple-500/25 group-hover:from-purple-500/[0.12] group-hover:to-blue-500/[0.06] transition-all duration-500">
                      <span className="text-xl font-bold text-zinc-300 group-hover:text-purple-200 transition-colors">{site.name[0]}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      Live
                    </span>
                  </div>

                  {/* Name + Description */}
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-100 transition-colors">
                    {site.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors leading-relaxed">
                    {site.description}
                  </p>

                  <div className="mt-3">
                    <StarRating rating={site.rating} />
                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/[0.05]">
                    <span className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-1 text-[11px] font-medium text-zinc-400 uppercase tracking-wider group-hover:border-purple-500/20 group-hover:text-zinc-300 transition-colors">
                      {site.category}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-zinc-600 group-hover:text-purple-300 transition-colors">
                      <span className="truncate max-w-[130px]">
                        {site.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </span>
                      <svg className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* === FOOTER === */}
      <footer className="relative z-10 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-center gap-4">
            <Logo size="sm" />
            <p className="text-center text-sm text-zinc-600 max-w-md">
              For educational purposes only. We do not host or stream any content.
              Use an adblocker &amp; VPN for the safest experience.
            </p>
            <div className="flex items-center gap-6 mt-2">
              <span className="text-xs text-zinc-700">© 2025 MoviesLinkHub</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
