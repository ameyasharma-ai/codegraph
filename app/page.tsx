/**
 * app/page.tsx
 * Main Entry Point with Landing Page
 */
"use client";

import { useState } from "react";
import Header from "@/components/UI/Header";
import SidePanel from "@/components/UI/SidePanel";
import CodeGraph from "@/components/Graph/CodeGraph";
import LoadingOverlay from "@/components/UI/LoadingOverlay";
import { Sparkles, ArrowRight, Zap, Database, Search as SearchIcon } from "lucide-react";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (url: string) => {
    setLoading(true);
    setError(null);
    setRepoUrl(url);
    setSelectedNode(null);
    
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url }),
      });
      
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        setGraphData({ nodes: [], edges: [] });
      } else {
        setGraphData({ nodes: data.nodes, edges: data.edges });
      }
    } catch (e) {
      console.error(e);
      setError("Failed to analyze repository. Please check the URL and try again.");
      setGraphData({ nodes: [], edges: [] });
    } finally {
      setLoading(false);
    }
  };

  const hasGraph = graphData.nodes.length > 0;

  return (
    <main className={`relative bg-[#050505] text-white flex flex-col ${
      hasGraph 
        ? "h-screen overflow-hidden" 
        : "min-h-screen overflow-y-auto md:h-screen md:overflow-hidden"
    }`}>
      <Header onSearch={handleSearch} loading={loading} />
      
      <div className="pt-16 flex-1 flex flex-col min-h-0">
        {hasGraph ? (
          <div className="flex-1 relative">
             <CodeGraph 
              initialNodes={graphData.nodes} 
              initialEdges={graphData.edges}
              onNodeClick={setSelectedNode}
            />
          </div>
        ) : !loading && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 md:py-8 text-center relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse-slow pointer-events-none" />
            
            {/* Hero Content */}
            <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center h-full space-y-4 md:space-y-8 lg:space-y-10 py-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[9px] md:text-xs font-bold tracking-wider uppercase animate-bounce mt-2 md:mt-0">
                <Sparkles className="w-3 h-3" />
                AI-Powered Code Intelligence
              </div>
              
              <h1 className="text-3xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[1.05] bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent px-2">
                Visualize Your <br className="hidden md:block" />
                <span className="text-indigo-500">Codebase</span> Like Never Before
              </h1>
              
              <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
                Transform complex GitHub repositories into interactive 3D dependency graphs. 
                Get instant AI explanations and trace code flow across thousands of files.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button 
                  onClick={() => document.querySelector('input')?.focus()}
                  className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-3 group"
                >
                  Analyze Your First Repo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a 
                  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all backdrop-blur-md flex items-center justify-center"
                >
                  View Demo
                </a>
              </div>

              {/* Feature Grid - Compressed for desktop fit */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6 pt-6 md:pt-10 w-full max-w-4xl">
                {[
                  { icon: Zap, title: "Fast Parsing", desc: "Recursive repo analysis in seconds." },
                  { icon: Database, title: "Graph Cache", desc: "Sub-second reloads for analyzed projects." },
                  { icon: SearchIcon, title: "Flow Tracing", desc: "Trace dependencies and imports visually." }
                ].map((f, i) => (
                  <div key={i} className="p-4 md:p-5 lg:p-6 rounded-2xl bg-white/5 border border-white/10 text-left space-y-1 md:space-y-2 lg:space-y-3 hover:bg-white/[0.08] transition-colors group">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <f.icon className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                    </div>
                    <h3 className="font-bold text-white text-xs md:text-sm lg:text-base">{f.title}</h3>
                    <p className="text-[10px] md:text-xs lg:text-sm text-gray-500 line-clamp-1 md:line-clamp-none">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs max-w-md animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <X className="w-3 h-3" />
                  Analysis Error
                </div>
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {loading && <LoadingOverlay />}
      
      <SidePanel 
        selectedNode={selectedNode} 
        onClose={() => setSelectedNode(null)} 
        repoUrl={repoUrl}
      />
    </main>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
