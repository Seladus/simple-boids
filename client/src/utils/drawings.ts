export function drawPoint(
  ctx: CanvasRenderingContext2D,
  radius: number,
  x: number,
  y: number,
  color: string
): void {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawIsocelTriangle(
  ctx: CanvasRenderingContext2D,
  height: number,
  width: number,
  X: number,
  Y: number,
  color: string,
  rotationAngle = 0
) {
  let x = 0;
  let y = 0;
  let sides = Math.sqrt(height ** 2 + (1 / 4) * width ** 2);
  let centerToBase = (width * height) / (2 * sides + width);
  let angle = (rotationAngle * Math.PI) / 180;
  y += centerToBase;
  x -= width / 2;
  ctx.translate(X, Y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(x, y);
  x += width;
  ctx.lineTo(x, y);
  y -= height;
  x -= width / 2;
  ctx.lineTo(x, y);
  y = centerToBase;
  x = -width / 2;
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.rotate(-angle);
  ctx.translate(-X, -Y);
}
