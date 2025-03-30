import { cn } from "@/lib/utils";

interface AnimatedBlobProps {
  className?: string;
  color: "primary" | "secondary" | "accent";
}

export default function AnimatedBlob({ className, color }: AnimatedBlobProps) {
  const colorClasses = {
    primary: "bg-primary/10",
    secondary: "bg-[#9333EA]/10",
    accent: "bg-[#10B981]/10"
  };

  return (
    <div 
      className={cn(
        colorClasses[color],
        "absolute blob animate-morph",
        className
      )}
      style={{
        borderRadius: "42% 58% 70% 30% / 45% 45% 55% 55%"
      }}
    />
  );
}
