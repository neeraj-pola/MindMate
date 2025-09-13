"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  sender: "user" | "ai"
  text: string
}

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage: Message = { sender: "user", text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      })
      const data = await response.json()
      const aiMessage: Message = { sender: "ai", text: data.answer || "No response from AI." }
      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [...prev, { sender: "ai", text: "⚠️ Error contacting server." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-12 max-w-3xl mx-auto border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Chat with MindMate AI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-80 overflow-y-auto border rounded p-4 bg-background/40">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                  msg.sender === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <p className="text-sm text-muted-foreground">AI is thinking...</p>}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={loading}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
