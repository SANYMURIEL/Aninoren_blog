import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "saffron";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-emerald-500 hover:bg-emerald-400 text-black glow-emerald hover:scale-105":
              variant === "primary",
            // secondary utilise les variables CSS pour s'adapter au thème
            "card-base text-primary hover:border-emerald-500/50":
              variant === "secondary",
            "text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5":
              variant === "ghost",
            "bg-amber-500 hover:bg-amber-400 text-black glow-saffron hover:scale-105":
              variant === "saffron",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-5 py-2.5 text-sm": size === "md",
            "px-7 py-3.5 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
