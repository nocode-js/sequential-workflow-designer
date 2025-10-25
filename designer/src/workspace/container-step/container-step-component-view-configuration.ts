import { LabelViewConfiguration } from '../common-views/label-view-configuration';

export interface ContainerStepComponentViewConfiguration {
	paddingTop: number;
	paddingX: number;
	inputSize: number;
	inputRadius: number;
	inputIconSize: number;
	autoHideInputOnDrag: boolean;
	label: LabelViewConfiguration;

	/**
	 * If `true`, the entire region of the switch step is clickable; otherwise, only the labels and icon are clickable.
	 */
	isRegionClickable: boolean;
}
