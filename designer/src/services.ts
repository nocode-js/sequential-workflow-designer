import { ControlBarExtension } from './control-bar/control-bar-extension';
import { DesignerExtension } from './designer-extension';
import { ContainerStepExtension } from './workspace/container-step/container-step-extension';
import { SwitchStepExtension } from './workspace/switch-step/switch-step-extension';
import { TaskStepExtension } from './workspace/task-step/task-step-extension';
import { ClassicWheelControllerExtension } from './workspace/view-port/classic-wheel-controller-extension';

export type Services = Required<DesignerExtension>;

export class ServicesResolver {
	public static resolve(extensions: DesignerExtension[] | undefined): Services {
		const services: Partial<Services> = {};
		if (extensions) {
			merge(services, extensions);
		}
		setDefault(services);
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
		if (ext.wheelController) {
			services.wheelController = ext.wheelController;
		}
	}
}

function setDefault(services: Partial<Services>) {
	services.steps = (services.steps || []).concat([new ContainerStepExtension(), new SwitchStepExtension(), new TaskStepExtension()]);
	services.uiComponents = (services.uiComponents || []).concat([new ControlBarExtension()]);
	if (!services.wheelController) {
		services.wheelController = new ClassicWheelControllerExtension();
	}
}
