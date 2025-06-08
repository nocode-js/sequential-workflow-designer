import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { BranchedStep } from '../../definition';
import { JoinView } from '../common-views/join-view';
import { LabelView } from '../common-views/label-view';
import { InputView } from '../common-views/input-view';
import { ClickDetails, StepComponentView, ClickCommand, SequenceComponent } from '../component';
import { RegionView, StepComponentViewContext, StepComponentViewFactory, StepContext } from '../../designer-extension';
import { SwitchStepComponentViewConfiguration } from './switch-step-component-view-configuration';

const COMPONENT_CLASS_NAME = 'switch';

function createView(
	g: SVGGElement,
	width: number,
	height: number,
	joinX: number,
	viewContext: StepComponentViewContext,
	sequenceComponents: SequenceComponent[] | null,
	regionView: RegionView,
	cfg: SwitchStepComponentViewConfiguration
): StepComponentView {
	let inputView: InputView | null = null;
	if (cfg.inputSize > 0) {
		const iconUrl = viewContext.getStepIconUrl();
		inputView = InputView.createRectInput(g, joinX, cfg.paddingTop1, cfg.inputSize, cfg.inputRadius, cfg.inputIconSize, iconUrl);
	}

	return {
		g,
		width,
		height,
		joinX,
		placeholders: null,
		sequenceComponents,
		hasOutput: sequenceComponents ? sequenceComponents.some(c => c.hasOutput) : true,

		getClientPosition(): Vector {
			return regionView.getClientPosition();
		},
		resolveClick(click: ClickDetails): true | ClickCommand | null {
			const result = regionView.resolveClick(click);
			return result === true || (result === null && g.contains(click.element)) ? true : result;
		},
		setIsDragging(isDragging: boolean) {
			if (cfg.autoHideInputOnDrag && inputView) {
				inputView.setIsHidden(isDragging);
			}
		},
		setIsSelected(isSelected: boolean) {
			regionView.setIsSelected(isSelected);
		},
		setIsDisabled(isDisabled: boolean) {
			Dom.toggleClass(g, isDisabled, 'sqd-disabled');
		}
	};
}

