import { DesignerContext } from '../designer-context';
import { ClickResult } from '../workspace';
import { Behavior } from './behavior';

export class OpenFolderBehavior implements Behavior {
	public static create(context: DesignerContext, clickedElement: Element, clickResult: ClickResult): OpenFolderBehavior {
		return new OpenFolderBehavior(context, clickedElement, clickResult);
	}

	private constructor(
		private readonly context: DesignerContext,
		private readonly clickedElement: Element,
		private readonly clickResult: ClickResult
	) {}

	public onStart() {
		// Nothing...
	}

	public onMove() {
		// Nothing...
	}

	public onEnd(_: boolean, element: Element | null) {
		if (this.clickedElement === element) {
			const stepId = this.clickResult.component.step.id;
			this.context.state.pushStepIdToFolderPath(stepId);
		}
	}
}
