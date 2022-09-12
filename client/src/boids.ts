import { DrawableObject } from "./utils/drawable-object.js";
import { drawIsocelTriangle, drawPoint } from "./utils/drawings.js";

export class Point {
  x: number;
  y: number;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

export class Vector {
  p: Point;
  constructor(p1: Point = new Point(0, 0), p2: Point = new Point(0, 0)) {
    this.p = new Point(p2.x - p1.x, p2.y - p1.y);
  }

  add(v: Vector) {
    return new Vector(
      new Point(0, 0),
      new Point(
        this.getCoordinates().x + v.getCoordinates().x,
        this.getCoordinates().y + v.getCoordinates().y
      )
    );
  }

  getCoordinates() {
    return new Point(this.p.x, this.p.y);
  }
  norm() {
    const coord = this.getCoordinates();
    return Math.sqrt(coord.x ** 2 + coord.y ** 2);
  }
  normalized(): Vector {
    const norm = this.norm();
    if (norm === 0) {
      return new Vector();
    }
    return new Vector(
      new Point(0, 0),
      new Point(this.p.x / norm, this.p.y / norm)
    );
  }
}

function vectorMeanDirection(vectors: Vector[]) {
  let total = new Vector(new Point(0, 0), new Point(0, 0));
  for (const v of vectors) {
    total = total.add(v);
  }
  return total;
}

function computeBarycenter(points: Point[]) {
  let total = new Point();
  for (const p of points) {
    total.x += p.x;
    total.y += p.y;
  }
  return new Point(total.x / points.length, total.y / points.length);
}

export class Boid implements DrawableObject {
  id: number;
  color: string;
  transparency: number;
  toBeDrawn: boolean;
  ctx: CanvasRenderingContext2D;
  directionVector: Vector;
  position: Point;
  speed: number;
  range: { low: number; mid: number; high: number };

  constructor(
    id: number,
    ctx: CanvasRenderingContext2D,
    position: Point,
    direction: Point,
    speed: number,
    range = { low: 50, mid: 100, high: 150 }
  ) {
    this.id = id;
    this.ctx = ctx;
    this.position = position;
    this.directionVector = new Vector(
      new Point(0, 0),
      new Point(direction.x, direction.y)
    );
    this.speed = speed;
    this.range = range;
  }

  private isInLowRange(p: Point) {
    return (
      (this.position.x - p.x) ** 2 + (this.position.y - p.y) ** 2 <
      this.range.low ** 2
    );
  }

  private isInMidRange(p: Point) {
    return (
      (this.position.x - p.x) ** 2 + (this.position.y - p.y) ** 2 <
      this.range.mid ** 2
    );
  }

  private isInHighRange(p: Point) {
    return (
      (this.position.x - p.x) ** 2 + (this.position.y - p.y) ** 2 <
      this.range.high ** 2
    );
  }

  applyAlignmentForce(neighbors: Boid[]): Vector {
    const midNeighborsDirections: Vector[] = [];
    for (const b of neighbors) {
      if (this.isInMidRange(b.position) && b.id != this.id) {
        midNeighborsDirections.push(b.directionVector);
      }
    }
    return vectorMeanDirection(midNeighborsDirections).normalized();
  }

  applyCohesionForce(neighbors: Boid[]): Vector {
    const highNeighbors: Point[] = [];
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

  applyRepulsionForce(neighbors: Boid[]): Vector {
    const lowNeighbors: Point[] = [];
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

  private applyForces(
    forces: {
      [name: string]: (neighbors: Boid[]) => Vector;
    },
    neighbors: Boid[]
  ): Vector {
    let sum = new Vector(new Point(), this.directionVector.p);
    for (const k in forces) {
      sum = sum.add(forces[k](neighbors));
    }
    return sum;
  }

  step(neighbors: Boid[], forcesEnabled: boolean = true) {
    const forces: { [name: string]: (neighbors: Boid[]) => Vector } = {};
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

  draw(ctx: CanvasRenderingContext2D): void {
    drawPoint(ctx, 10, this.position.x, this.position.y, "red");
  }
}
