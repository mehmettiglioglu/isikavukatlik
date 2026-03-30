import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { tr } from "date-fns/locale/tr";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("tr", tr);

// ─── Wrapper ────────────────────────────────────────────────────────────────
interface ShellProps {
  title: string;
  description: string;
  children: ReactNode;
  result?: ReactNode;
  disclaimer?: string;
}

export default function CalcShell({ title, description, children, result, disclaimer }: ShellProps) {
  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div>
        <h3 className="font-serif text-3xl font-light text-navy">{title}</h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">{description}</p>
        <div className="mt-4 h-px w-12 bg-gold" />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        {/* Form */}
        <div className="space-y-4">{children}</div>

        {/* Sonuç + Uyarı */}
        <div className="space-y-4">
          {result ? (
            <div className="border-l-2 border-gold bg-navy p-7">
              <p className="mb-5 text-[10px] uppercase tracking-[0.22em] text-gold/80">
                Hesaplama Sonucu
              </p>
              {result}
            </div>
          ) : (
            <div className="border border-dashed border-gray-200 bg-gray-50 p-7 text-center">
              <p className="text-sm text-gray-400">
                Alanları doldurun ve "Hesapla" butonuna tıklayın.
              </p>
            </div>
          )}

          <div className="flex items-start gap-3 bg-amber-50 px-5 py-4 border-l-2 border-amber-400">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-500" />
            <p className="text-xs leading-relaxed text-amber-700">
              {disclaimer ??
                "Bu hesaplama yalnızca tahmini bilgi amaçlıdır; kesin hukuki sonuç doğurmaz. Gerçek tutarlar mahkeme veya idari kararla belirlenir."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────────
export function CalcInput({
  label, id, type = "text", value, onChange, placeholder, suffix, min, step,
}: {
  label: string; id: string; type?: string; value: string | number;
  onChange: (v: string) => void; placeholder?: string; suffix?: string;
  min?: string; step?: string;
}) {
  return (
    <div className="group relative">
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
        {label}
      </label>
      <div className="flex items-center gap-3 border border-gray-200 bg-white px-5 py-3.5 transition-colors focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/10">
        <input
          id={id}
          type={type}
          value={value}
          min={min}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-base text-navy outline-none placeholder-gray-300"
        />
        {suffix && <span className="shrink-0 text-sm font-medium text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}

// ─── Date Picker ─────────────────────────────────────────────────────────────
export function CalcDatePicker({
  label, id, value, onChange,
}: {
  label: string; id: string; value: Date | null; onChange: (d: Date | null) => void;
}) {
  return (
    <div className="calc-date-wrapper">
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
        {label}
      </label>
      <DatePicker
        id={id}
        selected={value}
        onChange={onChange}
        locale="tr"
        dateFormat="dd.MM.yyyy"
        placeholderText="gün.ay.yıl"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        maxDate={new Date()}
        className="w-full border border-gray-200 bg-white px-5 py-3.5 text-base text-navy outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/10 placeholder-gray-300"
        wrapperClassName="w-full"
        calendarClassName="calc-calendar"
      />
    </div>
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────
export function CalcSelect({
  label, id, value, onChange, options,
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
        {label}
      </label>
      <div className="relative border border-gray-200 bg-white transition-colors focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/10">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-transparent px-5 py-3.5 pr-10 text-base text-navy outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
            <path d="M1 1l4.5 4.5L10 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Result Row ──────────────────────────────────────────────────────────────
export function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-start justify-between gap-4 py-3 ${highlight ? "border-t-2 border-gold/40 mt-2 pt-4" : "border-t border-white/10"}`}>
      <span className="text-xs leading-relaxed text-gray-400">{label}</span>
      <span className={`text-right ${highlight ? "font-serif text-xl font-light text-gold" : "text-sm font-medium text-white"}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────────
export function CalcButton({ onClick, label = "Hesapla" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 inline-flex items-center gap-2.5 bg-gold px-9 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
    >
      {label}
    </button>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function fmt(n: number) {
  return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
}
