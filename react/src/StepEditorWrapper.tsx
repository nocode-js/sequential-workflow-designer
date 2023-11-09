import { Context, createContext, useContext, useState, ReactNode } from 'react';
import { StepEditorContext, PropertyValue, Step, Definition } from 'sequential-workflow-designer';

declare global {
	interface Window {
		sqdStepEditorContext?: Context<StepEditorWrapper | null>;
	}
}

if (!window.sqdStepEditorContext) {
	window.sqdStepEditorContext = createContext<StepEditorWrapper | null>(null);
}
const stepEditorContext = window.sqdStepEditorContext;

export interface StepEditorWrapper<TStep extends Step = Step, TDefinition extends Definition = Definition> {
	readonly id: string;
	readonly type: TStep['type'];
	readonly componentType: TStep['componentType'];
	readonly name: string;
	readonly properties: TStep['properties'];
	readonly step: TStep;
	readonly definition: TDefinition;
	readonly isReadonly: boolean;

	setName(name: string): void;
	setProperty(name: keyof TStep['properties'], value: TStep['properties'][typeof name]): void;
	notifyPropertiesChanged(): void;
	notifyChildrenChanged(): void;
}

export function useStepEditor<TStep extends Step = Step, TDefinition extends Definition = Definition>(): StepEditorWrapper<
	TStep,
	TDefinition
> {
	const wrapper = useContext(stepEditorContext);
	if (!wrapper) {
		throw new Error('Cannot find step editor context');
	}
	return wrapper as unknown as StepEditorWrapper<TStep, TDefinition>;
}

export interface StepEditorWrapperContextProps {
	children: ReactNode;
	step: Step;
	definition: Definition;
	context: StepEditorContext;
	isReadonly: boolean;
}

export function StepEditorWrapperContext(props: StepEditorWrapperContextProps) {
	const [wrapper, setWrapper] = useState(() => createWrapper());

	function createWrapper(): StepEditorWrapper {
		return {
			id: props.step.id,
			type: props.step.type,
			componentType: props.step.componentType,
			name: props.step.name,
			properties: props.step.properties,
			step: props.step,
			definition: props.definition,
			isReadonly: props.isReadonly,
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
