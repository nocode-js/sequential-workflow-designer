import { CustomActionHandler } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { TriggerCustomActionClickCommand } from '../workspace';
import { Behavior } from './behavior';

export class TriggerCustomActionBehavior implements Behavior {
	public static create(
		designerContext: DesignerContext,
		clickedElement: Element,
		clickCommand: TriggerCustomActionClickCommand
	): TriggerCustomActionBehavior {
		return new TriggerCustomActionBehavior(clickedElement, clickCommand, designerContext.configuration.customActionHandler);
	}

	private constructor(
		private readonly clickedElement: Element,
		private readonly clickCommand: TriggerCustomActionClickCommand,
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
			console.warn(`Custom action handler is not defined (${this.clickCommand.action})`);
			return;
		}
		this.customActionHandler(this.clickCommand.action, this.clickCommand.step, this.clickCommand.sequence);
	}
}
