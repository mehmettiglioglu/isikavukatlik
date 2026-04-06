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
  CheckCircle,
  AlertCircle,
  User,
  MessageSquare,
  ShieldCheck,
  Clock,
  FileText,
  AlertTriangle,
  ListChecks,
} from "lucide-react";
import clsx from "clsx";
import { CHATBOT_TREE, type ChatNode } from "@/lib/chatbot-tree";
import { sendContactMessage } from "@/lib/api";

interface ChatMessage {
  id: string;
  type: "bot" | "user";
  text: string;
  node?: ChatNode;
}

/* ── Validation helpers ─────────────────────────────────── */

const LIMITS = { name: 80, phone: 15, message: 500 } as const;

function validateName(v: string): string | null {
  const t = v.trim();
  if (!t) return "Ad soyad zorunludur";
  if (t.length < 3) return "En az 3 karakter giriniz";
  if (t.length > LIMITS.name) return `En fazla ${LIMITS.name} karakter`;
  if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜâÂîÎûÛ\s]+$/.test(t))
    return "Yalnızca harf ve boşluk kullanınız";
  return null;
}

function validatePhone(v: string): string | null {
  const digits = v.replace(/\D/g, "");
  if (!digits) return "Telefon numarası zorunludur";
  if (digits.length < 10) return "En az 10 haneli olmalıdır";
  if (digits.length > LIMITS.phone) return "Geçersiz telefon numarası";
  return null;
}

function validateMessage(v: string): string | null {
  const t = v.trim();
  if (!t) return "Mesaj zorunludur";
  if (t.length < 10) return "En az 10 karakter giriniz";
  if (t.length > LIMITS.message) return `En fazla ${LIMITS.message} karakter`;
  return null;
}

/* ── Inline contact form ────��───────────────────────────── */

/* ── Info cards for terminal nodes ───────────────────────── */

