import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { BranchedStep } from '../../definition';
import { JoinView } from '../common-views/join-view';
import { LabelView } from '../common-views/label-view';
import { RegionView } from '../common-views//region-view';
import { InputView } from '../common-views/input-view';
import { ClickDetails, StepComponentView } from '../component';
import { ComponentContext } from '../../component-context';
import { SequenceComponent } from '../sequence/sequence-component';
import { StepContext } from '../../designer-extension';
import { SequenceContext } from '../sequence/sequence-context';
import { SwitchStepComponentViewConfiguration } from './switch-step-component-view-configuration';

export class SwitchStepComponentView implements StepComponentView {
	public static create(
		parent: SVGElement,
		stepContext: StepContext<BranchedStep>,
		context: ComponentContext,
		cfg: SwitchStepComponentViewConfiguration
	): SwitchStepComponentView {
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
			const labelY = cfg.paddingTop + cfg.labelHeight + cfg.connectionHeight;
			return LabelView.create(
				g,
				labelY,
				cfg.labelMinWidth,
				cfg.labelHeight,
				cfg.labelPaddingX,
				cfg.labelRadius,
				branchName,
				'secondary'
			);
		});

		const nameLabelView = LabelView.create(
			g,
			cfg.paddingTop,
			cfg.labelMinWidth,
			cfg.labelHeight,
			cfg.labelPaddingX,
			cfg.labelRadius,
			step.name,
			'primary'
		);

		let prevOffsetX = 0;
		const branchSizes = branchComponents.map((component, i) => {
			const halfOfWidestBranchElement = Math.max(branchLabelViews[i].width, cfg.minContainerWidth) / 2;

			const branchOffsetLeft = Math.max(halfOfWidestBranchElement - component.view.joinX, 0) + cfg.paddingX;
			const branchOffsetRight = Math.max(halfOfWidestBranchElement - (component.view.width - component.view.joinX), 0) + cfg.paddingX;

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

		const halfOfWidestSwitchElement = nameLabelView.width / 2 + cfg.paddingX;
		const switchOffsetLeft = Math.max(halfOfWidestSwitchElement - joinX, 0);
		const switchOffsetRight = Math.max(halfOfWidestSwitchElement - (totalBranchesWidth - joinX), 0);

		const viewWidth = switchOffsetLeft + totalBranchesWidth + switchOffsetRight;
		const viewHeight = maxBranchesHeight + cfg.paddingTop + cfg.labelHeight * 2 + cfg.connectionHeight * 2;

		const shiftedJoinX = switchOffsetLeft + joinX;
		Dom.translate(nameLabelView.g, shiftedJoinX, 0);

		const branchOffsetTop = cfg.paddingTop + cfg.labelHeight * 2 + cfg.connectionHeight;

		branchComponents.forEach((component, i) => {
			const branchSize = branchSizes[i];
			const branchOffsetLeft = switchOffsetLeft + branchSize.offsetX + branchSize.branchOffsetLeft;

			Dom.translate(branchLabelViews[i].g, switchOffsetLeft + branchSize.offsetX + branchSize.joinX, 0);
			Dom.translate(component.view.g, branchOffsetLeft, branchOffsetTop);

			if (component.hasOutput && stepContext.isOutputConnected) {
				const endOffsetTopOfComponent = cfg.paddingTop + cfg.labelHeight * 2 + cfg.connectionHeight + component.view.height;
				const missingHeight = viewHeight - endOffsetTopOfComponent - cfg.connectionHeight;
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
		const inputView = InputView.createRectInput(g, shiftedJoinX, 0, cfg.inputSize, cfg.inputIconSize, iconUrl);

		JoinView.createStraightJoin(g, new Vector(shiftedJoinX, 0), cfg.paddingTop);

		JoinView.createJoins(
			g,
			new Vector(shiftedJoinX, cfg.paddingTop + cfg.labelHeight),
			branchSizes.map(
				o => new Vector(switchOffsetLeft + o.offsetX + o.joinX, cfg.paddingTop + cfg.labelHeight + cfg.connectionHeight)
			)
		);

		if (stepContext.isOutputConnected) {
			const ongoingSequenceIndexes = branchComponents
				.map((component, index) => (component.hasOutput ? index : null))
				.filter(index => index !== null) as number[];
			const ongoingJoinTargets = ongoingSequenceIndexes.map(
				(i: number) =>
					new Vector(
						switchOffsetLeft + branchSizes[i].offsetX + branchSizes[i].joinX,
						cfg.paddingTop + cfg.connectionHeight + cfg.labelHeight * 2 + maxBranchesHeight
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

		return new SwitchStepComponentView(g, viewWidth, viewHeight, shiftedJoinX, branchComponents, regionView, inputView);
	}

	public readonly placeholders = null;

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly sequenceComponents: SequenceComponent[],
		private readonly regionView: RegionView,
		private readonly inputView: InputView
	) {}

	public getClientPosition(): Vector {
		return this.regionView.getClientPosition();
	}

	public resolveClick(click: ClickDetails): true | null {
		return this.regionView.resolveClick(click) || this.g.contains(click.element) ? true : null;
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

	public hasOutput(): boolean {
		return this.sequenceComponents.some(c => c.hasOutput);
	}
}
