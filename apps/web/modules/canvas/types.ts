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

export interface ConnectedUser {
  id: string;
  name: string;
  color: string;
  isDrawing: boolean;
}

export interface DrawMessage {
  name?: string;
  type:
    | "join"
    | "draw"
    | "update"
    | "delete"
    | "clear"
    | "user_joined"
    | "user_left"
    | "users_list"
    | "drawing_start"
    | "drawing_end"
    | "error"
    | "init";
  roomId: string;
  payload: {
    shape?: Shape;
    shapes?: Shape[];
    shapeId?: string;
    timestamp?: number;
    message?: string;
    users?: ConnectedUser[];
    user?: ConnectedUser;
    userId?: string;
  };
}

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

export const STROKE_COLORS = [
  "#ffffff",
  "#868e96",
  "#fa5252",
  "#e64980",
  "#be4bdb",
  "#7950f2",
  "#4c6ef5",
  "#228be6",
  "#15aabf",
  "#12b886",
  "#40c057",
  "#82c91e",
  "#fab005",
  "#fd7e14",
];

export const FILL_COLORS = [
  "transparent",
  "#ffffff1a",
  "#868e961a",
  "#fa52521a",
  "#e649801a",
  "#be4bdb1a",
  "#7950f21a",
  "#4c6ef51a",
  "#228be61a",
  "#15aabf1a",
  "#12b8861a",
  "#40c0571a",
  "#82c91e1a",
  "#fab0051a",
  "#fd7e141a",
];

export const STROKE_WIDTHS = [1, 2, 4, 6];
export function generateShapeId(): string {
  return `shape_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
