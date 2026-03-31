import {
  Briefcase, CalendarDays, Users, ScrollText, Landmark, TrendingUp,
  Scale, FileText, Gavel, Home, Mail, Shield, Truck, BarChart2,
  type LucideProps,
} from "lucide-react";

// HardHat ve Car lucide-react'te olmayabilir, fallback kullanıyoruz
const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Briefcase,
  CalendarDays,
  HardHat: Shield,
  Users,
  ScrollText,
  Landmark,
  TrendingUp,
  Scale,
  FileText,
  Car: Truck,
  Gavel,
  Home,
  Mail,
  BarChart2,
};

interface Props extends LucideProps {
  name: string;
}

export default function CalcIcon({ name, ...props }: Props) {
  const Icon = ICON_MAP[name] ?? FileText;
  return <Icon {...props} />;
}
