// In a real application, this would interact with your database
// For now, we'll use localStorage as a simple storage mechanism

export interface QuizResult {
  userId: string
  passed: boolean
  score: number
  completedAt: string
}

export const saveQuizResult = (userId: string, passed: boolean, score: number) => {
  const result: QuizResult = {
    userId,
    passed,
    score,
    completedAt: new Date().toISOString(),
  }

  // In a real app, you would save this to your database
  // For now, we'll use localStorage
  localStorage.setItem(`quiz_result_${userId}`, JSON.stringify(result))

  return result
}

export const getQuizResult = (userId: string): QuizResult | null => {
  // In a real app, you would fetch this from your database
  const resultString = localStorage.getItem(`quiz_result_${userId}`)
  if (!resultString) return null

  try {
    return JSON.parse(resultString) as QuizResult
  } catch (error) {
    console.error("Error parsing quiz result:", error)
    return null
  }
}

export const hasPassedQuiz = (userId: string): boolean => {
  const result = getQuizResult(userId)
  return result?.passed || false
}
