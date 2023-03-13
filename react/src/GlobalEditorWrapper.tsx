import { Context, createContext, useContext, useState } from 'react';
import { Definition, GlobalEditorContext, Properties, PropertyValue } from 'sequential-workflow-designer';

declare global {
	interface Window {
		sqdGlobalEditorContext?: Context<GlobalEditorWrapper<Definition> | null>;
	}
}

if (!window.sqdGlobalEditorContext) {
	window.sqdGlobalEditorContext = createContext<GlobalEditorWrapper<Definition> | null>(null);
}
const globalEditorContext = window.sqdGlobalEditorContext;

export interface GlobalEditorWrapper<TDefinition extends Definition> {
	readonly properties: TDefinition['properties'];

	setProperty(name: keyof TDefinition['properties'], value: TDefinition['properties'][typeof name]): void;
}

export function useGlobalEditor<TDefinition extends Definition = Definition>(): GlobalEditorWrapper<TDefinition> {
	const wrapper = useContext(globalEditorContext);
	if (!wrapper) {
		throw new Error('Cannot find global editor context');
	}
	return wrapper as unknown as GlobalEditorWrapper<TDefinition>;
}

export function GlobalEditorWrapperContext(props: { children: JSX.Element; definition: Definition; context: GlobalEditorContext }) {
	const [wrapper, setWrapper] = useState(() => createWrapper());

	function createWrapper() {
		return {
			properties: props.definition.properties as Properties,
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

	return <globalEditorContext.Provider value={wrapper}>{props.children}</globalEditorContext.Provider>;
}
