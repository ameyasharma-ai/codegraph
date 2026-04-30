/**
 * components/UI/LoadingOverlay.tsx
 */
"use client";

import { Loader2, Zap, Search, Box } from "lucide-react";
import { useState, useEffect } from "react";

export default function LoadingOverlay() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: Search, text: "Scanning repository tree..." },
    { icon: Box, text: "Extracting modules and imports..." },
    { icon: Zap, text: "Building dependency graph..." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = steps[step].icon;

  return (
    <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
      <div className="relative group">
        {/* Animated Glow */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full animate-pulse group-hover:bg-indigo-500/30 transition-colors" />
        
        <div className="relative w-24 h-24 flex items-center justify-center">
           <svg className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke="url(#gradient)" 
              strokeWidth="4" 
              strokeDasharray="100 200"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
          </svg>
          <ActiveIcon className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      <div className="mt-12 text-center space-y-4 max-w-sm">
        <h2 className="text-2xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
          {steps[step].text}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Please wait while our engine performs deep architectural analysis on your codebase.
        </p>
        
        <div className="flex justify-center gap-1.5 pt-4">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${
                i === step ? "w-8 bg-indigo-500" : "w-2 bg-white/10"
              }`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
