import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal as TerminalIcon, 
  MessageSquare, 
  Cpu, 
  Plus, 
  Trash2, 
  RotateCcw, 
  HelpCircle, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Sparkles, 
  Code, 
  Play, 
  LogOut,
  Info,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Rule, Message, PipelineStep } from "./types";
import PortfolioDoc from "./components/PortfolioDoc";

const INITIAL_RULES: Rule[] = [
  { id: "1", trigger: "hello", response: "Hello there! How can I help you today?" },
  { id: "2", trigger: "hi", response: "Hey! Nice to chat with you. Ask me anything!" },
  { id: "3", trigger: "bye", response: "Goodbye! Hope you had a great session." },
  { id: "4", trigger: "goodbye", response: "Farewell! Have a wonderful day!" },
  { id: "5", trigger: "how are you", response: "I am a deterministic system running smoothly at 100% capacity." },
  { id: "6", trigger: "who are you", response: "I am a Rule-Based AI Chatbot showing the precision of direct key-value matching." },
  { id: "7", trigger: "help", response: "I support direct matches for: hello, hi, bye, goodbye, 'how are you', 'who are you', and 'joke'. You can also toggle Hybrid Mode to let me call Gemini when no rule matches!" },
  { id: "8", trigger: "joke", response: "Why do programmers wear glasses? Because they can't C#!" }
];

