import { Context, createContext, useContext, useState } from 'react';
import { StepEditorContext, PropertyValue, Step } from 'sequential-workflow-designer';

declare global {
	interface Window {
		sqdStepEditorContext?: Context<StepEditorWrapper<Step> | null>;
	}
}

if (!window.sqdStepEditorContext) {
	window.sqdStepEditorContext = createContext<StepEditorWrapper<Step> | null>(null);
}
const stepEditorContext = window.sqdStepEditorContext;

export interface StepEditorWrapper<TStep extends Step> {
	readonly id: string;
	readonly type: TStep['type'];
	readonly componentType: TStep['componentType'];
	readonly name: string;
	readonly properties: TStep['properties'];
	readonly step: TStep;

	setName(name: string): void;
	setProperty(name: keyof TStep['properties'], value: TStep['properties'][typeof name]): void;
	notifyPropertiesChanged(): void;
	notifyChildrenChanged(): void;
}

export function useStepEditor<TStep extends Step = Step>(): StepEditorWrapper<TStep> {
	const wrapper = useContext(stepEditorContext);
	if (!wrapper) {
		throw new Error('Cannot find step editor context');
	}
	return wrapper as unknown as StepEditorWrapper<TStep>;
}

export function StepEditorWrapperContext(props: { children: JSX.Element; step: Step; context: StepEditorContext }) {
	const [wrapper, setWrapper] = useState(() => createWrapper());

	function createWrapper(): StepEditorWrapper<Step> {
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

	return <stepEditorContext.Provider value={wrapper}>{props.children}</stepEditorContext.Provider>;
}
