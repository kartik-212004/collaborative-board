"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";

const TooltipCreateHandle = TooltipPrimitive.createHandle;

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

function TooltipTrigger({ render, ...props }: TooltipPrimitive.Trigger.Props) {
  // Force a non-button wrapper to avoid nested button hydration errors when children are buttons.
  const defaultRender = render ?? <span className="inline-flex" />;
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" render={defaultRender} {...props} />;
}

function TooltipPopup({
  className,
  align = "center",
  sideOffset = 4,
  side = "top",
  children,
  ...props
}: TooltipPrimitive.Popup.Props & {
  align?: TooltipPrimitive.Positioner.Props["align"];
  side?: TooltipPrimitive.Positioner.Props["side"];
  sideOffset?: TooltipPrimitive.Positioner.Props["sideOffset"];
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        className="h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) data-instant:transition-none z-50 transition-[top,left,right,bottom,transform]"
        data-slot="tooltip-positioner"
        side={side}
        sideOffset={sideOffset}>
        <TooltipPrimitive.Popup
          className={cn(
            "h-(--popup-height,auto) w-(--popup-width,auto) origin-(--transform-origin) bg-popover text-popover-foreground data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0 data-instant:duration-0 relative flex text-balance rounded-md border bg-clip-padding text-xs shadow-md shadow-black/5 transition-[width,height,scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:bg-clip-border dark:before:shadow-[0_-1px_--theme(--color-white/8%)]",
            className
          )}
          data-slot="tooltip-popup"
          {...props}>
          <TooltipPrimitive.Viewport
            className="px-(--viewport-inline-padding) data-instant:transition-none **:data-current:data-ending-style:opacity-0 **:data-current:data-starting-style:opacity-0 **:data-previous:data-ending-style:opacity-0 **:data-previous:data-starting-style:opacity-0 **:data-current:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-previous:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-previous:truncate **:data-current:opacity-100 **:data-previous:opacity-100 **:data-current:transition-opacity **:data-previous:transition-opacity relative size-full overflow-clip py-1 [--viewport-inline-padding:--spacing(2)]"
            data-slot="tooltip-viewport">
            {children}
          </TooltipPrimitive.Viewport>
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export {
  TooltipCreateHandle,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipPopup,
  TooltipPopup as TooltipContent,
};
