import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { Sequence } from '../../definition';
import { JoinView } from '../common-views/join-view';
import { RectPlaceholderView } from '../common-views/rect-placeholder-view';
import { Component, ComponentView } from '../component';
import { ComponentContext } from '../component-context';

const PH_WIDTH = 100;
const PH_HEIGHT = 24;

export class SequenceComponentView implements ComponentView {
	public static create(parent: SVGElement, sequence: Sequence, context: ComponentContext): SequenceComponentView {
		const g = Dom.svg('g');
		parent.appendChild(g);

		const components = sequence.map(s => context.stepComponentFactory.create(g, s, sequence, context));

		const maxJoinX = components.length > 0 ? Math.max(...components.map(c => c.view.joinX)) : PH_WIDTH / 2;
		const maxWidth = components.length > 0 ? Math.max(...components.map(c => c.view.width)) : PH_WIDTH;

		let offsetY = PH_HEIGHT;

		const placeholderViews: RectPlaceholderView[] = [];
		for (let i = 0; i < components.length; i++) {
			const component = components[i];
			const offsetX = maxJoinX - component.view.joinX;

			if (i === 0 || !components[i - 1].isInterrupted) {
				JoinView.createStraightJoin(g, new Vector(maxJoinX, offsetY - PH_HEIGHT), PH_HEIGHT);
			}

			placeholderViews.push(RectPlaceholderView.create(g, maxJoinX - PH_WIDTH / 2, offsetY - PH_HEIGHT, PH_WIDTH, PH_HEIGHT));

			Dom.translate(component.view.g, offsetX, offsetY);
			offsetY += component.view.height + PH_HEIGHT;
		}

		if (components.length === 0 || !components[components.length - 1].isInterrupted) {
			JoinView.createStraightJoin(g, new Vector(maxJoinX, offsetY - PH_HEIGHT), PH_HEIGHT);
		}
		placeholderViews.push(RectPlaceholderView.create(g, maxJoinX - PH_WIDTH / 2, offsetY - PH_HEIGHT, PH_WIDTH, PH_HEIGHT));

		return new SequenceComponentView(g, maxWidth, offsetY, maxJoinX, placeholderViews, components);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly placeholderViews: RectPlaceholderView[],
		public readonly components: Component[]
	) {}

	public getClientPosition(): Vector {
		throw new Error('Not supported');
	}

	public setIsDragging(isDragging: boolean) {
		this.placeholderViews.forEach(placeholder => {
			placeholder.setIsVisible(isDragging);
		});
	}

	public isInterrupted(): boolean {
		if (this.components.length > 0) {
			return this.components[this.components.length - 1].isInterrupted;
		}
		return false;
	}
}
