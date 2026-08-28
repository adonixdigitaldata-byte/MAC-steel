import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  world?: "carbon" | "bone";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, world = "carbon", className = "", id, disabled, ...props }, ref) => {
    const isBone = world === "bone";

    const baseInputStyles =
      "w-full bg-transparent border-b py-3 px-1 font-tech text-xs tracking-wider transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const themeInputStyles = isBone
      ? "border-bone-border text-carbon placeholder:text-carbon/40 focus:border-carbon"
      : "border-carbon-border text-bone placeholder:text-accent-metal/50 focus:border-bone";

    const errorInputStyles = error ? "border-red-500 focus:border-red-500" : "";

    return (
      <div className="w-full space-y-1.5 font-tech text-xs">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-[10px] tracking-widest uppercase font-bold",
              isBone ? "text-accent-mineral" : "text-accent-metal"
            )}
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          disabled={disabled}
          className={cn(baseInputStyles, themeInputStyles, errorInputStyles, className)}
          {...props}
        />
        {error && <span className="block text-[10px] text-red-500 tracking-wider">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  world?: "carbon" | "bone";
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, world = "carbon", className = "", id, disabled, ...props }, ref) => {
    const isBone = world === "bone";

    const baseStyles =
      "w-full bg-transparent border p-3 font-tech text-xs tracking-wider transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[100px]";

    const themeStyles = isBone
      ? "bg-bone-surface border-bone-border text-carbon placeholder:text-carbon/40 focus:border-carbon"
      : "bg-carbon-surface border-carbon-border text-bone placeholder:text-accent-metal/50 focus:border-bone";

    const errorStyles = error ? "border-red-500 focus:border-red-500" : "";

    return (
      <div className="w-full space-y-1.5 font-tech text-xs">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-[10px] tracking-widest uppercase font-bold",
              isBone ? "text-accent-mineral" : "text-accent-metal"
            )}
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          disabled={disabled}
          className={cn(baseStyles, themeStyles, errorStyles, className)}
          {...props}
        />
        {error && <span className="block text-[10px] text-red-500 tracking-wider">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
