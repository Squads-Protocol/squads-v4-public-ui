"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, max, ...props }, ref) => {
  const calculatePercentage = () => {
    if (max !== undefined && max > 0) {
      return Math.min(100, Math.max(0, ((value || 0) / max) * 100));
    }
    return Math.min(100, Math.max(0, value || 0));
  };

  const percentage = calculatePercentage();
  const isComplete = percentage === 100;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-stone-300/40 dark:bg-white/10",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          `h-full w-full flex-1 transition-all`,
          isComplete
            ? "bg-gradient-to-br from-green-400 to-green-300"
            : "bg-gradient-to-br from-stone-600 to-stone-800 dark:bg-gradient-to-br dark:from-white dark:to-stone-400"
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
