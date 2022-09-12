var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Boid, Point } from "./boids.js";
import { DrawingArea } from "./utils/drawing-area.js";
function putInBoundaries(boundaries, boids) {
    for (const b of boids) {
        if (b.position.x < 0) {
            b.position.x += boundaries.width;
        }
        else if (b.position.x > boundaries.width) {
            b.position.x -= boundaries.width;
        }
        if (b.position.y < 0) {
            b.position.y += boundaries.height;
        }
        else if (b.position.y > boundaries.height) {
            b.position.y -= boundaries.height;
        }
    }
}
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let drawingArea = new DrawingArea(ctx, canvas);
drawingArea.draw();
function generateBoids(nb, boundaries) {
    const boids = [];
    for (let i = 0; i < nb; i++) {
        boids.push(new Boid(i, ctx, new Point(Math.random() * boundaries.width, Math.random() * boundaries.height), new Point(Math.random() * boundaries.width, Math.random() * boundaries.height), 10));
    }
    return boids;
}
// let boid = new Boid(ctx, new Point(0, 0), new Point(1, 0), 1);
const boundaries = { width: 1920, height: 1080 };
const boids = generateBoids(500, boundaries);
for (const b of boids) {
    drawingArea.addDrawableObject(b);
}
function main(boids, boundaries) {
    return __awaiter(this, void 0, void 0, function* () {
        let forcesEnabled = false;
        document.addEventListener("keypress", function (event) {
            if (event.key === " ") {
                forcesEnabled = !forcesEnabled;
            }
        });
        while (true) {
            for (const b of boids) {
                b.step(boids, forcesEnabled);
            }
            putInBoundaries(boundaries, boids);
            yield new Promise((resolve) => setTimeout(resolve, 50));
        }
    });
}
main(boids, boundaries);
