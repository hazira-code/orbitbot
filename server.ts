import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Hybrid mode will fall back to server error or mocked AI.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Memory-based or fallback rule lists
const defaultRules = [
  { trigger: "hello", response: "Hello there! How can I help you today?" },
  { trigger: "hi", response: "Hey! Nice to chat with you. Ask me anything!" },
  { trigger: "bye", response: "Goodbye! Hope you had a great session." },
  { trigger: "goodbye", response: "Farewell! Have a wonderful day!" },
  { trigger: "how are you", response: "I am a deterministic system running smoothly at 100% capacity." },
  { trigger: "who are you", response: "I am a Rule-Based AI Chatbot showing the precision of direct key-value matching." },
  { trigger: "help", response: "I support direct matches for: hello, hi, bye, goodbye, 'how are you', 'who are you', and 'joke'. You can also toggle Hybrid Mode to let me call Gemini when no rule matches!" },
  { trigger: "joke", response: "Why do programmers wear glasses? Because they can't C#!" }
];

// Health API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Rules API (Get default rules)
app.get("/api/rules", (req, res) => {
  res.json({ rules: defaultRules });
});

// Chat processor API: Demonstrates the Hybrid matching flow on the backend
app.post("/api/chat", async (req, res) => {
  try {
    const { message, rulesList, hybridMode } = req.body;
    
    if (typeof message !== "string") {
      return res.status(400).json({ error: "Message must be a string." });
    }

    // 1. Sanitization & Normalization
    const rawInput = message;
    const cleanInput = rawInput.toLowerCase().trim();

    // Check for exit commands
    const exitCommands = ["exit", "quit", "byebye", "kill", "terminate"];
    if (exitCommands.includes(cleanInput)) {
      return res.json({
        rawInput,
        cleanInput,
        matched: true,
        type: "rule",
        trigger: cleanInput,
        response: "Exit code triggered. Session disconnected. Continuous loop broken.",
        isExit: true,
        executionTimeMs: 0
      });
    }

    const t0 = performance.now();

    // 2. Intent matching with O(1) style lookup
    // Build lookup map from the latest frontend synchronized array
    const activeRules = Array.isArray(rulesList) ? rulesList : defaultRules;
    const lookupMap = new Map<string, string>();
    activeRules.forEach(r => {
      if (r.trigger && r.response) {
        lookupMap.set(r.trigger.toLowerCase().trim(), r.response);
      }
    });

    const matchedResponse = lookupMap.get(cleanInput);
    const tMatch = performance.now();

    if (matchedResponse) {
      return res.json({
        rawInput,
        cleanInput,
        matched: true,
        type: "rule",
        trigger: cleanInput,
        response: matchedResponse,
        isExit: false,
        executionTimeMs: parseFloat((tMatch - t0).toFixed(4))
      });
    }

    // 3. Fallback or LLM hybrid match
    if (hybridMode) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Fallback simulated AI if no key is supplied
        const tEnd = performance.now();
        return res.json({
          rawInput,
          cleanInput,
          matched: true,
          type: "simulated_ai",
          response: `[Simulated Gemini Response] Since GEMINI_API_KEY is not configured yet, here is a deterministic fallback. You asked: "${rawInput}"`,
          isExit: false,
          executionTimeMs: parseFloat((tEnd - t0).toFixed(4))
        });
      }

      // Real Gemini API Call
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: rawInput,
        config: {
          systemInstruction: "You are the LLM callback fallback of a Hybrid Rule-Based Chatbot. The user query did not match any of the strict predefined developer rules, so it was routed to you for a conversational answer. Keep your response friendly, clear, and relatively concise (under 3 sentences)."
        }
      });

      const aiText = response.text || "I was unable to generate a response.";
      const tEnd = performance.now();

      return res.json({
        rawInput,
        cleanInput,
        matched: true,
        type: "ai",
        response: aiText,
        isExit: false,
        executionTimeMs: parseFloat((tEnd - t0).toFixed(2))
      });
    }

    // Default Fallback
    const tEnd = performance.now();
    return res.json({
      rawInput,
      cleanInput,
      matched: false,
      type: "fallback",
      response: "I do not understand. (No matching rules discovered, Hybrid AI Mode is disabled.)",
      isExit: false,
      executionTimeMs: parseFloat((tEnd - t0).toFixed(4))
    });

  } catch (error: any) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: error.message || "An error occurred on the server." });
  }
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
