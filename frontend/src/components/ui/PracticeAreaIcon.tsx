import {
  Briefcase, Home, Scale, ShieldCheck, FileText, Building2,
  ScrollText, LandPlot, Users, Gavel, ShoppingBag, Landmark,
  Stethoscope, Globe, type LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Briefcase, Home, Scale, ShieldCheck, FileText, Building2,
  ScrollText, LandPlot, Users, Gavel, ShoppingBag, Landmark,
  Stethoscope, Globe,
};

interface Props extends LucideProps {
  name: string;
}

export default function PracticeAreaIcon({ name, ...props }: Props) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
