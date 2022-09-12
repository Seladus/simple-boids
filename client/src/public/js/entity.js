import { drawIsocelTriangle } from "./utils/drawings.js";
export class Entity {
    constructor(id, position, color, orientation, transparency) {
        this.toBeDrawn = true;
        this.id = id;
        this.position = position;
        this.color = color;
        this.orientation = orientation;
        this.transparency = transparency;
    }
    draw(ctx) {
        drawIsocelTriangle(ctx, 20, 10, 0, 0, "purple", this.orientation);
    }
}
