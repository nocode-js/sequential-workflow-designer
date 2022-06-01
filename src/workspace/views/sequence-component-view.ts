import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { Sequence } from '../../definition';
import { StepsConfiguration } from '../../designer-configuration';
import { Component, ComponentView } from '../component';
import { StepComponentFactory } from '../step-component-factory';
import { JoinView } from './join-view';

const PH_WIDTH = 100;
const PH_HEIGHT = 24;

export class SequenceComponentView implements ComponentView {

	public static create(parent: SVGElement, sequence: Sequence, configuration: StepsConfiguration): SequenceComponentView {
		const g = Dom.svg('g');
		parent.appendChild(g);

		const components = sequence.map(s => StepComponentFactory.create(g, s, sequence, configuration));

		const maxJoinX = (components.length > 0)
			? Math.max(...components.map(c => c.view.joinX))
			: (PH_WIDTH / 2);
		const maxWidth = (components.length > 0)
			? Math.max(...components.map(c => c.view.width))
			: PH_WIDTH;

		let offsetY = PH_HEIGHT;

		const placeholders: SVGElement[] = [];
		for (let i = 0; i < components.length; i++) {
			const component = components[i];
			const offsetX = maxJoinX - component.view.joinX;

			JoinView.createStraightJoin(g, new Vector(maxJoinX, offsetY - PH_HEIGHT), PH_HEIGHT);

			placeholders.push(appendPlaceholder(g,
				maxJoinX - PH_WIDTH / 2,
				offsetY - PH_HEIGHT));

			Dom.translate(component.view.g, offsetX, offsetY);
			offsetY += component.view.height + PH_HEIGHT;
		}

		JoinView.createStraightJoin(g, new Vector(maxJoinX, offsetY - PH_HEIGHT), PH_HEIGHT);
		placeholders.push(appendPlaceholder(g, maxJoinX - PH_WIDTH / 2, offsetY - PH_HEIGHT));

		return new SequenceComponentView(g, maxWidth, offsetY, maxJoinX, placeholders, components);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly placeholders: SVGElement[],
		public readonly components: Component[]) {
	}

	public getClientPosition(): Vector {
		throw new Error('Not supported');
	}

	public setIsDragging(isDragging: boolean) {
		this.placeholders.forEach(p => {
			Dom.attrs(p, {
				visibility: isDragging ? 'visible' : 'hidden'
			});
		});
	}
}

function appendPlaceholder(g: SVGGElement, x: number, y: number): SVGElement {
	const rect = Dom.svg('rect', {
		class: 'sqd-placeholder',
		width: PH_WIDTH,
		height: PH_HEIGHT,
		x,
		y,
		rx: 6,
		ry: 6,
		visibility: 'hidden'
	});
	g.appendChild(rect);
	return rect;
}
