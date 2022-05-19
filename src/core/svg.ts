
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

	public static centralText(attributes?: Attributes): SVGTextElement {
		return Svg.element('text', Object.assign(attributes || {}, {
			'text-anchor': 'middle',
			'style': 'dominant-baseline: central'
		}))
	}

	public static attrs(element: Element, attributes: Attributes) {
		Object.keys(attributes).forEach(name => {
			const value = attributes[name];
			element.setAttribute(name, value.toString());
		});
	}

	public static isChildOf(parent: SVGElement, child: SVGElement): boolean {
		let current: Node | null = child;
		do {
			if (current === parent) {
				return true;
			}
			current = current.parentNode;
		} while (current);
		return false;
	}
}
