import React from "react";

interface RoundedCircleProps {
  className?: string;
  width?: string;
  height?: string;
  color?: string;
  animateClass?: string;
  rotate?: string; // rotates the shadow!
  shadow?: boolean;
}

export default function RoundedCircle({
  className = "",
  width = "w-24",
  height = "h-24",
  color = "var(--color-blue)",
  animateClass = "",
  rotate = "rotate-0",
  shadow = false,
}: RoundedCircleProps) {
  return (
    <div className={`absolute ${className} ${width} ${height} ${animateClass}`}>
      <div
        className={`absolute inset-0 ${rotate} origin-center rounded-full`}
        style={{
          backgroundColor: color,
          boxShadow: shadow ? "0 8px 0 0 rgba(200,200,200,0.8)" : "none",
        }}
      />
    </div>
  );
}
