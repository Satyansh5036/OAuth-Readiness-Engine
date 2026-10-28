"use client";

import { useState } from "react";
import { Search, Clock, AlertTriangle, CheckCircle2, User, Bot, ShieldAlert, BookOpen, AlertCircle } from "lucide-react";
import { seedGuides } from "@/data/seed-guides";
import { OAuthGuide } from "@/lib/schema";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [useCase, setUseCase] = useState("Standard AI Agent Integration");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeGuide, setActiveGuide] = useState<OAuthGuide | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setActiveGuide(null);

    try {
      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appNameOrUrl: query, intendedUseCase: useCase }),
      });

      if (!res.ok) throw new Error("Failed to generate guide. Check backend logs.");

      const data: OAuthGuide = await res.json();
      setActiveGuide(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const loadSeed = (key: string) => {
    setError("");
    setActiveGuide(seedGuides[key]);
  };

  const frictionColors = {
    Low: "bg-green-100 text-green-800 border-green-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    High: "bg-orange-100 text-orange-800 border-orange-200",
    Extreme: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header & Search */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">OAuth Readiness Engine</h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Investigate developer setups, hidden approval timelines, and scope requirements before committing to an integration.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <input
              type="text"
              placeholder="App Name or URL (e.g., Linear, gusto.com)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Use Case (e.g., Sync contacts)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Investigating..." : <><Search size={18} /> Audit App</>}
            </button>
          </form>

          {/* Quick Links */}
          <div className="flex gap-2 text-sm items-center">
            <span className="text-gray-500 font-medium">Verified Library:</span>
            {Object.keys(seedGuides).map((key) => (
              <button
                key={key}
                onClick={() => loadSeed(key)}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition shadow-sm"
              >
                {seedGuides[key].provider_name}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex gap-2 items-center">
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        {/* Dashboard View */}
        {activeGuide && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            {/* Header section */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">{activeGuide.provider_name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${frictionColors[activeGuide.overall_friction_score as keyof typeof frictionColors]}`}>
                  Friction: {activeGuide.overall_friction_score}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-0">

              {/* Left Column: Timelines & Gotchas */}
              <div className="p-6 md:p-8 border-r border-gray-100 space-y-8">

                <section>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Clock size={20} className="text-blue-500" /> Integration Timelines</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-1">Sandbox / Local Dev</p>
                      <p className="text-gray-900 font-medium">{activeGuide.timelines.sandbox_dev_time}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <p className="text-sm text-purple-600 font-semibold uppercase tracking-wider mb-1">Production Approval</p>
                      <p className="text-gray-900 font-medium">{activeGuide.timelines.production_approval_wait}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><ShieldAlert size={20} className="text-orange-500" /> Prerequisites & Gotchas</h3>
                  <ul className="space-y-2">
                    {activeGuide.prerequisites_and_gotchas.map((item, i) => (
                      <li key={i} className="flex gap-2 text-gray-700 items-start">
                        <AlertCircle size={16} className="text-orange-400 mt-1 shrink-0" />
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

              </div>

              {/* Right Column: Execution */}
              <div className="p-6 md:p-8 space-y-8 bg-gray-50">

                <section>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><CheckCircle2 size={20} className="text-emerald-500" /> Execution Handoff</h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-sm text-gray-500 flex items-center gap-2 mb-3 uppercase"><Bot size={16} /> Agent Co-Pilot Can Automate</h4>
                      <ul className="space-y-2">
                        {activeGuide.handoff_matrix.agent_can_automate.map((item, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-sm text-gray-500 flex items-center gap-2 mb-3 uppercase"><User size={16} /> Human Developer Required</h4>
                      <ul className="space-y-2">
                        {activeGuide.handoff_matrix.human_must_do.map((item, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-blue-500 font-bold">→</span> {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><BookOpen size={20} className="text-gray-600" /> Evidence Audit</h3>
                  <div className="text-sm space-y-3">
                    <div className="flex gap-2"><span className="font-semibold text-gray-900 w-24 shrink-0">Tested Live:</span> <span className="text-gray-600">{activeGuide.evidence_audit.tested_live.join(", ")}</span></div>
                    <div className="flex gap-2"><span className="font-semibold text-gray-900 w-24 shrink-0">Docs Cited:</span> <span className="text-gray-600">{activeGuide.evidence_audit.doc_supported.join(", ")}</span></div>
                    <div className="flex gap-2"><span className="font-semibold text-orange-600 w-24 shrink-0">Unverified:</span> <span className="text-orange-700 bg-orange-100 px-2 py-0.5 rounded">{activeGuide.evidence_audit.uncertain_unverified.join(", ")}</span></div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}