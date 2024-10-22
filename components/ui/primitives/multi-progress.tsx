import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface MultiProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  approved?: number;
  rejected?: number;
  max?: number;
}

const MultiProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  MultiProgressProps
>(({ className, approved, rejected, max = 100, ...props }, ref) => {
  const calculatePercentage = (value: number | undefined) => {
    return Math.min(100, Math.max(0, ((value || 0) / max) * 100));
  };

  const percentage1 = calculatePercentage(approved);
  const percentage2 = calculatePercentage(rejected);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-stone-300/40 dark:bg-white/10",
        className
      )}
      {...props}
    >
      <TooltipProvider>
        <Tooltip delayDuration={250}>
          <TooltipTrigger asChild>
            <ProgressPrimitive.Indicator
              className={cn(
                "h-full flex-1 transition-all absolute left-0 top-0",
                "bg-gradient-to-br from-green-400 to-green-300"
              )}
              style={{ width: `${percentage1}%` }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-neue">
              Approved: {approved}/{max}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip delayDuration={250}>
          <TooltipTrigger asChild>
            <ProgressPrimitive.Indicator
              className={cn(
                "h-full flex-1 transition-all absolute right-0 top-0",
                "bg-gradient-to-l from-red-600 to-red-400 dark:from-red-500 dark:to-red-300"
              )}
              style={{ width: `${percentage2}%` }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-neue">Rejected: {rejected}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </ProgressPrimitive.Root>
  );
});
MultiProgress.displayName = ProgressPrimitive.Root.displayName;

export { MultiProgress };
