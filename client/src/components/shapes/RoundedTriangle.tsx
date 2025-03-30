import React from "react";

interface RoundedTriangleProps {
  className?: string;
  width?: string;
  height?: string;
  color?: string;
  rotate?: string;
  animateClass?: string;
  shadow?: boolean;
}

export default function RoundedTriangle({
  className = "",
  width = "w-24",
  height = "h-24",
  color = "var(--color-red)",
  rotate = "rotate-0",
  animateClass = "",
  shadow = false
}: RoundedTriangleProps) {
  // Generate a unique ID for the filter
  const filterId = React.useId();
  
  return (
    <div 
      className={`${className} ${width} ${height} ${rotate} ${animateClass} overflow-hidden`}
      style={{ 
        filter: `url(#${filterId})`,
        boxShadow: shadow ? '0 8px 0 0 rgba(200,200,200,0.8)' : 'none',
        position: 'relative'
      }}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix 
              in="blur" 
              type="matrix" 
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -9" 
              result="roundTriangle" 
            />
            <feComposite in="SourceGraphic" in2="roundTriangle" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div 
        className="w-full h-full" 
        style={{ 
          backgroundColor: color,
          clipPath: 'polygon(50% 0%, 0% 86.6%, 100% 86.6%)'
        }}
      />
    </div>
  );
}