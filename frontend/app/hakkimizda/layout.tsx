import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Konya'da faaliyet gösteren Işık Hukuk Bürosu; Av. Mustafa Çağatay Işık ve Av. Havva Nur Işık kuruculuğunda iş, aile, ticaret ve icra hukuku başta olmak üzere pek çok alanda avukatlık hizmeti sunmaktadır.",
  alternates: { canonical: "/hakkimizda" },
};

export default function HakkimizdaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
