import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Correct import for motion component
import { cn } from "@/lib/utils";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1.5, // Slow down rotation slightly
  clockwise = true,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState("TOP");

  const rotateDirection = (currentDirection) => {
    const directions = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  // Use a very faint grey for the constantly rotating gradient
  const movingMap = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT: "radial-gradient(16.2% 41.19% at 100% 50%, hsl(0, 0%, 100%, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  // Keep the brighter purple highlight for hover
  const highlight =
    "radial-gradient(75% 181.15% at 50% 50%, #8a2be2 0%, rgba(0, 0, 0, 0) 100%)"; // Purple: #8a2be2

  useEffect(() => {
    // Remove the !hovered check to make the interval run constantly
    const interval = setInterval(() => {
      setDirection((prevState) => rotateDirection(prevState));
    }, duration * 1000);
    return () => clearInterval(interval);
    // Dependencies remain the same, but the effect runs regardless of hover state
  }, [duration, clockwise]);

  return (
    <Tag
      onMouseEnter={(event) => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border border-transparent dark:border-white/[0.2] content-center bg-black/95 hover:bg-black transition-colors duration-300 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName // This applies classes to the outer container
      )}
      {...props} // Passes props like onClick, disabled to the underlying Tag (button)
    >
      <div
        className={cn(
          "text-white z-10 bg-black px-4 py-2 rounded-[inherit]",
          "text-sm", // Reduced font size using Tailwind class
          "font-mono", // Apply monospace font (Tailwind class)
          className
        )}
        style={{ fontFamily: 'IBM Plex Mono, monospace' }} // Explicit font family
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(3px)", // Slightly increased blur
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight] // On hover, transition to purple
            : movingMap[direction], // Otherwise, stay with the subtle rotating grey
        }}
        transition={{ ease: "linear", duration: duration ?? 1.5 }}
      />
      {/* The inner black background */}
      <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-full" />
    </Tag>
  );
}

// Added export default for convenience if needed elsewhere, or keep as named export
// export default HoverBorderGradient;
