"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  type Point,
  type Shape,
  type Tool,
  type RectangleShape,
  type DiamondShape,
  type EllipseShape,
  type ArrowShape,
  type LineShape,
  type PencilShape,
  type TextShape,
  generateShapeId,
} from "../types";

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

interface DrawingCanvasProps {
  shapes: Shape[];
  currentShape: Shape | null;
  tool: Tool;
  zoom: number;
  pan: Point;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  opacity: number;
  textSize: "xs" | "md" | "lg" | "xxl";
  selectedIds: string[];
  onStartDrawing: (point: Point) => void;
  onUpdateDrawing: (point: Point, shape: Shape | null) => void;
  onFinishDrawing: () => void;
  onAddShape: (shape: Shape) => void;
  onUpdateShape: (shapeId: string, updates: Partial<Shape>) => void;
  onSelectShape: (shapeId: string, addToSelection?: boolean) => void;
  onSetSelection: (shapeIds: string[]) => void;
  onSetLiveShapes: (updater: (prev: Shape[]) => Shape[]) => void;
  onCommitShapes: (shapes: Shape[]) => void;
  onDeselectAll: () => void;
  onDeleteShape: (shapeId: string) => void;
  onPanChange: (pan: Point) => void;
  onSetZoom: (zoom: number) => void;
  isDrawing: boolean;
  startPoint: Point | null;
}

