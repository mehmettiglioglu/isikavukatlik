import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Send, CheckCircle, AlertCircle, MapPin } from "lucide-react";
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

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
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
              <form onSubmit={handleSubmit} noValidate className="space-y-0">
                {/* Ad + Telefon */}
                <div className="grid gap-px sm:grid-cols-2">
                  <Field
                    label="Ad Soyad"
                    required
                    id="f-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Adınız Soyadınız"
                    position="top-left"
                  />
                  <Field
                    label="Telefon"
                    id="f-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0500 000 00 00"
                    position="top-right"
                  />
                </div>

                {/* E-posta + Konu */}
                <div className="grid gap-px sm:grid-cols-2">
                  <Field
                    label="E-posta"
                    required
                    id="f-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ornek@mail.com"
                    position="mid-left"
                  />
                  <div className="relative border border-gray-200 bg-white px-5 pt-5 pb-3 focus-within:border-gold/60 focus-within:ring-1 focus-within:ring-gold/20 transition-all">
                    <label htmlFor="f-subject" className="block text-[10px] uppercase tracking-[0.18em] text-gray-400">
                      Konu <span className="text-gold">*</span>
                    </label>
                    <select
                      id="f-subject"
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className="mt-1.5 w-full appearance-none bg-transparent text-sm text-navy outline-none placeholder-gray-300"
                    >
                      <option value="" disabled>Seçiniz</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <div aria-hidden="true" className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Mesaj */}
                <div className="relative border border-gray-200 bg-white px-5 pt-5 pb-3 focus-within:border-gold/60 focus-within:ring-1 focus-within:ring-gold/20 transition-all">
                  <label htmlFor="f-message" className="block text-[10px] uppercase tracking-[0.18em] text-gray-400">
                    Mesaj <span className="text-gold">*</span>
                  </label>
                  <textarea
                    id="f-message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Hukuki durumunuzu kısaca açıklayınız..."
                    className="mt-1.5 w-full resize-none bg-transparent text-sm text-navy outline-none placeholder-gray-300"
                  />
                </div>

                {state === "error" && (
                  <div className="flex items-center gap-2 pt-3 text-sm text-red-500">
                    <AlertCircle size={14} />
                    Bir hata oluştu. Lütfen tekrar deneyin.
                  </div>
                )}

                <div className="pt-4">
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
              { icon: Phone, label: "Telefon", value: "+90 500 123 45 67", href: "tel:+905001234567" },
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

// Input field bileşeni
type Position = "top-left" | "top-right" | "mid-left" | "mid-right";

function Field({
  label, required, id, name, type, value, onChange, placeholder, position,
}: {
  label: string; required?: boolean; id: string; name: string; type: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string; position: Position;
}) {
  // Bitişik kenarlar arasında gap kullanıldığından sadece border yönetimi
  void position;
  return (
    <div className="relative border border-gray-200 bg-white px-5 pt-5 pb-3 focus-within:border-gold/60 focus-within:ring-1 focus-within:ring-gold/20 transition-all">
      <label htmlFor={id} className="block text-[10px] uppercase tracking-[0.18em] text-gray-400">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1.5 w-full bg-transparent text-sm text-navy outline-none placeholder-gray-300"
      />
    </div>
  );
}
