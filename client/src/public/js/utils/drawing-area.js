export class DrawingArea {
    constructor(ctx, canvas) {
        this.cameraZoom = 1;
        this.isDragging = false;
        this.lastId = 0;
        this.drawableObjects = [];
        this.ctx = ctx;
        this.canvas = canvas;
        this.cameraOffset = { x: 0, y: 0 };
        this.dragStart = { x: 0, y: 0 };
        this.canvas.addEventListener("mousemove", function (event) {
            if (this.isDragging) {
                this.cameraOffset.x =
                    event.clientX / this.cameraZoom - this.dragStart.x;
                this.cameraOffset.y =
                    event.clientY / this.cameraZoom - this.dragStart.y;
            }
        }.bind(this));
        this.canvas.addEventListener("mousedown", function (event) {
            this.isDragging = true;
            this.dragStart.x =
                event.clientX / this.cameraZoom - this.cameraOffset.x;
            this.dragStart.y =
                event.clientY / this.cameraZoom - this.cameraOffset.y;
        }.bind(this));
        this.canvas.addEventListener("mouseup", function (event) {
            this.isDragging = false;
        }.bind(this));
        canvas.addEventListener("mousewheel", function (event) {
            if (event.deltaY < 0) {
                this.zoomIn();
            }
            else {
                this.zoomOut();
            }
        }.bind(this));
    }
    getCameraZoom() {
        return this.cameraZoom;
    }
    zoomIn(value = 1.1) {
        this.cameraZoom *= value;
    }
    zoomOut(value = 0.8) {
        this.cameraZoom *= value;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    addDrawableObject(o) {
        this.drawableObjects.push(o);
    }
    draw() {
        this.clear();
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(this.getCameraZoom(), this.getCameraZoom());
        this.ctx.translate(-this.canvas.width / 2 + this.cameraOffset.x, -this.canvas.height / 2 + this.cameraOffset.y);
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
