import { DesignerExtension } from './designer-extension';
import { LineGridConfiguration } from './workspace/grid/line-grid-configuration';
import { LineGridExtension } from './workspace/grid/line-grid-extension';

export class LineGridDesignerExtension implements DesignerExtension {
	public static create(configuration?: LineGridConfiguration): DesignerExtension {
		const grid = LineGridExtension.create(configuration);
		return new LineGridDesignerExtension(grid);
	}

	private constructor(public readonly grid: LineGridExtension) {}
}
