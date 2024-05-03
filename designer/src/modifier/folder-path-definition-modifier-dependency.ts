import { DefinitionWalker } from '../definition';
import { DesignerState } from '../designer-state';
import { StateModifierDependency } from './state-modifier-dependency';

export class FolderPathDefinitionModifierDependency implements StateModifierDependency {
	public constructor(
		private readonly state: DesignerState,
		private readonly definitionWalker: DefinitionWalker
	) {}

	public update() {
		for (let index = 0; index < this.state.folderPath.length; index++) {
			const stepId = this.state.folderPath[index];
			const found = this.definitionWalker.findById(this.state.definition, stepId);
			if (!found) {
				// We need to update path if any folder is deleted.
				const newPath = this.state.folderPath.slice(0, index);
				this.state.setFolderPath(newPath);
				break;
			}
		}
	}
}
