import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Çalışma Alanları",
  description:
    "İş hukuku, kira hukuku, icra-iflas, tazminat, aile, ticaret, miras, gayrimenkul ve ceza hukuku başta olmak üzere 14 farklı alanda avukatlık ve hukuki danışmanlık hizmeti.",
  alternates: { canonical: "/calisma-alanlari" },
};

export default function CalismaAlanlariLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
