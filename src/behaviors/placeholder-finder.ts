import { Vector } from '../core/vector';
import { Placeholder } from '../workspace/component';
import { Workspace } from '../workspace/workspace';

export class PlaceholderFinder {

	public static create(placeholders: Placeholder[], workspace: Workspace): PlaceholderFinder {
		const checker = new PlaceholderFinder(placeholders, workspace);
		workspace.onViewPortChanged.subscribe(checker.clearCacheHandler);
		return checker;
	}

	private readonly clearCacheHandler = () => this.clearCache();

	private cache?: {
		placeholder: Placeholder,
		lt: Vector, // left top
		br: Vector // bottom right
	}[];

	private constructor(
		private readonly placeholders: Placeholder[],
		private readonly workspace: Workspace) {
	}

	public find(vLt: Vector, vWidth: number, vHeight: number): Placeholder | undefined {
		if (!this.cache) {
			this.cache = this.placeholders.map(placeholder => {
				const rect = placeholder.element.getBoundingClientRect();
				return {
					placeholder,
					lt: new Vector(rect.x, rect.y),
					br: new Vector(rect.x + rect.width, rect.y + rect.height)
				};
			});
			this.cache.sort((a, b) => a.lt.y - b.lt.y);
		}

		const vR = vLt.x + vWidth;
		const vB = vLt.y + vHeight;
		return this.cache.find(p => {
			return (
				Math.max(vLt.x, p.lt.x) < Math.min(vR, p.br.x) &&
				Math.max(vLt.y, p.lt.y) < Math.min(vB, p.br.y));
		})?.placeholder;
	}

	public destroy() {
		this.workspace.onViewPortChanged.unsubscribe(this.clearCacheHandler);
	}

	private clearCache() {
		this.cache = undefined;
	}
}
