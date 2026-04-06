import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, Link as LinkIcon, X } from "lucide-react";

/* ── Types ─────────────────────────────────────────── */

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

interface PromptOptions {
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
}

type ModalState =
  | { type: "confirm"; options: ConfirmOptions; resolve: (v: boolean) => void }
  | { type: "prompt"; options: PromptOptions; resolve: (v: string | null) => void }
  | null;

/* ── Context ───────────────────────────────────────── */

interface AdminModalContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  prompt: (options: PromptOptions) => Promise<string | null>;
}

const AdminModalContext = createContext<AdminModalContextType | null>(null);

export function useAdminModal() {
  const ctx = useContext(AdminModalContext);
  if (!ctx) throw new Error("useAdminModal must be used within AdminModalProvider");
  return ctx;
}

/* ── Provider ──────────────────────────────────────── */

export function AdminModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setModal({ type: "confirm", options, resolve });
    });
  }, []);

  const prompt = useCallback((options: PromptOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      setModal({ type: "prompt", options, resolve });
    });
  }, []);

  const handleClose = useCallback((value: boolean | string | null) => {
    if (!modal) return;
    if (modal.type === "confirm") modal.resolve(value as boolean);
    else modal.resolve(value as string | null);
    setModal(null);
  }, [modal]);

  return (
    <AdminModalContext.Provider value={{ confirm, prompt }}>
      {children}
      <AnimatePresence>
        {modal && (
          <ModalOverlay onClose={() => handleClose(modal.type === "confirm" ? false : null)}>
            {modal.type === "confirm" ? (
              <ConfirmModal options={modal.options} onResult={handleClose} />
            ) : (
              <PromptModal options={modal.options} onResult={handleClose} />
            )}
          </ModalOverlay>
        )}
      </AnimatePresence>
    </AdminModalContext.Provider>
  );
}

/* ── Overlay ───────────────────────────────────────── */

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-white shadow-2xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ── Confirm Modal ─────────────────────────────────── */

const VARIANT_CONFIG = {
  danger: { icon: Trash2, iconBg: "bg-red-50", iconColor: "text-red-500", btnClass: "bg-red-600 hover:bg-red-700" },
  warning: { icon: AlertTriangle, iconBg: "bg-amber-50", iconColor: "text-amber-500", btnClass: "bg-amber-600 hover:bg-amber-700" },
  info: { icon: AlertTriangle, iconBg: "bg-navy/5", iconColor: "text-navy", btnClass: "bg-navy hover:bg-[#162442]" },
};

function ConfirmModal({ options, onResult }: { options: ConfirmOptions; onResult: (v: boolean) => void }) {
  const { title, message, confirmText = "Onayla", cancelText = "Vazgeç", variant = "danger" } = options;
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { confirmRef.current?.focus(); }, []);

  return (
    <>
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center ${config.iconBg}`}>
            <Icon size={20} className={config.iconColor} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-light text-navy">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
        <button
          onClick={() => onResult(false)}
          className="px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-gray-500 transition-colors hover:text-navy"
        >
          {cancelText}
        </button>
        <button
          ref={confirmRef}
          onClick={() => onResult(true)}
          className={`px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90 ${config.btnClass}`}
        >
          {confirmText}
        </button>
      </div>
    </>
  );
}

/* ── Prompt Modal ──────────────────────────────────── */

function PromptModal({ options, onResult }: { options: PromptOptions; onResult: (v: string | null) => void }) {
  const { title, message, placeholder = "", defaultValue = "", confirmText = "Uygula", cancelText = "Vazgeç" } = options;
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResult(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-navy/5">
            <LinkIcon size={20} className="text-gold" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-lg font-light text-navy">{title}</h3>
            {message && <p className="mt-1.5 text-sm text-gray-500">{message}</p>}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="mt-3 w-full border border-gray-200 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/10 placeholder-gray-300"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
        <button
          type="button"
          onClick={() => onResult(null)}
          className="px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-gray-500 transition-colors hover:text-navy"
        >
          {cancelText}
        </button>
        <button
          type="submit"
          className="bg-navy px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90"
        >
          {confirmText}
        </button>
      </div>
    </form>
  );
}
