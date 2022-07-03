export interface Attributes {
	[name: string]: string | number;
}

export class Dom {
	public static svg<K extends keyof SVGElementTagNameMap>(name: K, attributes?: Attributes): SVGElementTagNameMap[K] {
		const element = document.createElementNS('http://www.w3.org/2000/svg', name);
		if (attributes) {
			Dom.attrs(element, attributes);
		}
		return element;
	}

	public static translate(element: SVGElement, x: number, y: number) {
		element.setAttribute('transform', `translate(${x}, ${y})`);
	}

	public static attrs(element: Element, attributes: Attributes) {
		Object.keys(attributes).forEach(name => {
			const value = attributes[name];
			element.setAttribute(name, typeof value === 'string' ? value : value.toString());
		});
	}

	public static element<T extends keyof HTMLElementTagNameMap>(name: T, attributes?: Attributes): HTMLElementTagNameMap[T] {
		const element = document.createElement(name);
		if (attributes) {
			Dom.attrs(element, attributes);
		}
		return element;
	}

	public static toggleClass(element: Element, isEnabled: boolean, className: string) {
		if (isEnabled) {
			element.classList.add(className);
		} else {
			element.classList.remove(className);
		}
	}
}
