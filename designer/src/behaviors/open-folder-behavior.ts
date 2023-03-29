import { DesignerContext } from '../designer-context';
import { OpenFolderClickCommand } from '../workspace';
import { Behavior } from './behavior';

export class OpenFolderBehavior implements Behavior {
	public static create(context: DesignerContext, clickedElement: Element, clickCommand: OpenFolderClickCommand): OpenFolderBehavior {
		return new OpenFolderBehavior(context, clickedElement, clickCommand);
	}

	private constructor(
		private readonly context: DesignerContext,
		private readonly clickedElement: Element,
		private readonly clickCommand: OpenFolderClickCommand
	) {}

	public onStart() {
		// Nothing...
	}

	public onMove() {
		// Nothing...
	}

	public onEnd(_: boolean, element: Element | null) {
		if (this.clickedElement === element) {
			const stepId = this.clickCommand.step.id;
			this.context.state.pushStepIdToFolderPath(stepId);
		}
	}
}
