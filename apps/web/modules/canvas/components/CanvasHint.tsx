"use client";

export function CanvasHint() {
  return (
    <div className="text-canvas-muted-foreground flex items-center gap-2 text-xs">
      <span>To move canvas, hold</span>
      <kbd className="border-canvas-border bg-canvas-muted pointer-events-none select-none items-center justify-center rounded border px-1.5 pt-0.5 font-mono text-[10px] font-medium">
        Scroll wheel
      </kbd>
      <span>or</span>
      <kbd className="border-canvas-border bg-canvas-muted pointer-events-none select-none items-center justify-center rounded border px-1.5 pt-0.5 font-mono text-[10px] font-medium">
        Space
      </kbd>
      <span>while dragging, or use the hand tool</span>
    </div>
  );
}
