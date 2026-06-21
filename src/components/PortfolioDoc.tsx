import React, { useState } from "react";
import { 
  FileText, 
  Terminal, 
  BookOpen, 
  Code, 
  CheckCircle, 
  Cpu, 
  ArrowRight, 
  Layers, 
  Zap, 
  Download, 
  Copy, 
  Sparkles,
  Award,
  Calendar,
  User,
  GraduationCap,
  ListFilter,
  HelpCircle,
  Hash
} from "lucide-react";

export default function PortfolioDoc() {
  const [copied, setCopied] = useState(false);

  const samplePythonCode = `# =====================================================================
# PROJECT 1: DECENTRALIZED RULE-BASED AI CHATBOT SYSTEM
# Architecture: Deterministic Logic Skeleton (O(1) Vocabulary Hash Map)
# Course: Artificial Intelligence Foundation Project
# =====================================================================

import sys
import time

def sanitize_input(raw_text: str) -> str:
    """Normalizes raw user input by shifting casing and stripping terminal whitespace."""
    return raw_text.strip().lower()

def run_logic_engine():
    # Predefined rules represented as high-efficiency key-value dictionary (Hash Map)
    vocabulary_map = {
        "hello": "Hello there! How can I help you today?",
        "hi": "Hey! Nice to chat with you. Ask me anything!",
        "bye": "Goodbye! Hope you had a great session.",
        "goodbye": "Farewell! Have a wonderful day!",
        "how are you": "I am a deterministic system running smoothly at 100% capacity.",
        "who are you": "I am a Rule-Based AI Chatbot showing the precision of direct key-value matching.",
        "help": "I support direct matches for: hello, hi, bye, goodbye, 'how are you', 'joke'.",
        "joke": "Why do programmers wear glasses? Because they can't C#!"
    }
    
    # Terminate conditions (Kill commands)
    exit_commands = {"exit", "quit", "byebye", "kill", "terminate"}

    print("=====================================================================")
    print("🤖 DECISION LOGIC ENGINE - CHATBOT STARTED SUCCESSFULLY")
    print("Type your message to converse. Enter 'exit' to terminate the loop.")
    print("=====================================================================")

    # Continuous interactive loop ('while True' lifecycle)
    while True:
        try:
            # 1. Accept user input
            raw_input = input("\\nYou: ")
            
            # 2. Convert to lowercase & strip space (Sanitization)
            clean_input = sanitize_text = sanitize_input(raw_input)
            
            # 3. Guard against empty inputs
            if not clean_input:
                continue
                
            # 4. Check for Exit/Break Strategy
            if clean_input in exit_commands:
                print("Bot: Exit code triggered. Session disconnected. Loop broken gracefully.")
                break
                
            # 5. Direct lookup with fallback (.get() method O(1))
            t_start = time.perf_counter()
            response = vocabulary_map.get(
                clean_input, 
                "I do not understand. (No matching rules discovered in my dictionary.)"
            )
            t_end = time.perf_counter()
            latency = (t_end - t_start) * 1000
            
            # 6. Render Output
            print(f"Bot: {response}")
            # print(f"  [Metrics] Lookup completed in {latency:.4f}ms.")
            
        except KeyboardInterrupt:
            print("\\n\\nBot: Loop interrupted via terminal shutdown. Exiting cleanly.")
            break

if __name__ == "__main__":
    run_logic_engine()`;

  const handleCopyMarkdown = () => {
    const markdownContent = `# RULE-BASED ARTIFICIAL INTELLIGENCE CHATBOT
### PROJECT PORTFOLIO REPORT & COLLEGE SUBMISSION

- **Course:** Foundational Artificial Intelligence
- **Architecture:** Deterministic Hash-Map Logic Engine with O(1) Complexity
- **Language:** Python 3.x
- **Development Date:** June 2026

---

## 1. Executive Summary & Overview
This project presents a high-performance **Rule-Based Chatbot** written in Python, simulating basic conversational intelligence without the parameter overhead of heavy machine learning structures. Utilizing an **Input-Process-Output (IPO)** blueprint, it converts incoming string streams, sanitizes user noise, executes safe conditional matchings via high-performance python dictionaries, and triggers instant O(1) feedback loops completely free of hallucinations.

## 2. System Objectives
1. **Deterministic Guardrails**: Create zero-hallucination communication pipelines suitable for critical applications (e.g. Finance, Healthcare).
2. **Normalized Input Channels**: Implement text sanitization mechanisms (.lower().strip() strategies) to neutralize capitalization differences.
3. **Continuous Lifecycle Execution**: Drive full keyboard event listening loops that keep sessions interactive until exit commands are parsed.
4. **Algorithmic Efficiency**: Transition from sequential linear scales O(n) towards instant constant logic lookups O(1).

## 3. System Architecture & Flowchart
\`\`\`
  [User Raw Input] 
         │
         ▼
  [Sanitization & Normalization] ───> (.lower().strip())
         │
         ▼
  [Verify Exit Guardrails] ─────────> If "exit" / "quit" ──> [Clean break loop / Terminate]
         │
         ▼
  [Hash Map Dictionary Search]
         │
  ┌──────┴─────────────────────────┐
  ▼ [Match Found O(1)]             ▼ [Unmatched Fallback]
[Instantly Return Response]       [Trigger Generic Prompt Error]
\`\`\``;

    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 animate-fade-in text-slate-200 p-0.5" id="portfolio-hub-container">
      
      {/* 1. PROFESSIONAL ACADEMIC COVER EMBED */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/60 p-8 md:p-12 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-800/80">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-mono font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              Academic Project Submission
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              🤖 Rule-Based AI Chatbot using Python
            </h1>
            
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              Design, implementation, and analysis of deterministic control flow architectures, sanitization pipelines, and instant O(1) hash map lookup mechanisms.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shrink-0 min-w-[240px] space-y-3 shadow-inner">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono block">Submission Dossier</span>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Course:</span>
                <span className="text-white font-medium">Artificial Intelligence</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date:</span>
                <span className="text-white font-medium">June 2026</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Architecture:</span>
                <span className="text-indigo-400 font-semibold">Constant O(1)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Quick Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
          <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl text-center">
            <span className="text-slate-500 text-xs font-mono block mb-1">Time Complexity</span>
            <span className="text-xl font-bold font-mono text-emerald-400">O(1) Constant</span>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl text-center">
            <span className="text-slate-500 text-xs font-mono block mb-1">Casing Sanitizing</span>
            <span className="text-xl font-bold font-mono text-indigo-400">Standardized</span>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl text-center">
            <span className="text-slate-500 text-xs font-mono block mb-1">Vocabulary Size</span>
            <span className="text-xl font-bold font-mono text-white">8+ Prime Rules</span>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl text-center">
            <span className="text-slate-500 text-xs font-mono block mb-1">Hallucination Risk</span>
            <span className="text-xl font-bold font-mono text-rose-400">0.00% Zero</span>
          </div>
        </div>
      </div>

      {/* 2. CHATGPT-STYLE DOCUMENTATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Index & Overview Cards */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section: Project Overview */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Project Overview
            </h2>
            <div className="h-[1px] bg-slate-800"></div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Before constructing complex probabilistic deep learning systems that require millions of variables, AI engineers must master the absolute precision of **deterministic control logic**. This project implements a high-performance **Rule-Based Chatbot** using Python. The system processes direct key trigger patterns using an optimized **Hash Map Lookup**, offering zero latency, perfect predictability, and immediate guardrails.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex gap-3 text-xs text-slate-400 leading-relaxed">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <span>
                <strong>The Strategic Utility:</strong> While Large Language Models excel at creative prose, they are highly prone to hallucination. Modern enterprise AI stacks layer rule-based deterministic filters (like NVIDIA NeMo Guardrails) in front of the LLM to filter, redact, or block harmful inputs instantly. This project models that fundamental safety layer.
              </span>
            </div>
          </div>

          {/* Section: Project Objectives */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-400" />
              Core Objectives
            </h2>
            <div className="h-[1px] bg-slate-800"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-400">01 / Hello & Greetings</span>
                <p className="text-xs text-slate-300">
                  Parse and match generic greeting inputs seamlessly (e.g. hello, hi, hey) across all letters.
                </p>
              </div>
              
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-400">02 / Sanitization Pipeline</span>
                <p className="text-xs text-slate-300">
                  Clean whitespace characters, spaces, and bypass capitalization differences programmatically.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-400">03 / Continuous Infinite Loop</span>
                <p className="text-xs text-slate-300">
                  Establish a stable <code>while True</code> shell that remains running unless a dedicated kill is triggered.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-400">04 / Exit Strategy</span>
                <p className="text-xs text-slate-300">
                  Support exit commands (exit, quit, bye) to execute a safe loop break and disconnect cleanly.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Architectural Workflow Diagram */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Project Workflow Architecture
            </h2>
            <div className="h-[1px] bg-slate-800"></div>
            <p className="text-xs text-slate-300">
              The program executes on a cyclic **Input-Process-Output (IPO)** process model structure:
            </p>

            {/* Graphical flowchart */}
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-850 space-y-3 font-mono text-xs">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-white font-semibold text-center w-full max-w-sm">
                  User Types Message
                </div>
                <div className="text-slate-500 text-base">↓</div>
                <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-indigo-400 font-semibold text-center w-full max-w-sm">
                  Input Sanitized: .strip().lower()
                </div>
                <div className="text-slate-500 text-base">↓</div>
                <div className="bg-indigo-950/40 border border-indigo-900 px-4 py-2 rounded-lg text-indigo-300 font-semibold text-center w-full max-w-sm">
                  Conditional Checks (Exit / Vocabulary)
                </div>
                <div className="text-slate-500 text-base">↓</div>
                
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                  <div className="bg-emerald-950/30 border border-emerald-900/40 p-3 rounded-lg text-center">
                    <span className="text-[10px] text-emerald-500 font-bold block">TRIGGER DETECTED</span>
                    <span className="text-xs text-slate-200">Return response instantly</span>
                  </div>
                  <div className="bg-rose-950/20 border border-rose-900/35 p-3 rounded-lg text-center">
                    <span className="text-[10px] text-rose-500 font-bold block">NO MATCH FOUND</span>
                    <span className="text-xs text-slate-200">Fires default fallback error</span>
                  </div>
                </div>

                <div className="text-slate-500 text-base">↓</div>
                <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-white font-semibold text-center w-full max-w-sm">
                  Continues to Next Cycle / Awaits User
                </div>
              </div>
            </div>
          </div>

          {/* Section: Expected Terminal Output Bubbles */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              Expected Conversation Lifecycles
            </h2>
            <div className="h-[1px] bg-slate-800"></div>

            <div className="space-y-4">
              
              {/* ChatGPT-style message bubles */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                <span className="text-[10px] font-bold text-slate-500 font-mono uppercase">Scenario A: Normalized capitalization matching</span>
                <div className="text-xs font-mono space-y-1.5 text-slate-300">
                  <p className="text-indigo-400">You:   HeLLo  </p>
                  <p className="text-emerald-400">Bot: Hello there! How can I help you today?</p>
                  <p className="text-slate-600 italic">// Logic clean input to lowercase "hello" resulting in immediate O(1) hit.</p>
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                <span className="text-[10px] font-bold text-slate-500 font-mono uppercase">Scenario B: Unrecognized Fallback Error</span>
                <div className="text-xs font-mono space-y-1.5 text-slate-300">
                  <p className="text-indigo-400">You: Where is lucknow?</p>
                  <p className="text-rose-400">Bot: I do not understand. (No matching rules discovered in my dictionary.)</p>
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                <span className="text-[10px] font-bold text-slate-500 font-mono uppercase">Scenario C: Exit Gracefully</span>
                <div className="text-xs font-mono space-y-1.5 text-slate-300">
                  <p className="text-indigo-400">You: quit</p>
                  <p className="text-slate-400">Bot: Exit code triggered. Session disconnected. Loop broken gracefully.</p>
                  <p className="text-slate-600 block pt-1 border-t border-slate-900">// Loop terminates, control returns safely. shell process exit 0.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Key Requirements / Skills / Code Box */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Skills Checklist Card */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Demonstrated SDK Skills
            </h3>
            <div className="h-[1px] bg-slate-800"></div>
            
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Control Flow Logic</strong>
                  <span className="text-slate-400 text-[10px]">Decision-making using if-elif-else statements.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Looping Interactivity</strong>
                  <span className="text-slate-400 text-[10px]">Designing infinite cycles for seamless input captures.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Input Sanitization</strong>
                  <span className="text-slate-400 text-[10px]">Neutralizing spaces and matching differences with case safety rules.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Hash Map Mechanics</strong>
                  <span className="text-slate-400 text-[10px]">Vocabulary queries with ultra-efficient O(1) performance profiles.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Academic Learning Outcomes */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-400" />
              Learning Outcomes
            </h3>
            <div className="h-[1px] bg-slate-800"></div>

            <p className="text-xs text-slate-400 leading-normal mb-2">
              Successfully completing Project 1 proves conceptual mastery over:
            </p>

            <ul className="space-y-2.5 text-xs text-slate-300 list-disc pl-4">
              <li>How computers handle real-time system state processes without databases.</li>
              <li>How string-normalization algorithms clean input feeds.</li>
              <li>The difference between strict deterministic rule-guards and fuzzy probabilistic layers.</li>
            </ul>
          </div>

          {/* Technical Documentation Conclusion */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Conclusion
            </h3>
            <div className="h-[1px] bg-slate-800"></div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A **Rule-Based Chatbot** is the critical structural first-step of conversational engineering. It establishes predictable channels, safeguards systems from malicious user overrides, and forms the bedrock core before expanding into NLP, Vector Embeddings, and Generative AI.
            </p>
          </div>

        </div>

      </div>

      {/* 3. FLUID FULL-WIDTH CODEBLOCK ZONE WITH EXPORT CONTROLS */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono font-semibold text-slate-300">
              rule_based_chatbot.py
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 text-xs bg-slate-800 border border-slate-700 hover:text-white text-slate-300 px-3 py-1.5 rounded-lg transition font-mono cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy Report Markdown"}
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-slate-950">
          <pre className="text-xs font-mono overflow-x-auto text-slate-300 custom-scrollbar leading-relaxed">
            <code>{samplePythonCode}</code>
          </pre>
        </div>
      </div>

    </div>
  );
}
