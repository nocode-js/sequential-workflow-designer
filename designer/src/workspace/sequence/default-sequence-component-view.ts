import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { JoinView } from '../common-views/join-view';
import { ComponentView, Placeholder } from '../component';
import { ComponentContext } from '../../component-context';
import { SequenceContext, StepContext } from '../../designer-extension';
import { StepComponent } from '../step-component';

export class DefaultSequenceComponentView implements ComponentView {
	public static create(
		parent: SVGElement,
		sequenceContext: SequenceContext,
		componentContext: ComponentContext
	): DefaultSequenceComponentView {
		const phWidth = componentContext.services.placeholder.gapSize.x;
		const phHeight = componentContext.services.placeholder.gapSize.y;

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

		let joinX: number;
		let totalWidth: number;
		if (components.length > 0) {
			const restWidth = Math.max(...components.map(c => c.view.width - c.view.joinX));

			joinX = Math.max(...components.map(c => c.view.joinX));
			totalWidth = joinX + restWidth;
		} else {
			joinX = phWidth / 2;
			totalWidth = phWidth;
		}

		let offsetY = phHeight;

		const placeholders: Placeholder[] = [];
		for (let i = 0; i < components.length; i++) {
			const component = components[i];
			const offsetX = joinX - component.view.joinX;

			if ((i === 0 && sequenceContext.isInputConnected) || (i > 0 && components[i - 1].hasOutput)) {
				JoinView.createStraightJoin(g, new Vector(joinX, offsetY - phHeight), phHeight);
			}

			if (componentContext.placeholderController.canCreate(sequence, i)) {
				const ph = componentContext.services.placeholder.createForGap(g, sequence, i);
				Dom.translate(ph.view.g, joinX - phWidth / 2, offsetY - phHeight);
				placeholders.push(ph);
			}

			Dom.translate(component.view.g, offsetX, offsetY);
			offsetY += component.view.height + phHeight;
		}

		if (sequenceContext.isOutputConnected && (components.length === 0 || components[components.length - 1].hasOutput)) {
			JoinView.createStraightJoin(g, new Vector(joinX, offsetY - phHeight), phHeight);
		}

		const newIndex = components.length;
		if (componentContext.placeholderController.canCreate(sequence, newIndex)) {
			const ph = componentContext.services.placeholder.createForGap(g, sequence, newIndex);
			Dom.translate(ph.view.g, joinX - phWidth / 2, offsetY - phHeight);
			placeholders.push(ph);
		}
		return new DefaultSequenceComponentView(g, totalWidth, offsetY, joinX, placeholders, components);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly placeholders: Placeholder[],
		public readonly components: StepComponent[]
	) {}

	public setIsDragging(isDragging: boolean) {
		this.placeholders.forEach(placeholder => {
			placeholder.setIsVisible(isDragging);
		});
	}

	public hasOutput(): boolean {
		if (this.components.length > 0) {
			return this.components[this.components.length - 1].hasOutput;
		}
		return true;
	}
}
