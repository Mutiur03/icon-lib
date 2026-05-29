"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function QuickStart() {
  const [activeTab, setActiveTab] = useState<"markdown" | "html" | "react">("markdown");
  const [copied, setCopied] = useState(false);

  const snippets = {
    markdown: `![JavaScript](https://icon-lib-nu.vercel.app/api/icons/javascript)\n![React](https://icon-lib-nu.vercel.app/api/icons/react?theme=dark)`,
    html: `<img src="https://icon-lib-nu.vercel.app/api/icons/javascript" width="48" height="48" alt="JS" />\n<img src="https://icon-lib-nu.vercel.app/api/icons/react?theme=dark" width="48" height="48" alt="React" />`,
    react: `import Image from "next/image";\n\nexport function TechList() {\n  return (\n    <div className="flex gap-4">\n      <img src="https://icon-lib-nu.vercel.app/api/icons/javascript" alt="JS" className="w-12 h-12" />\n      <img src="https://icon-lib-nu.vercel.app/api/icons/react?theme=dark" alt="React" className="w-12 h-12" />\n    </div>\n  );\n}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 border-t border-slate-800 mt-12" aria-labelledby="quickstart-heading">
      <div className="max-w-3xl">
        <span className="text-sm font-semibold uppercase tracking-wide text-emerald-300 block mb-2">Developer Guide</span>
        <h2 id="quickstart-heading" className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-4">
          Quick Integration
        </h2>
        <p className="text-slate-400 text-base mb-6">
          Use these same-domain icons directly in your GitHub README, portfolio project, or website. The proxy serves theme-aware SVGs dynamically.
        </p>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md overflow-hidden shadow-lg">
          {/* Tab bar */}
          <div className="flex justify-between items-center bg-slate-950/80 px-4 py-2.5 border-b border-slate-800">
            <div className="flex gap-2">
              {(["markdown", "html", "react"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                    activeTab === tab
                      ? "bg-slate-800 text-white border border-slate-700/50 shadow-inner"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer transition hover:bg-slate-800"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Code display */}
          <div className="p-5 font-mono text-sm overflow-x-auto text-slate-200 bg-slate-900/20 whitespace-pre leading-relaxed">
            {snippets[activeTab]}
          </div>
        </div>
      </div>
    </section>
  );
}
