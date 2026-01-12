
import { GoogleGenAI, Type } from "@google/genai";

// Create a new instance right before making calls to ensure we use the current API key context
export async function generateLearningPath(interest: string, currentLevel: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a comprehensive "Zero to Hero" structured learning path for a ${currentLevel} student interested in ${interest}. 
    The path must be thorough and include everything from the absolute basics/fundamentals to advanced techniques and industry-best practices. 
    Provide 8-10 logical steps that build upon each other. 
    Each step must have a clear title, a detailed description of what will be learned, and a realistic estimated time to master that specific module.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pathTitle: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                estimatedTime: { type: Type.STRING }
              }
            }
          }
        },
        required: ["pathTitle", "steps"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function generateQuizQuestions(topic: string, type: string = 'MCQ') {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const typePrompt = type === 'CODING' 
    ? "Focus on code snippets, syntax, and algorithmic logic." 
    : "Focus on conceptual understanding and theoretical knowledge.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate exactly 10 comprehensive ${type} questions for the topic: ${topic}. ${typePrompt} Ensure questions vary in difficulty.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exactly 4 options" },
            correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
            explanation: { type: Type.STRING, description: "Short explanation of why this is correct" }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
}

export async function getCourseRecommendations(userContext: any, currentCourses: any[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the following student context:
    - Academic Focus/Interests: ${userContext.branch}
    - Progress in current courses: ${JSON.stringify(currentCourses.filter(c => c.progress > 0).map(c => ({ title: c.title, progress: c.progress })))}
    Suggest 3 unique courses that would be logically perfect next steps for this student's academic growth. 
    Do not suggest courses they are already enrolled in.
    For each course, provide a title, a short catchy description, and a compelling reason why it's recommended for them specifically.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["title", "description", "reason"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
}
