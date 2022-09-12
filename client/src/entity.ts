import { DrawableObject } from "./utils/drawable-object.js";
import { drawIsocelTriangle } from "./utils/drawings.js";

export class Entity implements DrawableObject {
  id: number;
  position: { x: number; y: number };
  color: string;
  transparency: number;
  orientation: number;
  toBeDrawn = true;

  constructor(
    id: number,
    position: { x: number; y: number },
    color: string,
    orientation: number,
    transparency: number
  ) {
    this.id = id;
    this.position = position;
    this.color = color;
    this.orientation = orientation;
    this.transparency = transparency;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    drawIsocelTriangle(ctx, 20, 10, 0, 0, "purple", this.orientation);
  }
}
