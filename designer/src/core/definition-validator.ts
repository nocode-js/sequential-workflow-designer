import { Sequence, Step } from '../definition';
import { ValidatorConfiguration } from '../designer-configuration';
import { DesignerState } from '../designer-state';

export class DefinitionValidator {
	public constructor(private readonly configuration: ValidatorConfiguration | undefined, private readonly state: DesignerState) {}

	public validateStep(step: Step, parentSequence: Sequence): boolean {
		if (this.configuration?.step) {
			return this.configuration.step(step, parentSequence, this.state.definition);
		}
		return true;
	}

	public validateRoot(): boolean {
		if (this.configuration?.root) {
			return this.configuration.root(this.state.definition);
		}
		return true;
	}
}
