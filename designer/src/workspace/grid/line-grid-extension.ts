import { Vector } from '../../core';
import { GridExtension } from '../../designer-extension';
import { LineGrid } from './line-grid';
import { LineGridConfiguration } from './line-grid-configuration';

const defaultConfiguration: LineGridConfiguration = {
	gridSizeX: 48,
	gridSizeY: 48
};

export class LineGridExtension implements GridExtension {
	public static create(configuration?: LineGridConfiguration): LineGridExtension {
		return new LineGridExtension(configuration ?? defaultConfiguration);
	}

	private constructor(private readonly configuration: LineGridConfiguration) {}

	public create(): LineGrid {
		const size = new Vector(this.configuration.gridSizeX, this.configuration.gridSizeY);
		return LineGrid.create(size);
	}
}
