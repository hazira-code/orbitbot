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
  Layers,
  ChevronRight,
  ShieldCheck,
  Send,
  User,
  Sliders,
  FileText,
  Clock,
  ExternalLink,
  ChevronLeft,
  Menu,
  Database,
  Search,
  Settings,
  HelpCircle as HelpIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Rule, Message, PipelineStep } from "./types";
import PortfolioDoc from "./components/PortfolioDoc";

const INITIAL_RULES: Rule[] = [
  { id: "1", trigger: "hello", response: "Hello there! How can I help you today?" },
  { id: "2", trigger: "hi", response: "Hey! Nice to chat with you. Ask me any predefined question!" },
  { id: "3", trigger: "bye", response: "Goodbye! Hope you had a great session with the logic engine." },
  { id: "4", trigger: "goodbye", response: "Farewell! Have a wonderful, productive day!" },
  { id: "5", trigger: "how are you", response: "I am a deterministic system running smoothly at 100% capacity." },
  { id: "6", trigger: "who are you", response: "I am a Rule-Based AI Chatbot showcasing constant O(1) matching speed." },
  { id: "7", trigger: "help", response: "I support direct matches for: hello, hi, bye, goodbye, 'how are you', 'who are you', and 'joke'. Toggle Hybrid AI to run Gemini fallback!" },
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
        text: "System initialized. Rule-Based AI Chatbot is running in a continuous 'while True' interactive loop. Type any message below to trigger the logic matching sequence, or use 'exit' to break the loop gracefully.",
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
  const [selectedView, setSelectedView] = useState<'gui' | 'terminal' | 'portfolio'>('gui');
  const [isLoopTerminated, setIsLoopTerminated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Search vocabulary
  const [searchTerm, setSearchTerm] = useState("");
  
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

  // Refs for scroll auto-scrollers
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("chatbot_rules", JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem("chatbot_hybrid", String(hybridMode));
  }, [hybridMode]);

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
    const userMsgObj: Message = {
      id: `user-${Date.now()}`,
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
            ? "Gemini Backfill" 
            : result.type === "simulated_ai" 
              ? "Simulated AI" 
              : result.type === "rule" 
                ? "Deterministic" 
                : "Fallback", 
          status: result.type === "fallback" ? "error" : "info", 
          description: result.type === "ai" 
            ? `Passed to LLM (Flexibility fallback) in ${result.executionTimeMs}ms` 
            : result.type === "simulated_ai"
              ? `Passed to simulated LLM because API Key is unconfigured.`
              : `Fired instant direct response in ${result.executionTimeMs || '0.01'}ms.` 
        }
      ]);

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
      setEditingError("Both trigger and output fields are required.");
      return;
    }

    if (rules.some(r => r.trigger.trim().toLowerCase() === term)) {
      setEditingError(`Trigger "${term}" already exists.`);
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

  const handleResetToDefaults = () => {
    setRules(INITIAL_RULES);
  };

  const handleRestartLoop = () => {
    setIsLoopTerminated(false);
    setChatHistory(prev => [
      ...prev,
      {
        id: `system-reset-${Date.now()}`,
        sender: "system",
        text: "Continuous infinite loop restarted successfully. System status: ACTIVE. Awaiting statements...",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleClearHistory = () => {
    setChatHistory([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: "Conversation logs cleared. System is active and waiting for inputs in standard 'while True' mode.",
        timestamp: new Date().toLocaleTimeString(),
        type: "rule",
        matched: true
      }
    ]);
  };

  const filteredRules = rules.filter(r => 
    r.trigger.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gpt-main font-sans text-gpt-text selection:bg-gpt-border selection:text-white antialiased flex flex-row overflow-hidden">
      
      {/* SIDEBAR: Left Control Center (ChatGPT Inspired Dark Theme) */}
      <aside 
        className={`bg-gpt-sidebar text-neutral-200 w-80 shrink-0 border-r border-gpt-border flex flex-col justify-between transition-all duration-300 z-40 fixed h-full lg:relative ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-r-0 lg:overflow-hidden'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-3 space-y-4">
          
          {/* Header context */}
          <div className="flex items-center justify-between pb-2 border-b border-gpt-divider/30">
            <div className="flex items-center gap-2.5">
              <div className="bg-gpt-green text-white p-1.5 rounded-md flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white tracking-tight">AI Logic Engine</h2>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isLoopTerminated ? 'bg-rose-500' : 'bg-gpt-green'}`} />
                  <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-semibold">
                    {isLoopTerminated ? "HALTED" : "ACTIVE LOOKUP"}
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-neutral-450 hover:text-white p-1 hover:bg-neutral-800 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button / Clear Triggers / Reset */}
          <button
            onClick={handleClearHistory}
            className="w-full flex items-center gap-2 text-left text-xs text-white border border-gpt-divider hover:bg-neutral-800 py-2.5 px-3 rounded-md transition duration-250 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            Clear Chat Flow
          </button>

          {/* New Match Register Form */}
          <div className="space-y-3 bg-[#1e1e24] border border-[#2f2f36] rounded-lg p-3 shadow-sm">
            <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-gpt-divider/20 pb-1.5">
              <Sliders className="w-3.5 h-3.5 text-gpt-green" />
              Add Key Match Rule
            </span>
            
            <form onSubmit={handleAddRule} className="space-y-2.5">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-medium">Trigger Phrase</label>
                <input
                  type="text"
                  placeholder="e.g. status"
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full bg-[#121214] border border-gpt-border rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gpt-green placeholder-neutral-605"
                />
              </div>
              
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-medium">Predefined Response</label>
                <textarea
                  placeholder="Instant O(1) response string"
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  rows={2}
                  className="w-full bg-[#121214] border border-gpt-border rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gpt-green placeholder-neutral-605 resize-none text-neutral-300"
                />
              </div>

              {editingError && (
                <p className="text-[10px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {editingError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gpt-green hover:bg-[#0e8f6e] text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to Hash Map
              </button>
            </form>
          </div>

          {/* Vocabulary Explorer with real-time search */}
          <div className="space-y-2.5 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between pb-0.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                Vocabulary Lookup ({rules.length})
              </span>
              <button 
                onClick={handleResetToDefaults}
                className="text-[10px] text-[#55b399] hover:text-[#10A37F] transition flex items-center gap-0.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>

            {/* Quick search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2 top-2.5" />
              <input 
                type="text" 
                placeholder="Search vocabulary keys..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#121214] border border-gpt-border rounded-md pl-7 pr-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-gpt-green placeholder-neutral-550"
              />
            </div>

            {/* Vocabulary list scrolling */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
              {filteredRules.map((rule) => (
                <div 
                  key={rule.id}
                  className="group flex items-center justify-between bg-[#121214] hover:bg-neutral-800/60 border border-[#27272a] hover:border-gpt-border p-2.5 rounded-md transition"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="text-xs font-mono font-bold text-white bg-gpt-green/10 text-emerald-400 px-1.5 py-0.5 rounded border border-gpt-green/10">
                      /{rule.trigger}
                    </span>
                    <p className="text-[10px] text-neutral-400 mt-1.5 truncate" title={rule.response}>
                      {rule.response}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-neutral-500 hover:text-rose-450 p-1 rounded transition opacity-0 group-hover:opacity-100 cursor-pointer hover:bg-neutral-700"
                    title="Delete trigger"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {filteredRules.length === 0 && (
                <p className="text-[11px] text-neutral-500 italic text-center py-4">No matching triggers configured.</p>
              )}
            </div>
          </div>

          {/* Complexity Analytics */}
          <div className="bg-[#121214] border border-gpt-border rounded-md p-3 space-y-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono block">Logic Mapping</span>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-[#1e1e24] p-1.5 rounded border border-[#2f2f36]">
                <span className="text-[9px] text-neutral-500 block">Query Scaling</span>
                <strong className="text-[#10A37F] font-mono">O(1)</strong>
              </div>
              <div className="bg-[#1e1e24] p-1.5 rounded border border-[#2f2f36]">
                <span className="text-[9px] text-neutral-500 block">Sanitization</span>
                <strong className="text-neutral-350 font-mono">Lowercase</strong>
              </div>
            </div>
          </div>
        </div>

        {/* User profile segment */}
        <div className="p-3 border-t border-gpt-border bg-[#18181c] text-xs flex items-center justify-between text-neutral-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-gpt-green" />
            Local Client Secure
          </span>
          <span className="font-mono text-[9px] text-neutral-500">v1.2.0</span>
        </div>
      </aside>

      {/* CHAT AREA: Central main workspace frame */}
      <section className="flex-1 flex flex-col justify-between overflow-hidden relative bg-gpt-main">
        
        {/* Upper Dashboard Tab Header */}
        <header className="border-b border-gpt-border bg-gpt-sidebar px-4 py-2.5 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="text-neutral-300 hover:text-white p-1 hover:bg-neutral-800 rounded-lg transition cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  System 2 Logic Engine
                  <span className="text-[9px] tracking-wide font-mono bg-gpt-green/10 text-gpt-green border border-gpt-green/20 px-1.5 py-0.5 rounded">
                    DETERMINISTIC
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* Upper View Switch Tabs */}
          <div className="flex items-center gap-1 bg-[#121214] p-1 rounded-lg border border-gpt-border">
            <button
              onClick={() => setSelectedView('gui')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                selectedView === 'gui'
                  ? 'bg-gpt-main text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-gpt-green" />
              ChatGPT Chat
            </button>
            
            <button
              onClick={() => setSelectedView('terminal')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                selectedView === 'terminal'
                  ? 'bg-gpt-main text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5 text-indigo-400" />
              Python Shell
            </button>

            <button
              onClick={() => setSelectedView('portfolio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                selectedView === 'portfolio'
                  ? 'bg-gpt-main text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              Project Report
            </button>
          </div>
        </header>

        {/* Central main viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gpt-main flex flex-col">
          
          {selectedView === 'portfolio' ? (
            <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in py-6">
              <PortfolioDoc />
            </div>
          ) : (
            <div className="flex-1 w-full flex flex-col justify-between py-2">
              
              {/* Message Log viewport list */}
              <div className="flex-1">
                
                {chatHistory.length === 1 && (
                  <div className="py-12 md:py-16 text-center space-y-6 px-4">
                    <h2 className="text-2xl md:text-3.5xl font-bold text-white tracking-tight">
                      ChatGPT Logic Engine
                    </h2>
                    <p className="text-neutral-400 text-xs max-w-sm mx-auto leading-relaxed font-medium">
                      Master O(1) matching. Standardize case triggers, run deterministic loop breakers, or fallback seamlessly to Gemini.
                    </p>

                    {/* Dynamic prompt cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto pt-6 text-left">
                      <button 
                        onClick={() => handleSendMessage("  HeLLo  ")}
                        className="bg-gpt-sidebar hover:bg-gpt-assistant border border-gpt-border p-3 rounded-md transition text-left cursor-pointer space-y-1 group"
                      >
                        <span className="text-xs font-semibold text-white group-hover:text-gpt-green flex items-center justify-between">
                          Test Case Sanitization
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <p className="text-[11px] text-neutral-400">Normalizes and trims whitespace logic cleanly</p>
                      </button>

                      <button 
                        onClick={() => handleSendMessage("who are you")}
                        className="bg-gpt-sidebar hover:bg-gpt-assistant border border-gpt-border p-3 rounded-md transition text-left cursor-pointer space-y-1 group"
                      >
                        <span className="text-xs font-semibold text-white group-hover:text-gpt-green flex items-center justify-between">
                          Identity Query
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <p className="text-[11px] text-neutral-400">Verifies system design details instantly</p>
                      </button>

                      <button 
                        onClick={() => handleSendMessage("Is Python fast for matching?")}
                        className="bg-gpt-sidebar hover:bg-gpt-assistant border border-gpt-border p-3 rounded-md transition text-left cursor-pointer space-y-1 group"
                      >
                        <span className="text-xs font-semibold text-white group-hover:text-gpt-green flex items-center justify-between">
                          Toggle Gemini Hybrid Mode
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <p className="text-[11px] text-neutral-400">Forwards unresolved triggers to LLM</p>
                      </button>

                      <button 
                        onClick={() => handleSendMessage("exit")}
                        className="bg-gpt-sidebar hover:bg-rose-950/10 border border-gpt-border hover:border-rose-900/30 p-3 rounded-md transition text-left cursor-pointer space-y-1 group"
                      >
                        <span className="text-xs font-semibold text-white group-hover:text-rose-400 flex items-center justify-between">
                          Trigger Exit Break
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <p className="text-[11px] text-neutral-400">Gracefully breaks infinite execution cycles</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* REAL USER VS BOT CHAT CONTAINER (Clean ChatGPT Design) */}
                {selectedView === 'gui' ? (
                  <div className="divide-y divide-gpt-border/40">
                    {chatHistory.map((msg) => {
                      const isUser = msg.sender === 'user';
                      const isSys = msg.sender === 'system';

                      if (isSys) {
                        return (
                          <div key={msg.id} className="flex justify-center bg-gpt-main py-2.5 border-b border-gpt-border/20">
                            <span className="bg-gpt-sidebar border border-gpt-border text-[9px] text-neutral-400 font-mono px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                              <Database className="w-3 h-3 text-gpt-green" />
                              {msg.text}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={msg.id}
                          className={`py-6 md:py-8 ${
                            isUser ? 'bg-gpt-main' : 'bg-gpt-assistant border-y border-gpt-border/10'
                          }`}
                        >
                          <div className="max-w-3xl mx-auto px-4 md:px-6 flex items-start gap-4">
                            {/* Avatar icon */}
                            <div className={`w-7.5 h-7.5 rounded shrink-0 flex items-center justify-center text-xs font-bold ${
                              isUser 
                                ? 'bg-[#5436da] text-white' 
                                : 'bg-gpt-green text-white'
                            }`}>
                              {isUser ? <User className="w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5" />}
                            </div>

                            <div className="flex-1 space-y-2 min-w-0">
                              {/* Header & Timestamp info info */}
                              <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                                <span className="font-semibold text-neutral-300">
                                  {isUser ? "You" : "Deterministic Intelligence"}
                                </span>
                                <span className="font-mono">
                                  {msg.timestamp}
                                </span>
                              </div>

                              {/* Message text content */}
                              <div className="text-sm leading-relaxed text-[#d1d5db] whitespace-pre-wrap">
                                {msg.text}
                              </div>

                              {/* Assistant tags and indicators */}
                              {!isUser && msg.type && (
                                <div className="pt-3 flex flex-wrap items-center gap-2">
                                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                                    msg.type === 'rule'
                                      ? 'bg-[#10A37F]/10 text-[#10A37F] border border-[#10A37F]/20'
                                      : msg.type === 'ai' || msg.type === 'simulated_ai'
                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border border-rose-550/20'
                                  }`}>
                                    {msg.type === 'rule' 
                                      ? `O(1) DIRECT MATCH [/${msg.triggerUsed}]`
                                      : msg.type === 'ai' 
                                        ? 'GEMINI BACKFILL CASCADE' 
                                        : msg.type === 'simulated_ai'
                                          ? 'SIMULATED AI HYBRID' 
                                          : 'FALLBACK ROUTING'}
                                  </span>
                                  
                                  {msg.executionTimeMs !== undefined && (
                                    <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-neutral-500" />
                                      {msg.executionTimeMs}ms
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {isLoading && (
                      <div className="py-6 md:py-8 bg-gpt-assistant border-y border-gpt-border/10">
                        <div className="max-w-3xl mx-auto px-4 md:px-6 flex items-start gap-4">
                          <div className="w-7.5 h-7.5 rounded bg-gpt-green text-white flex items-center justify-center">
                            <Cpu className="w-3.5 h-3.5 animate-spin" />
                          </div>
                          <div className="space-y-2 flex-1">
                            <span className="text-xs font-semibold text-neutral-300 block">Parsing vocabulary indices...</span>
                            <div className="flex gap-1.5 pt-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-gpt-green animate-bounce"></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-gpt-green animate-bounce [animation-delay:0.15s]"></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-gpt-green animate-bounce [animation-delay:0.3s]"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                ) : (
                  
                  /* TERMINAL STYLE PYTHON SHELLVIEW */
                  <div className="max-w-3xl mx-auto px-4 py-3">
                    <div className="bg-black/95 font-mono text-xs p-4 rounded border border-gpt-border text-emerald-400 min-h-[380px] flex flex-col justify-between shadow-lg">
                      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar mb-4">
                        <div className="text-neutral-500 border-b border-gpt-border/35 pb-2 mb-3">
                          Python 3.10.12 - Rule-Based Interactive Shell Pipeline<br />
                          Standard Input continuous listener active. Enter 'exit' to break.
                        </div>

                        {chatHistory.map((msg) => {
                          if (msg.sender === 'user') {
                            return (
                              <div key={msg.id} className="text-[#ececf1]">
                                <span className="text-gpt-green font-bold mr-1.5">You:</span>
                                <span>{msg.text}</span>
                              </div>
                            );
                          } else if (msg.sender === 'bot') {
                            return (
                              <div key={msg.id} className="text-emerald-400 pl-3 border-l border-emerald-500/25 space-y-1">
                                <div>{msg.text}</div>
                                {msg.cleanInput && (
                                  <div className="text-[10px] text-neutral-550 flex flex-wrap gap-x-4 pt-1">
                                    <span>[Input]: "{msg.cleanInput}"</span>
                                    <span>[Matched]: {msg.matched ? "Yes" : "No"}</span>
                                    {msg.triggerUsed && <span>[Rule]: {msg.triggerUsed}</span>}
                                    {msg.executionTimeMs && <span>[Latency]: {msg.executionTimeMs}ms</span>}
                                  </div>
                                )}
                              </div>
                            );
                          } else {
                            return (
                              <div key={msg.id} className="text-amber-500 italic my-1">
                                {msg.text}
                              </div>
                            );
                          }
                        })}

                        {isLoading && (
                          <div className="text-neutral-500 animate-pulse">
                            <span>$ python core_matching_engine.py --lookup...</span>
                          </div>
                        )}
                        <div ref={terminalEndRef} />
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Loop Broken Interactive Alert Frame overlay */}
              <AnimatePresence>
                {isLoopTerminated && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="max-w-2xl mx-auto bg-rose-950/20 border border-rose-900/30 p-5 rounded mr-4 ml-4 text-center space-y-3 mb-4"
                  >
                    <div className="inline-flex p-2 bg-rose-500/10 rounded-full text-rose-400 mb-1">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Execution Loop Terminated ('break' called)</h3>
                    <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                      Your exit command triggered the python execution exit gate. The standard input loop is frozen until restarted manually.
                    </p>
                    <button
                      onClick={handleRestartLoop}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-3.5 py-2 rounded transition cursor-pointer"
                    >
                      Reset and Restore Live Infinite Cycle
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Input form bar */}
              <div className="max-w-3xl mx-auto w-full px-4 md:px-6 pt-3 pb-4">
                <div className="flex gap-2.5 items-center relative bg-[#40414F] rounded-lg border border-[#565869] p-1.5 shadow-xl">
                  {selectedView === 'terminal' && (
                    <span className="text-gpt-green font-mono font-bold select-none pl-3 text-sm">&gt;&gt;&gt;</span>
                  )}
                  
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    disabled={isLoopTerminated || isLoading}
                    placeholder={
                      isLoopTerminated 
                        ? "Interactive loop frozen. Click 'Reset' to resume..." 
                        : "Type standard query... (e.g. hello, bye, who are you, write 'exit' to break)..."
                    }
                    className="flex-1 bg-transparent font-sans text-sm focus:outline-none placeholder-neutral-400 text-white pl-3.5 pr-4 py-2.5 disabled:opacity-40"
                    id="central-text-input"
                  />

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoopTerminated || isLoading || !userInput.trim()}
                    className="bg-gpt-green text-white hover:bg-[#0e8f6e] disabled:bg-transparent disabled:text-neutral-500 p-2.5 rounded transition cursor-pointer shrink-0"
                    id="submit-message-btn"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtext info */}
                <span className="text-[10px] text-neutral-500 block text-center leading-normal mt-2.5">
                  Academic Prototype: Direct dictionary exact value matching. Use **"exit"** to terminate standard input stream loops.
                </span>
              </div>

            </div>
          )}

        </div>

        {/* Trace and Strategy strategy footer bar */}
        {selectedView !== 'portfolio' && (
          <footer className="border-t border-gpt-border bg-gpt-sidebar px-4 py-3 flex flex-col md:flex-row md:items-center justify-between text-[11px] text-neutral-400 gap-3 shrink-0 z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gpt-green animate-pulse" />
              <span className="font-mono text-[10px]">Instant Hashed Hash-Map Parsing Activated</span>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">Hybrid AI Cascades:</span>
                <button
                  onClick={() => setHybridMode(!hybridMode)}
                  className={`px-2 py-0.5 rounded cursor-pointer transition text-[9px] font-semibold ${
                    hybridMode ? 'bg-[#10A37F]/10 text-[#10A37F] border border-[#10A37F]/20' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                  }`}
                >
                  {hybridMode ? "ENABLED" : "DISABLED"}
                </button>
              </div>
            </div>
          </footer>
        )}

      </section>

      {/* RIGHT DRAWER: Live Processing Pipeline Trace */}
      {selectedView !== 'portfolio' && (
        <aside className="w-80 shrink-0 bg-gpt-sidebar border-l border-gpt-border p-4 hidden xl:flex flex-col gap-5 overflow-y-auto custom-scrollbar">
          
          <div className="space-y-4">
            <div className="pb-2.5 border-b border-gpt-border">
              <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                <Activity className="w-4 h-4 text-gpt-green" />
                Live Logic Flow
              </h3>
              <p className="text-[10px] text-neutral-500 mt-1">
                Real-time exact string lookup progression
              </p>
            </div>

            <div className="space-y-4.5 pt-1">
              {lastPipeline.map((step, idx) => (
                <div key={idx} className="flex gap-2.5 relative pb-0.5">
                  {idx < lastPipeline.length - 1 && (
                    <div className="absolute left-3 top-6 w-[1px] h-9 bg-gpt-border"></div>
                  )}

                  <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                    step.status === 'success'
                      ? 'bg-gpt-green/10 text-gpt-green border border-gpt-green/20'
                      : step.status === 'error'
                        ? 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-semibold text-neutral-300">{step.name}</span>
                      <span className={`text-[9px] font-mono px-1 rounded ${
                        step.status === 'success'
                          ? 'text-gpt-green bg-gpt-green/5'
                          : step.status === 'error'
                            ? 'text-rose-400 bg-rose-500/5'
                            : 'text-neutral-400 bg-neutral-800'
                      }`}>
                        {step.value}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-1.5 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#121214] border border-gpt-border rounded-md p-3.5 space-y-2 text-xs">
            <h4 className="text-[10px] font-bold text-neutral-400 uppercase font-mono tracking-wider">Hash Map vs. Linear Search</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              Sequential <code>if/elif</code> ladder matrices scale lineally ($O(n)$ latency relative to rules size). Python dictionary indices lookup triggers directly in $O(1)$ constant time regardless of size, saving computing overhead instantly.
            </p>
          </div>

        </aside>
      )}

    </div>
  );
}
