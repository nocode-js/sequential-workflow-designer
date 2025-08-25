import { BranchedStep } from 'sequential-workflow-model';
import { SwitchStepComponentViewConfiguration } from './switch-step-component-view-configuration';

export type BranchNamesResolver = (step: BranchedStep) => string[];

export interface SwitchStepExtensionConfiguration {
	view?: SwitchStepComponentViewConfiguration;

	/**
	 * A function that takes a `BranchedStep` and returns an array of branch names.
	 * If not provided, the default is: `Object.keys(step.branches)`.
	 * You can use this to provide custom ordering or filtering of branch names.
	 */
	branchNamesResolver?: BranchNamesResolver;
}
