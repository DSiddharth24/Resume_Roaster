import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase request size limits for base64 file payloads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Lazy initialize Gemini API to fail gracefully if key is missing
let aiInstance: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please configure it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// Roast API Endpoint
app.post("/api/roast", async (req, res) => {
  try {
    const { text, file } = req.body;

    if (!text && !file) {
      return res.status(400).json({
        error: "No resume provided. Please paste your resume text or upload a PDF/text file.",
      });
    }

    const ai = getGemini();

    let contents: any;
    if (file && file.base64 && file.mimeType) {
      contents = [
        {
          inlineData: {
            mimeType: file.mimeType,
            data: file.base64,
          },
        },
        {
          text: "Analyze and roast this resume. Please find between 5 and 8 specific callouts where the phrasing is weak, vague, or filled with fluff. Provide concrete rewrites.",
        },
      ];
    } else {
      contents = `Here is the resume content:\n\n${text}\n\nAnalyze and roast this resume. Please find between 5 and 8 specific callouts where the phrasing is weak, vague, or filled with fluff. Provide concrete rewrites.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: `You are 'The Resume Roaster' — an elite, incredibly sharp, and highly experienced senior hiring manager who has scanned over 50,000 resumes and is completely done being polite about lazy, boring, or vague writing. You actually like the candidate and want them to get hired, which is why you refuse to waste their time with soft, friendly platitudes or generic career-center advice. You are here to tell them the absolute, unfiltered truth.

Your tone is dry, witty, occasionally sarcastic, and highly specific. Do not use generic roast jokes; every criticism must feel directly tied to the words, formatting, or missing details in the provided resume. Keep your roasting directed entirely at the resume's text, formatting, lack of numbers, buzzwords, or phrasing — NEVER make personal attacks on the candidate's character or intelligence. It should feel like an incredibly useful, eye-opening 5-minute mentorship session with a sharp, funny boss.

You must analyze the resume and return a JSON object matching this schema:
{
  "verdict": "A single, sharp, headline-style sentence summing up the biggest issue or strongest overall impression of this resume. This should be witty, punchy, and highly shareable.",
  "sixSecondTest": "An honest description of what a recruiter's eye actually catches in the first 6 seconds of glancing at this resume, and what split-second impression it leaves.",
  "callouts": [
    {
      "original": "The exact weak, boring, or vague phrase or sentence from the resume.",
      "issue": "A brief explanation (with sharp wit and personality) of why this line doesn't work (e.g. describing passive duties instead of accomplishments, using meaningless buzzwords, or lacking measurable numbers/impact).",
      "rewrite": "A concrete, rewritten, high-impact version of that same line that is specific, quantitative, and directly usable."
    }
  ],
  "compliment": "One genuine, specific compliment about something on the resume that actually works well (e.g. a genuinely solid skill, a well-written project description, or a great achievement) so the experience feels fair and constructive."
}

Important constraints:
1. Every callout's "original" field MUST contain an exact or nearly exact quote of a phrase or line present in the input resume.
2. The number of callouts must be between 5 and 8.
3. Keep the rewrites professional, high-impact, and directly usable. Do not put jokes inside the "rewrite" field — keep the humor in the "issue" and "verdict" fields.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.STRING,
              description: "One sharp, headline-style sentence summing up the biggest issue or strongest impression.",
            },
            sixSecondTest: {
              type: Type.STRING,
              description: "Honest description of what a recruiter catches in the first six seconds.",
            },
            callouts: {
              type: Type.ARRAY,
              description: "A list of 5 to 8 specific weak phrases and their rewrites.",
              items: {
                type: Type.OBJECT,
                properties: {
                  original: {
                    type: Type.STRING,
                    description: "The exact weak phrase or line quoted from the resume.",
                  },
                  issue: {
                    type: Type.STRING,
                    description: "Brief, witty explanation of why it doesn't work.",
                  },
                  rewrite: {
                    type: Type.STRING,
                    description: "Rewritten version of that line that is concrete, specific, and high-impact.",
                  },
                },
                required: ["original", "issue", "rewrite"],
              },
            },
            compliment: {
              type: Type.STRING,
              description: "One genuine, specific compliment about something on the resume that actually works well.",
            },
          },
          required: ["verdict", "sixSecondTest", "callouts", "compliment"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini API.");
    }

    const data = JSON.parse(response.text.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Roast error details:", error);
    return res.status(500).json({
      error: error.message || "Failed to process the roast. Please ensure your API key is configured correctly and try again.",
    });
  }
});

// Configure Vite or Static Assets serving
async function configureApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Resume Roaster Server] running on http://localhost:${PORT}`);
  });
}

configureApp();