export default function App() {
  // State variables synchronized with localStorage
  const [rules, setRules] = useState<Rule[]>(() => {
    const saved = localStorage.getItem("chatbot_rules");
    return saved ? JSON.parse(saved) : INITIAL_RULES;
  });

  const [chatHistory, setChatHistory] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chatbot_chat");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: "welcome-msg",
        sender: "bot",
        text: "System initialized. Rule-Based Chatbot is running in a continuous 'while True' loop. Type any message to run the logic engine, or write 'exit' to break the loop.",
        timestamp: new Date().toLocaleTimeString(),
        type: "rule",
        matched: true
      }
    ];
  });

  const [userInput, setUserInput] = useState("");
  const [hybridMode, setHybridMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("chatbot_hybrid");
    return saved ? JSON.parse(saved) === "true" : true;
  });
  const [selectedView, setSelectedView] = useState<'gui' | 'terminal' | 'portfolio'>('terminal');
  const [isLoopTerminated, setIsLoopTerminated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Rule editor form state
  const [newTrigger, setNewTrigger] = useState("");
  const [newResponse, setNewResponse] = useState("");
  const [editingError, setEditingError] = useState("");

  // Pipeline tracking
  const [lastPipeline, setLastPipeline] = useState<PipelineStep[]>(() => [
    { name: "1. Raw Input", value: "None", status: "pending", description: "Awaiting incoming string" },
    { name: "2. Sanitization", value: "None", status: "pending", description: "Trimming whitespace, converting to lowercase" },
    { name: "3. HashMap Search", value: "None", status: "pending", description: "Direct O(1) matching against the key hash set" },
    { name: "4. Output Strategy", value: "None", status: "pending", description: "Determining whether to fire deterministic answer, LLM, or fallback" }
  ]);

  const [simulatedTimeOffset, setSimulatedTimeOffset] = useState<number | null>(null);

  // Refs for scroll auto-scrollers
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync rules to localStorage
  useEffect(() => {
    localStorage.setItem("chatbot_rules", JSON.stringify(rules));
  }, [rules]);

  // Sync hybrid toggle to localStorage
  useEffect(() => {
    localStorage.setItem("chatbot_hybrid", String(hybridMode));
  }, [hybridMode]);

  // Sync chat to localStorage
  useEffect(() => {
    localStorage.setItem("chatbot_chat", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Scroll to bottom on updates
  useEffect(() => {
    if (selectedView === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, selectedView]);

  // Handle message processing
  const handleSendMessage = async (textToSend?: string) => {
    const inputMsg = (textToSend !== undefined ? textToSend : userInput).trim();
    if (!inputMsg) return;

    if (isLoopTerminated) return;

    // Add user message to history
    const userMessageId = `user-${Date.now()}`;
    const userMsgObj: Message = {
      id: userMessageId,
      sender: 'user',
      text: inputMsg,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatHistory(prev => [...prev, userMsgObj]);
    if (textToSend === undefined) {
      setUserInput("");
    }
    setIsLoading(true);

    // Initial pipeline state setting
    setLastPipeline([
      { name: "1. Raw Input", value: `"${inputMsg}"`, status: "info", description: `Captured incoming payload length of ${inputMsg.length} characters.` },
      { name: "2. Sanitization", value: "Processing...", status: "pending", description: "Standardizing for consistent index matching." },
      { name: "3. HashMap Search", value: "Pending...", status: "pending", description: "Awaiting cleaned criteria." },
      { name: "4. Output Strategy", value: "Pending...", status: "pending", description: "Evaluating fallback routing." }
    ]);

    try {
      // Execute the request to our Express backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMsg,
          rulesList: rules,
          hybridMode: hybridMode
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with local server.");
      }

      const result = await response.json();

      // Check loop closure command (break condition)
      if (result.isExit) {
        setIsLoopTerminated(true);
      }

      // Update Pipeline visualizer with absolute accuracy
      setLastPipeline([
        { 
          name: "1. Raw Input", 
          value: `"${result.rawInput}"`, 
          status: "success", 
          description: `Captured input of length ${result.rawInput.length}.` 
        },
        { 
          name: "2. Sanitization", 
          value: `"${result.cleanInput}"`, 
          status: "success", 
          description: `Converted casing and trimmed terminal spaces: .toLowerCase().trim()` 
        },
        { 
          name: "3. HashMap Search", 
          value: result.matched ? `Match Found! [O(1)]` : `No match found [O(1)]`, 
          status: result.matched ? "success" : "error", 
          description: result.matched 
            ? `Direct Key match hit in ${result.executionTimeMs || 0.01}ms` 
            : `Criteria did not exist in the ${rules.length} stored key index map.` 
        },
        { 
          name: "4. Output Strategy", 
          value: result.type === "ai" 
            ? "Gemini AI Helper Backfill" 
            : result.type === "simulated_ai" 
              ? "Simulated AI Backfill" 
              : result.type === "rule" 
                ? "Predefined Deterministic Match" 
                : "Fallback Error Response", 
          status: result.type === "fallback" ? "error" : "info", 
          description: result.type === "ai" 
            ? `Passed to LLM (Flexibility fallback) in ${result.executionTimeMs}ms` 
            : result.type === "simulated_ai"
              ? `Passed to simulated LLM because API Key is unconfigured.`
              : `Fired instant direct response in ${result.executionTimeMs || '0'}ms.` 
        }
      ]);

      // Add chatbot response to history
      const botMsgObj: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: result.response,
        timestamp: new Date().toLocaleTimeString(),
        type: result.type,
        matched: result.matched,
        cleanInput: result.cleanInput,
        triggerUsed: result.trigger || undefined,
        executionTimeMs: result.executionTimeMs,
        isExit: result.isExit
      };

      setChatHistory(prev => [...prev, botMsgObj]);

    } catch (err: any) {
      console.error(err);
      const errorMsgObj: Message = {
        id: `err-${Date.now()}`,
        sender: 'system',
        text: `Pipeline Error: ${err.message || "An unexpected error occurred during execution sequence."}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatHistory(prev => [...prev, errorMsgObj]);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe manual addition of intent rules
  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    setEditingError("");

    const term = newTrigger.trim().toLowerCase();
    const answer = newResponse.trim();

    if (!term || !answer) {
      setEditingError("Both key trigger and output response fields are required.");
      return;
    }

    if (rules.some(r => r.trigger.trim().toLowerCase() === term)) {
      setEditingError(`The key definition for "${term}" already exists inside your O(1) look-up map.`);
      return;
    }

    const newRuleObj: Rule = {
      id: `rule-${Date.now()}`,
      trigger: term,
      response: answer
    };

    setRules(prev => [...prev, newRuleObj]);
    setNewTrigger("");
    setNewResponse("");
  };

  // Delete matching keys
  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  // Reset to default dictionary rules
  const handleResetToDefaults = () => {
    setRules(INITIAL_RULES);
  };

  // Restart continuous Loop cycle
  const handleRestartLoop = () => {
    setIsLoopTerminated(false);
    setChatHistory(prev => [
      ...prev,
      {
        id: `system-reset-${Date.now()}`,
        sender: "system",
        text: "--- Continuous infinite loop restarted successfully. System status: ACTIVE. Awaiting statements... ---",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Clear chat log entirely
  const handleClearHistory = () => {
    setChatHistory([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: "Chat record flushed. System running smoothly. Continuous while loop waiting...",
        timestamp: new Date().toLocaleTimeString(),
        type: "rule",
        matched: true
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white antialiased flex flex-col custom-scrollbar">
      {/* Upper Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-indigo-100 shadow-md shadow-indigo-600/10">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Rule-Based AI Chatbot
              <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
                Project 1
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Deterministic Logic Engine Simulator &bull; Hash Map Lookups $O(1)$
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLoopTerminated ? 'bg-red-400' : 'bg-emerald-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLoopTerminated ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="font-mono uppercase font-bold text-[10px] tracking-wider">
              {isLoopTerminated ? "LOOP BROKEN (EXIT)" : "LOOP ACTIVE (while True)"}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setSelectedView('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${selectedView === 'terminal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              id="btn-view-terminal"
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              Terminal REPL
            </button>
            <button
              onClick={() => setSelectedView('gui')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${selectedView === 'gui' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              id="btn-view-gui"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Modern Chat
            </button>
            <button
              onClick={() => setSelectedView('portfolio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${selectedView === 'portfolio' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              id="btn-view-portfolio"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Project Report
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {selectedView === 'portfolio' ? (
          <div className="col-span-12">
            <PortfolioDoc />
          </div>
        ) : (
          <>
            {/* LEFT COLUMN: Input Interface (Terminal or Chat GUI) - takes 7 shares */}
        <section className="lg:col-span-7 flex flex-col gap-6" id="left-workspace-column">
          
          {/* Active View Container */}
          <div className="border border-slate-800 rounded-2xl bg-slate-900/40 shadow-xl overflow-hidden flex-1 flex flex-col min-h-[480px]">
            {/* Window Header */}
            <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2 font-semibold">
                  {selectedView === 'terminal' ? 'terminal_runtime_loop.py' : 'modern_chat_client.tsx'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-500">UTC: {new Date().toISOString().substring(11,19)}</span>
                <button 
                  onClick={handleClearHistory}
                  title="Clear Screen logs"
                  className="text-slate-400 hover:text-indigo-400 transition"
                  id="btn-clear-logs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* View Viewports */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col justify-between bg-slate-950/80 relative">
              
              {/* Loop Broken Overlay Banner */}
              {isLoopTerminated && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6" id="loop-terminated-overlay">
                  <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-full text-rose-500 mb-4 animate-bounce">
                    <LogOut className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-mono">Loop Terminated via 'exit'</h3>
                  <p className="text-sm text-slate-400 max-w-sm mb-6">
                    The instruction <code className="bg-slate-800 px-1 py-0.5 rounded font-mono text-rose-400">break</code> was executed in the control flow. The continuous input cycle has terminated.
                  </p>
                  <button
                    onClick={handleRestartLoop}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer text-sm"
                    id="btn-restart-loop"
                  >
                    <Play className="w-4 h-4fill" />
                    Restart while True Loop
                  </button>
                </div>
              )}

              {/* TERMINAL VIEW */}
              {selectedView === 'terminal' ? (
                <div className="flex-1 flex flex-col font-mono text-sm leading-relaxed text-emerald-400" id="terminal-content">
                  <div className="space-y-3 flex-1 mb-4">
                    <div className="text-slate-500 text-xs border-b border-slate-900 pb-2 mb-4">
                      Python 3.10.6 -- Interactive Deterministic Chatbot Cycle<br />
                      Loaded {rules.length} hash map rules successfully. Fallback strategy is primed.
                    </div>
                    
                    {chatHistory.map((msg, index) => {
                      if (msg.sender === 'user') {
                        return (
                          <div key={msg.id} className="text-slate-200">
                            <span className="text-indigo-400 text-xs font-semibold mr-1">You:</span>
                            <span>{msg.text}</span>
                          </div>
                        );
                      } else if (msg.sender === 'bot') {
                        return (
                          <div key={msg.id} className="pl-4 border-l-2 border-emerald-500/30 text-emerald-400 space-y-1">
                            <div>{msg.text}</div>
                            {msg.cleanInput && (
                              <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-slate-900/60 mt-1">
                                <span>[SANITIZED]: "{msg.cleanInput}"</span>
                                <span>[STRATEGY]: {msg.type?.toUpperCase()}</span>
                                {msg.matched && <span>[KEY]: "{msg.triggerUsed}"</span>}
                                {msg.executionTimeMs !== undefined && <span>[LATENCY]: {msg.executionTimeMs}ms</span>}
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <div key={msg.id} className="text-amber-500 text-xs font-mono my-2 italic">
                            {msg.text}
                          </div>
                        );
                      }
                    })}
                    
                    {isLoading && (
                      <div className="text-slate-400 animate-pulse flex items-center gap-2">
                        <span>$ python processing_input.py ...</span>
                      </div>
                    )}
                    <div ref={terminalEndRef} />
                  </div>
                </div>
              ) : (
                /* GUI MESSAGE VIEWER */
                <div className="flex-1 flex flex-col gap-4 mb-4" id="gui-content">
                  <div className="flex-1 space-y-4">
                    {chatHistory.map((msg) => {
                      const isUser = msg.sender === 'user';
                      const isSys = msg.sender === 'system';
                      
                      if (isSys) {
                        return (
                          <div key={msg.id} className="flex justify-center my-2 text-center">
                            <span className="bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 font-mono px-3 py-1 rounded-full">
                              {msg.text}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                        >
                          <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800'}`}>
                            <p>{msg.text}</p>
                            
                            {!isUser && msg.type && (
                              <div className="mt-2.5 pt-2 border-t border-slate-800/30 flex items-center gap-2 flex-wrap">
                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  msg.type === 'rule' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                                    : msg.type === 'ai' 
                                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' 
                                      : msg.type === 'simulated_ai'
                                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/10'
                                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
                                }`}>
                                  {msg.type === 'rule' ? 'O(1) Exact Match' : msg.type === 'ai' || msg.type === 'simulated_ai' ? 'Hybrid AI response' : 'Fallback error'}
                                </span>
                                {msg.executionTimeMs !== undefined && (
                                  <span className="text-[10px] font-mono text-slate-500">
                                    Latency: {msg.executionTimeMs}ms
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {isLoading && (
                      <div className="flex gap-3 mr-auto items-center">
                        <div className="bg-slate-900 p-3.5 rounded-2xl rounded-tl-none border border-slate-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>
              )}

            </div>

            {/* View Inputs Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2 items-center">
              {selectedView === 'terminal' && (
                <span className="text-emerald-500 font-mono font-bold select-none text-sm">$</span>
              )}
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                disabled={isLoopTerminated || isLoading}
                placeholder={isLoopTerminated ? "Loop has broke. Restart loop above to trigger..." : "Type text and hit enter (type 'exit' to break)..."}
                className="flex-1 bg-slate-950 font-mono text-sm border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-600 px-4 py-2 rounded-xl focus:outline-none transition-all disabled:opacity-50"
                id="chatbot-text-input"
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={isLoopTerminated || isLoading || !userInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1"
                id="btn-send-message"
              >
                Send
              </button>
            </div>
          </div>

          {/* Quick Sandbox preset queries */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-4 rounded-2xl">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 font-mono">
              Sandbox Test Statements
            </h4>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleSendMessage("  HeLLo  ")}
                disabled={isLoopTerminated || isLoading}
                className="text-xs bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/60 px-3 py-1.5 rounded-lg font-mono transition cursor-pointer"
              >
                "  HeLLo  " (test sanitization)
              </button>
              <button 
                onClick={() => handleSendMessage("how are you")}
                disabled={isLoopTerminated || isLoading}
                className="text-xs bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/60 px-3 py-1.5 rounded-lg font-mono transition cursor-pointer"
              >
                "how are you" (exact hit)
              </button>
              <button 
                onClick={() => handleSendMessage("joke")}
                disabled={isLoopTerminated || isLoading}
                className="text-xs bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/60 px-3 py-1.5 rounded-lg font-mono transition cursor-pointer"
              >
                "joke" (exact hit)
              </button>
              <button 
                onClick={() => handleSendMessage("What is the distance to Mars?")}
                disabled={isLoopTerminated || isLoading}
                className="text-xs bg-slate-800/70 hover:bg-slate-800 text-amber-400 border border-slate-700/60 px-3 py-1.5 rounded-lg font-mono transition cursor-pointer"
              >
                "What is Mars?" (test LLM fallback)
              </button>
              <button 
                onClick={() => handleSendMessage("exit")}
                disabled={isLoopTerminated || isLoading}
                className="text-xs bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-900/30 px-3 py-1.5 rounded-lg font-mono transition cursor-pointer"
              >
                "exit" (kill loop)
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Pipeline Visualizer & Rules config editor - takes 5 shares */}
        <section className="lg:col-span-5 flex flex-col gap-6" id="right-workspace-column">
          
          {/* 1. DYNAMIC LOGIC PIPELINE */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-indigo-400" />
              Logic Processing Pipeline
            </h3>
            <p className="text-xs text-slate-400 pb-4 border-b border-slate-800">
              Trace execution steps for the last triggered message in real-time.
            </p>

            <div className="space-y-4 pt-4">
              {lastPipeline.map((step, idx) => (
                <div key={idx} className="flex gap-3 relative pb-1">
                  {idx < lastPipeline.length - 1 && (
                    <div className="absolute left-3.5 top-7 w-[1px] h-9 bg-slate-800"></div>
                  )}

                  {/* Icon step */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    step.status === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                      : step.status === 'error' 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                  }`}>
                    {idx + 1}
                  </div>

                  {/* Flow description */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">{step.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                        step.status === 'success' 
                          ? 'text-emerald-400 bg-emerald-500/5' 
                          : step.status === 'error' 
                            ? 'text-rose-400 bg-rose-500/5' 
                            : 'text-slate-400 bg-slate-800'
                      }`}>
                        {step.value}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. RULE DICTIONARY CONFIGURATOR */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" />
                  Predefined Rules Dictionary
                </h3>
                <p className="text-xs text-slate-400">
                  Total rules indexed: {rules.length} (Matches execute in $O(1)$)
                </p>
              </div>
              <button 
                onClick={handleResetToDefaults}
                title="Reset to original training kit defaults"
                className="text-slate-400 hover:text-white transition p-1.5 hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1 border border-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3" />
                Reset
              </button>
            </div>

            {/* List rules */}
            <div className="my-4 max-h-[180px] overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
              {rules.map((rule) => (
                <div 
                  key={rule.id} 
                  className="flex items-center justify-between bg-slate-950/60 hover:bg-slate-950/90 border border-slate-800/85 px-3 py-2 rounded-xl transition"
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/10">
                        {rule.trigger}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 truncate" title={rule.response}>
                      {rule.response}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 transition rounded-lg hover:bg-rose-500/10 cursor-pointer"
                    title="Delete Key Match"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {rules.length === 0 && (
                <p className="text-xs text-slate-500 italic text-center py-4">No lookup rules configured. Matches will fall through.</p>
              )}
            </div>

            {/* Form to add a new rule */}
            <form onSubmit={handleAddRule} className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Add O(1) Key Trigger</span>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g. status)"
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Answer response text"
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {editingError && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {editingError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium text-xs py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Register Key in Vocabulary
              </button>
            </form>
          </div>

          {/* 3. EXPERT SETTING CONFIGURATIONS */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Hybrid Generative Settings
            </h3>
            
            <div className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="flex-1 pr-4">
                <span className="text-xs font-semibold text-slate-200 block">Hybrid AI Backfill Strategy</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block leading-normal">
                  If unmatched by rules, queries Gemini backend helper (Slide 18) instead of direct "unknown" error.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={hybridMode}
                  onChange={(e) => setHybridMode(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-slate-100"></div>
              </label>
            </div>

            <div className="mt-4 bg-slate-950/40 border border-slate-800 p-3 rounded-xl flex gap-3 text-xs leading-normal text-slate-400">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[11px]">
                <strong className="text-slate-300">Deterministic vs Probabilistic: </strong> 
                The O(1) direct dictionary match completes instantly in micro-seconds, ensuring absolutely ZERO hallucination and absolute safety. The Generative fallback provides conversational flexibility.
              </p>
            </div>
          </div>
        </section>
          </>
        )}
      </main>

      {/* Educational Footer Banner */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-600">
        <div>
          <span>&bull; Theoretical AI Concept Studio - Rules-based vs Vectors &bull;</span>
        </div>
        <div className="flex items-center gap-6">
          <span>O(1) Map Lookup</span>
          <span>while True continuous loop</span>
          <span>Normalized String sanitization</span>
        </div>
      </footer>
    </div>
  );
}
