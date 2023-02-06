export class NextQuantifiedNumber {
	public constructor(private readonly values: number[]) {}

	public next(value: number, direction: boolean): { current: number; next: number } {
		let bestIndex = 0;
		let bestDistance = Number.MAX_VALUE;
		for (let i = 0; i < this.values.length; i++) {
			const distance = Math.abs(this.values[i] - value);
			if (bestDistance > distance) {
				bestIndex = i;
				bestDistance = distance;
			}
		}

		let index: number;
		if (direction) {
			index = Math.min(bestIndex + 1, this.values.length - 1);
		} else {
			index = Math.max(bestIndex - 1, 0);
		}
		return {
			current: this.values[bestIndex],
			next: this.values[index]
		};
	}
}
