import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: "primary" | "cyan" | "amber" | "violet";
}

const colorMap = {
  primary: "text-primary group-hover:shadow-[0_0_24px_hsl(var(--terminal)/0.2)]",
  cyan: "text-cyan group-hover:shadow-[0_0_24px_hsl(var(--cyan)/0.2)]",
  amber: "text-amber group-hover:shadow-[0_0_24px_hsl(var(--amber)/0.2)]",
  violet: "text-violet group-hover:shadow-[0_0_24px_hsl(var(--violet)/0.2)]",
};

const iconBgMap = {
  primary: "bg-primary/10",
  cyan: "bg-cyan/10",
  amber: "bg-amber/10",
  violet: "bg-violet/10",
};

export function ToolCard({ title, description, href, icon: Icon, color }: ToolCardProps) {
  return (
    <Link
      to={href}
      className="group block rounded-lg border border-border bg-card p-6 card-glow transition-all duration-300 hover:card-glow-hover hover:border-primary/30"
    >
      <div className={`inline-flex p-2.5 rounded-md mb-4 ${iconBgMap[color]}`}>
        <Icon className={`h-5 w-5 ${colorMap[color]}`} />
      </div>
      <h3 className="font-mono font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </Link>
  );
}
