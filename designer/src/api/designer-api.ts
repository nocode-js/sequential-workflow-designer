import { DesignerContext } from '../designer-context';
import { ControlBarApi } from './control-bar-api';
import { EditorApi } from './editor-api';
import { PathBarApi } from './path-bar-api';
import { ToolboxApi } from './toolbox-api';
import { ViewportApi } from './viewport-api';
import { WorkspaceApi } from './workspace-api';

export class DesignerApi {
	public static create(context: DesignerContext): DesignerApi {
		const workspace = new WorkspaceApi(context.state, context.workspaceController);
		const viewportController = context.services.viewportController.create(workspace);
		const viewport = new ViewportApi(context.workspaceController, viewportController);

		return new DesignerApi(
			new ControlBarApi(context.state, context.historyController, context.definitionModifier, viewport),
			new ToolboxApi(context.state, context, context.behaviorController, context.layoutController, context.configuration.steps),
			new EditorApi(context.state, context.stepsTraverser, context.layoutController, context.definitionModifier),
			workspace,
			viewport,
			new PathBarApi(context.state, context.stepsTraverser)
		);
	}

	private constructor(
		public readonly controlBar: ControlBarApi,
		public readonly toolbox: ToolboxApi,
		public readonly editor: EditorApi,
		public readonly workspace: WorkspaceApi,
		public readonly viewport: ViewportApi,
		public readonly pathBar: PathBarApi
	) {}
}
