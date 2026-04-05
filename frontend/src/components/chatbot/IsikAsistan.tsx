import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  X,
  Phone,
  Send,
  ArrowLeft,
  Scale,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import { CHATBOT_TREE, type ChatNode } from "@/lib/chatbot-tree";

interface ChatMessage {
  id: string;
  type: "bot" | "user";
  text: string;
  node?: ChatNode;
}

export default function IsikAsistan() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState("root");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  const addBotMessage = useCallback(
    (nodeId: string) => {
      const node = CHATBOT_TREE[nodeId];
      if (!node) return;

      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `bot-${Date.now()}`, type: "bot", text: node.message, node },
        ]);
        setCurrentNodeId(nodeId);
        scrollToBottom();
      }, 600);
    },
    [scrollToBottom],
  );

  // Initialize with root message on first open
  useEffect(() => {
    if (open && !hasInitialized.current) {
      hasInitialized.current = true;
      addBotMessage("root");
    }
  }, [open, addBotMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  const handleOptionClick = (label: string, nextId: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: "user", text: label },
    ]);
    addBotMessage(nextId);
  };

  const handleRestart = () => {
    setMessages([]);
    hasInitialized.current = false;
    setTimeout(() => {
      hasInitialized.current = true;
      addBotMessage("root");
    }, 100);
  };

  const handleBack = () => {
    // Find previous bot message to go back to
    const botMessages = messages.filter((m) => m.type === "bot");
    if (botMessages.length < 2) return;

    const prevBot = botMessages[botMessages.length - 2];
    const prevBotIndex = messages.indexOf(prevBot);

    setMessages(messages.slice(0, prevBotIndex + 1));
    setCurrentNodeId(prevBot.node?.id ?? "root");
  };

  const currentNode = CHATBOT_TREE[currentNodeId];
  const canGoBack = messages.filter((m) => m.type === "bot").length > 1;

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center bg-navy text-white shadow-lg shadow-navy/25 transition-colors hover:bg-navy-light sm:h-16 sm:w-16"
            aria-label="Işık Asistan'ı aç"
          >
            <MessageCircle size={24} />
            {/* Pulse indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping bg-gold opacity-75" />
              <span className="relative inline-flex h-4 w-4 bg-gold" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 right-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:h-[560px] sm:w-[380px] sm:border sm:border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-navy px-4 py-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-white/10">
                <Scale size={18} className="text-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">Işık Asistan</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
                  Hukuki Yönlendirme
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center text-gray-400 transition-colors hover:text-white"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4"
              style={{ scrollBehavior: "smooth" }}
            >
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={clsx(
                        "flex",
                        msg.type === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      {msg.type === "bot" ? (
                        <div className="max-w-[88%]">
                          <div className="bg-[#f8f7f4] px-4 py-3">
                            <p className="text-[13px] leading-relaxed text-gray-700">
                              {msg.text}
                            </p>
                          </div>

                          {/* Action buttons for terminal nodes */}
                          {msg.node?.action && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {(msg.node.action === "contact" ||
                                msg.node.action === "call") && (
                                <a
                                  href="tel:+905452162466"
                                  className="inline-flex items-center gap-1.5 bg-navy px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-navy-light"
                                >
                                  <Phone size={12} />
                                  Hemen Ara
                                </a>
                              )}
                              {msg.node.action === "contact" && (
                                <Link
                                  to="/iletisim"
                                  onClick={() => setOpen(false)}
                                  className="inline-flex items-center gap-1.5 border border-navy px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-navy transition-colors hover:bg-navy hover:text-white"
                                >
                                  <Send size={12} />
                                  Mesaj Gonder
                                </Link>
                              )}
                              {msg.node.areaSlug && (
                                <Link
                                  to={`/calisma-alanlari/${msg.node.areaSlug}`}
                                  onClick={() => setOpen(false)}
                                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gold transition-opacity hover:opacity-70"
                                >
                                  Detayli Bilgi
                                  <ChevronRight size={12} />
                                </Link>
                              )}
                            </div>
                          )}

                          {/* Option buttons */}
                          {msg.node?.options &&
                            msg.id ===
                              messages.filter((m) => m.type === "bot").slice(-1)[0]
                                ?.id && (
                              <div className="mt-2.5 space-y-1.5">
                                {msg.node.options.map((opt) => (
                                  <button
                                    key={opt.nextId}
                                    onClick={() =>
                                      handleOptionClick(opt.label, opt.nextId)
                                    }
                                    className="group flex w-full items-center gap-2 border border-gray-200 bg-white px-3.5 py-2.5 text-left text-[13px] text-navy transition-all hover:border-gold/50 hover:bg-[#faf9f7]"
                                  >
                                    <span className="flex-1">{opt.label}</span>
                                    <ChevronRight
                                      size={14}
                                      className="shrink-0 text-gray-300 transition-colors group-hover:text-gold"
                                    />
                                  </button>
                                ))}
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="max-w-[80%] bg-navy px-4 py-2.5">
                          <p className="text-[13px] leading-relaxed text-white">
                            {msg.text}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {typing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#f8f7f4] px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="h-1.5 w-1.5 animate-bounce bg-gray-400"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {canGoBack && (
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.1em] text-gray-400 transition-colors hover:text-navy"
                    >
                      <ArrowLeft size={12} />
                      Geri
                    </button>
                  )}
                </div>
                <button
                  onClick={handleRestart}
                  className="text-[11px] font-medium uppercase tracking-[0.1em] text-gray-400 transition-colors hover:text-gold"
                >
                  Yeniden Basla
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
