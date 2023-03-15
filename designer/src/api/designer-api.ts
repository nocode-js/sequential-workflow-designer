import { DesignerContext } from '../designer-context';
import { ControlBarApi } from './control-bar-api';
import { EditorApi } from './editor-api';
import { PathBarApi } from './path-bar-api';
import { ToolboxApi } from './toolbox-api';
import { ViewPortApi } from './view-port-api';
import { WorkspaceApi } from './workspace-api';

export class DesignerApi {
	public static create(context: DesignerContext): DesignerApi {
		const workspaceApi = new WorkspaceApi(context.state, context.workspaceController);
		const viewPortController = context.services.viewPortController.create(workspaceApi);
		const viewPortApi = new ViewPortApi(context.workspaceController, viewPortController);

		return new DesignerApi(
			new ControlBarApi(context.state, context.historyController, context.definitionModifier, viewPortApi),
			new ToolboxApi(context.state, context, context.behaviorController, context.layoutController, context.configuration.steps),
			new EditorApi(context.state, context.stepsTraverser, context.layoutController, context.definitionModifier),
			workspaceApi,
			viewPortApi,
			new PathBarApi(context.state, context.stepsTraverser)
		);
	}

	private constructor(
		public readonly controlBar: ControlBarApi,
		public readonly toolbox: ToolboxApi,
		public readonly editor: EditorApi,
		public readonly workspace: WorkspaceApi,
		public readonly viewPort: ViewPortApi,
		public readonly pathBar: PathBarApi
	) {}
}