export const createSwitchStepComponentViewFactory =
	(cfg: SwitchStepComponentViewConfiguration): StepComponentViewFactory =>
	(parent: SVGElement, stepContext: StepContext<BranchedStep>, viewContext: StepComponentViewContext): StepComponentView => {
		return viewContext.createRegionComponentView(parent, COMPONENT_CLASS_NAME, (g, regionViewBuilder) => {
			const step = stepContext.step;
			const paddingTop = cfg.paddingTop1 + cfg.paddingTop2;

			const name = viewContext.getStepName();
			const nameLabelView = LabelView.create(g, paddingTop, cfg.nameLabel, name, 'primary');
			const branchNames = Object.keys(step.branches);

			if (branchNames.length === 0) {
				const width = Math.max(nameLabelView.width, cfg.minBranchWidth) + cfg.paddingX * 2;
				const height = nameLabelView.height + paddingTop + cfg.noBranchPaddingBottom;
				const joinX = width / 2;
				const regionView = regionViewBuilder(g, [width], height);

				Dom.translate(nameLabelView.g, joinX, 0);
				JoinView.createStraightJoin(g, new Vector(joinX, 0), height);

				return createView(g, width, height, joinX, viewContext, null, regionView, cfg);
			}

			const branchComponents: SequenceComponent[] = [];
			const branchLabelViews: LabelView[] = [];
			const branchSizes: BranchSize[] = [];
			let totalBranchesWidth = 0;
			let maxBranchesHeight = 0;

			branchNames.forEach(branchName => {
				const labelY = paddingTop + cfg.nameLabel.height + cfg.connectionHeight;
				const translatedBranchName = viewContext.i18n(`stepComponent.${step.type}.branchName`, branchName);
				const labelView = LabelView.create(g, labelY, cfg.branchNameLabel, translatedBranchName, 'secondary');

				const component = viewContext.createSequenceComponent(g, step.branches[branchName]);

				const halfOfWidestBranchElement = Math.max(labelView.width, cfg.minBranchWidth) / 2;

				const branchOffsetLeft = Math.max(halfOfWidestBranchElement - component.view.joinX, 0) + cfg.paddingX;
				const branchOffsetRight =
					Math.max(halfOfWidestBranchElement - (component.view.width - component.view.joinX), 0) + cfg.paddingX;

				const width: number = component.view.width + branchOffsetLeft + branchOffsetRight;
				const joinX = component.view.joinX + branchOffsetLeft;

				const offsetX = totalBranchesWidth;
				totalBranchesWidth += width;
				maxBranchesHeight = Math.max(maxBranchesHeight, component.view.height);

				branchComponents.push(component);
				branchLabelViews.push(labelView);
				branchSizes.push({ width, branchOffsetLeft, offsetX, joinX });
			});

			const centerBranchIndex = Math.floor(branchNames.length / 2);
			const centerBranchSize = branchSizes[centerBranchIndex];
			let joinX = centerBranchSize.offsetX;
			if (branchNames.length % 2 !== 0) {
				joinX += centerBranchSize.joinX;
			}

			const halfOfWidestSwitchElement = nameLabelView.width / 2 + cfg.paddingX;
			const switchOffsetLeft = Math.max(halfOfWidestSwitchElement - joinX, 0);
			const switchOffsetRight = Math.max(halfOfWidestSwitchElement - (totalBranchesWidth - joinX), 0);

			const viewWidth = switchOffsetLeft + totalBranchesWidth + switchOffsetRight;
			const viewHeight =
				maxBranchesHeight + paddingTop + cfg.nameLabel.height + cfg.branchNameLabel.height + cfg.connectionHeight * 2;

			const shiftedJoinX = switchOffsetLeft + joinX;
			Dom.translate(nameLabelView.g, shiftedJoinX, 0);

			const branchOffsetTop = paddingTop + cfg.nameLabel.height + cfg.branchNameLabel.height + cfg.connectionHeight;

			branchComponents.forEach((component, i) => {
				const branchSize = branchSizes[i];
				const branchOffsetLeft = switchOffsetLeft + branchSize.offsetX + branchSize.branchOffsetLeft;

				Dom.translate(branchLabelViews[i].g, switchOffsetLeft + branchSize.offsetX + branchSize.joinX, 0);
				Dom.translate(component.view.g, branchOffsetLeft, branchOffsetTop);

				if (component.hasOutput && stepContext.isOutputConnected) {
					const endOffsetTopOfComponent =
						paddingTop + cfg.nameLabel.height + cfg.branchNameLabel.height + cfg.connectionHeight + component.view.height;
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

			JoinView.createStraightJoin(g, new Vector(shiftedJoinX, 0), paddingTop);

			JoinView.createJoins(
				g,
				new Vector(shiftedJoinX, paddingTop + cfg.nameLabel.height),
				branchSizes.map(
					s => new Vector(switchOffsetLeft + s.offsetX + s.joinX, paddingTop + cfg.nameLabel.height + cfg.connectionHeight)
				)
			);

			if (stepContext.isOutputConnected) {
				const ongoingSequenceIndexes = branchComponents
					.map((component, index) => (component.hasOutput ? index : null))
					.filter(index => index !== null) as number[];
				const ongoingJoinTargets = ongoingSequenceIndexes.map((i: number) => {
					const branchSize = branchSizes[i];
					return new Vector(
						switchOffsetLeft + branchSize.offsetX + branchSize.joinX,
						paddingTop + cfg.connectionHeight + cfg.nameLabel.height + cfg.branchNameLabel.height + maxBranchesHeight
					);
				});
				if (ongoingJoinTargets.length > 0) {
					JoinView.createJoins(g, new Vector(shiftedJoinX, viewHeight), ongoingJoinTargets);
				}
			}

			const regions = branchSizes.map(s => s.width);
			regions[0] += switchOffsetLeft;
			regions[regions.length - 1] += switchOffsetRight;
			const regionView = regionViewBuilder(g, regions, viewHeight);

			return createView(g, viewWidth, viewHeight, shiftedJoinX, viewContext, branchComponents, regionView, cfg);
		});
	};

interface BranchSize {
	width: number;
	branchOffsetLeft: number;
	offsetX: number;
	joinX: number;
}
