import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { SwitchStep } from '../../definition';
import { JoinView } from '../common-views/join-view';
import { LabelView, LABEL_HEIGHT } from '../common-views/label-view';
import { RegionView } from '../common-views//region-view';
import { ValidationErrorView } from '../common-views/validation-error-view';
import { InputView } from '../common-views/input-view';
import { ClickDetails, ComponentView } from '../component';
import { ComponentContext } from '../../component-context';
import { SequenceComponent } from '../sequence/sequence-component';
import { StepContext } from '../../designer-extension';
import { SequenceContext } from '../sequence/sequence-context';

const MIN_CONTAINER_WIDTH = 40;
const PADDING_X = 20;
const PADDING_TOP = 20;
const CONNECTION_HEIGHT = 16;

export class SwitchStepComponentView implements ComponentView {
	public static create(parent: SVGElement, stepContext: StepContext<SwitchStep>, context: ComponentContext): SwitchStepComponentView {
		const { step } = stepContext;
		const g = Dom.svg('g', {
			class: `sqd-step-switch sqd-type-${step.type}`
		});
		parent.appendChild(g);

		const branchNames = Object.keys(step.branches);
		const branchComponents = branchNames.map(branchName => {
			const sequenceContext: SequenceContext = {
				sequence: step.branches[branchName],
				depth: stepContext.depth + 1,
				isInputConnected: true,
				isOutputConnected: stepContext.isOutputConnected
			};
			return SequenceComponent.create(g, sequenceContext, context);
		});

		const branchLabelViews = branchNames.map(branchName => {
			return LabelView.create(g, PADDING_TOP + LABEL_HEIGHT + CONNECTION_HEIGHT, branchName, 'secondary');
		});

		const nameLabelView = LabelView.create(g, PADDING_TOP, step.name, 'primary');

		let prevOffsetX = 0;
		const branchSizes = branchComponents.map((component, i) => {
			const halfOfWidestBranchElement = Math.max(branchLabelViews[i].width, MIN_CONTAINER_WIDTH) / 2;

			const branchOffsetLeft = Math.max(halfOfWidestBranchElement - component.view.joinX, 0) + PADDING_X;
			const branchOffsetRight = Math.max(halfOfWidestBranchElement - (component.view.width - component.view.joinX), 0) + PADDING_X;

			const width = component.view.width + branchOffsetLeft + branchOffsetRight;
			const joinX = component.view.joinX + branchOffsetLeft;

			const offsetX = prevOffsetX;
			prevOffsetX += width;
			return { width, branchOffsetLeft, offsetX, joinX };
		});

		const centerBranchIndex = Math.floor(branchNames.length / 2);
		const centerBranchSize = branchSizes[centerBranchIndex];
		let joinX = centerBranchSize.offsetX;
		if (branchNames.length % 2 !== 0) {
			joinX += centerBranchSize.joinX;
		}

		const totalBranchesWidth = branchSizes.reduce((result, s) => result + s.width, 0);
		const maxBranchesHeight = Math.max(...branchComponents.map(s => s.view.height));

		const halfOfWidestSwitchElement = nameLabelView.width / 2 + PADDING_X;
		const switchOffsetLeft = Math.max(halfOfWidestSwitchElement - joinX, 0);
		const switchOffsetRight = Math.max(halfOfWidestSwitchElement - (totalBranchesWidth - joinX), 0);

		const viewWidth = switchOffsetLeft + totalBranchesWidth + switchOffsetRight;
		const viewHeight = maxBranchesHeight + PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT * 2;

		const shiftedJoinX = switchOffsetLeft + joinX;
		Dom.translate(nameLabelView.g, shiftedJoinX, 0);

		const branchOffsetTop = PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT;

		branchComponents.forEach((component, i) => {
			const branchSize = branchSizes[i];
			const branchOffsetLeft = switchOffsetLeft + branchSize.offsetX + branchSize.branchOffsetLeft;

			Dom.translate(branchLabelViews[i].g, switchOffsetLeft + branchSize.offsetX + branchSize.joinX, 0);
			Dom.translate(component.view.g, branchOffsetLeft, branchOffsetTop);

			if (component.hasOutput && stepContext.isOutputConnected) {
				const endOffsetTopOfComponent = PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT + component.view.height;
				const missingHeight = viewHeight - endOffsetTopOfComponent - CONNECTION_HEIGHT;
				if (missingHeight > 0) {
					JoinView.createStraightJoin(
						g,
						new Vector(switchOffsetLeft + branchSize.offsetX + branchSize.joinX, endOffsetTopOfComponent),
						missingHeight
					);
				}
			}
		});

		const iconUrl = context.configuration.iconUrlProvider ? context.configuration.iconUrlProvider(step.componentType, step.type) : null;
		const inputView = InputView.createRectInput(g, shiftedJoinX, 0, iconUrl);

		JoinView.createStraightJoin(g, new Vector(shiftedJoinX, 0), PADDING_TOP);

		JoinView.createJoins(
			g,
			new Vector(shiftedJoinX, PADDING_TOP + LABEL_HEIGHT),
			branchSizes.map(o => new Vector(switchOffsetLeft + o.offsetX + o.joinX, PADDING_TOP + LABEL_HEIGHT + CONNECTION_HEIGHT))
		);

		if (stepContext.isOutputConnected) {
			const ongoingSequenceIndexes = branchComponents
				.map((component, index) => (component.hasOutput ? index : null))
				.filter(index => index !== null) as number[];
			const ongoingJoinTargets = ongoingSequenceIndexes.map(
				(i: number) =>
					new Vector(
						switchOffsetLeft + branchSizes[i].offsetX + branchSizes[i].joinX,
						PADDING_TOP + CONNECTION_HEIGHT + LABEL_HEIGHT * 2 + maxBranchesHeight
					)
			);
			if (ongoingJoinTargets.length > 0) {
				JoinView.createJoins(g, new Vector(shiftedJoinX, viewHeight), ongoingJoinTargets);
			}
		}

		const regions = branchSizes.map(s => s.width);
		regions[0] += switchOffsetLeft;
		regions[regions.length - 1] += switchOffsetRight;
		const regionView = RegionView.create(g, regions, viewHeight);

		const validationErrorView = ValidationErrorView.create(g, viewWidth, 0);

		return new SwitchStepComponentView(
			g,
			viewWidth,
			viewHeight,
			shiftedJoinX,
			branchComponents,
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

	public resolveClick(click: ClickDetails): boolean {
		return this.regionView.resolveClick(click) || this.g.contains(click.element);
	}

	public setIsDragging(isDragging: boolean) {
		this.inputView?.setIsHidden(isDragging);
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

	public hasOutput(): boolean {
		return this.sequenceComponents.some(c => c.hasOutput);
	}
}
