import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
  className?: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  iconBgColor: string;
  iconColor: string;
  delay?: boolean;
}

export default function FloatingCard({
  className,
  icon,
  title,
  subtitle,
  iconBgColor,
  iconColor,
  delay = false
}: FloatingCardProps) {
  return (
    <div className={cn(
      "bg-white p-4 rounded-lg shadow-lg",
      delay ? "animate-floating-delayed" : "animate-floating",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          iconBgColor
        )}>
          <div className={cn("w-5 h-5", iconColor)}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
