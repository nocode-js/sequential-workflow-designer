import { DesignerContext } from '../designer-context';
import { ResolvedClick } from '../workspace';
import { Behavior } from './behavior';

export class OpenFolderBehavior implements Behavior {
	public static create(context: DesignerContext, clickedElement: Element, resolvedClick: ResolvedClick): OpenFolderBehavior {
		return new OpenFolderBehavior(context, clickedElement, resolvedClick);
	}

	private constructor(
		private readonly context: DesignerContext,
		private readonly clickedElement: Element,
		private readonly resolvedClick: ResolvedClick
	) {}

	public onStart() {
		// Nothing...
	}

	public onMove() {
		// Nothing...
	}

	public onEnd(_: boolean, element: Element | null) {
		if (this.clickedElement === element) {
			const stepId = this.resolvedClick.component.step.id;
			this.context.state.pushStepIdToFolderPath(stepId);
		}
	}
}
