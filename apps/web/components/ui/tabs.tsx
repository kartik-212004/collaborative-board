"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

type TabsVariant = "default" | "underline";

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-2 data-[orientation=vertical]:flex-row", className)}
      data-slot="tabs"
      {...props}
    />
  );
}

function TabsList({
  variant = "default",
  className,
  children,
  ...props
}: TabsPrimitive.List.Props & {
  variant?: TabsVariant;
}) {
  return (
    <TabsPrimitive.List
      className={cn(
        "text-muted-foreground relative z-0 flex w-fit items-center justify-center gap-x-0.5",
        "data-[orientation=vertical]:flex-col",
        variant === "default"
          ? "bg-muted text-muted-foreground/72 rounded-lg p-0.5"
          : "*:data-[slot=tabs-trigger]:hover:bg-accent data-[orientation=horizontal]:py-1 data-[orientation=vertical]:px-1",
        className
      )}
      data-slot="tabs-list"
      {...props}>
      {children}
      <TabsPrimitive.Indicator
        className={cn(
          "-translate-y-(--active-tab-bottom) h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) absolute bottom-0 left-0 transition-[width,translate] duration-200 ease-in-out",
          variant === "underline"
            ? "bg-primary z-10 data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 data-[orientation=horizontal]:translate-y-px data-[orientation=vertical]:-translate-x-px"
            : "-z-1 bg-background dark:bg-accent rounded-md shadow-sm"
        )}
        data-slot="tab-indicator"
      />
    </TabsPrimitive.List>
  );
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "focus-visible:ring-ring data-disabled:pointer-events-none data-disabled:opacity-64 [&_svg:not([class*='size-'])]:size-4.5 flex shrink-0 grow cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-transparent text-base font-medium outline-none transition-[color,background-color,box-shadow] focus-visible:ring-2 sm:text-sm sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
        "hover:text-muted-foreground data-active:text-foreground",
        "h-9 gap-1.5 px-[calc(--spacing(2.5)-1px)] sm:h-8",
        "data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start",
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      className={cn("flex-1 outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTab, TabsTab as TabsTrigger, TabsPanel, TabsPanel as TabsContent };
