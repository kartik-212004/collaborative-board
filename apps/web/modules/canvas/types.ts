// Canvas drawing types and constants

export type Tool =
  | "select"
  | "hand"
  | "rectangle"
  | "diamond"
  | "ellipse"
  | "arrow"
  | "line"
  | "pencil"
  | "text"
  | "image"
  | "eraser";

export type ShapeType = "rectangle" | "diamond" | "ellipse" | "arrow" | "line" | "pencil" | "text";

export interface Point {
  x: number;
  y: number;
}

export interface BaseShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
  opacity: number;
  isSelected?: boolean;
  // Text inside the shape
  label?: string;
  labelFontSize?: number;
}

export interface RectangleShape extends BaseShape {
  type: "rectangle";
  width: number;
  height: number;
  borderRadius?: number;
}

export interface DiamondShape extends BaseShape {
  type: "diamond";
  width: number;
  height: number;
}

export interface EllipseShape extends BaseShape {
  type: "ellipse";
  radiusX: number;
  radiusY: number;
}

export interface ArrowShape extends BaseShape {
  type: "arrow";
  points: Point[];
  startArrowhead?: "arrow" | "bar" | "dot" | "triangle" | null;
  endArrowhead?: "arrow" | "bar" | "dot" | "triangle" | null;
}

export interface LineShape extends BaseShape {
  type: "line";
  points: Point[];
}

export interface PencilShape extends BaseShape {
  type: "pencil";
  points: Point[];
}

export interface TextShape extends BaseShape {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  textAlign: "left" | "center" | "right";
}

export type Shape =
  | RectangleShape
  | DiamondShape
  | EllipseShape
  | ArrowShape
  | LineShape
  | PencilShape
  | TextShape;

export interface CanvasState {
  shapes: Shape[];
  selectedIds: string[];
  zoom: number;
  pan: Point;
  tool: Tool;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  opacity: number;
}

export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  currentShape: Shape | null;
}

export interface HistoryState {
  past: Shape[][];
  present: Shape[];
  future: Shape[][];
}

// WebSocket message types
export interface DrawMessage {
  name: string;
  type: "join" | "draw" | "update" | "delete" | "clear" | "user_joined" | "error";
  roomId: string;
  payload: {
    shape?: Shape;
    shapes?: Shape[];
    shapeId?: string;
    timestamp?: number;
    message?: string;
  };
}

// Tool keyboard shortcuts
export const TOOL_SHORTCUTS: Record<string, Tool> = {
  "1": "select",
  "2": "hand",
  "3": "rectangle",
  "4": "diamond",
  "5": "ellipse",
  "6": "arrow",
  "7": "line",
  "8": "pencil",
  "9": "text",
  "0": "eraser",
};

// Default canvas settings
export const DEFAULT_CANVAS_STATE: Omit<CanvasState, "shapes"> = {
  selectedIds: [],
  zoom: 1,
  pan: { x: 0, y: 0 },
  tool: "select",
  strokeColor: "#ffffff",
  strokeWidth: 2,
  fillColor: "transparent",
  opacity: 1,
};

// Color palette for the canvas
export const STROKE_COLORS = [
  "#ffffff", // White
  "#868e96", // Gray
  "#fa5252", // Red
  "#e64980", // Pink
  "#be4bdb", // Purple
  "#7950f2", // Violet
  "#4c6ef5", // Indigo
  "#228be6", // Blue
  "#15aabf", // Cyan
  "#12b886", // Teal
  "#40c057", // Green
  "#82c91e", // Lime
  "#fab005", // Yellow
  "#fd7e14", // Orange
];

export const FILL_COLORS = [
  "transparent",
  "#ffffff1a", // White 10%
  "#868e961a", // Gray 10%
  "#fa52521a", // Red 10%
  "#e649801a", // Pink 10%
  "#be4bdb1a", // Purple 10%
  "#7950f21a", // Violet 10%
  "#4c6ef51a", // Indigo 10%
  "#228be61a", // Blue 10%
  "#15aabf1a", // Cyan 10%
  "#12b8861a", // Teal 10%
  "#40c0571a", // Green 10%
  "#82c91e1a", // Lime 10%
  "#fab0051a", // Yellow 10%
  "#fd7e141a", // Orange 10%
];

export const STROKE_WIDTHS = [1, 2, 4, 6];

// Generate unique ID for shapes
export function generateShapeId(): string {
  return `shape_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
