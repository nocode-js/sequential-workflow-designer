import { LabelViewConfiguration } from '../common-views/label-view-configuration';

export interface SwitchStepComponentViewConfiguration {
	minContainerWidth: number;
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
	inputSize: number;
	inputIconSize: number;
	autoHideInputOnDrag: boolean;
	inputRadius: number;
	nameLabel: LabelViewConfiguration;
	branchNameLabel: LabelViewConfiguration;
}
