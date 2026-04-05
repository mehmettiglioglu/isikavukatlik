import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Send, CheckCircle, AlertCircle, MapPin, User, MessageSquare, Tag } from "lucide-react";
import clsx from "clsx";
import { fadeUp, staggerContainer } from "@/components/ui/MotionDiv";
import { sendContactMessage } from "@/lib/api";

type FormState = "idle" | "submitting" | "success" | "error";

const SUBJECTS = [
  "İş Hukuku",
  "Aile Hukuku",
  "Ticaret Hukuku",
  "İcra ve İflas Hukuku",
  "Gayrimenkul Hukuku",
  "Tazminat Hukuku",
  "Genel Danışmanlık",
  "Diğer",
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [state, setState] = useState<FormState>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");
    try {
      await sendContactMessage({ ...form, phone: form.phone || undefined });
      setState("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setState("error");
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#f8f7f4] py-28">
      {/* Dekoratif geometrik arka plan */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full border border-gold/10" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full border border-gold/10" />
        <div className="absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Başlık */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-16 text-center"
        >
          <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            Ücretsiz Ön Görüşme
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
          </p>
          <h2 className="font-serif text-4xl font-light text-navy md:text-5xl">
            Nasıl Yardımcı Olabiliriz?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-gray-500">
            Hukuki sorunlarınız için mesajınızı bırakın; uzman avukatlarımız en kısa sürede
            sizinle iletişime geçsin.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {state === "success" ? (
              <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle size={56} className="mx-auto text-gold" />
                </motion.div>
                <h3 className="mt-6 font-serif text-2xl font-light text-navy">
                  Mesajınız İletildi
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
                  En kısa sürede sizinle iletişime geçeceğiz. Teşekkür ederiz.
                </p>
                <button
                  onClick={() => setState("idle")}
                  className="mt-8 text-xs uppercase tracking-[0.15em] text-gold transition-opacity hover:opacity-70"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Ad Soyad + Telefon */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FloatField
                    icon={<User size={16} />}
                    label="Ad Soyad"
                    required
                    id="f-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Adınız Soyadınız"
                  />
                  <FloatField
                    icon={<Phone size={16} />}
                    label="Telefon"
                    id="f-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0500 000 00 00"
                  />
                </div>

                {/* E-posta + Konu */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FloatField
                    icon={<Mail size={16} />}
                    label="E-posta"
                    required
                    id="f-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ornek@mail.com"
                  />
                  <SelectField
                    icon={<Tag size={16} />}
                    label="Konu"
                    required
                    id="f-subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    options={SUBJECTS}
                  />
                </div>

                {/* Mesaj */}
                <TextareaField
                  icon={<MessageSquare size={16} />}
                  label="Mesajınız"
                  required
                  id="f-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Hukuki durumunuzu kısaca açıklayınız..."
                  rows={5}
                />

                {state === "error" && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle size={14} />
                    Bir hata oluştu. Lütfen tekrar deneyin.
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="group inline-flex items-center gap-3 bg-navy px-10 py-4 text-sm font-medium uppercase tracking-[0.15em] text-white transition-all hover:bg-[#162442] disabled:opacity-60"
                  >
                    {state === "submitting" ? (
                      "Gönderiliyor..."
                    ) : (
                      <>
                        Mesaj Gönder
                        <Send size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

          {/* Sağ bilgi kartı */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col gap-4"
          >
            <motion.div variants={fadeUp} className="relative overflow-hidden bg-navy p-8">
              <div aria-hidden="true" className="absolute top-0 right-0 h-20 w-20 border-t-2 border-r-2 border-gold/25" />
              <p className="mb-6 font-serif text-xl font-light leading-snug text-white">
                "Hukuki sorunlarınızda yanınızda olmak için buradayız."
              </p>
              <div className="h-px w-10 bg-gold" aria-hidden="true" />
              <p className="mt-4 text-xs uppercase tracking-widest text-gold">Işık Hukuk Bürosu</p>
            </motion.div>

            {[
              { icon: Phone, label: "Telefon", value: "+90 545 216 24 66", href: "tel:+905452162466" },
              { icon: Mail, label: "E-posta", value: "info@isikavukatlik.com", href: "mailto:info@isikavukatlik.com" },
              { icon: MapPin, label: "Konum", value: "Konya, Türkiye", href: undefined },
            ].map(({ icon: Icon, label, value, href }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="group flex items-center gap-4 border border-gray-200 bg-white px-6 py-4 transition-colors hover:border-gold/40"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-surface">
                  <Icon size={15} className="text-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">{label}</p>
                  {href ? (
                    <a href={href} className="mt-0.5 block truncate text-sm font-medium text-navy transition-colors hover:text-gold">
                      {value}
                    </a>
                  ) : (
                    <p className="mt-0.5 truncate text-sm font-medium text-navy">{value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Ortak input sarmalayıcı stilleri ─────────────────────────────────────────

type BaseProps = {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  id: string;
  name: string;
  value: string;
};

function FieldWrapper({
  icon,
  label,
  required,
  id,
  focused,
  hasValue,
  children,
}: BaseProps & { focused: boolean; hasValue: boolean; children: React.ReactNode }) {
  return (
    <div
      className={clsx(
        "relative flex items-start gap-3 rounded-none border bg-white px-4 pt-3 pb-3 transition-all duration-150",
        focused ? "border-gold/70 ring-2 ring-gold/15 shadow-sm" : "border-gray-200 hover:border-gray-300"
      )}
    >
      {/* İkon */}
      <span
        className={clsx(
          "mt-4.5 shrink-0 transition-colors",
          focused || hasValue ? "text-gold" : "text-gray-300"
        )}
      >
        {icon}
      </span>

      <div className="flex-1 min-w-0">
        {/* Floating label */}
        <label
          htmlFor={id}
          className={clsx(
            "pointer-events-none block font-medium transition-all duration-150",
            focused || hasValue
              ? "translate-y-0 text-[10px] uppercase tracking-[0.16em] text-gold"
              : "translate-y-2 text-sm text-gray-400"
          )}
        >
          {label}
          {required && <span className="ml-0.5 text-gold">*</span>}
        </label>
        {children}
      </div>
    </div>
  );
}

// ─── Text input ────────────────────────────────────────────────────────────────

function FloatField({
  icon, label, required, id, name, type, value, onChange, placeholder,
}: BaseProps & {
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldWrapper icon={icon} label={label} required={required} id={id} name={name} value={value} focused={focused} hasValue={!!value}>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ""}
        className="mt-0.5 w-full bg-transparent text-base text-navy outline-none placeholder-gray-300"
      />
    </FieldWrapper>
  );
}

// ─── Select ────────────────────────────────────────────────────────────────────

function SelectField({
  icon, label, required, id, name, value, onChange, options,
}: BaseProps & {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldWrapper icon={icon} label={label} required={required} id={id} name={name} value={value} focused={focused} hasValue={!!value}>
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="mt-0.5 w-full appearance-none bg-transparent text-base text-navy outline-none"
        >
          <option value="" disabled />
          {options.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </FieldWrapper>
  );
}

// ─── Textarea ──────────────────────────────────────────────────────────────────

function TextareaField({
  icon, label, required, id, name, value, onChange, placeholder, rows,
}: BaseProps & {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldWrapper icon={icon} label={label} required={required} id={id} name={name} value={value} focused={focused} hasValue={!!value}>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ""}
        className="mt-0.5 w-full resize-none bg-transparent text-base text-navy outline-none placeholder-gray-300"
      />
    </FieldWrapper>
  );
}
