import { DefaultDraggedComponentExtension } from './behaviors/default-dragged-component-extension';
import { ControlBarExtension } from './control-bar/control-bar-extension';
import { DesignerConfiguration, KeyboardConfiguration } from './designer-configuration';
import { DesignerExtension } from './designer-extension';
import { KeyboardDaemonExtension } from './keyboard/keyboard-daemon-extension';
import { SmartEditorExtension } from './smart-editor/smart-editor-extension';
import { ToolboxExtension } from './toolbox/toolbox-extension';
import { ValidationErrorBadgeExtension } from './workspace/badges/validation-error/validation-error-badge-extension';
import { ContainerStepExtension } from './workspace/container-step/container-step-extension';
import { DefaultPlaceholderControllerExtension } from './workspace/placeholder/default-placeholder-controller-extension';
import { RectPlaceholderExtension } from './workspace/placeholder/rect-placeholder-extension';
import { StartStopRootComponentExtension } from './workspace/start-stop-root/start-stop-root-component-extension';
import { SwitchStepExtension } from './workspace/switch-step/switch-step-extension';
import { TaskStepExtension } from './workspace/task-step/task-step-extension';
import { ClassicWheelControllerExtension } from './workspace/viewport/classic-wheel-controller-extension';
import { DefaultViewportControllerExtension } from './workspace/viewport/default-viewport-controller-extension';
import { findValidationBadgeIndex } from './workspace/badges/find-validation-badge-index';
import { DefaultSequenceComponentExtension } from './workspace/sequence/default-sequence-component-extension';
import { DefaultStepComponentViewWrapperExtension } from './workspace/default-step-component-view-wrapper-extension';
import { LineGridExtension } from './workspace/grid/line-grid-extension';

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
		if (ext.stepComponentViewWrapper) {
			services.stepComponentViewWrapper = ext.stepComponentViewWrapper;
		}
		if (ext.badges) {
			services.badges = (services.badges || []).concat(ext.badges);
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
		if (ext.placeholder) {
			services.placeholder = ext.placeholder;
		}
		if (ext.viewportController) {
			services.viewportController = ext.viewportController;
		}
		if (ext.grid) {
			services.grid = ext.grid;
		}
		if (ext.rootComponent) {
			services.rootComponent = ext.rootComponent;
		}
		if (ext.sequenceComponent) {
			services.sequenceComponent = ext.sequenceComponent;
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
	services.steps.push(ContainerStepExtension.create());
	services.steps.push(SwitchStepExtension.create());
	services.steps.push(TaskStepExtension.create());

	if (!services.stepComponentViewWrapper) {
		services.stepComponentViewWrapper = new DefaultStepComponentViewWrapperExtension();
	}

	if (!services.badges) {
		services.badges = [];
	}
	if (findValidationBadgeIndex(services.badges) < 0) {
		services.badges.push(ValidationErrorBadgeExtension.create());
	}

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
		services.uiComponents.push(new ToolboxExtension());
	}

	if (!services.wheelController) {
		services.wheelController = new ClassicWheelControllerExtension();
	}
	if (!services.placeholderController) {
		services.placeholderController = new DefaultPlaceholderControllerExtension();
	}
	if (!services.placeholder) {
		services.placeholder = RectPlaceholderExtension.create();
	}
	if (!services.viewportController) {
		services.viewportController = new DefaultViewportControllerExtension();
	}
	if (!services.grid) {
		services.grid = LineGridExtension.create();
	}
	if (!services.rootComponent) {
		services.rootComponent = new StartStopRootComponentExtension();
	}
	if (!services.sequenceComponent) {
		services.sequenceComponent = new DefaultSequenceComponentExtension();
	}

	if (!services.daemons) {
		services.daemons = [];
	}
	if (configuration.keyboard === undefined || configuration.keyboard) {
		services.daemons.push(KeyboardDaemonExtension.create(configuration.keyboard as true | undefined | KeyboardConfiguration));
	}
}
