import { LabelViewConfiguration } from '../common-views/label-view-configuration';

export interface SwitchStepComponentViewConfiguration {
	minBranchWidth: number;
	paddingX: number;
	/**
	 * The distance between the top of the container and the center point of the input.
	 */
	paddingTop1: number;
	/**
	 * The distance between the center point of the input and the name label.
	 */
	paddingTop2: number;
	connectionHeight: number;
	/**
	 * The distance between the end of the label and the bottom of the container when there are no branches.
	 */
	noBranchPaddingBottom: number;
	inputSize: number;
	inputIconSize: number;
	autoHideInputOnDrag: boolean;
	inputRadius: number;
	nameLabel: LabelViewConfiguration;
	branchNameLabel: LabelViewConfiguration;
}
