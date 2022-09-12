import { Boid, Point } from "./boids.js";
import { Entity } from "./entity.js";
import { DrawableObject } from "./utils/drawable-object.js";
import { DrawingArea } from "./utils/drawing-area.js";

function putInBoundaries(
  boundaries: { width: number; height: number },
  boids: Boid[]
) {
  for (const b of boids) {
    if (b.position.x < 0) {
      b.position.x += boundaries.width;
    } else if (b.position.x > boundaries.width) {
      b.position.x -= boundaries.width;
    }

    if (b.position.y < 0) {
      b.position.y += boundaries.height;
    } else if (b.position.y > boundaries.height) {
      b.position.y -= boundaries.height;
    }
  }
}

let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d");

let drawingArea = new DrawingArea(ctx, canvas);

drawingArea.draw();

function generateBoids(
  nb: number,
  boundaries: { width: number; height: number }
) {
  const boids: Boid[] = [];
  for (let i = 0; i < nb; i++) {
    boids.push(
      new Boid(
        i,
        ctx,
        new Point(
          Math.random() * boundaries.width,
          Math.random() * boundaries.height
        ),
        new Point(
          Math.random() * boundaries.width,
          Math.random() * boundaries.height
        ),
        10
      )
    );
  }
  return boids;
}

// let boid = new Boid(ctx, new Point(0, 0), new Point(1, 0), 1);
const boundaries = { width: 1920, height: 1080 };
const boids = generateBoids(500, boundaries);

for (const b of boids) {
  drawingArea.addDrawableObject(b);
}

async function main(
  boids: Boid[],
  boundaries: { width: number; height: number }
) {
  let forcesEnabled = false;
  document.addEventListener("keypress", function (event: KeyboardEvent) {
    if (event.key === " ") {
      forcesEnabled = !forcesEnabled;
    }
  });
  while (true) {
    for (const b of boids) {
      b.step(boids, forcesEnabled);
    }
    putInBoundaries(boundaries, boids);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

main(boids, boundaries);
