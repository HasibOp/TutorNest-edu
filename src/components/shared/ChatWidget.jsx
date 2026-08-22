import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useAxiosPublic from "@/hooks/useAxiosPublic";

const markdownComponents = {
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    em: ({ children }) => <em className="text-slate-300">{children}</em>,
    ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>,
    ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>,
    li: ({ children }) => <li className="leading-snug">{children}</li>,
    h1: ({ children }) => <p className="mb-1 mt-1 font-semibold text-white">{children}</p>,
    h2: ({ children }) => <p className="mb-1 mt-1 font-semibold text-white">{children}</p>,
    h3: ({ children }) => <p className="mb-1 mt-1 font-semibold text-white">{children}</p>,
    code: ({ children }) => <code className="rounded bg-black/30 px-1 py-0.5 text-xs text-amber-300">{children}</code>,
    a: ({ href, children }) => {
        const isInternal = href?.startsWith("/");
        if (isInternal) {
            return (
                <Link to={href} className="font-medium text-fuchsia-400 underline underline-offset-2 hover:text-fuchsia-300">
                    {children}
                </Link>
            );
        }
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-fuchsia-400 underline underline-offset-2 hover:text-fuchsia-300">
                {children}
            </a>
        );
    },
};

const ChatWidget = () => {
    const axiosPublic = useAxiosPublic();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", text: "Hi! I'm the TutorNest assistant. Ask me about finding tutors, courses, or how booking works." },
    ]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const interactionIdRef = useRef(null);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isSending) return;

        setMessages((prev) => [...prev, { role: "user", text }]);
        setInput("");
        setIsSending(true);

        try {
            const { data } = await axiosPublic.post("/chat", {
                message: text,
                interactionId: interactionIdRef.current,
            });
            interactionIdRef.current = data.interactionId;
            setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
        } catch {
            setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, something went wrong. Please try again." }]);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.97 }}
                        className="flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a1130] shadow-2xl sm:w-96">
                        <div className="flex items-center justify-between border-b border-white/10 bg-linear-to-r from-fuchsia-500/15 to-purple-600/15 px-4 py-3">
                            <p className="text-sm font-semibold text-white">TutorNest Assistant</p>
                            <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="h-4.5 w-4.5" />
                            </button>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    {msg.role === "user" ? (
                                        <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-linear-to-r from-fuchsia-500 to-purple-600 px-3.5 py-2 text-sm text-white">
                                            {msg.text}
                                        </p>
                                    ) : (
                                        <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-slate-200">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isSending && (
                                <div className="flex justify-start">
                                    <p className="max-w-[85%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-slate-400">
                                        Typing…
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 border-t border-white/10 p-3">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message…"
                                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-fuchsia-400/60"
                            />
                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={isSending || !input.trim()}
                                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-r from-fuchsia-500 to-purple-600 text-white disabled:opacity-50">
                                <Send className="h-4.5 w-4.5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Toggle chat assistant"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-500 to-purple-600 text-white shadow-[0_0_20px_rgba(217,70,239,0.45)] transition-transform hover:scale-105">
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </button>
        </div>
    );
};

export default ChatWidget;
