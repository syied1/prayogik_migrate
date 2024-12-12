// @ts-nocheck

import { cn } from "@/lib/utils";
import Progress from "./ui/progress";

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success";
  size?: "default" | "sm";
}

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

export const CourseProgress = ({
  value,
  variant,
  size,
}: CourseProgressProps) => {
  // Validate value
  if (typeof value !== "number" || value < 0 || value > 100) {
    throw new Error(
      "Invalid progress value. It must be a number between 0 and 100."
    );
  }

  const effectiveVariant = variant ?? "default";
  const effectiveSize = size ?? "default";
  const safeValue = Math.max(0, Math.min(100, value)); 

  return (
    <>
      <Progress />
      <p
        className={cn(
          "font-medium mt-2 text-sky-700",
          colorByVariant[effectiveVariant],
          sizeByVariant[effectiveSize]
        )}
      >
        {Math.round(safeValue)}% Complete
      </p>
    </>
  );
};
