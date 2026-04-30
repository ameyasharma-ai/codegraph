/**
 * components/UI/SidePanel.tsx
 */
"use client";

import { useState, useEffect } from "react";
import { FileText, ChevronRight, Brain, Loader2, X, Share2, Code } from "lucide-react";

interface SidePanelProps {
  selectedNode: any;
  onClose: () => void;
  repoUrl: string;
}

export default function SidePanel({ selectedNode, onClose, repoUrl }: SidePanelProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset explanation when node changes
  useEffect(() => {
    setExplanation(null);
  }, [selectedNode]);

  const handleExplain = async () => {
    if (!selectedNode) return;
    setLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, fileName: selectedNode.id }),
      });
      const data = await res.json();
      setExplanation(data.summary);
    } catch (e) {
      console.error(e);
      setExplanation("Failed to generate explanation.");
    } finally {
      setLoading(false);
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopyPath = () => {
    if (!selectedNode) return;
    navigator.clipboard.writeText(selectedNode.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenSource = () => {
    if (!selectedNode) return;
    // Construct GitHub URL (assuming main branch as default)
    const baseUrl = repoUrl.startsWith('http') ? repoUrl : `https://github.com/${repoUrl}`;
    const cleanRepo = baseUrl.replace(/\/$/, '');
    const url = `${cleanRepo}/blob/main/${selectedNode.id}`;
    window.open(url, '_blank');
  };

  if (!selectedNode) return null;

  return (
    <div className="fixed top-20 right-6 bottom-6 w-[420px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl z-40 flex flex-col overflow-hidden animate-in slide-in-from-right duration-500 ease-out">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
            <FileText className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-lg truncate max-w-[240px]">
              {selectedNode.id.split("/").pop()}
            </span>
            <span className="text-xs text-gray-500 font-mono">Module</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors group"
        >
          <X className="w-5 h-5 text-gray-500 group-hover:text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        <section className="space-y-3">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">File Information</h3>
          <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Path</span>
              <span className="text-gray-300 font-mono truncate max-w-[200px]">{selectedNode.id}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Type</span>
              <span className="text-indigo-400 uppercase">{selectedNode.id.split('.').pop()} Module</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">AI Intelligence</h3>
            {!explanation && (
              <button
                onClick={handleExplain}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 active:scale-95"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
                Analyze Module
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center border border-white/5 bg-white/[0.01] rounded-2xl animate-pulse">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
              </div>
              <p className="text-sm font-medium text-indigo-300">Consulting Architect...</p>
              <p className="text-xs text-gray-500 mt-1">Extracting patterns and role</p>
            </div>
          ) : explanation ? (
            <div className="text-sm text-gray-300 leading-relaxed bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/10 space-y-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Architect's Summary
              </div>
              <p className="whitespace-pre-wrap">{explanation}</p>
            </div>
          ) : (
            <div className="group cursor-pointer p-8 border border-dashed border-white/10 rounded-2xl text-center hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition-all" onClick={handleExplain}>
              <Brain className="w-8 h-8 text-gray-700 mx-auto mb-3 group-hover:text-indigo-400 transition-colors" />
              <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                Run AI analysis to understand the purpose <br /> and architectural role of this module.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-white/10 bg-white/[0.02] grid grid-cols-2 gap-4">
        <button 
          onClick={handleOpenSource}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-colors active:scale-95"
        >
          <Code className="w-4 h-4" />
          Raw Source
        </button>
        <button 
          onClick={handleCopyPath}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-colors active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          {copied ? "Copied!" : "Share Path"}
        </button>
      </div>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>
  );
}
