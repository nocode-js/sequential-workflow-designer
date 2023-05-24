import { race } from '../core';
import { DefinitionWalker } from '../definition';
import { DesignerState } from '../designer-state';

export class PathBarApi {
	public constructor(private readonly state: DesignerState, private readonly definitionWalker: DefinitionWalker) {}

	/**
	 * @deprecated Don't use this method
	 */
	public subscribe(handler: () => void) {
		// TODO: this should be refactored

		race(0, this.state.onFolderPathChanged, this.state.onDefinitionChanged).subscribe(handler);
	}

	public setFolderPath(path: string[]) {
		this.state.setFolderPath(path);
	}

	public getFolderPath(): string[] {
		return this.state.folderPath;
	}

	public getFolderPathStepNames(): string[] {
		return this.state.folderPath.map(stepId => {
			return this.definitionWalker.getById(this.state.definition, stepId).name;
		});
	}
}
