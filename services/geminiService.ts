import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, QuestionAndAnswer, QuestionLevel } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. The app may not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const questionAnswerSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING },
        },
        required: ["question", "answer"],
    },
};

const quizSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: {
          type: Type.STRING,
          description: "The quiz question text.",
        },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: "An array of 4 multiple-choice options, labeled 'a)', 'b)', 'c)', 'd)'.",
        },
        answer: {
          type: Type.STRING,
          description: "The correct answer, matching one of the options exactly.",
        },
      },
      required: ["question", "options", "answer"],
    },
};

export const generateActSceneQuestions = async (act: number, scene: number, level: QuestionLevel): Promise<QuestionAndAnswer[]> => {
    const prompt = `Generate 10 fresh, exam-style questions with concise answers from Shakespeare’s Julius Caesar, focusing on Act ${act} Scene ${scene}. The questions should be appropriate for a ${level} academic level. Ensure the questions are unique. Return valid JSON.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: questionAnswerSchema,
            },
        });
        const data = JSON.parse(response.text);
        if (!Array.isArray(data) || data.length === 0) {
             throw new Error("AI returned an invalid format for questions.");
        }
        return data as QuestionAndAnswer[];
    } catch (error) {
        console.error("Error generating act/scene questions:", error);
        throw new Error("Failed to generate content. Please check your API key and network connection.");
    }
};

export const generateCharacterQuestions = async (character: string, level: QuestionLevel): Promise<QuestionAndAnswer[]> => {
    const prompt = `Generate 10 new and insightful analytical questions with concise answers about the character ${character} from Shakespeare’s Julius Caesar. The questions should be suitable for a ${level} academic level. Avoid common or repetitive questions. Return valid JSON.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: questionAnswerSchema,
            },
        });
        const data = JSON.parse(response.text);
        if (!Array.isArray(data) || data.length === 0) {
             throw new Error("AI returned an invalid format for questions.");
        }
        return data as QuestionAndAnswer[];
    } catch (error) {
        console.error("Error generating character questions:", error);
        throw new Error("Failed to generate content. Please check your API key and network connection.");
    }
};

export const generateQuiz = async (level: QuestionLevel): Promise<QuizQuestion[]> => {
    const prompt = `Create a brand new 10-question multiple-choice quiz on Shakespeare's Julius Caesar, ensuring the questions are different from previous quizzes and tailored for a ${level} audience. Each question must include 4 options (labeled a, b, c, d) and 1 correct answer. Return valid JSON.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const quizData = JSON.parse(jsonText);

        if (!Array.isArray(quizData) || quizData.length === 0) {
            throw new Error("AI returned an invalid quiz format.");
        }
        
        // Validate each question
        return quizData.map((q: any) => {
            if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || !q.answer) {
                 throw new Error("AI returned a malformed question object.");
            }
            return q as QuizQuestion;
        });

    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate content. Please check your API key and network connection.");
    }
};

export const askDoubt = async (question: string): Promise<string> => {
    const prompt = `You are an expert tutor on Shakespeare's "Julius Caesar". A student has the following question: "${question}". Provide a clear, concise, and helpful answer.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const answer = response.text.trim();
        if (!answer) {
            throw new Error("AI returned an empty answer.");
        }
        return answer;
    } catch (error) {
        console.error("Error asking doubt:", error);
        throw new Error("Failed to generate content. Please check your API key and network connection.");
    }
};