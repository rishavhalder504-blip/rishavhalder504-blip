
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationConfig, Question, QuestionType } from "./types";
import { KIPS_CHAPTERS } from "./constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateQuestions(config: GenerationConfig): Promise<Question[]> {
  const chapter = KIPS_CHAPTERS.find(c => c.id === config.chapterId);
  if (!chapter) throw new Error("Chapter not found");

  const prompt = `Generate a set of ${config.count} Information Technology questions for Class 9 students based on the KIPS curriculum for Subject Code 417.
  Chapter: ${chapter.title}
  Topics: ${chapter.topics.join(", ")}
  Question Types Required: ${config.questionTypes.join(", ")}
  Difficulty: ${config.difficulty}

  Important: Strictly follow the Kips Information Technology (Subject Code: 417) textbook style. 
  Ensure technical accuracy according to common Class 9 IT software (like LibreOffice Writer, Calc, Impress or MS Office equivalents as taught in the Kips book).
  Include clear, concise answers and brief explanations for why the answer is correct.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, enum: Object.values(QuestionType) },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Include 4 options only if type is MCQ"
            },
            answer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["id", "type", "question", "answer"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response content received from the AI model.");
  }

  try {
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Failed to parse Gemini response:", error, text);
    throw new Error("Failed to generate valid question data. Please try again.");
  }
}
