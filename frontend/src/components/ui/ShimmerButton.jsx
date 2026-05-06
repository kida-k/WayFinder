import React from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export const ShimmerButton = ({
  children,
  className,
  onClick,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-xl bg-primary px-8 font-medium text-primary-foreground shadow-lg transition-all",
        disabled && "opacity-50 cursor-not-allowed bg-muted text-muted-foreground",
        !disabled && "hover:shadow-[0_0_40px_8px_rgba(59,130,246,0.3)]",
        className
      )}
      {...props}
    >
      {/* Shimmer Effect */}
      {!disabled && (
        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
          <div className="relative h-full w-8 bg-white/20" />
        </div>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
