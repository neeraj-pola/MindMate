"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Heart, Shield, Users } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { PHQ9Form } from "@/components/phq9-form"
import { GAD7Form } from "@/components/gad7-form"
import { ChatBox } from "@/components/ChatBox"

export default function HomePage() {
  const [activeForm, setActiveForm] = useState<"phq9" | "gad7" | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <Navbar onFormSelect={setActiveForm} />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 animate-gradient" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              Professional Mental Health Assessment
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              MindMate
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
              Take control of your mental health with scientifically validated assessments for depression and anxiety
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-lg font-semibold" onClick={() => setActiveForm("phq9")}>
                Start PHQ-9 Assessment
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold bg-transparent"
                onClick={() => setActiveForm("gad7")}
              >
                Start GAD-7 Assessment
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MindMate?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform uses clinically validated tools to provide accurate mental health assessments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <CardHeader className="text-center">
                <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>PHQ-9 Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Comprehensive depression screening using the Patient Health Questionnaire-9
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <CardHeader className="text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-accent" />
                <CardTitle>GAD-7 Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Anxiety disorder screening with the Generalized Anxiety Disorder 7-item scale
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <CardHeader className="text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Your responses are processed securely and never stored without your consent
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-accent" />
                <CardTitle>Professional Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Results include guidance on when to seek professional mental health support
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-16 bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About MindMate</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            MindMate is designed to make mental health assessment accessible and straightforward. Our platform uses
            evidence-based screening tools that are widely used by healthcare professionals worldwide. These assessments
            can help you understand your mental health status and guide you toward appropriate care when needed.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">PHQ-9 Depression Screen</h3>
              <p className="text-muted-foreground">
                The Patient Health Questionnaire-9 is a validated tool for screening, diagnosing, monitoring and
                measuring the severity of depression.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-accent">GAD-7 Anxiety Screen</h3>
              <p className="text-muted-foreground">
                The Generalized Anxiety Disorder 7-item scale is a reliable tool for screening and measuring anxiety
                disorder severity.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="px-6 py-16">
        < ChatBox />
      </section>

      {/* Form Modals */}
      {activeForm === "phq9" && <PHQ9Form onClose={() => setActiveForm(null)} />}
      {activeForm === "gad7" && <GAD7Form onClose={() => setActiveForm(null)} />}
    </div>
  )
}
