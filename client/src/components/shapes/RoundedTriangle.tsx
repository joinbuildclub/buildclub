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
  rotate = "rotate-45",
  animateClass = "",
  shadow = true,
}: RoundedTriangleProps) {
  // Generate a unique ID for the filter
  const filterId = React.useId();

  return (
    <div className={`absolute ${className} ${width} ${height} ${animateClass}`}>
      {/* Create a wrapper for both triangles that will handle the rotation */}
      <div className={`absolute inset-0 ${rotate} origin-center`}>
        {/* First, render the shadow triangle if needed */}
        {shadow && (
          <div
            className="absolute inset-0 translate-y-2"
            style={{
              filter: `url(#${filterId})`,
            }}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundColor: "rgba(200,200,200,0.8)",
                clipPath: "polygon(50% 0%, 0% 86.6%, 100% 86.6%)",
              }}
            />
          </div>
        )}

        {/* SVG filter definition (shared between both elements) */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <filter id={filterId}>
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="8"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -9"
                result="roundTriangle"
              />
              <feComposite
                in="SourceGraphic"
                in2="roundTriangle"
                operator="atop"
              />
            </filter>
          </defs>
        </svg>

        {/* Main colored triangle */}
        <div
          className="absolute inset-0"
          style={{
            filter: `url(#${filterId})`,
          }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundColor: color,
              clipPath: "polygon(50% 0%, 0% 86.6%, 100% 86.6%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
