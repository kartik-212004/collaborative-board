"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "group/switch inset-shadow-[0_1px_--theme(--color-black/4%)] h-5.5 w-9.5 focus-visible:ring-ring focus-visible:ring-offset-background data-checked:bg-primary data-unchecked:bg-input data-disabled:opacity-64 sm:h-4.5 sm:w-7.5 inline-flex shrink-0 items-center rounded-full p-px outline-none transition-all focus-visible:ring-2 focus-visible:ring-offset-1",
        className
      )}
      data-slot="switch"
      {...props}>
      <SwitchPrimitive.Thumb
        className={cn(
          "bg-background group-active/switch:not-data-disabled:w-5.5 data-checked:translate-x-4 data-unchecked:translate-x-0 data-checked:group-active/switch:translate-x-3.5 sm:data-checked:translate-x-3 sm:group-active/switch:not-data-disabled:w-4.5 sm:data-checked:group-active/switch:translate-x-2.5 pointer-events-none block size-5 rounded-full shadow-sm transition-[translate,width] sm:size-4"
        )}
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
