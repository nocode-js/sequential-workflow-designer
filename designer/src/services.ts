import { DefaultDraggedComponentExtension } from './behaviors/default-dragged-component-extension';
import { ControlBarExtension } from './control-bar/control-bar-extension';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerExtension } from './designer-extension';
import { KeyboardDaemonExtension } from './keyboard/keyboard-daemon-extension';
import { SmartEditorExtension } from './smart-editor/smart-editor-extension';
import { ToolboxExtension } from './toolbox/toolbox-extension';
import { ContainerStepExtension } from './workspace/container-step/container-step-extension';
import { DefaultPlaceholderControllerExtension } from './workspace/placeholder/default-placeholder-controller-extension';
import { StartStopRootComponentExtension } from './workspace/start-stop-root/start-stop-root-component-extension';
import { SwitchStepExtension } from './workspace/switch-step/switch-step-extension';
import { TaskStepExtension } from './workspace/task-step/task-step-extension';
import { ClassicWheelControllerExtension } from './workspace/view-port/classic-wheel-controller-extension';
import { DefaultViewPortControllerExtension } from './workspace/view-port/default-view-port-controller-extension';

export type Services = Required<DesignerExtension>;

export class ServicesResolver {
	public static resolve(extensions: DesignerExtension[] | undefined, configuration: DesignerConfiguration): Services {
		const services: Partial<Services> = {};
		merge(services, extensions || []);
		setDefault(services, configuration);
		return services as Services;
	}
}

function merge(services: Partial<Services>, extensions: DesignerExtension[]) {
	for (const ext of extensions) {
		if (ext.steps) {
			services.steps = (services.steps || []).concat(ext.steps);
		}
		if (ext.uiComponents) {
			services.uiComponents = (services.uiComponents || []).concat(ext.uiComponents);
		}
		if (ext.draggedComponent) {
			services.draggedComponent = ext.draggedComponent;
		}
		if (ext.wheelController) {
			services.wheelController = ext.wheelController;
		}
		if (ext.placeholderController) {
			services.placeholderController = ext.placeholderController;
		}
		if (ext.viewPortController) {
			services.viewPortController = ext.viewPortController;
		}
		if (ext.rootComponent) {
			services.rootComponent = ext.rootComponent;
		}
		if (ext.daemons) {
			services.daemons = (services.daemons || []).concat(ext.daemons);
		}
	}
}

function setDefault(services: Partial<Services>, configuration: DesignerConfiguration) {
	if (!services.steps) {
		services.steps = [];
	}
	services.steps.push(new ContainerStepExtension());
	services.steps.push(new SwitchStepExtension());
	services.steps.push(new TaskStepExtension());

	if (!services.draggedComponent) {
		services.draggedComponent = new DefaultDraggedComponentExtension();
	}

	if (!services.uiComponents) {
		services.uiComponents = [];
	}
	if (configuration.controlBar) {
		services.uiComponents.push(new ControlBarExtension());
	}
	if (configuration.editors) {
		services.uiComponents.push(new SmartEditorExtension(configuration.editors));
	}
	if (configuration.toolbox) {
		services.uiComponents.push(new ToolboxExtension(configuration.toolbox));
	}

	if (!services.wheelController) {
		services.wheelController = new ClassicWheelControllerExtension();
	}
	if (!services.placeholderController) {
		services.placeholderController = new DefaultPlaceholderControllerExtension();
	}
	if (!services.viewPortController) {
		services.viewPortController = new DefaultViewPortControllerExtension();
	}
	if (!services.rootComponent) {
		services.rootComponent = new StartStopRootComponentExtension();
	}

	if (!services.daemons) {
		services.daemons = [];
	}
	services.daemons.push(new KeyboardDaemonExtension());
}
