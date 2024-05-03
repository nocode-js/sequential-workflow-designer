import { DefinitionWalker } from '../definition';
import { DesignerState } from '../designer-state';
import { StateModifierDependency } from './state-modifier-dependency';

export class SelectedStepIdDefinitionModifierDependency implements StateModifierDependency {
	public constructor(
		private readonly state: DesignerState,
		private readonly definitionWalker: DefinitionWalker
	) {}

	public update() {
		if (this.state.selectedStepId) {
			const found = this.definitionWalker.findById(this.state.definition, this.state.selectedStepId);
			if (!found) {
				// We need to unselect step when it's deleted.
				this.state.setSelectedStepId(null);
			}
		}
	}
}
