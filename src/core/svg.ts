
export interface Attributes {
	[name: string]: any;
}

export class Svg {

	public static element<K extends keyof SVGElementTagNameMap>(name: K, attributes?: Attributes)
			: SVGElementTagNameMap[K] {
		const element = document.createElementNS('http://www.w3.org/2000/svg', name);
		if (attributes) {
			Svg.attrs(element, attributes);
		}
		return element;
	}

	public static attrs(element: Element, attributes: Attributes) {
		Object.keys(attributes).forEach(name => {
			const value = attributes[name];
			element.setAttribute(name, value.toString());
		});
	}

	public static translate(element: Element, x: number, y: number) {
		element.setAttribute('transform', `translate(${x}, ${y})`);
	}
}
