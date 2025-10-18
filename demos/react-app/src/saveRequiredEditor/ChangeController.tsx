import { useEffect, useState } from 'react';
import { SimpleEvent } from 'sequential-workflow-designer';

export class ChangeController {
	public readonly onIsChangedChanged = new SimpleEvent<boolean>();
	public isChanged = false;

	public set(isChanged: boolean) {
		if (this.isChanged !== isChanged) {
			this.isChanged = isChanged;
			this.onIsChangedChanged.forward(isChanged);
		}
	}
}

export interface ChangeControllerWrapper {
	controller: ChangeController;
	isChanged: boolean;
}

export function useChangeControllerWrapper(controller: ChangeController): ChangeControllerWrapper {
	const [wrapper, setWrapper] = useState(() => ({
		controller,
		isChanged: controller.isChanged
	}));

	useEffect(() => {
		function onIsDirtyChanged(isChanged: boolean) {
			setWrapper({
				...wrapper,
				isChanged
			});
		}

		wrapper.controller.onIsChangedChanged.subscribe(onIsDirtyChanged);
		return () => {
			wrapper.controller.onIsChangedChanged.unsubscribe(onIsDirtyChanged);
		};
	}, [wrapper]);

	return wrapper;
}
