import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, User, MessageSquare, Tag } from "lucide-react";
import clsx from "clsx";
import { fadeUp, staggerContainer } from "@/components/ui/MotionDiv";
import { sendContactMessage } from "@/lib/api";
import PageHead from "@/components/seo/PageHead";

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

export default function IletisimPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [state, setState] = useState<FormState>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

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

  const contactItems = [
    { icon: MapPin, label: "Adres", value: "Konya, Türkiye", detail: "Detaylı adres için arayınız" },
    { icon: Phone, label: "Telefon", value: "+90 500 123 45 67", href: "tel:+905001234567" },
    { icon: Mail, label: "E-posta", value: "info@isikavukatlik.com", href: "mailto:info@isikavukatlik.com" },
    { icon: Clock, label: "Çalışma Saatleri", value: "Pazartesi – Cuma", detail: "09:00 – 18:00" },
  ];

  return (
    <main>
      <PageHead
        title="İletişim — Hukuki Danışmanlık ve Randevu"
        description="Hukuki danışmanlık ve randevu talepleriniz için bizimle iletişime geçin. Ücretsiz ön görüşme için hemen arayın veya form doldurun."
        canonical="/iletisim"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-20">
        <div className="absolute inset-0 z-0">
          <img src="/justice2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" loading="eager" />
          <div className="absolute inset-0 bg-linear-to-r from-navy/95 to-navy/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-6 bg-gold" aria-hidden="true" />
              Ulaşın
            </p>
            <h1 className="font-serif text-5xl font-light text-white">İletişim</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-300">
              Hukuki danışmanlık ve randevu talepleriniz için bizimle iletişime geçebilirsiniz.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-14 lg:grid-cols-[1fr_380px]">

            {/* Sol: Form + Ara butonu */}
            <div>
              {/* Hemen Ara */}
              <motion.a
                href="tel:+905001234567"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group mb-8 flex items-center gap-5 border border-gold/30 bg-navy px-6 py-5 transition-opacity hover:opacity-90"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-gold/15">
                  <Phone size={22} className="text-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Hemen Ara</p>
                  <p className="mt-0.5 font-serif text-xl font-light text-white">+90 500 123 45 67</p>
                  <p className="text-xs text-gray-400">Pzt – Cum 09:00 – 18:00</p>
                </div>
                <Phone size={18} className="ml-auto shrink-0 text-gold/40 transition-transform group-hover:scale-110" />
              </motion.a>

              {/* Ayırıcı */}
              <div className="mb-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-100" />
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400">veya mesaj bırakın</p>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              {/* Form */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
                {state === "success" ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                      <CheckCircle size={52} className="mx-auto text-gold" />
                    </motion.div>
                    <h3 className="mt-6 font-serif text-2xl font-light text-navy">Mesajınız İletildi</h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
                      En kısa sürede sizinle iletişime geçeceğiz. Teşekkür ederiz.
                    </p>
                    <button onClick={() => setState("idle")} className="mt-8 text-xs uppercase tracking-[0.15em] text-gold transition-opacity hover:opacity-70">
                      Yeni Mesaj Gönder
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FloatField icon={<User size={16} />} label="Ad Soyad" required id="i-name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Adınız Soyadınız" />
                      <FloatField icon={<Phone size={16} />} label="Telefon" id="i-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="0500 000 00 00" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FloatField icon={<Mail size={16} />} label="E-posta" required id="i-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="ornek@mail.com" />
                      <SelectField icon={<Tag size={16} />} label="Konu" required id="i-subject" name="subject" value={form.subject} onChange={handleChange} options={SUBJECTS} />
                    </div>
                    <TextareaField icon={<MessageSquare size={16} />} label="Mesajınız" required id="i-message" name="message" value={form.message} onChange={handleChange} placeholder="Hukuki durumunuzu kısaca açıklayınız..." rows={5} />

                    {state === "error" && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle size={14} /> Bir hata oluştu. Lütfen tekrar deneyin.
                      </div>
                    )}

                    <div className="pt-1">
                      <button type="submit" disabled={state === "submitting"} className="group inline-flex items-center gap-3 bg-navy px-10 py-4 text-sm font-medium uppercase tracking-[0.15em] text-white transition-all hover:bg-[#162442] disabled:opacity-60">
                        {state === "submitting" ? "Gönderiliyor..." : (<>Mesaj Gönder <Send size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></>)}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>

            {/* Sağ: İletişim kartları */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-4">
              <motion.h2 variants={fadeUp} className="mb-6 font-serif text-2xl font-light text-navy">Bize Ulaşın</motion.h2>
              {contactItems.map(({ icon: Icon, label, value, detail, href }) => (
                <motion.div key={label} variants={fadeUp} className="flex items-start gap-4 border border-gray-100 bg-white p-5 transition-colors hover:border-gold/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#f8f7f4]">
                    <Icon size={17} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">{label}</p>
                    {href ? (
                      <a href={href} className="mt-1 block font-medium text-navy transition-colors hover:text-gold">{value}</a>
                    ) : (
                      <p className="mt-1 font-medium text-navy">{value}</p>
                    )}
                    {detail && <p className="mt-0.5 text-sm text-gray-500">{detail}</p>}
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Input bileşenleri ─────────────────────────────────────────────────────────

type BaseProps = { icon: React.ReactNode; label: string; required?: boolean; id: string; name: string; value: string };

function FieldWrapper({ icon, label, required, id, focused, hasValue, children }: BaseProps & { focused: boolean; hasValue: boolean; children: React.ReactNode }) {
  return (
    <div className={clsx("relative flex items-start gap-3 border bg-white px-4 pt-3 pb-3 transition-all duration-150", focused ? "border-gold/70 ring-2 ring-gold/15 shadow-sm" : "border-gray-200 hover:border-gray-300")}>
      <span className={clsx("mt-4.5 shrink-0 transition-colors", focused || hasValue ? "text-gold" : "text-gray-300")}>{icon}</span>
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className={clsx("pointer-events-none block font-medium transition-all duration-150", focused || hasValue ? "translate-y-0 text-[10px] uppercase tracking-[0.16em] text-gold" : "translate-y-2 text-sm text-gray-400")}>
          {label}{required && <span className="ml-0.5 text-gold">*</span>}
        </label>
        {children}
      </div>
    </div>
  );
}

function FloatField({ icon, label, required, id, name, type, value, onChange, placeholder }: BaseProps & { type: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldWrapper icon={icon} label={label} required={required} id={id} name={name} value={value} focused={focused} hasValue={!!value}>
      <input id={id} name={name} type={type} required={required} value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={focused ? placeholder : ""} className="mt-0.5 w-full bg-transparent text-base text-navy outline-none placeholder-gray-300" />
    </FieldWrapper>
  );
}

function SelectField({ icon, label, required, id, name, value, onChange, options }: BaseProps & { onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldWrapper icon={icon} label={label} required={required} id={id} name={name} value={value} focused={focused} hasValue={!!value}>
      <div className="relative">
        <select id={id} name={name} required={required} value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className="mt-0.5 w-full appearance-none bg-transparent text-base text-navy outline-none">
          <option value="" disabled />
          {options.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </FieldWrapper>
  );
}

function TextareaField({ icon, label, required, id, name, value, onChange, placeholder, rows }: BaseProps & { onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder: string; rows: number }) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldWrapper icon={icon} label={label} required={required} id={id} name={name} value={value} focused={focused} hasValue={!!value}>
      <textarea id={id} name={name} required={required} rows={rows} value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={focused ? placeholder : ""} className="mt-0.5 w-full resize-none bg-transparent text-base text-navy outline-none placeholder-gray-300" />
    </FieldWrapper>
  );
}
