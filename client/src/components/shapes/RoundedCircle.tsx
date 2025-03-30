import React from "react";

interface RoundedCircleProps {
  className?: string;
  width?: string;
  height?: string;
  color?: string;
  animateClass?: string;
  shadow?: boolean;
}

export default function RoundedCircle({
  className = "",
  width = "w-24",
  height = "h-24",
  color = "var(--color-blue)",
  animateClass = "",
  shadow = false
}: RoundedCircleProps) {
  return (
    <div 
      className={`${className} ${width} ${height} ${animateClass} rounded-full`}
      style={{ 
        backgroundColor: color,
        boxShadow: shadow ? '0 10px 0 0 rgba(0,0,0,0.1)' : 'none'
      }}
    />
  );
}