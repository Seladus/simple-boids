import { drawPoint } from "./utils/drawings.js";
export class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
export class Vector {
    constructor(p1 = new Point(0, 0), p2 = new Point(0, 0)) {
        this.p = new Point(p2.x - p1.x, p2.y - p1.y);
    }
    add(v) {
        return new Vector(new Point(0, 0), new Point(this.getCoordinates().x + v.getCoordinates().x, this.getCoordinates().y + v.getCoordinates().y));
    }
    getCoordinates() {
        return new Point(this.p.x, this.p.y);
    }
    norm() {
        const coord = this.getCoordinates();
        return Math.sqrt(Math.pow(coord.x, 2) + Math.pow(coord.y, 2));
    }
    normalized() {
        const norm = this.norm();
        if (norm === 0) {
            return new Vector();
        }
        return new Vector(new Point(0, 0), new Point(this.p.x / norm, this.p.y / norm));
    }
}
function vectorMeanDirection(vectors) {
    let total = new Vector(new Point(0, 0), new Point(0, 0));
    for (const v of vectors) {
        total = total.add(v);
    }
    return total;
}
function computeBarycenter(points) {
    let total = new Point();
    for (const p of points) {
        total.x += p.x;
        total.y += p.y;
    }
    return new Point(total.x / points.length, total.y / points.length);
}
export class Boid {
    constructor(id, ctx, position, direction, speed, range = { low: 50, mid: 100, high: 150 }) {
        this.id = id;
        this.ctx = ctx;
        this.position = position;
        this.directionVector = new Vector(new Point(0, 0), new Point(direction.x, direction.y));
        this.speed = speed;
        this.range = range;
    }
    isInLowRange(p) {
        return (Math.pow((this.position.x - p.x), 2) + Math.pow((this.position.y - p.y), 2) <
            Math.pow(this.range.low, 2));
    }
    isInMidRange(p) {
        return (Math.pow((this.position.x - p.x), 2) + Math.pow((this.position.y - p.y), 2) <
            Math.pow(this.range.mid, 2));
    }
    isInHighRange(p) {
        return (Math.pow((this.position.x - p.x), 2) + Math.pow((this.position.y - p.y), 2) <
            Math.pow(this.range.high, 2));
    }
    applyAlignmentForce(neighbors) {
        const midNeighborsDirections = [];
        for (const b of neighbors) {
            if (this.isInMidRange(b.position) && b.id != this.id) {
                midNeighborsDirections.push(b.directionVector);
            }
        }
        return vectorMeanDirection(midNeighborsDirections).normalized();
    }
    applyCohesionForce(neighbors) {
        const highNeighbors = [];
        for (const b of neighbors) {
            if (this.isInHighRange(b.position) && b.id != this.id) {
                highNeighbors.push(b.position);
            }
        }
        let barycenter = computeBarycenter(highNeighbors);
        if (highNeighbors.length == 0) {
            return new Vector();
        }
        return new Vector(this.position, barycenter).normalized();
    }
    applyRepulsionForce(neighbors) {
        const lowNeighbors = [];
        for (const b of neighbors) {
            if (this.isInLowRange(b.position) && b.id != this.id) {
                lowNeighbors.push(b.position);
            }
        }
        let barycenter = computeBarycenter(lowNeighbors);
        if (lowNeighbors.length == 0) {
            return new Vector();
        }
        return new Vector(barycenter, this.position).normalized();
    }
    applyForces(forces, neighbors) {
        let sum = new Vector(new Point(), this.directionVector.p);
        for (const k in forces) {
            sum = sum.add(forces[k](neighbors));
        }
        return sum;
    }
    step(neighbors, forcesEnabled = true) {
        const forces = {};
        forces["alignment"] = this.applyAlignmentForce.bind(this);
        forces["cohesion"] = this.applyCohesionForce.bind(this);
        forces["repulsion"] = this.applyRepulsionForce.bind(this);
        // move
        if (forcesEnabled) {
            this.directionVector = this.applyForces(forces, neighbors).normalized();
        }
        this.directionVector = this.directionVector.normalized();
        this.position.x += this.directionVector.getCoordinates().x * this.speed;
        this.position.y += this.directionVector.getCoordinates().y * this.speed;
    }
    draw(ctx) {
        drawPoint(ctx, 10, this.position.x, this.position.y, "red");
    }
}
