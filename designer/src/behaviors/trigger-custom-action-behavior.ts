import { CustomActionHandler } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { ResolvedClick, TriggerCustomActionClickCommand } from '../workspace';
import { Behavior } from './behavior';

export class TriggerCustomActionBehavior implements Behavior {
	public static create(
		designerContext: DesignerContext,
		clickedElement: Element,
		resolvedClick: ResolvedClick
	): TriggerCustomActionBehavior {
		return new TriggerCustomActionBehavior(clickedElement, resolvedClick, designerContext.configuration.customActionHandler);
	}

	private constructor(
		private readonly clickedElement: Element,
		private readonly resolvedClick: ResolvedClick,
		private readonly customActionHandler: CustomActionHandler | undefined
	) {}

	public onStart() {
		// Nothing...
	}

	public onMove() {
		// Nothing...
	}

	public onEnd(_: boolean, element: Element | null) {
		if (this.clickedElement !== element) {
			return;
		}
		if (!this.customActionHandler) {
			console.warn('Custom action handler is not defined');
			return;
		}
		const action = (this.resolvedClick.command as TriggerCustomActionClickCommand).action;
		this.customActionHandler(action, this.resolvedClick.component.step);
	}
}
