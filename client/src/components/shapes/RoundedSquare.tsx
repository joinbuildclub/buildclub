import React from "react";

interface RoundedSquareProps {
  className?: string;
  width?: string;
  height?: string;
  color?: string;
  rotate?: string;
  animateClass?: string;
  shadow?: boolean;
}

export default function RoundedSquare({
  className = "",
  width = "w-24",
  height = "h-24",
  color = "var(--color-yellow)",
  rotate = "rotate-0",
  animateClass = "",
  shadow = false
}: RoundedSquareProps) {
  return (
    <div 
      className={`${className} ${width} ${height} ${rotate} ${animateClass} rounded-md`}
      style={{ 
        backgroundColor: color,
        boxShadow: shadow ? '0 8px 0 0 rgba(0,0,0,0.1)' : 'none'
      }}
    />
  );
}