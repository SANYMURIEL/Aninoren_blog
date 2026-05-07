import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "emerald" | "saffron" | "none";
}

export function Card({ children, className, hover = true, glow = "none" }: CardProps) {
  return (
    <div
      className={cn(
        "card-base rounded-2xl overflow-hidden",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30",
        glow === "emerald" && "glow-emerald",
        glow === "saffron" && "glow-saffron",
        className
      )}
    >
      {children}
    </div>
  );
}
