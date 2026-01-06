"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";

import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      className={cn("flex flex-col gap-3", className)}
      data-slot="radio-group"
      {...props}
    />
  );
}

function Radio({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      className={cn(
        "size-4.5 border-input bg-background shadow-xs not-data-disabled:not-data-checked:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:ring-ring focus-visible:ring-offset-background aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/48 data-disabled:opacity-64 dark:not-data-checked:bg-input/32 dark:aria-invalid:ring-destructive/24 dark:not-data-disabled:not-data-checked:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/8%)] [[data-disabled],[data-checked],[aria-invalid]]:shadow-none relative inline-flex shrink-0 items-center justify-center rounded-full border bg-clip-padding outline-none transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-full focus-visible:ring-2 focus-visible:ring-offset-1 sm:size-4 dark:bg-clip-border",
        className
      )}
      data-slot="radio"
      {...props}>
      <RadioPrimitive.Indicator
        className="size-4.5 before:bg-primary-foreground data-unchecked:hidden data-checked:bg-primary absolute -inset-px flex items-center justify-center rounded-full before:size-2 before:rounded-full sm:size-4 sm:before:size-1.5"
        data-slot="radio-indicator"
      />
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, Radio, Radio as RadioGroupItem };
