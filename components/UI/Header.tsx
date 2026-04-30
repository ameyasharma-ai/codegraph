/**
 * components/UI/Header.tsx
 */
"use client";

import { useState } from "react";
import { Search, Loader2, Code2, Mail } from "lucide-react";

interface HeaderProps {
  onSearch: (url: string) => void;
  loading: boolean;
}

export default function Header({ onSearch, loading }: HeaderProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSearch(url.trim());
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl z-50 flex items-center px-3 md:px-8 justify-between gap-2">
      <div className="flex items-center gap-2 group cursor-pointer shrink-0" onClick={() => window.location.reload()}>
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <Code2 className="text-white w-4 h-4" />
        </div>
        <h1 className="text-base font-bold tracking-tight text-white hidden sm:block">
          Code<span className="text-indigo-400">Graph</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 max-w-xl relative group flex items-center gap-1.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Repo URL..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 px-8 md:px-11 focus:outline-none focus:border-indigo-500/50 transition-all text-[11px] md:text-sm placeholder:text-gray-500"
            disabled={loading}
          />
          <Search className="absolute left-2.5 md:left-4 top-2 w-3 h-3 md:w-4 md:h-4 text-gray-500" />
          {loading && (
            <Loader2 className="absolute right-3 top-2 w-3 h-3 text-indigo-400 animate-spin" />
          )}
        </div>
        <button 
          type="submit"
          disabled={loading || !url.trim()}
          className="flex px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white text-[10px] font-bold rounded-full transition-all shrink-0"
        >
          {loading ? "..." : "Go"}
        </button>
      </form>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <a 
          href="https://github.com/codegraph" 
          target="_blank" 
          rel="noreferrer" 
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Documentation"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>
        <a 
          href="mailto:sharmaameya999@gmail.com"
          className="hidden sm:flex px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
        >
          Give Feedback
        </a>
        <a 
          href="mailto:sharmaameya999@gmail.com"
          className="flex sm:hidden p-2 text-white bg-white/10 rounded-full"
          title="Give Feedback"
        >
          <Mail className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
