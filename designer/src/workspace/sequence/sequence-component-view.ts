import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { JoinView } from '../common-views/join-view';
import { RectPlaceholderDirection, RectPlaceholderView } from '../common-views/rect-placeholder-view';
import { ComponentView } from '../component';
import { ComponentContext } from '../../component-context';
import { StepContext } from '../../designer-extension';
import { SequenceContext } from './sequence-context';
import { StepComponent } from '../step-component';

const PH_WIDTH = 100;
const PH_HEIGHT = 24;

export class SequenceComponentView implements ComponentView {
	public static create(parent: SVGElement, sequenceContext: SequenceContext, componentContext: ComponentContext): SequenceComponentView {
		const { sequence } = sequenceContext;
		const g = Dom.svg('g');
		parent.appendChild(g);

		const components: StepComponent[] = [];
		for (let index = 0; index < sequence.length; index++) {
			const stepContext: StepContext = {
				parentSequence: sequenceContext.sequence,
				step: sequence[index],
				depth: sequenceContext.depth,
				position: index,
				isInputConnected: index === 0 ? sequenceContext.isInputConnected : components[index - 1].hasOutput,
				isOutputConnected: index === sequence.length - 1 ? sequenceContext.isOutputConnected : true
			};
			components[index] = componentContext.stepComponentFactory.create(g, stepContext, componentContext);
		}

		const maxJoinX = components.length > 0 ? Math.max(...components.map(c => c.view.joinX)) : PH_WIDTH / 2;
		const maxWidth = components.length > 0 ? Math.max(...components.map(c => c.view.width)) : PH_WIDTH;

		let offsetY = PH_HEIGHT;

		const placeholders: SequencePlaceholder[] = [];
		for (let i = 0; i < components.length; i++) {
			const component = components[i];
			const offsetX = maxJoinX - component.view.joinX;

			if ((i === 0 && sequenceContext.isInputConnected) || (i > 0 && components[i - 1].hasOutput)) {
				JoinView.createStraightJoin(g, new Vector(maxJoinX, offsetY - PH_HEIGHT), PH_HEIGHT);
			}

			if (componentContext.placeholderController.canCreate(sequence, i)) {
				const view = RectPlaceholderView.create(
					g,
					maxJoinX - PH_WIDTH / 2,
					offsetY - PH_HEIGHT,
					PH_WIDTH,
					PH_HEIGHT,
					RectPlaceholderDirection.none
				);
				placeholders.push({
					view,
					index: i
				});
			}

			Dom.translate(component.view.g, offsetX, offsetY);
			offsetY += component.view.height + PH_HEIGHT;
		}

		if (sequenceContext.isOutputConnected && (components.length === 0 || components[components.length - 1].hasOutput)) {
			JoinView.createStraightJoin(g, new Vector(maxJoinX, offsetY - PH_HEIGHT), PH_HEIGHT);
		}

		const newIndex = components.length;
		if (componentContext.placeholderController.canCreate(sequence, newIndex)) {
			const view = RectPlaceholderView.create(
				g,
				maxJoinX - PH_WIDTH / 2,
				offsetY - PH_HEIGHT,
				PH_WIDTH,
				PH_HEIGHT,
				RectPlaceholderDirection.none
			);
			placeholders.push({
				view,
				index: newIndex
			});
		}
		return new SequenceComponentView(g, maxWidth, offsetY, maxJoinX, placeholders, components);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly placeholders: SequencePlaceholder[],
		public readonly components: StepComponent[]
	) {}

	public setIsDragging(isDragging: boolean) {
		this.placeholders.forEach(placeholder => {
			placeholder.view.setIsVisible(isDragging);
		});
	}

	public hasOutput(): boolean {
		if (this.components.length > 0) {
			return this.components[this.components.length - 1].hasOutput;
		}
		return true;
	}
}

export interface SequencePlaceholder {
	view: RectPlaceholderView;
	index: number;
}
