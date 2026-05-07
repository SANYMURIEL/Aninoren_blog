import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "emerald" | "saffron" | "glass";
  className?: string;
}

export function Badge({ children, variant = "emerald", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30":
            variant === "emerald",
          "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30":
            variant === "saffron",
          "card-base text-secondary":
            variant === "glass",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
