"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, Copy, Share2, ChevronRight } from "lucide-react";
import { useUserProfile } from "@/store/userProfile";
import { useGamification } from "@/store/gamification";
import { useLang, t } from "@/store/language";
import { CitationCard } from "@/components/CitationCard";
import { MarkdownContent } from "@/components/MarkdownContent";
import type { ChatMessage, DocumentChunk } from "@/types";

// DiceBear avatar URLs — deterministic based on seed
function dicebear(seed: string, style = "bottts-neutral") {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

function Avatar({ seed, size = 32 }: { seed: string; size?: number }) {
  return (
    <img
      src={dicebear(seed)}
      alt="avatar"
      width={size}
      height={size}
      className="rounded-full bg-gray-100 shrink-0"
    />
  );
}

function MessageBubble({
  msg,
  onCopy,
  onShare,
}: {
  msg: ChatMessage;
  onCopy: (text: string) => void;
  onShare: (text: string) => void;
}) {
  const isUser = msg.role === "user";
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex gap-3 mb-5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Avatar seed={isUser ? "user-human" : "civicai-bot"} size={32} />
      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <span className="text-[11px] font-semibold text-gray-400 px-1">
          {isUser ? "You" : "CivicAI"}
        </span>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-green-700 text-white rounded-tr-sm"
              : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{msg.content}</p>
          ) : msg.content ? (
            <MarkdownContent content={msg.content} />
          ) : (
            <span className="text-gray-400">…</span>
          )}
        </div>
        {!isUser && hovered && msg.content && (
          <div className="flex gap-2 px-1">
            <button
              onClick={() => onCopy(msg.content)}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600"
            >
              <Copy size={11} /> Copy
            </button>
            <button
              onClick={() => onShare(msg.content)}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600"
            >
              <Share2 size={11} /> Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const profile = useUserProfile();
  const { addPoints, earnBadge } = useGamification();
  const { lang } = useLang();
  const tr = t[lang];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [citations, setCitations] = useState<DocumentChunk[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstMessage = useRef(true);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async (text: string) => {
    text = text.trim();
    if (!text || loading) return;
    setInput("");
    setLoading(true);

    if (firstMessage.current) {
      earnBadge("first_chat");
      addPoints(10);
      firstMessage.current = false;
    }

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userProfile: profile, history }),
      });

      if (!res.body) { setLoading(false); return; }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("event: citations")) continue;
          if (line.startsWith("data: ")) {
            const payload = line.slice(6);
            if (payload === "[DONE]") { setLoading(false); addPoints(5); continue; }
            try {
              const parsed = JSON.parse(payload);
              if (Array.isArray(parsed)) {
                setCitations(parsed as DocumentChunk[]);
              } else if (parsed.text) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: m.content + parsed.text } : m
                  )
                );
              }
            } catch { /* ignore */ }
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, [loading, messages, profile, addPoints, earnBadge]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (text: string) => {
    const snippet = text.slice(0, 280);
    setShareMsg(snippet);
    navigator.clipboard.writeText(`${snippet}\n\n— CivicAI (civicai.ke)`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden bg-gray-50">
      {/* Main chat */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
              <Avatar seed="civicai-bot" size={64} />
              <div>
                <p className="text-xl font-bold text-gray-800 mb-1">{tr.chatEmpty}</p>
                <p className="text-sm text-gray-400">{tr.chatEmptyEx}</p>
                {!profile.isComplete && (
                  <a href="/profile" className="block mt-3 text-sm text-green-700 underline">
                    Set up your profile for personalized answers →
                  </a>
                )}
              </div>
              {/* Suggested prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl w-full">
                {tr.suggestedPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="flex items-center gap-2 text-left border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm text-gray-700 hover:border-green-300 hover:bg-green-50 transition-all group"
                  >
                    <Sparkles size={14} className="text-green-600 shrink-0" />
                    <span>{p}</span>
                    <ChevronRight size={12} className="ml-auto text-gray-300 group-hover:text-green-600" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {messages.map((m) => (
                <MessageBubble key={m.id} msg={m} onCopy={handleCopy} onShare={handleShare} />
              ))}
              {loading && (
                <div className="flex gap-3 mb-5">
                  <Avatar seed="civicai-bot" size={32} />
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-gray-200 bg-white px-4 py-3 shadow-sm">
          {copied && (
            <div className="text-center text-xs text-green-600 mb-2">{tr.copied}</div>
          )}
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
              placeholder={tr.chatInput}
              className="flex-1 bg-gray-100 border border-transparent rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-green-400 transition-all"
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="bg-green-700 text-white px-4 py-2.5 rounded-xl hover:bg-green-800 disabled:opacity-40 transition-colors flex items-center gap-1.5 font-medium text-sm"
            >
              <Send size={14} /> {tr.send}
            </button>
          </div>
        </div>
      </div>

      {/* Citations sidebar */}
      {citations.length > 0 && (
        <aside className="hidden lg:flex flex-col w-72 border-l border-gray-200 bg-white overflow-y-auto">
          <div className="px-4 pt-4 pb-2 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{tr.sources}</p>
          </div>
          <div className="p-3">
            <CitationCard chunks={citations} />
          </div>
        </aside>
      )}
    </div>
  );
}
