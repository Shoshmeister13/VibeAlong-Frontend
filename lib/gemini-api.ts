import { GoogleGenerativeAI } from "@google/generative-ai"

// Access the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY

// Initialize the Google Generative AI with the API key
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export async function generateText(prompt: string): Promise<string> {
  if (!genAI) {
    console.error("Gemini API key not found")
    throw new Error("Gemini API key not found")
  }

  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error("Error generating text with Gemini:", error)
    throw error
  }
}
