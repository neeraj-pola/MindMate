"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface PHQ9FormProps {
  onClose: () => void
}

const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way",
]

const responseOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" },
]

export function PHQ9Form({ onClose }: PHQ9FormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<string[]>(new Array(9).fill(""))
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const isMainQuestionsComplete = responses.every((response) => response !== "")
  const progress = ((currentQuestion + 1) / phq9Questions.length) * 100

  const handleResponseChange = (value: string) => {
    const newResponses = [...responses]
    newResponses[currentQuestion] = value
    setResponses(newResponses)
  }

  const nextQuestion = () => {
    if (currentQuestion < phq9Questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (isMainQuestionsComplete) {
      submitAssessment()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // 🔑 Send responses to FastAPI backend
  const submitAssessment = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionnaire: "PHQ-9",
          responses: responses.map((r) => parseInt(r)),
        }),
      })
      const data = await res.json()
      setResult(data)
      setShowResults(true)
    } catch (error) {
      console.error("Error submitting PHQ-9:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">
        <p>Submitting your responses...</p>
      </div>
    )
  }

  if (showResults && result) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">PHQ-9 Results</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{result.total_score}/27</div>
              <div className="text-xl font-semibold">{result.severity}</div>
              <p className="text-muted-foreground mt-2">{result.interpretation}</p>
            </div>

            <div className="flex gap-4">
              <Button onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button variant="outline" onClick={() => window.print()} className="flex-1">
                Print Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">PHQ-9 Depression Screen</CardTitle>
              <CardDescription>
                Over the last 2 weeks, how often have you been bothered by the following problems?
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {phq9Questions.length}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">
              {currentQuestion + 1}. {phq9Questions[currentQuestion]}
            </h3>

            <RadioGroup value={responses[currentQuestion]} onValueChange={handleResponseChange} className="space-y-3">
              {responseOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`q${currentQuestion}-${option.value}`} />
                  <Label htmlFor={`q${currentQuestion}-${option.value}`} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                  <span className="text-sm text-muted-foreground w-4">{option.value}</span>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button onClick={nextQuestion} disabled={!responses[currentQuestion]}>
              {currentQuestion === phq9Questions.length - 1 ? "Submit" : "Next"}
              {currentQuestion < phq9Questions.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
