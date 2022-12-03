export class Vector {
	public constructor(public readonly x: number, public readonly y: number) {}

	public add(v: Vector): Vector {
		return new Vector(this.x + v.x, this.y + v.y);
	}

	public subtract(v: Vector): Vector {
		return new Vector(this.x - v.x, this.y - v.y);
	}

	public multiplyByScalar(s: number): Vector {
		return new Vector(this.x * s, this.y * s);
	}

	public divideByScalar(s: number): Vector {
		return new Vector(this.x / s, this.y / s);
	}

	public round(): Vector {
		return new Vector(Math.round(this.x), Math.round(this.y));
	}

	public distance(): number {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}
}
