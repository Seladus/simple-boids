export interface DrawableObject {
  id: number;
  color: string;
  transparency: number;
  toBeDrawn: boolean;

  draw(ctx: CanvasRenderingContext2D): void;
}
