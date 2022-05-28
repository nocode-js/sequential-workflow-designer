import { Dom } from '../core/dom';
import { Vector } from '../core/vector';
import { Sequence, Step, SwitchStep } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { ComponentView, Placeholder, StepComponent, StepComponentState } from './component';
import { JoinRenderer } from './join-renderer';
import { SequenceComponent } from './sequence-component';
import { ValidationErrorRenderer } from './validation-error-renderer';

const INPUT_SIZE = 18;
const MIN_CHILDREN_WIDTH = 50;
const PADDING_X = 20;
const PADDING_TOP = 20;
const LABEL_HEIGHT = 22;
const LABEL_PADDING_X = 10;
const MIN_LABEL_WIDTH = 50;
const CONNECTION_HEIGHT = 16;

export class SwitchStepComponent implements StepComponent {

	public static create(parent: SVGElement, step: SwitchStep, parentSequence: Sequence, configuration: StepsConfiguration): SwitchStepComponent {
		const view = SwitchStepComponentView.create(parent, step, configuration);
		return new SwitchStepComponent(view, step, parentSequence, configuration);
	}

	private currentState = StepComponentState.default;

	private constructor(
		public readonly view: SwitchStepComponentView,
		public readonly step: Step,
		public readonly parentSequence: Sequence,
		private readonly configuration: StepsConfiguration) {
	}

	public findStepComponent(element: Element): StepComponent | null {
		for (const sequence of this.view.sequenceComponents) {
			const component = sequence.findStepComponent(element);
			if (component) {
				return component;
			}
		}
		if (this.view.containsElement(element)) {
			return this;
		}
		return null;
	}

	public getPlaceholders(result: Placeholder[]) {
		if (this.currentState !== StepComponentState.moving) {
			this.view.sequenceComponents.forEach(sc => sc.getPlaceholders(result));
		}
	}

	public setIsMoving(isEnabled: boolean) {
		if (this.currentState !== StepComponentState.moving) {
			this.view.sequenceComponents.forEach(s => s.setIsMoving(isEnabled));
		}
		this.view.setIsMoving(isEnabled);
	}

	public setState(state: StepComponentState) {
		this.currentState = state;
		switch (state) {
			case StepComponentState.default:
				this.view.setIsSelected(false);
				this.view.setIsDisabled(false);
				break;
			case StepComponentState.selected:
				this.view.setIsSelected(true);
				this.view.setIsDisabled(false);
				break;
			case StepComponentState.moving:
				this.view.setIsSelected(false);
				this.view.setIsDisabled(true);
				break;
		}
	}

	public validate(): boolean {
		const isValid = this.configuration.validator
			? this.configuration.validator(this.step)
			: true;
		this.view.setIsValidationErrorHidden(isValid);
		const isChildrenValid = this.view.sequenceComponents.every(c => c.validate());
		return isValid && isChildrenValid;
	}
}

export class SwitchStepComponentView implements ComponentView {

