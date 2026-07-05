"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { LogoIcon } from "../components/logo";

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

const CATEGORIES = ["Movies & TV", "Anime", "Asian Drama", "TV Shows", "All-in-One", "Sports", "Documentary"];

export default function AdminDashboard() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchSites = useCallback(async () => {
    const res = await fetch("/api/sites");
    const data = await res.json();
    setSites(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/sites/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSites(sites.filter((s) => s.id !== id));
      showToast("Site deleted successfully", "success");
    } else {
      showToast("Failed to delete site", "error");
    }
    setDeleteConfirm(null);
  }

  async function handleToggleStatus(site: Site) {
    const newStatus = site.status === "online" ? "offline" : "online";
    const res = await fetch(`/api/sites/${site.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setSites(sites.map((s) => (s.id === site.id ? { ...s, status: newStatus } : s)));
      showToast(`${site.name} marked as ${newStatus}`, "success");
    }
  }

  async function handleToggleFeatured(site: Site) {
    const res = await fetch(`/api/sites/${site.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !site.featured }),
    });
    if (res.ok) {
      setSites(sites.map((s) => (s.id === site.id ? { ...s, featured: !s.featured } : s)));
      showToast(`${site.name} ${!site.featured ? "featured" : "unfeatured"}`, "success");
    }
  }

  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(search.toLowerCase()) ||
      site.url.toLowerCase().includes(search.toLowerCase()) ||
      site.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "All" || site.category === filterCategory;
    const matchesStatus = filterStatus === "All" || site.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: sites.length,
    online: sites.filter((s) => s.status === "online").length,
    offline: sites.filter((s) => s.status === "offline").length,
    featured: sites.filter((s) => s.featured).length,
    categories: [...new Set(sites.map((s) => s.category))].length,
  };

  return (
    <div className="min-h-screen bg-[#06060b] relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-blue-600/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-sm transition-all ${
          toast.type === "success"
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            : "border-red-500/20 bg-red-500/10 text-red-400"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="relative border-b border-white/[0.06] sticky top-0 z-40 bg-[#06060b]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <LogoIcon size="sm" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Admin Panel</span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 font-medium">
                SUPER ADMIN
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-white"
            >
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400 transition-all hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1400px] px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Total Sites", value: stats.total, color: "purple" },
            { label: "Online", value: stats.online, color: "emerald" },
            { label: "Offline", value: stats.offline, color: "red" },
            { label: "Featured", value: stats.featured, color: "amber" },
            { label: "Categories", value: stats.categories, color: "blue" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search sites by name, URL, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-purple-500/40"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-purple-500/40 appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-purple-500/40 appearance-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>

          {/* Add Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:from-purple-500 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-500/20 whitespace-nowrap"
          >
            + Add Site
          </button>
        </div>

        {/* Results Count */}
        <p className="text-xs text-zinc-600 mb-4">
          Showing {filteredSites.length} of {sites.length} sites
        </p>

        {/* Sites Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Site</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Featured</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredSites.map((site) => (
                    <tr key={site.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-white">{site.name}</p>
                          <p className="text-xs text-zinc-600 truncate max-w-[250px]">{site.url}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-xs text-zinc-400">
                          {site.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-amber-400 font-medium">{site.rating.toFixed(1)}</span>
                        <span className="text-xs text-zinc-600">/5</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(site)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer ${
                            site.status === "online"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${site.status === "online" ? "bg-emerald-400" : "bg-red-400"}`} />
                          {site.status}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleFeatured(site)}
                          className={`text-lg transition-transform hover:scale-110 ${site.featured ? "" : "opacity-30 grayscale"}`}
                          title={site.featured ? "Remove from featured" : "Add to featured"}
                        >
                          ★
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md p-1.5 text-zinc-600 hover:bg-white/[0.06] hover:text-white transition-colors"
                            title="Visit"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </a>
                          <button
                            onClick={() => setEditingSite(site)}
                            className="rounded-md p-1.5 text-zinc-600 hover:bg-white/[0.06] hover:text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(site.id)}
                            className="rounded-md p-1.5 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredSites.length === 0 && (
              <div className="py-12 text-center text-sm text-zinc-600">
                No sites found matching your criteria.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {(showAddModal || editingSite) && (
        <SiteModal
          site={editingSite}
          onClose={() => {
            setShowAddModal(false);
            setEditingSite(null);
          }}
          onSave={async (data) => {
            if (editingSite) {
              const res = await fetch(`/api/sites/${editingSite.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              if (res.ok) {
                const updated = await res.json();
                setSites(sites.map((s) => (s.id === editingSite.id ? updated : s)));
                showToast("Site updated successfully", "success");
              } else {
                showToast("Failed to update site", "error");
              }
            } else {
              const res = await fetch("/api/sites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              if (res.ok) {
                const newSite = await res.json();
                setSites([...sites, newSite]);
                showToast("Site added successfully", "success");
              } else {
                showToast("Failed to add site", "error");
              }
            }
            setShowAddModal(false);
            setEditingSite(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Delete Site</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Are you sure you want to delete this site? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 hover:bg-white/[0.06] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SiteModal({
  site,
  onClose,
  onSave,
}: {
  site: Site | null;
  onClose: () => void;
  onSave: (data: Partial<Site>) => void;
}) {
  const [name, setName] = useState(site?.name || "");
  const [url, setUrl] = useState(site?.url || "");
  const [description, setDescription] = useState(site?.description || "");
  const [category, setCategory] = useState(site?.category || CATEGORIES[0]);
  const [status, setStatus] = useState<"online" | "offline">(site?.status === "offline" ? "offline" : "online");
  const [featured, setFeatured] = useState(site?.featured || false);
  const [rating, setRating] = useState(site?.rating ?? 4.0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ name, url, description, category, status, featured, rating });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {site ? "Edit Site" : "Add New Site"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Site Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. FMovies"
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-purple-500/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://example.com/"
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-purple-500/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Short description of the site"
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-purple-500/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-300 outline-none focus:border-purple-500/40 appearance-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "online" | "offline")}
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-300 outline-none focus:border-purple-500/40 appearance-none"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(Math.min(5, Math.max(1, parseFloat(e.target.value) || 1)))}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-purple-500/40"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFeatured(!featured)}
              className={`relative h-5 w-9 rounded-full transition-colors ${featured ? "bg-purple-600" : "bg-zinc-700"}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${featured ? "translate-x-4" : ""}`} />
            </button>
            <span className="text-sm text-zinc-400">Featured site</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.06] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:from-purple-500 hover:to-blue-500 transition-all"
            >
              {site ? "Save Changes" : "Add Site"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
