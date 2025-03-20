import { DesignerContext } from '../../designer-context';
import { RerenderStepClickCommand } from '../../workspace';
import { PressingBehaviorHandler } from './pressing-behavior';

export class RerenderStepPressingBehaviorHandler implements PressingBehaviorHandler {
	public constructor(
		private readonly command: RerenderStepClickCommand,
		private readonly designerContext: DesignerContext
	) {}

	public handle() {
		if (this.command.beforeCallback) {
			this.command.beforeCallback();
		}
		this.designerContext.workspaceController.updateRootComponent();
	}
}
