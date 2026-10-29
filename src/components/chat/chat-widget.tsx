"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, MessageCircle, Send, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ChatMessage = {
  role: "user" | "assistant"
  text: string
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  // Lets other UI (e.g. the hero's "Ask my AI" button) open the widget.
  useEffect(() => {
    const openChat = () => setOpen(true)
    window.addEventListener("open-chat", openChat)
    return () => window.removeEventListener("open-chat", openChat)
  }, [])

  async function ask() {
    const question = input.trim()
    if (!question || loading) return

    setInput("")
    setLoading(true)
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "assistant", text: "" },
    ])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })
      if (!response.ok || !response.body) {
        throw new Error(`Request failed (${response.status})`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          next[next.length - 1] = { ...last, text: last.text + text }
          return next
        })
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev]
        next[next.length - 1] = {
          role: "assistant",
          text: "Sorry, something went wrong. Please try again.",
        }
        return next
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {open ? (
        <div className="bg-background flex h-[28rem] w-80 flex-col rounded-xl border shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Ask about Aung</p>
              <p className="text-muted-foreground text-xs">
                Answers based on this portfolio
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Hi! Ask me anything about Aung&apos;s projects, skills, or
                experience.
              </p>
            )}
            {messages.map((message, i) => (
              <div
                key={i}
                className={
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-8 rounded-lg px-3 py-2 text-sm"
                    : "bg-muted mr-8 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap"
                }
              >
                {message.text ||
                  (loading && i === messages.length - 1 ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null)}
              </div>
            ))}
          </div>

          <form
            className="flex gap-2 border-t p-3"
            onSubmit={(e) => {
              e.preventDefault()
              ask()
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              maxLength={500}
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send"
              disabled={loading || !input.trim()}
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      ) : (
        <Button
          size="icon"
          className="size-12 rounded-full shadow-lg"
          aria-label="Open chat"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="size-5" />
        </Button>
      )}
    </div>
  )
}