export function DrawingCanvas({
  shapes,
  currentShape,
  tool,
  zoom,
  pan,
  strokeColor,
  strokeWidth,
  fillColor,
  opacity,
  textSize,
  selectedIds,
  onStartDrawing,
  onUpdateDrawing,
  onFinishDrawing,
  onAddShape,
  onUpdateShape,
  onSelectShape,
  onSetSelection,
  onSetLiveShapes,
  onCommitShapes,
  onDeselectAll,
  onDeleteShape,
  onPanChange,
  onSetZoom,
  isDrawing,
  startPoint,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const lastPanPointRef = useRef<Point | null>(null);
  const selectionStartRef = useRef<Point | null>(null);
  const [selectionBox, setSelectionBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const isDraggingShapesRef = useRef(false);
  const dragStartRef = useRef<Point | null>(null);

  const [textInput, setTextInput] = useState<{
    x: number;
    y: number;
    text: string;
    isEditing: boolean;
    editingShapeId?: string;
    editingType?: "text" | "label";
  } | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null);
  const resizeStartRef = useRef<{
    handle: ResizeHandle;
    startPoint: Point;
    originalBounds: { x: number; y: number; width: number; height: number };
    shapeId: string;
  } | null>(null);

  const getCanvasCoordinates = useCallback(
    (e: MouseEvent | React.MouseEvent): Point => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left - pan.x) / zoom,
        y: (e.clientY - rect.top - pan.y) / zoom,
      };
    },
    [pan, zoom]
  );

  const drawShape = useCallback(
    (ctx: CanvasRenderingContext2D, shape: Shape, isPreview = false) => {
      ctx.save();
      ctx.globalAlpha = shape.opacity;
      ctx.strokeStyle = shape.strokeColor;
      ctx.lineWidth = shape.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (shape.fillColor && shape.fillColor !== "transparent") {
        ctx.fillStyle = shape.fillColor;
      }

      const isSelected = selectedIds.includes(shape.id);

      switch (shape.type) {
        case "rectangle": {
          const rect = shape as RectangleShape;
          const borderRadius = rect.borderRadius || 0;

          ctx.beginPath();
          if (borderRadius > 0) {
            ctx.roundRect(rect.x, rect.y, rect.width, rect.height, borderRadius);
          } else {
            ctx.rect(rect.x, rect.y, rect.width, rect.height);
          }

          if (rect.fillColor && rect.fillColor !== "transparent") {
            ctx.fill();
          }
          ctx.stroke();

          if (rect.label) {
            const labelFontSize = rect.labelFontSize || 16;
            ctx.font = `${labelFontSize}px sans-serif`;
            ctx.fillStyle = rect.strokeColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const lines = rect.label.split("\n");
            const lineHeight = labelFontSize * 1.2;
            const totalHeight = lines.length * lineHeight;
            const startY = rect.y + rect.height / 2 - totalHeight / 2 + lineHeight / 2;
            lines.forEach((line, i) => {
              ctx.fillText(line, rect.x + rect.width / 2, startY + i * lineHeight);
            });
          }
          break;
        }

        case "diamond": {
          const diamond = shape as DiamondShape;
          const cx = diamond.x + diamond.width / 2;
          const cy = diamond.y + diamond.height / 2;
          const hw = diamond.width / 2;
          const hh = diamond.height / 2;

          ctx.beginPath();
          ctx.moveTo(cx, diamond.y);
          ctx.lineTo(diamond.x + diamond.width, cy);
          ctx.lineTo(cx, diamond.y + diamond.height);
          ctx.lineTo(diamond.x, cy);
          ctx.closePath();

          if (diamond.fillColor && diamond.fillColor !== "transparent") {
            ctx.fill();
          }
          ctx.stroke();

          if (diamond.label) {
            const labelFontSize = diamond.labelFontSize || 16;
            ctx.font = `${labelFontSize}px sans-serif`;
            ctx.fillStyle = diamond.strokeColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const lines = diamond.label.split("\n");
            const lineHeight = labelFontSize * 1.2;
            const totalHeight = lines.length * lineHeight;
            const startY = cy - totalHeight / 2 + lineHeight / 2;
            lines.forEach((line, i) => {
              ctx.fillText(line, cx, startY + i * lineHeight);
            });
          }
          break;
        }

        case "ellipse": {
          const ellipse = shape as EllipseShape;
          ctx.beginPath();
          ctx.ellipse(
            ellipse.x,
            ellipse.y,
            Math.abs(ellipse.radiusX),
            Math.abs(ellipse.radiusY),
            0,
            0,
            2 * Math.PI
          );

          if (ellipse.fillColor && ellipse.fillColor !== "transparent") {
            ctx.fill();
          }
          ctx.stroke();

          if (ellipse.label) {
            const labelFontSize = ellipse.labelFontSize || 16;
            ctx.font = `${labelFontSize}px sans-serif`;
            ctx.fillStyle = ellipse.strokeColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const lines = ellipse.label.split("\n");
            const lineHeight = labelFontSize * 1.2;
            const totalHeight = lines.length * lineHeight;
            const startY = ellipse.y - totalHeight / 2 + lineHeight / 2;
            lines.forEach((line, i) => {
              ctx.fillText(line, ellipse.x, startY + i * lineHeight);
            });
          }
          break;
        }

        case "arrow": {
          const arrow = shape as ArrowShape;
          if (arrow.points.length < 2) break;

          ctx.beginPath();
          ctx.moveTo(arrow.points[0].x, arrow.points[0].y);
          for (let i = 1; i < arrow.points.length; i++) {
            ctx.lineTo(arrow.points[i].x, arrow.points[i].y);
          }
          ctx.stroke();

          const lastPoint = arrow.points[arrow.points.length - 1];
          const secondLastPoint = arrow.points[arrow.points.length - 2] || arrow.points[0];
          const angle = Math.atan2(lastPoint.y - secondLastPoint.y, lastPoint.x - secondLastPoint.x);
          const arrowLength = 12;
          const arrowAngle = Math.PI / 6;

          ctx.beginPath();
          ctx.moveTo(lastPoint.x, lastPoint.y);
          ctx.lineTo(
            lastPoint.x - arrowLength * Math.cos(angle - arrowAngle),
            lastPoint.y - arrowLength * Math.sin(angle - arrowAngle)
          );
          ctx.moveTo(lastPoint.x, lastPoint.y);
          ctx.lineTo(
            lastPoint.x - arrowLength * Math.cos(angle + arrowAngle),
            lastPoint.y - arrowLength * Math.sin(angle + arrowAngle)
          );
          ctx.stroke();
          break;
        }

        case "line": {
          const line = shape as LineShape;
          if (line.points.length < 2) break;

          ctx.beginPath();
          ctx.moveTo(line.points[0].x, line.points[0].y);
          for (let i = 1; i < line.points.length; i++) {
            ctx.lineTo(line.points[i].x, line.points[i].y);
          }
          ctx.stroke();
          break;
        }

        case "pencil": {
          const pencil = shape as PencilShape;
          if (pencil.points.length < 2) break;

          ctx.beginPath();
          ctx.moveTo(pencil.points[0].x, pencil.points[0].y);

          for (let i = 1; i < pencil.points.length - 1; i++) {
            const xc = (pencil.points[i].x + pencil.points[i + 1].x) / 2;
            const yc = (pencil.points[i].y + pencil.points[i + 1].y) / 2;
            ctx.quadraticCurveTo(pencil.points[i].x, pencil.points[i].y, xc, yc);
          }

          if (pencil.points.length > 1) {
            const lastPoint = pencil.points[pencil.points.length - 1];
            ctx.lineTo(lastPoint.x, lastPoint.y);
          }

          ctx.stroke();
          break;
        }

        case "text": {
          const textShape = shape as TextShape;
          ctx.font = `${textShape.fontSize}px ${textShape.fontFamily}`;
          ctx.fillStyle = textShape.strokeColor;
          ctx.textAlign = textShape.textAlign;
          ctx.textBaseline = "top";

          const lines = textShape.text.split("\n");
          lines.forEach((line, index) => {
            ctx.fillText(line, textShape.x, textShape.y + index * textShape.fontSize * 1.2);
          });
          break;
        }
      }

      if (isSelected && !isPreview) {
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        const bounds = getShapeBounds(shape);
        ctx.strokeRect(bounds.x - 4, bounds.y - 4, bounds.width + 8, bounds.height + 8);
        ctx.setLineDash([]);

        const handleSize = 8;
        const handles = [
          { x: bounds.x - 4, y: bounds.y - 4 },
          { x: bounds.x + bounds.width / 2, y: bounds.y - 4 },
          { x: bounds.x + bounds.width + 4, y: bounds.y - 4 },
          { x: bounds.x + bounds.width + 4, y: bounds.y + bounds.height / 2 },
          { x: bounds.x + bounds.width + 4, y: bounds.y + bounds.height + 4 },
          { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height + 4 },
          { x: bounds.x - 4, y: bounds.y + bounds.height + 4 },
          { x: bounds.x - 4, y: bounds.y + bounds.height / 2 },
        ];

        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 2;

        handles.forEach((handle) => {
          ctx.beginPath();
          ctx.rect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
          ctx.fill();
          ctx.stroke();
        });
      }

      ctx.restore();
    },
    [selectedIds]
  );

  const getShapeBounds = (shape: Shape): { x: number; y: number; width: number; height: number } => {
    switch (shape.type) {
      case "rectangle":
      case "diamond": {
        const s = shape as RectangleShape | DiamondShape;
        return { x: s.x, y: s.y, width: s.width, height: s.height };
      }
      case "ellipse": {
        const e = shape as EllipseShape;
        return {
          x: e.x - e.radiusX,
          y: e.y - e.radiusY,
          width: e.radiusX * 2,
          height: e.radiusY * 2,
        };
      }
      case "arrow":
      case "line":
      case "pencil": {
        const points = (shape as ArrowShape | LineShape | PencilShape).points;
        if (points.length === 0) return { x: shape.x, y: shape.y, width: 0, height: 0 };

        const xs = points.map((p) => p.x);
        const ys = points.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      }
      case "text": {
        const textShape = shape as TextShape;
        const lines = textShape.text.split("\n");
        const lineHeight = textShape.fontSize * 1.2;
        const width = Math.max(...lines.map((line) => line.length * textShape.fontSize * 0.6), 100);
        const height = lines.length * lineHeight;
        return { x: textShape.x, y: textShape.y, width, height };
      }
    }
  };

  const isPointInShape = (point: Point, shape: Shape): boolean => {
    const bounds = getShapeBounds(shape);
    return (
      point.x >= bounds.x &&
      point.x <= bounds.x + bounds.width &&
      point.y >= bounds.y &&
      point.y <= bounds.y + bounds.height
    );
  };

  const getResizeHandleAtPoint = (point: Point, shape: Shape): ResizeHandle | null => {
    const bounds = getShapeBounds(shape);
    const handleSize = 12;

    const handles: { pos: ResizeHandle; x: number; y: number }[] = [
      { pos: "nw", x: bounds.x - 4, y: bounds.y - 4 },
      { pos: "n", x: bounds.x + bounds.width / 2, y: bounds.y - 4 },
      { pos: "ne", x: bounds.x + bounds.width + 4, y: bounds.y - 4 },
      { pos: "e", x: bounds.x + bounds.width + 4, y: bounds.y + bounds.height / 2 },
      { pos: "se", x: bounds.x + bounds.width + 4, y: bounds.y + bounds.height + 4 },
      { pos: "s", x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height + 4 },
      { pos: "sw", x: bounds.x - 4, y: bounds.y + bounds.height + 4 },
      { pos: "w", x: bounds.x - 4, y: bounds.y + bounds.height / 2 },
    ];

    for (const handle of handles) {
      if (
        point.x >= handle.x - handleSize / 2 &&
        point.x <= handle.x + handleSize / 2 &&
        point.y >= handle.y - handleSize / 2 &&
        point.y <= handle.y + handleSize / 2
      ) {
        return handle.pos;
      }
    }
    return null;
  };

  const getCursorForHandle = (handle: ResizeHandle): string => {
    const cursors: Record<ResizeHandle, string> = {
      nw: "nwse-resize",
      n: "ns-resize",
      ne: "nesw-resize",
      e: "ew-resize",
      se: "nwse-resize",
      s: "ns-resize",
      sw: "nesw-resize",
      w: "ew-resize",
    };
    return cursors[handle];
  };

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.setTransform(zoom, 0, 0, zoom, pan.x, pan.y);

    shapes.forEach((shape) => drawShape(ctx, shape));

    if (currentShape) {
      drawShape(ctx, currentShape, true);
    }
  }, [shapes, currentShape, zoom, pan, drawShape]);

  const createShape = useCallback(
    (startPoint: Point, currentPoint: Point): Shape | null => {
      const baseShape = {
        id: generateShapeId(),
        strokeColor,
        strokeWidth,
        fillColor,
        opacity,
      };

      switch (tool) {
        case "rectangle": {
          const x = Math.min(startPoint.x, currentPoint.x);
          const y = Math.min(startPoint.y, currentPoint.y);
          const width = Math.abs(currentPoint.x - startPoint.x);
          const height = Math.abs(currentPoint.y - startPoint.y);

          return {
            ...baseShape,
            type: "rectangle",
            x,
            y,
            width,
            height,
          } as RectangleShape;
        }

        case "diamond": {
          const x = Math.min(startPoint.x, currentPoint.x);
          const y = Math.min(startPoint.y, currentPoint.y);
          const width = Math.abs(currentPoint.x - startPoint.x);
          const height = Math.abs(currentPoint.y - startPoint.y);

          return {
            ...baseShape,
            type: "diamond",
            x,
            y,
            width,
            height,
          } as DiamondShape;
        }

        case "ellipse": {
          return {
            ...baseShape,
            type: "ellipse",
            x: startPoint.x,
            y: startPoint.y,
            radiusX: Math.abs(currentPoint.x - startPoint.x),
            radiusY: Math.abs(currentPoint.y - startPoint.y),
          } as EllipseShape;
        }

        case "arrow": {
          return {
            ...baseShape,
            type: "arrow",
            x: startPoint.x,
            y: startPoint.y,
            points: [startPoint, currentPoint],
            endArrowhead: "arrow",
          } as ArrowShape;
        }

        case "line": {
          return {
            ...baseShape,
            type: "line",
            x: startPoint.x,
            y: startPoint.y,
            points: [startPoint, currentPoint],
          } as LineShape;
        }

        default:
          return null;
      }
    },
    [tool, strokeColor, strokeWidth, fillColor, opacity]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const coords = getCanvasCoordinates(e);
      if (tool === "hand" || e.button === 1) {
        isPanningRef.current = true;
        lastPanPointRef.current = { x: e.clientX, y: e.clientY };
        return;
      }
      if (tool === "select") {
        for (const shapeId of selectedIds) {
          const shape = shapes.find((s) => s.id === shapeId);
          if (shape) {
            const handle = getResizeHandleAtPoint(coords, shape);
            if (handle) {
              resizeStartRef.current = {
                handle,
                startPoint: coords,
                originalBounds: getShapeBounds(shape),
                shapeId: shape.id,
              };
              setActiveHandle(handle);
              return;
            }
          }
        }

        const clickedShape = [...shapes].reverse().find((s) => isPointInShape(coords, s));
        if (clickedShape) {
          onSelectShape(clickedShape.id, e.shiftKey);
          isDraggingShapesRef.current = true;
          dragStartRef.current = coords;
        } else {
          onDeselectAll();
          selectionStartRef.current = coords;
          setSelectionBox({ x: coords.x, y: coords.y, width: 0, height: 0 });
        }
        return;
      }
      if (tool === "eraser") {
        const shapeToDelete = [...shapes].reverse().find((s) => isPointInShape(coords, s));
        if (shapeToDelete) {
          onDeleteShape(shapeToDelete.id);
        }
        return;
      }
      if (tool === "pencil") {
        const pencilShape: PencilShape = {
          id: generateShapeId(),
          type: "pencil",
          x: coords.x,
          y: coords.y,
          strokeColor,
          strokeWidth,
          fillColor,
          opacity,
          points: [coords],
        };
        onStartDrawing(coords);
        onUpdateDrawing(coords, pencilShape);
        return;
      }
      if (["rectangle", "diamond", "ellipse", "arrow", "line"].includes(tool)) {
        selectionStartRef.current = null;
        setSelectionBox(null);
        isDraggingShapesRef.current = false;
        dragStartRef.current = null;

        onStartDrawing(coords);
      }
    },
    [
      tool,
      shapes,
      selectedIds,
      getCanvasCoordinates,
      onStartDrawing,
      onUpdateDrawing,
      onSelectShape,
      onDeselectAll,
      onDeleteShape,
      strokeColor,
      strokeWidth,
      fillColor,
      opacity,
    ]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanningRef.current && lastPanPointRef.current) {
        const dx = e.clientX - lastPanPointRef.current.x;
        const dy = e.clientY - lastPanPointRef.current.y;
        onPanChange({ x: pan.x + dx, y: pan.y + dy });
        lastPanPointRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      if (tool === "select" && resizeStartRef.current) {
        const coords = getCanvasCoordinates(e);
        const { handle, startPoint, originalBounds, shapeId } = resizeStartRef.current;
        const dx = coords.x - startPoint.x;
        const dy = coords.y - startPoint.y;

        onSetLiveShapes((prevShapes) =>
          prevShapes.map((shape) => {
            if (shape.id !== shapeId) return shape;

            let newX = originalBounds.x;
            let newY = originalBounds.y;
            let newWidth = originalBounds.width;
            let newHeight = originalBounds.height;

            switch (handle) {
              case "nw":
                newX = originalBounds.x + dx;
                newY = originalBounds.y + dy;
                newWidth = originalBounds.width - dx;
                newHeight = originalBounds.height - dy;
                break;
              case "n":
                newY = originalBounds.y + dy;
                newHeight = originalBounds.height - dy;
                break;
              case "ne":
                newY = originalBounds.y + dy;
                newWidth = originalBounds.width + dx;
                newHeight = originalBounds.height - dy;
                break;
              case "e":
                newWidth = originalBounds.width + dx;
                break;
              case "se":
                newWidth = originalBounds.width + dx;
                newHeight = originalBounds.height + dy;
                break;
              case "s":
                newHeight = originalBounds.height + dy;
                break;
              case "sw":
                newX = originalBounds.x + dx;
                newWidth = originalBounds.width - dx;
                newHeight = originalBounds.height + dy;
                break;
              case "w":
                newX = originalBounds.x + dx;
                newWidth = originalBounds.width - dx;
                break;
            }

            const minSize = 10;
            if (newWidth < minSize) {
              if (handle.includes("w")) {
                newX = originalBounds.x + originalBounds.width - minSize;
              }
              newWidth = minSize;
            }
            if (newHeight < minSize) {
              if (handle.includes("n")) {
                newY = originalBounds.y + originalBounds.height - minSize;
              }
              newHeight = minSize;
            }

            switch (shape.type) {
              case "rectangle":
              case "diamond":
                return { ...shape, x: newX, y: newY, width: newWidth, height: newHeight } as Shape;
              case "ellipse":
                return {
                  ...shape,
                  x: newX + newWidth / 2,
                  y: newY + newHeight / 2,
                  radiusX: newWidth / 2,
                  radiusY: newHeight / 2,
                } as Shape;
              case "text": {
                const textShape = shape as TextShape;
                const scaleY = newHeight / originalBounds.height;
                const newFontSize = Math.max(8, Math.round(textShape.fontSize * scaleY));
                return {
                  ...textShape,
                  x: newX,
                  y: newY,
                  fontSize: newFontSize,
                } as Shape;
              }
              case "arrow":
              case "line":
              case "pencil": {
                const pointsShape = shape as ArrowShape | LineShape | PencilShape;
                const safeWidth = Math.max(originalBounds.width, 10);
                const safeHeight = Math.max(originalBounds.height, 10);
                const scaleX = Math.min(5, Math.max(0.2, newWidth / safeWidth));
                const scaleY = Math.min(5, Math.max(0.2, newHeight / safeHeight));

                const newPoints = pointsShape.points.map((p) => ({
                  x: newX + (p.x - originalBounds.x) * scaleX,
                  y: newY + (p.y - originalBounds.y) * scaleY,
                }));
                return { ...pointsShape, points: newPoints } as Shape;
              }
              default:
                return shape;
            }
          })
        );
        return;
      }

      if (tool === "select" && isDraggingShapesRef.current && dragStartRef.current) {
        const coords = getCanvasCoordinates(e);
        const dx = coords.x - dragStartRef.current.x;
        const dy = coords.y - dragStartRef.current.y;
        dragStartRef.current = coords;

        onSetLiveShapes((prevShapes) =>
          prevShapes.map((shape) => {
            if (!selectedIds.includes(shape.id)) return shape;

            const movePoints = (points: Point[]) => points.map((p) => ({ x: p.x + dx, y: p.y + dy }));

            switch (shape.type) {
              case "rectangle":
              case "diamond":
                return { ...shape, x: shape.x + dx, y: shape.y + dy } as Shape;
              case "ellipse":
                return { ...shape, x: shape.x + dx, y: shape.y + dy } as Shape;
              case "arrow":
              case "line":
              case "pencil":
                return { ...shape, points: movePoints((shape as any).points) } as Shape;
              default:
                return shape;
            }
          })
        );
        return;
      }

      if (tool === "select" && selectionStartRef.current) {
        const coords = getCanvasCoordinates(e);
        const x = Math.min(selectionStartRef.current.x, coords.x);
        const y = Math.min(selectionStartRef.current.y, coords.y);
        const width = Math.abs(coords.x - selectionStartRef.current.x);
        const height = Math.abs(coords.y - selectionStartRef.current.y);
        setSelectionBox({ x, y, width, height });

        const selected = shapes
          .filter((shape) => {
            const b = getShapeBounds(shape);
            return b.x < x + width && b.x + b.width > x && b.y < y + height && b.y + b.height > y;
          })
          .map((s) => s.id);

        onSetSelection(selected);
        return;
      }

      if (!isDrawing || !startPoint) return;

      const coords = getCanvasCoordinates(e);

      if (tool === "pencil" && currentShape?.type === "pencil") {
        const updatedPencil: PencilShape = {
          ...(currentShape as PencilShape),
          points: [...(currentShape as PencilShape).points, coords],
        };
        onUpdateDrawing(coords, updatedPencil);
        return;
      }

      const shape = createShape(startPoint, coords);
      if (shape) {
        onUpdateDrawing(coords, shape);
      }
    },
    [
      isDrawing,
      startPoint,
      tool,
      currentShape,
      pan,
      getCanvasCoordinates,
      createShape,
      onUpdateDrawing,
      onPanChange,
      onSetLiveShapes,
      selectedIds,
      onSetSelection,
      shapes,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      lastPanPointRef.current = null;
      return;
    }
    if (tool === "select" && resizeStartRef.current) {
      resizeStartRef.current = null;
      setActiveHandle(null);
      onCommitShapes(shapes);
      return;
    }
    if (tool === "select" && isDraggingShapesRef.current) {
      isDraggingShapesRef.current = false;
      dragStartRef.current = null;
      onCommitShapes(shapes);
      return;
    }
    if (tool === "select" && selectionStartRef.current) {
      selectionStartRef.current = null;
      setSelectionBox(null);
      return;
    }
    if (currentShape) {
      const bounds = getShapeBounds(currentShape);
      if (bounds.width > 2 || bounds.height > 2 || currentShape.type === "pencil") {
        onAddShape(currentShape);
      }
    }

    onFinishDrawing();
  }, [currentShape, onAddShape, onFinishDrawing, onCommitShapes, shapes, tool]);
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(5, zoom * delta));
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
          const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

          onPanChange({ x: newPanX, y: newPanY });
        }

        onSetZoom(newZoom);
      } else {
        onPanChange({
          x: pan.x - e.deltaX,
          y: pan.y - e.deltaY,
        });
      }
    },
    [zoom, pan, onPanChange, onSetZoom]
  );
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redrawCanvas();
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [redrawCanvas]);
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const getCursor = () => {
    if (activeHandle) {
      return getCursorForHandle(activeHandle);
    }
    switch (tool) {
      case "hand":
        return isPanningRef.current ? "grabbing" : "grab";
      case "select":
        return "default";
      case "eraser":
        return "crosshair";
      case "text":
        return "text";
      default:
        return "crosshair";
    }
  };

  const TEXT_SIZE_MAP = {
    xs: 14,
    md: 18,
    lg: 28,
    xxl: 42,
  };

  const measureTextDimensions = useCallback(
    (text: string, fontSize: number): { width: number; height: number } => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return { width: 100, height: fontSize * 1.2 };

      ctx.font = `${fontSize}px sans-serif`;
      const lines = text.split("\n");
      const lineHeight = fontSize * 1.2;
      const maxWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
      const totalHeight = lines.length * lineHeight;

      return { width: maxWidth + 20, height: totalHeight + 20 };
    },
    []
  );

  const handleTextSubmit = useCallback(() => {
    if (!textInput) {
      return;
    }

    if (textInput.editingShapeId && textInput.editingType === "text") {
      if (textInput.text.trim()) {
        onUpdateShape(textInput.editingShapeId, { text: textInput.text } as Partial<TextShape>);
      }
      setTextInput(null);
      return;
    }

    if (textInput.editingShapeId && textInput.editingType === "label") {
      const fontSize = TEXT_SIZE_MAP[textSize];
      const labelText = textInput.text.trim();

      if (labelText) {
        const textDimensions = measureTextDimensions(labelText, fontSize);
        const shape = shapes.find((s) => s.id === textInput.editingShapeId);

        if (shape) {
          const updates: Partial<Shape> = {
            label: labelText,
            labelFontSize: fontSize,
          };

          if (shape.type === "rectangle" || shape.type === "diamond") {
            const rectShape = shape as RectangleShape | DiamondShape;
            if (textDimensions.width > rectShape.width) {
              (updates as any).width = textDimensions.width;
            }
            if (textDimensions.height > rectShape.height) {
              (updates as any).height = textDimensions.height;
            }
          } else if (shape.type === "ellipse") {
            const ellipseShape = shape as EllipseShape;
            const neededRadiusX = textDimensions.width / 2;
            const neededRadiusY = textDimensions.height / 2;
            if (neededRadiusX > ellipseShape.radiusX) {
              (updates as any).radiusX = neededRadiusX;
            }
            if (neededRadiusY > ellipseShape.radiusY) {
              (updates as any).radiusY = neededRadiusY;
            }
          }

          onUpdateShape(textInput.editingShapeId, updates);
        }
      } else {
        onUpdateShape(textInput.editingShapeId, {
          label: undefined,
          labelFontSize: undefined,
        });
      }

      setTextInput(null);
      return;
    }

    if (textInput.text.trim()) {
      const fontSize = TEXT_SIZE_MAP[textSize];
      const textShape: TextShape = {
        id: generateShapeId(),
        type: "text",
        x: textInput.x,
        y: textInput.y,
        strokeColor,
        strokeWidth,
        fillColor,
        opacity,
        text: textInput.text,
        fontSize,
        fontFamily: "sans-serif",
        textAlign: "left",
      };
      onAddShape(textShape);
    }
    setTextInput(null);
  }, [
    textInput,
    strokeColor,
    strokeWidth,
    fillColor,
    opacity,
    onAddShape,
    onUpdateShape,
    textSize,
    measureTextDimensions,
    shapes,
  ]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const coords = getCanvasCoordinates(e);

      const clickedTextShape = [...shapes]
        .reverse()
        .find((s) => s.type === "text" && isPointInShape(coords, s)) as TextShape | undefined;

      if (clickedTextShape) {
        const bounds = getShapeBounds(clickedTextShape);
        setTextInput({
          x: clickedTextShape.x,
          y: clickedTextShape.y,
          text: clickedTextShape.text,
          isEditing: true,
          editingShapeId: clickedTextShape.id,
          editingType: "text",
        });
        return;
      }

      const clickedShape = [...shapes]
        .reverse()
        .find((s) => ["rectangle", "diamond", "ellipse"].includes(s.type) && isPointInShape(coords, s));

      if (clickedShape) {
        const bounds = getShapeBounds(clickedShape);
        setTextInput({
          x: bounds.x + bounds.width / 2,
          y: bounds.y + bounds.height / 2,
          text: clickedShape.label || "",
          isEditing: true,
          editingShapeId: clickedShape.id,
          editingType: "label",
        });
        return;
      }

      setTextInput({
        x: coords.x,
        y: coords.y,
        text: "",
        isEditing: true,
      });
    },
    [getCanvasCoordinates, shapes]
  );

  useEffect(() => {
    if (textInput?.isEditing && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [textInput?.isEditing]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" style={{ cursor: getCursor() }}>
      <canvas
        ref={canvasRef}
        className="bg-canvas-background absolute inset-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />

      {selectionBox && (
        <div
          className="pointer-events-none absolute border-2 border-dashed border-indigo-500 bg-indigo-500/10"
          style={{
            left: selectionBox.x * zoom + pan.x,
            top: selectionBox.y * zoom + pan.y,
            width: selectionBox.width * zoom,
            height: selectionBox.height * zoom,
          }}
        />
      )}

      {textInput &&
        textInput.isEditing &&
        (() => {
          let fontSize = TEXT_SIZE_MAP[textSize];
          if (textInput.editingShapeId && textInput.editingType === "text") {
            const editingShape = shapes.find((s) => s.id === textInput.editingShapeId) as
              | TextShape
              | undefined;
            if (editingShape) {
              fontSize = editingShape.fontSize;
            }
          } else if (textInput.editingShapeId && textInput.editingType === "label") {
            const editingShape = shapes.find((s) => s.id === textInput.editingShapeId);
            if (editingShape?.labelFontSize) {
              fontSize = editingShape.labelFontSize;
            }
          }

          const isLabel = textInput.editingType === "label";

          return (
            <textarea
              ref={textInputRef}
              className={`absolute resize-none whitespace-pre border-none bg-transparent text-white outline-none ${
                isLabel ? "text-center" : ""
              }`}
              style={{
                left: textInput.x * zoom + pan.x,
                top: textInput.y * zoom + pan.y,
                fontSize: `${fontSize * zoom}px`,
                fontFamily: "sans-serif",
                minWidth: "20px",
                minHeight: "30px",
                width: "auto",
                padding: "4px",
                color: strokeColor,
                overflow: "hidden",
                wordWrap: "normal",
                overflowWrap: "normal",
                transform: isLabel ? "translate(-50%, -50%)" : "none",
              }}
              value={textInput.text}
              onChange={(e) => {
                setTextInput({ ...textInput, text: e.target.value });
                if (textInputRef.current) {
                  textInputRef.current.style.width = "auto";
                  textInputRef.current.style.height = "auto";
                  textInputRef.current.style.width = `${textInputRef.current.scrollWidth}px`;
                  textInputRef.current.style.height = `${textInputRef.current.scrollHeight}px`;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setTextInput(null);
                }
                e.stopPropagation();
              }}
              onBlur={handleTextSubmit}
              placeholder={isLabel ? "Add label..." : "Type here..."}
            />
          );
        })()}
    </div>
  );
}
