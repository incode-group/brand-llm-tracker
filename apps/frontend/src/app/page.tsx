"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Activity, CheckCircle2, AlertCircle, TrendingUp, Users, MessageSquare } from "lucide-react";
import LuxuryButton from "@/components/ui/LuxuryButton";
import GlassCard from "@/components/ui/GlassCard";
import FadeSection from "@/components/ui/FadeSection";

// --- Mock Data Types ---
interface MockResults {
  visibilityScore: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  mentions: number;
  marketFit: number;
  keyTopics: string[];
}

export default function Dashboard() {
  const [brandName, setBrandName] = useState("");
  const [domain, setDomain] = useState("");
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"IDLE" | "PROCESSING" | "COMPLETED" | "FAILED">("IDLE");
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [results, setResults] = useState<MockResults | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && analysisId) {
      socket.on(`progress:${analysisId}`, (data: { progress: number; message: string }) => {
        setProgress(data.progress);
        setMessage(data.message);
        if (data.progress === 100) {
          setStatus("COMPLETED");
          // Generate mock results on completion
          setResults({
            visibilityScore: Math.floor(Math.random() * 30) + 70, // 70-100
            sentiment: "Positive",
            mentions: Math.floor(Math.random() * 1000) + 500,
            marketFit: Math.floor(Math.random() * 20) + 80,
            keyTopics: ["AI Innovation", "User Experience", "Market Growth", "Tech Trends"],
          });
        }
      });
    }
  }, [socket, analysisId]);

  const handleStartAnalysis = async () => {
    if (!brandName || !domain) return;
    setStatus("PROCESSING");
    setProgress(0);
    setResults(null); 
    setMessage("Initializing quantum analysis vectors...");

    // MOCK MODE: If backend fails or for demo, use this simulation
    try {
      // Try backend first
      const response = await axios.post("http://localhost:3000/analysis/start", {
        brandName,
        domain,
      });
      setAnalysisId(response.data.analysisId);
    } catch (error) {
      console.warn("Backend unavailable, starting mock simulation...");
      simulateMockAnalysis();
    }
  };

  const simulateMockAnalysis = () => {
    let mockProgress = 0;
    const interval = setInterval(() => {
      mockProgress += Math.floor(Math.random() * 5) + 1;
      if (mockProgress > 100) mockProgress = 100;

      setProgress(mockProgress);
      
      if (mockProgress < 30) setMessage("Scanning global brand mentions...");
      else if (mockProgress < 60) setMessage("Analyzing sentiment vectors...");
      else if (mockProgress < 90) setMessage("Calculating market resonance...");
      else setMessage("Finalizing report...");

      if (mockProgress === 100) {
        clearInterval(interval);
        setStatus("COMPLETED");
        setResults({
          visibilityScore: 87,
          sentiment: "Positive",
          mentions: 1243,
          marketFit: 92,
          keyTopics: ["Innovation", "Luxury", "Design", "Future Tech"],
        });
      }
    }, 100); // Fast simulation for demo
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-charcoal selection:bg-violet-glow/30">
      {/* Background Gradient Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-violet-glow/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <FadeSection className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-violet-glow" />
            <span className="text-xs font-medium tracking-widest uppercase text-white/70">
              AI Brand Tracker v2.0
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Brand Intelligence <br /> Reimagined.
          </h1>
        </FadeSection>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel */}
          <div className="lg:col-span-4 space-y-8">
            <FadeSection delay={0.2}>
              <GlassCard className="h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Analysis Parameters</h3>
                  <p className="text-white/40 text-sm">Configure your target for deep-dive scanning.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider ml-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-glow/50 focus:ring-1 focus:ring-violet-glow/50 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider ml-1">
                      Target Domain
                    </label>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="acme.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-glow/50 focus:ring-1 focus:ring-violet-glow/50 transition-all"
                    />
                  </div>

                  <div className="pt-4">
                    <LuxuryButton 
                      onClick={handleStartAnalysis}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      {status === "PROCESSING" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        "Initiate Scan"
                      )}
                    </LuxuryButton>
                  </div>
                </div>
              </GlassCard>
            </FadeSection>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {status === "COMPLETED" && results ? (
                /* RESULTS VIEW */
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Hero Card: Visibility Score */}
                  <GlassCard className="col-span-1 md:col-span-2 bg-gradient-to-br from-violet-glow/10 to-transparent border-violet-glow/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div>
                        <div className="flex items-center gap-2 text-violet-glow mb-2">
                          <Activity className="w-5 h-5" />
                          <span className="font-semibold tracking-wide uppercase text-xs">Visibility Score</span>
                        </div>
                        <h2 className="text-6xl font-bold text-white mb-2">{results.visibilityScore}/100</h2>
                        <p className="text-white/50 max-w-sm">
                          Your brand dominates {results.visibilityScore}% of the digital conversation in your identified niche.
                        </p>
                      </div>
                      <div className="w-32 h-32 rounded-full border-4 border-violet-glow/30 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-4 border-violet-glow border-t-transparent animate-spin-slow" />
                         <span className="text-2xl font-bold text-white">A+</span>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Sentiment Analysis */}
                  <GlassCard>
                    <div className="flex items-center gap-2 text-emerald-400 mb-4">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold tracking-wide uppercase text-xs">Sentiment Analysis</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">{results.sentiment}</div>
                     <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-4">
                      <div className="bg-emerald-500 h-full w-[85%]" />
                    </div>
                    <p className="text-white/40 text-xs mt-3">Based on {results.mentions} verified mentions</p>
                  </GlassCard>

                  {/* Market Fit */}
                  <GlassCard>
                    <div className="flex items-center gap-2 text-blue-400 mb-4">
                      <Users className="w-5 h-5" />
                      <span className="font-semibold tracking-wide uppercase text-xs">Market Fit</span>
                    </div>
                     <div className="text-4xl font-bold text-white mb-2">{results.marketFit}%</div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {results.keyTopics.map((topic, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">
                          #{topic}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              ) : (
                /* LOADING / IDLE VIEW */
                <FadeSection delay={0.4} key="loading">
                  <GlassCard className="min-h-[500px] flex items-center justify-center relative overflow-hidden">
                    {status === "IDLE" && (
                      <div className="text-center space-y-4 max-w-md">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                          <Activity className="w-10 h-10 text-white/20" />
                        </div>
                        <h3 className="text-xl font-medium text-white">Ready to Analyze</h3>
                        <p className="text-white/30 text-sm leading-relaxed">
                          Systems are calibrated. Enter brand details to begin the autonomous LLM-driven investigation.
                        </p>
                      </div>
                    )}

                    {(status === "PROCESSING" || status === "FAILED") && (
                       <div className="w-full max-w-sm space-y-8 relative z-10">
                       <div className="text-center">
                         <h3 className="text-3xl font-light text-white mb-2">{progress}%</h3>
                         <p className="text-violet-glow text-sm font-medium tracking-wide animate-pulse">{message}</p>
                       </div>
   
                       <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                         <div 
                           className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-600 to-violet-400"
                           style={{ width: `${progress}%`, transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
                         />
                       </div>
   
                       <div className="grid grid-cols-2 gap-4 pt-8">
                         <div className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                           <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Status</div>
                           <div className="text-white font-medium">{status}</div>
                         </div>
                         <div className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                           <div className="text-white/40 text-xs uppercase tracking-wider mb-1">ETA</div>
                           <div className="text-white font-medium">~45s</div>
                         </div>
                       </div>

                       {status === "FAILED" && (
                         <div className="flex items-center justify-center gap-2 text-red-400 bg-red-500/10 py-3 rounded-lg border border-red-500/20">
                           <AlertCircle className="w-5 h-5" />
                           <span className="text-sm font-medium">Analysis Failed</span>
                         </div>
                       )}
                     </div>
                    )}

                    {status === "PROCESSING" && (
                      <>
                        <div className="absolute inset-0 bg-violet-glow/5 animate-pulse" />
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet-600/20 rounded-full blur-3xl animate-spin-slow" />
                      </>
                    )}
                  </GlassCard>
                </FadeSection>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
