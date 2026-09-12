"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border border-[var(--border)] shadow-[var(--shadow-sm)] rounded-[var(--radius-md)] bg-white",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-3 px-5 py-3.5 border-b border-[var(--border)]",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
CardHeader.displayName = "CardHeader";

export const CardBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("p-5", className)} {...props}>
    {children}
  </div>
));
CardBody.displayName = "CardBody";
