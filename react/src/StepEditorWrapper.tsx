import { createContext, useContext, useState } from 'react';
import { ComponentType, Properties, PropertyValue, Step, StepEditorContext } from 'sequential-workflow-designer';

export interface StepEditorWrapper {
	readonly id: string;
	readonly type: string;
	readonly componentType: ComponentType;
	readonly name: string;
	readonly properties: Properties;
	readonly step: Step;

	setName(name: string): void;
	setProperty(name: string, value: PropertyValue): void;
	notifyPropertiesChanged(): void;
	notifyChildrenChanged(): void;
}

const globalEditorWrapperContext = createContext<StepEditorWrapper | null>(null);

export function useStepEditor(): StepEditorWrapper {
	const wrapper = useContext(globalEditorWrapperContext);
	if (!wrapper) {
		throw new Error('Cannot find step editor context');
	}
	return wrapper;
}

export function StepEditorWrapperContext(props: { children: JSX.Element; step: Step; context: StepEditorContext }) {
	const [wrapper, setWrapper] = useState(() => createWrapper());

	function createWrapper(): StepEditorWrapper {
		return {
			id: props.step.id,
			type: props.step.type,
			componentType: props.step.componentType,
			name: props.step.name,
			properties: props.step.properties,
			step: props.step,
			setName,
			setProperty,
			notifyPropertiesChanged,
			notifyChildrenChanged
		};
	}

	function forward() {
		setWrapper(createWrapper());
	}

	function setName(name: string) {
		props.step.name = name;
		notifyNameChanged();
	}

	function setProperty(name: string, value: PropertyValue) {
		props.step.properties[name] = value;
		notifyPropertiesChanged();
	}

	function notifyNameChanged() {
		props.context.notifyNameChanged();
		forward();
	}

	function notifyPropertiesChanged() {
		props.context.notifyPropertiesChanged();
		forward();
	}

	function notifyChildrenChanged() {
		props.context.notifyChildrenChanged();
		forward();
	}

	return <globalEditorWrapperContext.Provider value={wrapper}>{props.children}</globalEditorWrapperContext.Provider>;
}
