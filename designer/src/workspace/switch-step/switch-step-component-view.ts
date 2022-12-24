import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { SwitchStep } from '../../definition';
import { JoinView } from '../common-views//join-view';
import { LabelView } from '../common-views//label-view';
import { RegionView } from '../common-views//region-view';
import { ValidationErrorView } from '../common-views//validation-error-view';
import { InputView } from '../common-views/input-view';
import { ComponentView } from '../component';
import { ComponentContext } from '../component-context';
import { SequenceComponent } from '../sequence/sequence-component';

const MIN_CHILDREN_WIDTH = 50;
const PADDING_X = 20;
const PADDING_TOP = 20;
const LABEL_HEIGHT = 22;
const CONNECTION_HEIGHT = 16;

export class SwitchStepComponentView implements ComponentView {
	public static create(parent: SVGElement, step: SwitchStep, context: ComponentContext): SwitchStepComponentView {
		const g = Dom.svg('g', {
			class: `sqd-switch-group sqd-type-${step.type}`
		});
		parent.appendChild(g);

		const branchNames = Object.keys(step.branches);
		const sequenceComponents = branchNames.map(bn => SequenceComponent.create(g, step.branches[bn], context));

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

		const centerBranchIndex = Math.floor(branchNames.length / 2);
		let joinX = containerOffsets[centerBranchIndex];
		if (branchNames.length % 2 !== 0) {
			joinX += joinXs[centerBranchIndex] + PADDING_X;
		}

		branchNames.forEach((branchName, i) => {
			const sequence = sequenceComponents[i];
			const offsetX = containerOffsets[i];

			LabelView.create(g, offsetX + joinXs[i] + PADDING_X, PADDING_TOP + LABEL_HEIGHT + CONNECTION_HEIGHT, branchName, 'secondary');

			const childEndY = PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT + sequence.view.height;

			if (!sequence.isInterrupted) {
				const fillingHeight = containerHeight - childEndY - CONNECTION_HEIGHT;
				if (fillingHeight > 0) {
					JoinView.createStraightJoin(g, new Vector(containerOffsets[i] + joinXs[i] + PADDING_X, childEndY), fillingHeight);
				}
			}

			const sequenceX = offsetX + PADDING_X + Math.max((MIN_CHILDREN_WIDTH - sequence.view.width) / 2, 0);
			const sequenceY = PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT;
			Dom.translate(sequence.view.g, sequenceX, sequenceY);
		});

		LabelView.create(g, joinX, PADDING_TOP, step.name);

		JoinView.createStraightJoin(g, new Vector(joinX, 0), PADDING_TOP);

		const iconUrl = context.configuration.iconUrlProvider ? context.configuration.iconUrlProvider(step.componentType, step.type) : null;
		const inputView = InputView.createRectInput(g, joinX, 0, iconUrl);

		JoinView.createJoins(
			g,
			new Vector(joinX, PADDING_TOP + LABEL_HEIGHT),
			containerOffsets.map((o, i) => new Vector(o + joinXs[i] + PADDING_X, PADDING_TOP + LABEL_HEIGHT + CONNECTION_HEIGHT))
		);

		const ongoingSequenceIndexes = sequenceComponents
			.map((component, index) => (component.isInterrupted ? null : index))
			.filter(index => index !== null) as number[];
		const ongoingJoinTargets = ongoingSequenceIndexes.map(
			(i: number) =>
				new Vector(containerOffsets[i] + joinXs[i] + PADDING_X, PADDING_TOP + CONNECTION_HEIGHT + LABEL_HEIGHT * 2 + maxChildHeight)
		);
		if (ongoingJoinTargets.length > 0) {
			JoinView.createJoins(g, new Vector(joinX, containerHeight), ongoingJoinTargets);
		}

		const regionView = RegionView.create(g, containerWidths, containerHeight);

		const validationErrorView = ValidationErrorView.create(g, containersWidth, 0);

		return new SwitchStepComponentView(
			g,
			containersWidth,
			containerHeight,
			joinX,
			sequenceComponents,
			regionView,
			inputView,
			validationErrorView
		);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly sequenceComponents: SequenceComponent[],
		private readonly regionView: RegionView,
		private readonly inputView: InputView,
		private readonly validationErrorView: ValidationErrorView
	) {}

	public getClientPosition(): Vector {
		return this.regionView.getClientPosition();
	}

	public containsElement(element: Element): boolean {
		return this.g.contains(element);
	}

	public setIsDragging(isDragging: boolean) {
		this.inputView.setIsHidden(isDragging);
	}

	public setIsSelected(isSelected: boolean) {
		this.regionView.setIsSelected(isSelected);
	}

	public setIsDisabled(isDisabled: boolean) {
		Dom.toggleClass(this.g, isDisabled, 'sqd-disabled');
	}

	public setIsValid(isValid: boolean) {
		this.validationErrorView.setIsHidden(isValid);
	}

	public isInterrupted(): boolean {
		return this.sequenceComponents.every(c => c.isInterrupted);
	}
}
