import { Sequence } from '../definition';
import { createSvgElement, setAttrs } from '../svg';
import { Vector } from '../vector';
import { Component } from './component';
import { ConnectionRenderer } from './connection-renderer';
import { StepComponentFactory } from './step-component-factory';

const PH_WIDTH = 80;
const PH_HEIGHT = 20;

export class SequenceComponent implements Component {

	public static create(sequence: Sequence): SequenceComponent {
		const components = sequence.steps.map(StepComponentFactory.create);
		return SequenceComponent.createForComponents(components, false);
	}

	public static createForComponents(components: Component[], skipFirstPadding: boolean): SequenceComponent {
		const g = createSvgElement('g');

		if (components.length === 0) {
			ConnectionRenderer.createLine(g, new Vector(PH_WIDTH / 2, 0), PH_HEIGHT);

			const placeholder = createPlaceholder(0, 0);
			// g.insertBefore(placeholder, g.firstChild);

			return new SequenceComponent(g, PH_WIDTH, PH_HEIGHT, PH_WIDTH / 2);
		}

		const maxConnectorX = Math.max(...components.map(c => c.connectorX));
		const maxWidth = Math.max(...components.map(c => c.width));

		let offsetY = skipFirstPadding ? 0 : PH_HEIGHT;

		for (let i = 0; i < components.length; i++) {
			const component = components[i];
			const offsetX = maxConnectorX - component.connectorX;

			if (i !== 0 || !skipFirstPadding) {
				ConnectionRenderer.createLine(g, new Vector(maxConnectorX, offsetY - PH_HEIGHT), PH_HEIGHT);

				const placeholder = createPlaceholder(
					maxConnectorX - PH_WIDTH / 2,
					offsetY - PH_HEIGHT);
				// g.insertBefore(placeholder, g.firstChild);
			}

			setAttrs(component.g, {
				transform: `translate(${offsetX}, ${offsetY})`
			});
			g.appendChild(component.g);
			offsetY += component.height + PH_HEIGHT;
		}

		return new SequenceComponent(g, maxWidth, offsetY - PH_HEIGHT, maxConnectorX);
	}

	public constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly connectorX: number) {
	}
}

function createPlaceholder(x: number, y: number) {
	return createSvgElement('rect', {
		fill: '#FF930D',
		width: PH_WIDTH,
		height: PH_HEIGHT,
		x,
		y,
		rx: 6,
		ry: 6
	});
}
