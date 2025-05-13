"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables")
  }

  return new GoogleGenerativeAI(apiKey)
}

// Generate text with Gemini
export async function generateAIResponse(prompt: string, modelName = "gemini-pro") {
  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({ model: modelName })

    const result = await model.generateContent(prompt)
    const response = result.response
    return { success: true, data: response.text() }
  } catch (error) {
    console.error("Error generating text with Gemini:", error)
    return { success: false, error: String(error) }
  }
}

// Generate chat response with Gemini
export async function generateAIChatResponse(
  messages: { role: "user" | "model"; content: string }[],
  modelName = "gemini-pro",
) {
  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({ model: modelName })

    const chat = model.startChat({
      history: messages.slice(0, -1),
    })

    const lastMessage = messages[messages.length - 1]
    const result = await chat.sendMessage(lastMessage.content)
    return { success: true, data: result.response.text() }
  } catch (error) {
    console.error("Error generating chat response with Gemini:", error)
    return { success: false, error: String(error) }
  }
}

// Generate code with Gemini
export async function generateAICode(prompt: string, modelName = "gemini-pro") {
  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({ model: modelName })

    const result = await model.generateContent(`Generate code for the following: ${prompt}`)
    const response = result.response
    return { success: true, data: response.text() }
  } catch (error) {
    console.error("Error generating code with Gemini:", error)
    return { success: false, error: String(error) }
  }
}
