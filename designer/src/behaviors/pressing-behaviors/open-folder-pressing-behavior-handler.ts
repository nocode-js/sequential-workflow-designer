import { DesignerContext } from '../../designer-context';
import { OpenFolderClickCommand } from '../../workspace';
import { PressingBehaviorHandler } from './pressing-behavior';

export class OpenFolderPressingBehaviorHandler implements PressingBehaviorHandler {
	public constructor(private readonly command: OpenFolderClickCommand, private readonly designerContext: DesignerContext) {}

	public handle() {
		const stepId = this.command.step.id;
		this.designerContext.state.pushStepIdToFolderPath(stepId);
	}
}
