"use client";

import React, { useState } from "react";

// ✅ UI Components (shadcn/ui)
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

// ✅ Icons (lucide-react)
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GAD7FormProps {
  onClose: () => void;
}

const gad7Questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen",
];

const responseOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" },
];

export function GAD7Form({ onClose }: GAD7FormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>(new Array(7).fill(""));
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const isMainQuestionsComplete = responses.every((r) => r !== "");
  const progress = ((currentQuestion + 1) / gad7Questions.length) * 100;

  const handleResponseChange = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);
  };

  const nextQuestion = () => {
    if (currentQuestion < gad7Questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (isMainQuestionsComplete) {
      submitAssessment();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionnaire: "GAD-7",
          responses: responses.map((r) => parseInt(r)),
        }),
      });
      const data = await res.json();
      setResult(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting assessment:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">
        <p>Submitting your responses...</p>
      </div>
    );
  }

  if (showResults && result) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">GAD-7 Results</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{result.total_score}/21</div>
              <div className="text-xl font-semibold">{result.severity}</div>
              <p className="text-muted-foreground mt-2">{result.interpretation}</p>
            </div>

            <div className="flex gap-4">
              <Button onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex-1"
              >
                Print Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">GAD-7 Anxiety Screen</CardTitle>
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
            Question {currentQuestion + 1} of {gad7Questions.length}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">
              {currentQuestion + 1}. {gad7Questions[currentQuestion]}
            </h3>

            <RadioGroup
              value={responses[currentQuestion]}
              onValueChange={handleResponseChange}
              className="space-y-3"
            >
              {responseOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`q${currentQuestion}-${option.value}`}
                  />
                  <Label
                    htmlFor={`q${currentQuestion}-${option.value}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <span className="text-sm text-muted-foreground w-4">
                    {option.value}
                  </span>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button onClick={nextQuestion} disabled={!responses[currentQuestion]}>
              {currentQuestion === gad7Questions.length - 1 ? "Submit" : "Next"}
              {currentQuestion < gad7Questions.length - 1 && (
                <ChevronRight className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
