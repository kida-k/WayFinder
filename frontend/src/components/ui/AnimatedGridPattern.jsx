import React from "react";
import { cn } from "../../lib/utils";

export const AnimatedGridPattern = ({ className, width = 40, height = 40, x = -1, y = -1, ...props }) => {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-white/5 stroke-white/5",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)" />
    </svg>
  );
};