	public static create(parent: SVGElement, step: SwitchStep, configuration: StepsConfiguration): SwitchStepComponentView {
		const g = Dom.svg('g', {
			class: 'sqd-switch-group'
		});
		parent.appendChild(g);

		const branchNames = Object.keys(step.branches);
		const sequenceComponents = branchNames.map(bn => SequenceComponent.create(g, step.branches[bn], configuration));

		const maxChildHeight = Math.max(...sequenceComponents.map(s => s.view.height));
		const containerWidths = sequenceComponents.map(s => Math.max(s.view.width, MIN_CHILDREN_WIDTH) + PADDING_X * 2);
		const containersWidth = containerWidths.reduce((p, c) => p + c, 0);
		const containerHeight = maxChildHeight + PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT * 2;
		const containerOffsets: number[] = [];

		const joinXs = sequenceComponents.map(s => Math.max(s.view.joinX, MIN_CHILDREN_WIDTH / 2));

		let totalX = 0;
		for (let i = 0; i < branchNames.length; i++) {
			containerOffsets.push(totalX);
			totalX += containerWidths[i];
		}

		const regions = branchNames.map((branchName, i) => {
			const sequence = sequenceComponents[i];
			const offsetX = containerOffsets[i];
			const region = Dom.svg('rect', {
				class: 'sqd-switch-region',
				width: containerWidths[i],
				height: containerHeight,
				x: offsetX,
				fill: 'transparent'
			});

			const branchText = Dom.svg('text', {
				class: 'sqd-switch-branch-text',
				x: offsetX + joinXs[i]+ PADDING_X,
				y: PADDING_TOP + LABEL_HEIGHT * 1.5 + CONNECTION_HEIGHT
			});
			branchText.textContent = branchName;
			g.appendChild(branchText);
			const branchTextWidth = Math.max(branchText.getBBox().width + LABEL_PADDING_X * 2, MIN_LABEL_WIDTH);

			const branchRect = Dom.svg('rect', {
				class: 'sqd-switch-branch-rect',
				x: offsetX + joinXs[i] + PADDING_X - branchTextWidth / 2,
				y: PADDING_TOP + LABEL_HEIGHT + CONNECTION_HEIGHT,
				width: branchTextWidth,
				height: LABEL_HEIGHT,
				rx: 10,
				ry: 10
			});
			g.insertBefore(branchRect, branchText);

			const childEndY = PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT + sequence.view.height;

			const fillingHeight = containerHeight - childEndY - CONNECTION_HEIGHT;
			if (fillingHeight > 0) {
				JoinRenderer.createStraightJoin(g, new Vector(containerOffsets[i] + joinXs[i] + PADDING_X, childEndY), fillingHeight);
			}

			const sequenceX = offsetX + PADDING_X + Math.max((MIN_CHILDREN_WIDTH - sequence.view.width) / 2, 0);
			const sequenceY = PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT;
			Dom.translate(sequence.view.g, sequenceX, sequenceY);

			return region;
		});


		const nameText = Dom.svg('text', {
			class: 'sqd-switch-name-text',
			x: containerWidths[0],
			y: PADDING_TOP + LABEL_HEIGHT / 2
		});
		nameText.textContent = step.name;
		g.appendChild(nameText);
		const nameWidth = Math.max(nameText.getBBox().width + LABEL_PADDING_X * 2, MIN_LABEL_WIDTH);

		const nameRect = Dom.svg('rect', {
			class: 'sqd-switch-name-rect',
			width: nameWidth,
			height: LABEL_HEIGHT,
			x: containerWidths[0] - nameWidth / 2,
			y: PADDING_TOP,
			rx: 10,
			ry: 10
		});
		g.insertBefore(nameRect, nameText);

		JoinRenderer.createStraightJoin(g, new Vector(containerWidths[0], 0), PADDING_TOP);

		const inputHalfSize = INPUT_SIZE / 2;
		const input = Dom.svg('path', {
			d: `M ${inputHalfSize} 0 L ${INPUT_SIZE} ${inputHalfSize} L ${inputHalfSize} ${INPUT_SIZE} L 0 ${inputHalfSize} Z`,
			transform: `translate(${containerWidths[0] - INPUT_SIZE / 2} ${-INPUT_SIZE / 2})`,
			fill: '#FFF',
			'stroke-width': 2,
			stroke: '#000'
		});
		g.appendChild(input);

		JoinRenderer.createJoins(g,
			new Vector(containerWidths[0], PADDING_TOP + LABEL_HEIGHT),
			containerOffsets.map((o, i) => new Vector(o + joinXs[i] + PADDING_X, PADDING_TOP + LABEL_HEIGHT + CONNECTION_HEIGHT)));

		JoinRenderer.createJoins(g,
			new Vector(containerWidths[0], containerHeight),
			containerOffsets.map((o, i) => new Vector(o + joinXs[i] + PADDING_X, PADDING_TOP + CONNECTION_HEIGHT + LABEL_HEIGHT * 2 + maxChildHeight)));

		regions.forEach(region =>
			g.insertBefore(region, g.firstChild));

		const validationError = ValidationErrorRenderer.create(g, containersWidth, 0);

		return new SwitchStepComponentView(g, containersWidth, containerHeight, containerWidths[0], sequenceComponents, regions, input, validationError);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly sequenceComponents: SequenceComponent[],
		private readonly regions: SVGRectElement[],
		private readonly input: SVGPathElement,
		private readonly validationError: SVGElement) {
	}

	public getClientPosition(): Vector {
		const rect = this.regions[0].getBoundingClientRect();
		return new Vector(rect.x, rect.y);
	}

	public containsElement(element: Element): boolean {
		return this.g.contains(element);
	}

	public setIsMoving(isEnabled: boolean) {
		Dom.attrs(this.input, {
			visibility: isEnabled ? 'hidden' : 'visible'
		});
	}

	public setIsSelected(isSelected: boolean) {
		this.regions.forEach(region => {
			Dom.toggleClass(region, isSelected, 'sqd-selected');
		});
	}

	public setIsDisabled(isDisabled: boolean) {
		Dom.toggleClass(this.g, isDisabled, 'sqd-disabled');
	}

	public setIsValidationErrorHidden(isHidden: boolean) {
		Dom.toggleClass(this.validationError, isHidden, 'sqd-hidden');
	}
}
