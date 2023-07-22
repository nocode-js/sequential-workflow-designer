import { Sequence } from '../../definition';
import { Vector } from '../../core';
import { PlaceholderExtension } from '../../designer-extension';
import { PlaceholderDirection, Placeholder } from '../component';
import { RectPlaceholder } from './rect-placeholder';
import { RectPlaceholderConfiguration } from './rect-placeholder-configuration';

const defaultConfiguration: RectPlaceholderConfiguration = {
	gapWidth: 100,
	gapHeight: 24,
	radius: 6,
	iconSize: 16
};

export class RectPlaceholderExtension implements PlaceholderExtension {
	public static create(configuration?: RectPlaceholderConfiguration): RectPlaceholderExtension {
		return new RectPlaceholderExtension(configuration ?? defaultConfiguration);
	}

	public readonly gapSize = new Vector(this.configuration.gapWidth, this.configuration.gapHeight);

	private constructor(private readonly configuration: RectPlaceholderConfiguration) {}

	public createForGap(parent: SVGElement, parentSequence: Sequence, index: number): Placeholder {
		return RectPlaceholder.create(parent, this.gapSize, PlaceholderDirection.none, parentSequence, index, this.configuration);
	}

	public createForArea(
		parent: SVGElement,
		size: Vector,
		direction: PlaceholderDirection,
		parentSequence: Sequence,
		index: number
	): Placeholder {
		return RectPlaceholder.create(parent, size, direction, parentSequence, index, this.configuration);
	}
}
