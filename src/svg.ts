
export interface Attributes {
	[name: string]: any;
}

export function createSvgElement<K extends keyof SVGElementTagNameMap>(
	name: K,
	attributes?: Attributes): SVGElementTagNameMap[K] {
	const element = document.createElementNS('http://www.w3.org/2000/svg', name);
	if (attributes) {
		setAttrs(element, attributes);
	}
	return element;
}

export function createSvgCenteredText(attributes?: Attributes): SVGTextElement {
	return createSvgElement('text', Object.assign(attributes || {}, {
		'text-anchor': 'middle',
		'style': 'dominant-baseline: central'
	}))
}

export function setAttrs(element: Element, attributes: Attributes) {
	Object.keys(attributes).forEach(name => {
		const value = attributes[name];
		element.setAttribute(name, value.toString());
	});
}
