
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

export const analyzeFileSecurity = async (
  fileName: string,
  detectedType: string,
  hexPreview: string[],
  fileSize: number
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analyze this file:
    File Name: ${fileName}
    Detected Format: ${detectedType}
    File Size: ${fileSize} bytes
    Header Hex Dump (First 16 bytes): ${hexPreview.join(' ')}

    Identify if this file type is commonly used as a malware vector and provide defensive insights.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    return response.text || "Unable to retrieve forensic data from Gemini.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Forensic intelligence module offline. Check API connectivity.";
  }
};
