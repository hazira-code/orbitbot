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
  Database
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
      setEditingError(`Trigger key "${term}" already exists.`);
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

  return (
    <div className="min-h-screen bg-[#171717] font-sans text-[#ececec] selection:bg-neutral-700 selection:text-white antialiased flex flex-row overflow-hidden">
      
      {/* SIDEBAR: Left Control Center (ChatGPT Style) */}
      <aside 
        className={`bg-[#0d0d0d] text-neutral-300 w-80 shrink-0 border-r border-[#2f2f2f] flex flex-col justify-between transition-all duration-300 z-40 fixed h-full lg:relative ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-r-0 lg:overflow-hidden'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-3.5 space-y-6">
          {/* Header context */}
          <div className="flex items-center justify-between border-b border-[#212121] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-600/20 text-indigo-400 p-2 rounded-lg border border-indigo-500/10">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">Logic Engine Control</h2>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isLoopTerminated ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-500">
                    {isLoopTerminated ? "LOOP HALTED" : "LOOP ACTIVE"}
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-neutral-400 hover:text-white p-1 hover:bg-[#212121] rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* New Match Register Form */}
          <div className="space-y-3 bg-[#171717] border border-[#2f2f2f] rounded-xl p-3 shadow-inner">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-[#212121]">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              Register Predefined Trigger
            </span>
            
            <form onSubmit={handleAddRule} className="space-y-2">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Key Match Trigger</label>
                <input
                  type="text"
                  placeholder="e.g. status"
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#2f2f2f] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-neutral-600"
                />
              </div>
              
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Response Value</label>
                <textarea
                  placeholder="System response string"
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0d0d0d] border border-[#2f2f2f] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-neutral-600 resize-none text-neutral-300"
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
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to Hash Map
              </button>
            </form>
          </div>

          {/* Active Rules Vocabulary list */}
          <div className="space-y-2 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                Vocabulary List ({rules.length})
              </span>
              <button 
                onClick={handleResetToDefaults}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 transition flex items-center gap-0.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
              {rules.map((rule) => (
                <div 
                  key={rule.id}
                  className="group flex items-center justify-between bg-[#171717] hover:bg-[#212121] border border-[#232323] hover:border-[#2f2f2f] p-2.5 rounded-xl transition"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="text-xs font-mono font-bold text-white bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/10">
                      /{rule.trigger}
                    </span>
                    <p className="text-[10px] text-neutral-400 mt-1 truncate" title={rule.response}>
                      {rule.response}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1 rounded transition opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Delete trigger"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {rules.length === 0 && (
                <p className="text-xs text-neutral-500 italic text-center py-4">No predefined rules configured.</p>
              )}
            </div>
          </div>

          {/* Statistics card */}
          <div className="bg-[#171717] border border-[#2f2f2f] rounded-xl p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono block">Logic Complexity</span>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-[#0d0d0d] p-2 rounded-lg border border-[#212121]">
                <span className="text-[10px] text-neutral-500 block">Lookup</span>
                <strong className="text-emerald-400 font-mono">O(1)</strong>
              </div>
              <div className="bg-[#0d0d0d] p-2 rounded-lg border border-[#212121]">
                <span className="text-[10px] text-neutral-500 block">Sanitizer</span>
                <strong className="text-white font-mono">2-Step</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info area */}
        <div className="p-3.5 border-t border-[#2f2f2f] bg-[#090909] text-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Secure Logic
            </span>
            <span className="font-mono text-[10px] text-neutral-500">v1.1</span>
          </div>
        </div>
      </aside>

      {/* CHAT AREA: Central workspace */}
      <section className="flex-1 flex flex-col justify-between overflow-hidden relative bg-[#212121]">
        
        {/* Upper Dashboard Tab Header */}
        <header className="border-b border-[#2f2f2f] bg-[#171717] px-4 py-3 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="text-neutral-300 hover:text-white p-1 hover:bg-[#2f2f2f] rounded-lg transition cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  System 2 Logic Engine
                  <span className="text-[10px] tracking-wide font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 px-1.5 py-0.5 rounded">
                    DETERMINISTIC
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* Upper Tabs: Terminal, ChatGPT UI, Project Doc */}
          <div className="flex items-center gap-1 bg-[#0d0d0d] p-1 rounded-xl border border-[#2f2f2f]">
            <button
              onClick={() => setSelectedView('gui')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedView === 'gui'
                  ? 'bg-[#212121] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              ChatGPT Chat
            </button>
            
            <button
              onClick={() => setSelectedView('terminal')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedView === 'terminal'
                  ? 'bg-[#212121] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5 text-indigo-400" />
              Python Shell
            </button>

            <button
              onClick={() => setSelectedView('portfolio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedView === 'portfolio'
                  ? 'bg-[#212121] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Project Report
            </button>
          </div>
        </header>

        {/* Central main viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-[#212121] flex flex-col">
          
          {selectedView === 'portfolio' ? (
            <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
              <PortfolioDoc />
            </div>
          ) : (
            <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col justify-between py-2">
              
              {/* Message Log viewport list */}
              <div className="space-y-6 flex-1 mb-8">
                
                {chatHistory.length === 1 && (
                  <div className="py-8 text-center space-y-6">
                    <div className="flex justify-center">
                      <div className="bg-[#171717] p-4 rounded-full border border-[#2f2f2f] shadow-lg">
                        <Cpu className="w-10 h-10 text-indigo-400 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-white">How can I help you today?</h2>
                      <p className="text-neutral-400 text-xs max-w-md mx-auto leading-relaxed">
                        Test the rule-based logic engine. You can enter clean strings, trigger exact-matching rules with instant speed, choose exits to break standard terminal loops, or leverage hybrid AI.
                      </p>
                    </div>

                    {/* Dynamic clickable prompt cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-4 text-left">
                      <button 
                        onClick={() => handleSendMessage("  HeLLo  ")}
                        className="bg-[#171717] hover:bg-[#2f2f2f] border border-[#2f2f2f] p-3 rounded-xl transition text-left cursor-pointer space-y-1 group"
                      >
                        <span className="text-xs font-bold text-white group-hover:text-indigo-400 flex items-center justify-between">
                          Test Case Sanitization
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <p className="text-[11px] text-neutral-400">Triggers string clean-ups for "  HeLLo  "</p>
                      </button>

                      <button 
                        onClick={() => handleSendMessage("who are you")}
                        className="bg-[#171717] hover:bg-[#2f2f2f] border border-[#2f2f2f] p-3 rounded-xl transition text-left cursor-pointer space-y-1 group"
                      >
                        <span className="text-xs font-bold text-white group-hover:text-indigo-400 flex items-center justify-between">
                          Identity Query
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <p className="text-[11px] text-neutral-400">Requests chatbot specification details</p>
                      </button>

                      <button 
                        onClick={() => handleSendMessage("Tell me some other things?")}
                        className="bg-[#171717] hover:bg-[#2f2f2f] border border-[#2f2f2f] p-3 rounded-xl transition text-left cursor-pointer space-y-1 group"
                      >
                        <span className="text-xs font-bold text-white group-hover:text-indigo-400 flex items-center justify-between">
                          Toggle Hybrid Mode Fallback
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <p className="text-[11px] text-neutral-400">Triggers Gemini generative answer cascade</p>
                      </button>

                      <button 
                        onClick={() => handleSendMessage("exit")}
                        className="bg-[#171717] hover:bg-rose-950/20 border border-[#2f2f2f] hover:border-rose-900/40 p-3 rounded-xl transition text-left cursor-pointer space-y-1 group"
                      >
                        <span className="text-xs font-bold text-white group-hover:text-rose-400 flex items-center justify-between">
                          Trigger Kill Command
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <p className="text-[11px] text-neutral-400">Breaks Python standard interactive shell loop</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* REAL USER VS BOT CHAT CONTAINER (ChatGPT Style) */}
                {selectedView === 'gui' ? (
                  <div className="space-y-4">
                    {chatHistory.map((msg, index) => {
                      const isUser = msg.sender === 'user';
                      const isSys = msg.sender === 'system';

                      if (isSys) {
                        return (
                          <div key={msg.id} className="flex justify-center my-3">
                            <span className="bg-[#171717] border border-[#2f2f2f] text-[10px] text-neutral-400 font-mono px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                              <Database className="w-3 h-3 text-indigo-400" />
                              {msg.text}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={msg.id}
                          className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                            isUser ? 'bg-transparent' : 'bg-[#171717] border border-[#2a2a2a]'
                          }`}
                        >
                          {/* Avatar icon */}
                          <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                            isUser 
                              ? 'bg-neutral-700 text-white' 
                              : 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                          }`}>
                            {isUser ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4 text-indigo-400" />}
                          </div>

                          <div className="flex-1 space-y-2 min-w-0">
                            {/* Header */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">
                                {isUser ? "You" : "Deterministic Assistant"}
                              </span>
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {msg.timestamp}
                              </span>
                            </div>

                            {/* Message text */}
                            <div className="text-sm leading-relaxed text-[#ececec] whitespace-pre-wrap selection-highlight">
                              {msg.text}
                            </div>

                            {/* Assistant tags and indicators */}
                            {!isUser && msg.type && (
                              <div className="pt-2 flex flex-wrap items-center gap-2">
                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                                  msg.type === 'rule'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : msg.type === 'ai' || msg.type === 'simulated_ai'
                                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                      : 'bg-rose-500/10 text-rose-400 border border-rose-550/20'
                                }`}>
                                  {msg.type === 'rule' 
                                    ? `O(1) DIRECT KEY MATCH [${msg.triggerUsed}]`
                                    : msg.type === 'ai' 
                                      ? 'HYBRID GEMINI FALLBACK' 
                                      : msg.type === 'simulated_ai'
                                        ? 'SIMULATED AI FALLBACK' 
                                        : 'GENERIC LOOP FALLBACK'}
                                </span>
                                
                                {msg.executionTimeMs !== undefined && (
                                  <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
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
                      <div className="bg-[#171717] border border-[#2a2a2a] flex items-start gap-4 p-4 rounded-xl leading-relaxed">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                          <Cpu className="w-4 h-4 animate-spin text-indigo-400" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <span className="text-xs font-bold text-white block">Evaluating matching criteria...</span>
                          <div className="flex gap-1 pt-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                ) : (
                  
                  /* TERMINAL STYLE PYTHON SHELLVIEW */
                  <div className="bg-black/95 font-mono text-xs p-4 rounded-xl border border-[#2f2f2f] text-emerald-400 relative min-h-[380px] flex flex-col justify-between shadow-2xl">
                    <div className="space-y-3.5 flex-1 overflow-y-auto custom-scrollbar mb-4">
                      <div className="text-neutral-500 border-b border-neutral-900 pb-2 mb-3">
                        Python 3.10 Build #84729 - Deterministic Shell Interface<br />
                        Listening on live std_in buffer stream... Enter 'exit' to break.
                      </div>

                      {chatHistory.map((msg) => {
                        if (msg.sender === 'user') {
                          return (
                            <div key={msg.id} className="text-neutral-200">
                              <span className="text-indigo-400 font-bold mr-1.5">You:</span>
                              <span>{msg.text}</span>
                            </div>
                          );
                        } else if (msg.sender === 'bot') {
                          return (
                            <div key={msg.id} className="text-emerald-400 pl-3 border-l border-emerald-500/20 space-y-1">
                              <div>{msg.text}</div>
                              {msg.cleanInput && (
                                <div className="text-[10px] text-neutral-500 flex flex-wrap gap-x-4 pt-1">
                                  <span>[Normal]: "{msg.cleanInput}"</span>
                                  <span>[Lookup]: {msg.type}</span>
                                  {msg.matched && <span>[Hit]: {msg.triggerUsed}</span>}
                                  {msg.executionTimeMs && <span>[Time]: {msg.executionTimeMs}ms</span>}
                                </div>
                              )}
                            </div>
                          );
                        } else {
                          return (
                            <div key={msg.id} className="text-amber-500 italic my-1.5">
                              {msg.text}
                            </div>
                          );
                        }
                      })}

                      {isLoading && (
                        <div className="text-neutral-400 animate-pulse">
                          <span>$ python parser.py --sanitize...</span>
                        </div>
                      )}
                      <div ref={terminalEndRef} />
                    </div>
                  </div>
                )}

              </div>

              {/* Loop Broken Interactive Alert Frame overlay */}
              <AnimatePresence>
                {isLoopTerminated && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-rose-950/20 border border-rose-900/40 p-5 rounded-2xl mb-4 text-center space-y-3 shadow-inner shadow-rose-900/10"
                  >
                    <div className="inline-flex p-3 bg-rose-500/15 rounded-full text-rose-400 mb-1">
                      <LogOut className="w-6 h-6" />
                    </div>
                    <h3 className="text-md font-bold text-white">Interactive Loop Disconnected ('break' trigger)</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                      An exit command has triggered the logic gate <code>break</code>. The infinite cycle is broken and standard inputs are blocked until reset.
                    </p>
                    <button
                      onClick={handleRestartLoop}
                      className="bg-rose-600 hover:bg-rose-500 hover:scale-[1.02] text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer shadow-md shadow-rose-500/10"
                    >
                      Reset and Open standard loop cycle
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Input form bar */}
              <div className="space-y-3">
                <div className="flex gap-2.5 items-center relative bg-[#171717] rounded-2xl border border-[#2f2f2f] p-1.5 shadow-xl">
                  {selectedView === 'terminal' && (
                    <span className="text-indigo-400 font-mono font-black select-none pl-3 text-sm">$</span>
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
                        ? "Continuous loop has halted. Please restart to chat..." 
                        : "Type message... (e.g. hello, bye, who are you, write 'exit' to break)..."
                    }
                    className="flex-1 bg-transparent font-mono text-sm inline-block focus:outline-none placeholder-neutral-500 text-white pl-3.5 pr-4 py-2.5 disabled:opacity-40"
                    id="central-text-input"
                  />

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoopTerminated || isLoading || !userInput.trim()}
                    className="bg-[#ececec] text-[#171717] hover:bg-white disabled:bg-[#2f2f2f] disabled:text-neutral-500 p-2.5 rounded-xl transition cursor-pointer shrink-0"
                    id="submit-message-btn"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Subtext info */}
                <span className="text-[10px] text-neutral-500 block text-center leading-normal">
                  Project 1: Rule-Based Chatbot with linear input sanitization. Enter <strong>"exit"</strong> to break the execution loop.
                </span>
              </div>

            </div>
          )}

        </div>

        {/* Dynamic Trace footer panel (only when chat or shell is active) */}
        {selectedView !== 'portfolio' && (
          <footer className="border-t border-[#2f2f2f] bg-[#171717] px-4 py-3 flex flex-col md:flex-row md:items-center justify-between text-[11px] text-neutral-400 gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs">O(1) Hash Map Matching Mode Enabled</span>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-500">
              <div className="flex items-center gap-2">
                <span>Hybrid Backfill strategy:</span>
                <button
                  onClick={() => setHybridMode(!hybridMode)}
                  className={`px-2 py-0.5 rounded cursor-pointer transition ${
                    hybridMode ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                  }`}
                >
                  {hybridMode ? "ACTIVE (GEMINI)" : "OFF (FALLBACK ERROR)"}
                </button>
              </div>
            </div>
          </footer>
        )}

      </section>

      {/* RIGHT DRAWER: Current Processing live Pipeline Trace */}
      {selectedView !== 'portfolio' && (
        <aside className="w-80 shrink-0 bg-[#0d0d0d] border-l border-[#2f2f2f] p-4 hidden xl:flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#212121]">
              <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                <Activity className="w-4 h-4 text-indigo-400" />
                Processing Trace
              </h3>
              <p className="text-[10px] text-neutral-500 mt-1">
                Step-by-step logic pipeline parsing
              </p>
            </div>

            <div className="space-y-4 pt-1">
              {lastPipeline.map((step, idx) => (
                <div key={idx} className="flex gap-2.5 relative pb-1">
                  {idx < lastPipeline.length - 1 && (
                    <div className="absolute left-3 top-6 w-[1px] h-9 bg-[#212121]"></div>
                  )}

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                    step.status === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : step.status === 'error'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[11px] font-semibold text-neutral-300">{step.name}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        step.status === 'success'
                          ? 'text-emerald-400 bg-emerald-500/5 font-bold'
                          : step.status === 'error'
                            ? 'text-rose-400 bg-rose-500/5'
                            : 'text-neutral-400 bg-[#171717]'
                      }`}>
                        {step.value}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-1.5 leading-normal">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#171717] border border-[#2f2f2f] rounded-xl p-3.5 space-y-2 text-xs">
            <h4 className="text-[10px] font-bold text-neutral-400 uppercase font-mono tracking-wider">Concept Spotlight</h4>
            <p className="text-[11px] text-neutral-400 leading-normal">
              Unlike <code>if/elif</code> ladder structures which require sequentially testing every rule ($O(n)$ complexity), the Python dictionary lookup resolves keys instantly using hashed indices ($O(1)$ constant time), protecting system scale efficiency.
            </p>
          </div>

        </aside>
      )}

    </div>
  );
}