function DropdownArrow() {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      className="ml-auto shrink-0 text-gray-400 transition-transform group-open:rotate-180"
    >
      <path
        d="M1 1l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoCards({ info }: { info: NonNullable<ChatNode["info"]> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="mt-2.5 space-y-2"
    >
      {/* Deadline / urgency warning */}
      {info.deadline && (
        <div className="flex gap-2.5 border-l-2 border-gold bg-[#fdf8f0] px-3 py-2.5">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-gold" />
          <p className="text-[12px] leading-relaxed text-gray-700">
            {info.deadline}
          </p>
        </div>
      )}

      {/* Rights */}
      {info.rights && info.rights.length > 0 && (
        <details className="group" open>
          <summary className="flex cursor-pointer items-center gap-2 bg-[#f8f7f4] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-navy select-none">
            <ShieldCheck size={13} className="shrink-0 text-gold" />
            Haklarınız
            <DropdownArrow />
          </summary>
          <ul className="space-y-1.5 bg-[#f8f7f4] px-3 pb-2.5">
            {info.rights.map((r, i) => (
              <li
                key={i}
                className="flex gap-2 text-[12px] leading-relaxed text-gray-600"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 bg-gold" />
                {r}
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Duration */}
      {info.duration && (
        <div className="flex items-start gap-2.5 bg-[#f8f7f4] px-3 py-2.5">
          <Clock size={13} className="mt-0.5 shrink-0 text-gray-400" />
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-gray-400">
              Tahmini Süre
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-gray-600">
              {info.duration}
            </p>
          </div>
        </div>
      )}

      {/* Documents */}
      {info.documents && info.documents.length > 0 && (
        <details className="group">
          <summary className="flex cursor-pointer items-center gap-2 bg-[#f8f7f4] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-navy select-none">
            <FileText size={13} className="shrink-0 text-gold" />
            Görüşmeye Getirin
            <DropdownArrow />
          </summary>
          <ul className="space-y-1.5 bg-[#f8f7f4] px-3 pb-2.5">
            {info.documents.map((d, i) => (
              <li
                key={i}
                className="flex gap-2 text-[12px] leading-relaxed text-gray-600"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 bg-navy/30" />
                {d}
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Process steps */}
      {info.process && info.process.length > 0 && (
        <details className="group">
          <summary className="flex cursor-pointer items-center gap-2 bg-[#f8f7f4] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-navy select-none">
            <ListChecks size={13} className="shrink-0 text-gold" />
            Süreç Nasıl İşler?
            <DropdownArrow />
          </summary>
          <ol className="space-y-1.5 bg-[#f8f7f4] px-3 pb-2.5">
            {info.process.map((s, i) => (
              <li
                key={i}
                className="flex gap-2 text-[12px] leading-relaxed text-gray-600"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center bg-navy/10 text-[9px] font-bold text-navy">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </details>
      )}
    </motion.div>
  );
}

type FormStatus = "idle" | "submitting" | "success" | "error";

function InlineContactForm({
  context,
  onClose,
}: {
  context: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    // Enforce character limits
    const limit = LIMITS[name as keyof typeof LIMITS];
    const capped = limit ? value.slice(0, limit) : value;
    setForm((p) => ({ ...p, [name]: capped }));
    if (touched[name]) {
      setErrors((p) => ({ ...p, [name]: getError(name, capped) }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: getError(name, form[name as keyof typeof form]) }));
  };

  const getError = (field: string, value: string): string | null => {
    if (field === "name") return validateName(value);
    if (field === "phone") return validatePhone(value);
    if (field === "message") return validateMessage(value);
    return null;
  };

  const isValid =
    !validateName(form.name) &&
    !validatePhone(form.phone) &&
    !validateMessage(form.message);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all & validate
    const allErrors = {
      name: validateName(form.name),
      phone: validatePhone(form.phone),
      message: validateMessage(form.message),
    };
    setErrors(allErrors);
    setTouched({ name: true, phone: true, message: true });
    if (Object.values(allErrors).some(Boolean)) return;

    setStatus("submitting");
    try {
      await sendContactMessage({
        name: form.name.trim(),
        phone: form.phone.trim(),
        subject: context,
        message: form.message.trim(),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 bg-[#f8f7f4] px-4 py-5 text-center"
      >
        <CheckCircle size={28} className="mx-auto text-gold" />
        <p className="mt-2 text-[13px] font-medium text-navy">
          Mesajınız Iletildi
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
          En kısa sürede sizinle iletişime geçeceğiz.
        </p>
        <button
          onClick={onClose}
          className="mt-3 text-[11px] font-medium uppercase tracking-[0.1em] text-gold transition-opacity hover:opacity-70"
        >
          Tamam
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit}
      noValidate
      className="mt-2 space-y-2.5 bg-[#f8f7f4] px-4 py-4"
    >
      <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
        Mesaj Bırakın
      </p>

      {/* Name */}
      <div>
        <div
          className={clsx(
            "flex items-center gap-2 border bg-white px-3 py-2 transition-colors",
            touched.name && errors.name
              ? "border-red-300"
              : "border-gray-200 focus-within:border-gold/50",
          )}
        >
          <User size={14} className="shrink-0 text-gray-300" />
          <input
            name="name"
            type="text"
            placeholder="Ad Soyad"
            value={form.name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
            maxLength={LIMITS.name}
            className="w-full bg-transparent text-[13px] text-navy outline-none placeholder-gray-400"
          />
        </div>
        {touched.name && errors.name && (
          <p className="mt-0.5 text-[10px] text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <div
          className={clsx(
            "flex items-center gap-2 border bg-white px-3 py-2 transition-colors",
            touched.phone && errors.phone
              ? "border-red-300"
              : "border-gray-200 focus-within:border-gold/50",
          )}
        >
          <Phone size={14} className="shrink-0 text-gray-300" />
          <input
            name="phone"
            type="tel"
            placeholder="0545 000 00 00"
            value={form.phone}
            onChange={handleChange}
            onBlur={() => handleBlur("phone")}
            maxLength={LIMITS.phone}
            className="w-full bg-transparent text-[13px] text-navy outline-none placeholder-gray-400"
          />
        </div>
        {touched.phone && errors.phone && (
          <p className="mt-0.5 text-[10px] text-red-500">{errors.phone}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <div
          className={clsx(
            "flex items-start gap-2 border bg-white px-3 py-2 transition-colors",
            touched.message && errors.message
              ? "border-red-300"
              : "border-gray-200 focus-within:border-gold/50",
          )}
        >
          <MessageSquare size={14} className="mt-0.5 shrink-0 text-gray-300" />
          <textarea
            name="message"
            rows={3}
            placeholder="Durumunuzu kısaca açıklayınız..."
            value={form.message}
            onChange={handleChange}
            onBlur={() => handleBlur("message")}
            maxLength={LIMITS.message}
            className="w-full resize-none bg-transparent text-[13px] leading-relaxed text-navy outline-none placeholder-gray-400"
          />
        </div>
        <div className="mt-0.5 flex items-center justify-between">
          {touched.message && errors.message ? (
            <p className="text-[10px] text-red-500">{errors.message}</p>
          ) : (
            <span />
          )}
          <p className="text-[10px] text-gray-300">
            {form.message.length}/{LIMITS.message}
          </p>
        </div>
      </div>

      {status === "error" && (
        <div className="flex items-center gap-1.5 text-[11px] text-red-500">
          <AlertCircle size={12} />
          Bir hata oluştu. Lütfen tekrar deneyin.
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={status === "submitting" || !isValid}
          className="inline-flex flex-1 items-center justify-center gap-1.5 bg-navy px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-navy-light disabled:opacity-50"
        >
          {status === "submitting" ? (
            "Gönderiliyor..."
          ) : (
            <>
              <Send size={12} />
              Gönder
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-gray-400 transition-colors hover:text-navy"
        >
          Vazgeç
        </button>
      </div>
    </motion.form>
  );
}

/* ── Main chatbot component ─────────────────────────────── */

export default function IsikAsistan() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState("root");
  const [typing, setTyping] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Sayfa yüklendikten 3-4 sn sonra otomatik aç (session'da sadece 1 kez)
  useEffect(() => {
    if (sessionStorage.getItem("chatbot_dismissed")) return;
    const delay = 3000 + Math.random() * 1000;
    const timer = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(timer);
  }, []);

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
  }, [messages, typing, showForm, scrollToBottom]);

  const handleOptionClick = (label: string, nextId: string) => {
    setShowForm(false);
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: "user", text: label },
    ]);
    addBotMessage(nextId);
  };

  const handleRestart = () => {
    setShowForm(false);
    setMessages([]);
    hasInitialized.current = false;
    setTimeout(() => {
      hasInitialized.current = true;
      addBotMessage("root");
    }, 100);
  };

  const handleBack = () => {
    setShowForm(false);
    const botMessages = messages.filter((m) => m.type === "bot");
    if (botMessages.length < 2) return;

    const prevBot = botMessages[botMessages.length - 2];
    const prevBotIndex = messages.indexOf(prevBot);

    setMessages(messages.slice(0, prevBotIndex + 1));
    setCurrentNodeId(prevBot.node?.id ?? "root");
  };

  // Build context string from conversation path
  const formContext = messages
    .filter((m) => m.type === "user")
    .map((m) => m.text)
    .join(" > ");

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
                onClick={() => { sessionStorage.setItem("chatbot_dismissed", "1"); setOpen(false); }}
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
                          <div className="bg-navy px-4 py-3">
                            <p className="text-[13px] leading-relaxed text-white">
                              {msg.text}
                            </p>
                          </div>

                          {/* Info cards + action buttons for terminal nodes */}
                          {msg.node?.action &&
                            msg.id ===
                            messages
                              .filter((m) => m.type === "bot")
                              .slice(-1)[0]?.id && (
                              <>
                                {/* Info cards */}
                                {msg.node.info && (
                                  <InfoCards info={msg.node.info} />
                                )}

                                {/* Action buttons */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {(msg.node.action === "contact" ||
                                    msg.node.action === "call") && (
                                      <a
                                        href="tel:+905054005380"
                                        className="inline-flex min-h-[44px] items-center gap-1.5 bg-navy px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-navy-light"
                                      >
                                        <Phone size={12} />
                                        Hemen Ara
                                      </a>
                                    )}
                                  <button
                                    type="button"
                                    onClick={() => setShowForm(true)}
                                    className="inline-flex min-h-[44px] items-center gap-1.5 border border-navy px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-navy transition-colors hover:bg-navy hover:text-white"
                                  >
                                    <Send size={12} />
                                    Mesaj Gönder
                                  </button>
                                  {msg.node.areaSlug && (
                                    <Link
                                      to={`/calisma-alanlari/${msg.node.areaSlug}`}
                                      onClick={() => setOpen(false)}
                                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gold transition-opacity hover:opacity-70"
                                    >
                                      Detaylı Bilgi
                                      <ChevronRight size={12} />
                                    </Link>
                                  )}
                                </div>

                                {/* Inline form */}
                                <AnimatePresence>
                                  {showForm && (
                                    <InlineContactForm
                                      context={formContext}
                                      onClose={() => setShowForm(false)}
                                    />
                                  )}
                                </AnimatePresence>
                              </>
                            )}

                          {/* Option buttons */}
                          {msg.node?.options &&
                            msg.id ===
                            messages
                              .filter((m) => m.type === "bot")
                              .slice(-1)[0]?.id && (
                              <div className="mt-2.5 space-y-1.5">
                                {msg.node.options.map((opt) => (
                                  <button
                                    key={opt.nextId}
                                    onClick={() =>
                                      handleOptionClick(opt.label, opt.nextId)
                                    }
                                    className="group flex min-h-[44px] w-full items-center gap-2 border border-gray-200 bg-white px-3.5 py-3 text-left text-[13px] text-navy transition-all hover:border-gold/50 hover:bg-[#faf9f7]"
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
                  Yeniden Başla
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
