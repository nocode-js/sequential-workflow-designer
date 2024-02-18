import { Context, createContext, useContext, useState, ReactNode } from 'react';
import { Definition, RootEditorContext, PropertyValue } from 'sequential-workflow-designer';

declare global {
	interface Window {
		sqdRootEditorContext?: Context<RootEditorWrapper<Definition> | null>;
	}
}

if (!window.sqdRootEditorContext) {
	window.sqdRootEditorContext = createContext<RootEditorWrapper<Definition> | null>(null);
}
const rootEditorContext = window.sqdRootEditorContext;

export interface RootEditorWrapper<TDefinition extends Definition> {
	readonly properties: TDefinition['properties'];
	readonly definition: TDefinition;
	readonly isReadonly: boolean;

	setProperty(name: keyof TDefinition['properties'], value: TDefinition['properties'][typeof name]): void;
}

export function useRootEditor<TDefinition extends Definition = Definition>(): RootEditorWrapper<TDefinition> {
	const wrapper = useContext(rootEditorContext);
	if (!wrapper) {
		throw new Error('Cannot find root editor context');
	}
	return wrapper as unknown as RootEditorWrapper<TDefinition>;
}

export interface RootEditorWrapperContextProps {
	children: ReactNode;
	definition: Definition;
	context: RootEditorContext;
	isReadonly: boolean;
}

export function RootEditorWrapperContext(props: RootEditorWrapperContextProps) {
	const [wrapper, setWrapper] = useState(() => createWrapper());

	function createWrapper() {
		return {
			properties: props.definition.properties,
			definition: props.definition,
			isReadonly: props.isReadonly,
			setProperty
		};
	}

	function forward() {
		setWrapper(createWrapper());
	}

	function setProperty(name: string, value: PropertyValue) {
		props.definition.properties[name] = value;
		props.context.notifyPropertiesChanged();
		forward();
	}

	return <rootEditorContext.Provider value={wrapper}>{props.children}</rootEditorContext.Provider>;
}
