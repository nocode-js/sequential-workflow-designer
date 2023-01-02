import { race } from '../core/simple-event-race';
import { StepsTraverser } from '../core/steps-traverser';
import { DesignerContext } from '../designer-context';
import { DesignerState } from '../designer-state';
import { PathBarView } from './path-bar-view';

export class PathBar {
	public static create(parent: HTMLElement, context: DesignerContext): PathBar {
		const view = PathBarView.create(parent);
		const bar = new PathBar(view, context.state, context.stepsTraverser);

		race(0, context.state.onFolderPathChanged, context.state.onDefinitionChanged).subscribe(() => bar.reloadPath());

		view.bindOnItemClick(index => bar.onItemClicked(index));
		view.bindOnResetClick(() => bar.onResetClicked());

		bar.reloadPath();
		return bar;
	}

	private constructor(
		private readonly view: PathBarView,
		private readonly state: DesignerState,
		private readonly stepsTraverser: StepsTraverser
	) {}

	private onItemClicked(index: number) {
		const path = this.state.folderPath.splice(0, index + 1);
		this.state.setFolderPath(path);
	}

	private onResetClicked() {
		this.state.setFolderPath([]);
	}

	private reloadPath() {
		if (this.state.folderPath.length === 0) {
			this.view.reload(null);
			return;
		}

		const names: string[] = [];
		for (const stepId of this.state.folderPath) {
			const step = this.stepsTraverser.getById(this.state.definition, stepId);
			names.push(step.name);
		}
		this.view.reload(names);
	}
}
