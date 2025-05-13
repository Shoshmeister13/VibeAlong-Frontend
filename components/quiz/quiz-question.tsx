"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuizQuestion } from "@/data/quiz-questions"
import { CheckCircle, XCircle } from "lucide-react"

interface QuizQuestionProps {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  onAnswer: (isCorrect: boolean) => void
}

export function QuizQuestionCard({ question, questionNumber, totalQuestions, onAnswer }: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const isCorrect = selectedOption === question.correctAnswer

  const handleSubmit = () => {
    if (selectedOption === null) return
    setHasSubmitted(true)
    onAnswer(isCorrect)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <CardTitle className="text-xl">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(value) => !hasSubmitted && setSelectedOption(Number.parseInt(value))}
          className="space-y-3"
          disabled={hasSubmitted}
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 rounded-md border p-3 
                ${hasSubmitted && index === question.correctAnswer ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""}
                ${hasSubmitted && selectedOption === index && index !== question.correctAnswer ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""}
                ${!hasSubmitted ? "hover:bg-accent" : ""}
              `}
            >
              <RadioGroupItem value={index.toString()} id={`option-${questionNumber}-${index}`} />
              <Label htmlFor={`option-${questionNumber}-${index}`} className="flex-grow cursor-pointer">
                {option}
              </Label>
              {hasSubmitted && index === question.correctAnswer && <CheckCircle className="h-5 w-5 text-green-500" />}
              {hasSubmitted && selectedOption === index && index !== question.correctAnswer && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} disabled={selectedOption === null || hasSubmitted}>
          Submit Answer
        </Button>
      </CardFooter>
    </Card>
  )
}
