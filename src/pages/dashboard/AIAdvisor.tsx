import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Send, Sparkles } from "lucide-react";

const suggestedPrompts = [
  "What tax deductions am I eligible for this quarter?",
  "Explain Section 44AD presumptive taxation",
  "How can I reduce my GST liability legally?",
  "Generate a tax saving plan for FY 2025-26",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Hello Rohit! I'm your AI tax advisor. I have context on your business financials, GST filings, and compliance status. How can I help you today?",
  },
];

export default function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Based on your current revenue of ₹18.4L and expense patterns, I'd recommend exploring Section 80JJAA deductions for new employee hires. Your eligible deduction could be approximately ₹1.8L, reducing your effective tax rate by ~2.3%. Shall I prepare a detailed breakdown?",
        },
      ]);
    }, 1200);
  };

  const handlePrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          AI Tax Advisor
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ask questions about tax, compliance, and financial strategy.
        </p>
      </div>

      <div className="flex-1 overflow-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {messages.length <= 1 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handlePrompt(prompt)}
              className="text-left text-sm p-3 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/20 transition-all text-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary mb-1" />
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 border border-border rounded-2xl bg-card p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about tax, GST, compliance…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground px-3 py-2 outline-none"
        />
        <Button
          variant="default"
          size="icon"
          onClick={handleSend}
          disabled={!input.trim()}
          className="rounded-xl shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
