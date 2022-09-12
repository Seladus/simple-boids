import { DrawableObject } from "./drawable-object.js";

export class DrawingArea {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private cameraZoom = 1;
  private cameraOffset: { x: number; y: number };
  private isDragging = false;
  private dragStart: { x: number; y: number };
  private lastId = 0;
  private drawableObjects: DrawableObject[] = [];

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.cameraOffset = { x: 0, y: 0 };
    this.dragStart = { x: 0, y: 0 };

    this.canvas.addEventListener(
      "mousemove",
      function (event: MouseEvent) {
        if (this.isDragging) {
          this.cameraOffset.x =
            event.clientX / this.cameraZoom - this.dragStart.x;
          this.cameraOffset.y =
            event.clientY / this.cameraZoom - this.dragStart.y;
        }
      }.bind(this)
    );

    this.canvas.addEventListener(
      "mousedown",
      function (event: MouseEvent) {
        this.isDragging = true;
        this.dragStart.x =
          event.clientX / this.cameraZoom - this.cameraOffset.x;
        this.dragStart.y =
          event.clientY / this.cameraZoom - this.cameraOffset.y;
      }.bind(this)
    );

    this.canvas.addEventListener(
      "mouseup",
      function (event: MouseEvent) {
        this.isDragging = false;
      }.bind(this)
    );

    canvas.addEventListener(
      "mousewheel",
      function (event: WheelEvent) {
        if (event.deltaY < 0) {
          this.zoomIn();
        } else {
          this.zoomOut();
        }
      }.bind(this)
    );
  }

  public getCameraZoom(): number {
    return this.cameraZoom;
  }

  public zoomIn(value = 1.1): void {
    this.cameraZoom *= value;
  }

  public zoomOut(value = 0.8): void {
    this.cameraZoom *= value;
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public addDrawableObject(o: DrawableObject) {
    this.drawableObjects.push(o);
  }

  public draw() {
    this.clear();
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.scale(this.getCameraZoom(), this.getCameraZoom());
    this.ctx.translate(
      -this.canvas.width / 2 + this.cameraOffset.x,
      -this.canvas.height / 2 + this.cameraOffset.y
    );

    for (const drawable of this.drawableObjects) {
      const initialAlpha = this.ctx.globalAlpha;
      this.ctx.globalAlpha = drawable.transparency;
      drawable.draw(this.ctx);
      this.ctx.globalAlpha = initialAlpha;
    }

    this.ctx.restore();
    requestAnimationFrame(this.draw.bind(this));
  }
}
