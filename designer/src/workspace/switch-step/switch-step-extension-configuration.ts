import { BranchedStep, Step } from 'sequential-workflow-model';
import { SwitchStepComponentViewConfiguration } from './switch-step-component-view-configuration';

export type BranchNamesResolver = (step: BranchedStep) => string[];

export type BranchNameLabelResolver = (branchName: string, step: Step) => string;

export interface SwitchStepExtensionConfiguration {
	componentType?: string;
	view?: SwitchStepComponentViewConfiguration;

	/**
	 * A function that takes a `BranchedStep` and returns an array of branch names.
	 * If not provided, the default is: `Object.keys(step.branches)`.
	 * You can use this to provide custom ordering or filtering of branch names.
	 */
	branchNamesResolver?: BranchNamesResolver;

	/**
	 * A function that takes a branch name and a step, and returns the label to display for that branch.
	 * If not provided, the branch name itself will be used as the label.
	 * Before rendering, the label is translated using the i18n callback.
	 */
	branchNameLabelResolver?: BranchNameLabelResolver;
}
