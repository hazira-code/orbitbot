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
  Copy, 
  Sparkles,
  Award,
  Calendar,
  GraduationCap
} from "lucide-react";

export default function PortfolioDoc() {
  const [copied, setCopied] = useState(false);

  const samplePythonCode = `# =====================================================================
# PROJECT 1: DETERMINISTIC RULE-BASED AI CHATBOT SYSTEM
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
            clean_input = sanitize_input(raw_input)
            
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
This project presents a high-performance **Rule-Based Chatbot** written in Python, simulating basic conversational behavior using standard conditional statements, string sanitization, and lookup mappings. Utilizing an **Input-Process-Output (IPO)** blueprint, it converts incoming string streams, sanitizes raw text by shifting casing to lowercase and trimming whitespaces, executes safe conditional matchings via high-performance python dictionaries, and triggers instant O(1) feedback loops completely free of hallucinations.

## 2. System Objectives
1. **Deterministic Guardrails**: Create zero-hallucination communication pipelines suitable for critical applications and filters.
2. **Normalized Input Channels**: Implement text sanitization mechanisms (.lower().strip() strategies) to neutralize capitalization differences.
3. **Continuous Lifecycle Execution**: Drive full interactive input listening loops that keep sessions running until exit commands are parsed.
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
    <div className="space-y-10 animate-fade-in text-neutral-200 p-0.5" id="portfolio-hub-container">
      
      {/* 1. SEAMLESS CHATGPT DARK ACADEMIC COVER EMBED */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-8 md:p-12 shadow-2xl">
        {/* Glow effects */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-neutral-800">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 text-neutral-300 border border-neutral-750 rounded-full text-xs font-mono font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              Interactive Academic Portfolio
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              🤖 Rule-Based Chatbot using Python
            </h1>
            
            <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-sans">
              Implementation portfolio showcasing deterministic flow architectures, sanitization pipelines, and instant O(1) hash map lookup mechanisms. Perfect for academic submission.
            </p>
          </div>

          <div className="bg-neutral-950/85 border border-neutral-800 p-5 rounded-xl shrink-0 min-w-[240px] space-y-3">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono block">Submission Dossier</span>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Course:</span>
                <span className="text-white font-medium">Foundational AI</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date:</span>
                <span className="text-white font-medium">June 2026</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Profile:</span>
                <span className="text-indigo-400 font-semibold">Constant O(1)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Quick Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
          <div className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-xl text-center">
            <span className="text-neutral-500 text-xs font-mono block mb-1">Time Complexity</span>
            <span className="text-lg font-bold font-mono text-emerald-400">O(1) Hash Map</span>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-xl text-center">
            <span className="text-neutral-500 text-xs font-mono block mb-1">Casing Sanitizing</span>
            <span className="text-lg font-bold font-mono text-indigo-400">Standardized</span>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-xl text-center">
            <span className="text-neutral-500 text-xs font-mono block mb-1">Vocabulary Size</span>
            <span className="text-lg font-bold font-mono text-white">8+ Prime Rules</span>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-xl text-center">
            <span className="text-neutral-500 text-xs font-mono block mb-1">Hallucination Risk</span>
            <span className="text-lg font-bold font-mono text-rose-400">0.00% Zero</span>
          </div>
        </div>
      </div>

      {/* 2. CHATGPT-STYLE DOCUMENTATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Index & Overview Cards */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section: Project Overview */}
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 md:p-8 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Project Overview & Theoretical Background
            </h2>
            <div className="h-[1px] bg-neutral-800"></div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Before constructing complex probabilistic deep learning systems that require millions of parameters, developers must master the absolute precision of **deterministic control logic**. This project implements a high-performance **Rule-Based Chatbot** using Python. The system processes direct key trigger patterns using an optimized **Hash Map Lookup**, offering zero latency, perfect predictability, and immediate guardrails.
            </p>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex gap-3 text-xs text-neutral-400 leading-relaxed">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <span>
                <strong>The Strategic Utility:</strong> While Large Language Models excel at creative prose, they are highly prone to hallucination. Modern enterprise stacks layer rule-based deterministic filters (like NVIDIA NeMo Guardrails) in front of the LLM to filter, redact, or block harmful inputs instantly. This project models that fundamental safety layer.
              </span>
            </div>
          </div>

          {/* Section: Project Objectives */}
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 md:p-8 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-400" />
              Core System Requirements & Objectives
            </h2>
            <div className="h-[1px] bg-neutral-800"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-400 text-purple-400">01 / Hello & Greetings</span>
                <p className="text-xs text-neutral-300">
                  Parse and match generic greeting inputs seamlessly (e.g. hello, hi, hey, good morning) across all cases of capitalization.
                </p>
              </div>
              
              <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-400 text-purple-400">02 / Sanitization Pipeline</span>
                <p className="text-xs text-neutral-300">
                  Clean whitespace characters, trim tabs, and convert text parameters to lowercase programmatically prior to directory lookups.
                </p>
              </div>

              <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-400 text-purple-400">03 / Continuous Infinite Loop</span>
                <p className="text-xs text-neutral-300">
                  Establish a stable <code>while True</code> shell that remains active and listening to user std_in unless an exit criterion hits.
                </p>
              </div>

              <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-400 text-purple-400">04 / Exit Strategy</span>
                <p className="text-xs text-neutral-300">
                  Support exit commands (exit, quit, bye) to execute a safe loop break and disconnect cleanly.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Architectural Workflow Diagram */}
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 md:p-8 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Project Workflow Architecture
            </h2>
            <div className="h-[1px] bg-neutral-800"></div>
            <p className="text-xs text-neutral-300 font-sans">
              The program executes on a cyclic **Input-Process-Output (IPO)** process model structure:
            </p>

            {/* Graphical flowchart */}
            <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-850 space-y-3 font-mono text-xs">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-lg text-white font-semibold text-center w-full max-w-sm shadow-sm">
                  User Types Message
                </div>
                <div className="text-neutral-500 text-base">↓</div>
                <div className="bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-lg text-indigo-400 font-semibold text-center w-full max-w-sm shadow-sm font-mono">
                  Input Sanitized: .strip().lower()
                </div>
                <div className="text-neutral-500 text-base">↓</div>
                <div className="bg-[#1e1b4b] border border-indigo-900/50 px-4 py-2 rounded-lg text-indigo-300 font-semibold text-center w-full max-w-sm shadow-sm font-mono">
                  Conditional Checks (Exit / Vocabulary)
                </div>
                <div className="text-neutral-500 text-base">↓</div>
                
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                  <div className="bg-[#022c22] border border-[#065f46]/40 p-3 rounded-lg text-center shadow-inner">
                    <span className="text-[10px] text-emerald-400 font-bold block mb-1">TRIGGER DETECTED</span>
                    <span className="text-xs text-neutral-200">Return response instantly</span>
                  </div>
                  <div className="bg-[#4c0519]/25 border border-[#9f1239]/35 p-3 rounded-lg text-center shadow-inner">
                    <span className="text-[10px] text-rose-400 font-bold block mb-1">NO MATCH FOUND</span>
                    <span className="text-xs text-neutral-200">Fires default fallback error</span>
                  </div>
                </div>

                <div className="text-neutral-500 text-base">↓</div>
                <div className="bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-lg text-white font-semibold text-center w-full max-w-sm shadow-sm">
                  Continues to Next Cycle / Awaits User
                </div>
              </div>
            </div>
          </div>

          {/* Section: Expected Terminal Output Bubbles */}
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 md:p-8 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              Expected Conversation Lifecycles
            </h2>
            <div className="h-[1px] bg-neutral-800"></div>

            <div className="space-y-4">
              
              {/* ChatGPT-style message bubbles */}
              <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 space-y-3">
                <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider block border-b border-neutral-900 pb-1.5">Scenario A: Normalized capitalization matching</span>
                <div className="text-xs font-mono space-y-1.5 text-neutral-300">
                  <p className="text-indigo-400 font-semibold">You:   HeLLo  </p>
                  <p className="text-emerald-400 font-semibold">Bot: Hello there! How can I help you today?</p>
                  <p className="text-neutral-500 italic block pt-1">// Logic clean input to lowercase "hello" resulting in immediate O(1) matching speed.</p>
                </div>
              </div>

              <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 space-y-3">
                <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider block border-b border-neutral-900 pb-1.5">Scenario B: Unrecognized Fallback Error</span>
                <div className="text-xs font-mono space-y-1.5 text-neutral-300">
                  <p className="text-indigo-400 font-semibold">You: Where is Mars?</p>
                  <p className="text-rose-400 font-semibold">Bot: I do not understand. (No matching rules discovered in my dictionary.)</p>
                </div>
              </div>

              <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 space-y-3">
                <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase tracking-wider block border-b border-neutral-900 pb-1.5">Scenario C: Exit Gracefully</span>
                <div className="text-xs font-mono space-y-1.5 text-neutral-300">
                  <p className="text-indigo-400 font-semibold">You: quit</p>
                  <p className="text-neutral-400 font-semibold">Bot: Exit code triggered. Session disconnected. Loop broken gracefully.</p>
                  <p className="text-neutral-500 block pt-1.5 border-t border-neutral-900 mt-2">// Loop terminates, control returns safely. shell process exit 0.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Key Requirements / Skills / Code Box */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Skills Checklist Card */}
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Demonstrated Skills & Mechanics
            </h3>
            <div className="h-[1px] bg-neutral-800"></div>
            
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-200 block">Control Flow Logic</strong>
                  <span className="text-neutral-400 text-[10px]">Deterministic logic parsing using optimized python nested logic guards.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-200 block">Looping Interactivity</strong>
                  <span className="text-neutral-400 text-[10px]">Designing endless background execution shells to handle incoming std_in dynamically.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-200 block">Input Sanitization</strong>
                  <span className="text-neutral-400 text-[10px]">Utilizing built-in text trimming and lowercase functions to safely normalize keyboard input layout.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-200 block">Constant-Speed Dictionaries</strong>
                  <span className="text-neutral-400 text-[10px]">Bypassing O(n) sequential loop lag with O(1) key lookups, maintaining scalability.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Academic Learning Outcomes */}
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-400" />
              Target Learning Outcomes
            </h3>
            <div className="h-[1px] bg-neutral-800"></div>

            <p className="text-xs text-neutral-400 leading-normal mb-2 font-sans">
              Evaluating Project 1 outputs demonstrates core proficiency over:
            </p>

            <ul className="space-y-2.5 text-xs text-neutral-300 list-disc pl-4 font-sans">
              <li>Configuring interactive runtime cycle shells.</li>
              <li>Linear-time cleaning of incoming payload string arrays.</li>
              <li>How deterministic code matrices operate without full database components.</li>
            </ul>
          </div>

          {/* Technical Documentation Conclusion */}
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Conclusion
            </h3>
            <div className="h-[1px] bg-neutral-800"></div>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              A **Rule-Based Chatbot** is the critical structural first-step of conversational engineering. It establishes predictable channels, safeguards systems from malicious user overrides, and forms the bedrock core before expanding into NLP, Vector Embeddings, and Generative AI.
            </p>
          </div>

        </div>

      </div>

      {/* 3. FLUID FULL-WIDTH CODEBLOCK ZONE WITH EXPORT CONTROLS */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono font-semibold text-neutral-300">
              rule_based_chatbot.py
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 text-xs bg-neutral-800 border border-neutral-700 hover:text-white text-neutral-300 px-3 py-1.5 rounded-lg transition font-mono cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy Report Markdown"}
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-neutral-950">
          <pre className="text-xs font-mono overflow-x-auto text-neutral-300 custom-scrollbar leading-relaxed">
            <code>{samplePythonCode}</code>
          </pre>
        </div>
      </div>

    </div>
  );
}
