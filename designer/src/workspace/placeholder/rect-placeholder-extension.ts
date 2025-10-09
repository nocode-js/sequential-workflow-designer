import { Sequence } from '../../definition';
import { Vector } from '../../core';
import { PlaceholderExtension, PlaceholderGapOrientation } from '../../designer-extension';
import { PlaceholderDirection, Placeholder } from '../component';
import { RectPlaceholder } from './rect-placeholder';
import { RectPlaceholderConfiguration } from './rect-placeholder-configuration';

const defaultConfiguration: RectPlaceholderConfiguration = {
	gapWidth: 88,
	gapHeight: 24,
	radius: 6,
	iconSize: 16
};

export class RectPlaceholderExtension implements PlaceholderExtension {
	public static create(configuration?: RectPlaceholderConfiguration): RectPlaceholderExtension {
		return new RectPlaceholderExtension(configuration ?? defaultConfiguration);
	}

	private readonly alongGapSize = new Vector(this.configuration.gapWidth, this.configuration.gapHeight);
	private readonly perpendicularGapSize = new Vector(this.configuration.gapHeight, this.configuration.gapWidth);

	private constructor(private readonly configuration: RectPlaceholderConfiguration) {}

	public getGapSize(orientation: PlaceholderGapOrientation): Vector {
		return orientation === PlaceholderGapOrientation.perpendicular ? this.perpendicularGapSize : this.alongGapSize;
	}

	public createForGap(parent: SVGElement, parentSequence: Sequence, index: number, orientation: PlaceholderGapOrientation): Placeholder {
		const gapSize = this.getGapSize(orientation);
		return RectPlaceholder.create(
			parent,
			gapSize,
			PlaceholderDirection.gap,
			parentSequence,
			index,
			this.configuration.radius,
			this.configuration.iconSize
		);
	}

	public createForArea(
		parent: SVGElement,
		size: Vector,
		direction: PlaceholderDirection,
		parentSequence: Sequence,
		index: number
	): Placeholder {
		return RectPlaceholder.create(
			parent,
			size,
			direction,
			parentSequence,
			index,
			this.configuration.radius,
			this.configuration.iconSize
		);
	}
}
