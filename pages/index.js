import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const aiMessage = {
        role: "assistant",
        content: data.reply || "没有返回内容",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "请求失败：" + err.message },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white text-black">

      {/* Header */}
      <div className="p-4 border-b border-black/10 text-center text-sm tracking-wide text-black/60">
        AI Assistant
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex animate-fadeIn ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed border ${
                msg.role === "user"
                  ? "bg-black text-white border-black/10"
                  : "bg-gray-100 text-black border-black/10"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-black/40 text-sm animate-pulse">
            AI 正在思考...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-black/10 bg-white">
        <div className="flex items-end gap-2 bg-gray-100 border border-black/10 rounded-2xl px-3 py-2">
          <textarea
            className="flex-1 bg-transparent text-sm resize-none outline-none text-black placeholder-black/40"
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="text-sm px-3 py-1 rounded-lg bg-black text-white hover:opacity-80 transition disabled:opacity-40"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}