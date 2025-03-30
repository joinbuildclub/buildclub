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
        boxShadow: shadow ? '0 8px 0 0 rgba(200,200,200,0.8)' : 'none',
        position: 'relative'
      }}
    />
  );
}