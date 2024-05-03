import { DesignerContext } from '../designer-context';
import { ControlBarApi } from './control-bar-api';
import { EditorApi } from './editor-api';
import { PathBarApi } from './path-bar-api';
import { ToolboxApi } from './toolbox-api';
import { ToolboxDataProvider } from '../toolbox/toolbox-data-provider';
import { ViewportApi } from './viewport-api';
import { WorkspaceApi } from './workspace-api';
import { DefinitionWalker } from '../definition';
import { I18n } from '../designer-configuration';

export class DesignerApi {
	public static create(context: DesignerContext): DesignerApi {
		const workspace = new WorkspaceApi(context.state, context.workspaceController);
		const viewportController = context.services.viewportController.create(workspace);
		const viewport = new ViewportApi(context.workspaceController, viewportController);
		const toolboxDataProvider = new ToolboxDataProvider(
			context.componentContext.iconProvider,
			context.i18n,
			context.configuration.toolbox
		);

		return new DesignerApi(
			ControlBarApi.create(context.state, context.historyController, context.stateModifier, viewport),
			new ToolboxApi(context.state, context, context.behaviorController, toolboxDataProvider, context.configuration.uidGenerator),
			new EditorApi(context.state, context.definitionWalker, context.stateModifier),
			workspace,
			viewport,
			new PathBarApi(context.state, context.definitionWalker),
			context.definitionWalker,
			context.i18n
		);
	}

	private constructor(
		public readonly controlBar: ControlBarApi,
		public readonly toolbox: ToolboxApi,
		public readonly editor: EditorApi,
		public readonly workspace: WorkspaceApi,
		public readonly viewport: ViewportApi,
		public readonly pathBar: PathBarApi,
		public readonly definitionWalker: DefinitionWalker,
		public readonly i18n: I18n
	) {}
}
