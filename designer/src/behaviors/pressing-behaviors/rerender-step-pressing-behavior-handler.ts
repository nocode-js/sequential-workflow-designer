import { DesignerContext } from '../../designer-context';
import { PressingBehaviorHandler } from './pressing-behavior';

export class RerenderStepPressingBehaviorHandler implements PressingBehaviorHandler {
	public constructor(private readonly designerContext: DesignerContext) {}

	public handle() {
		this.designerContext.workspaceController.updateRootComponent();
	}
}
