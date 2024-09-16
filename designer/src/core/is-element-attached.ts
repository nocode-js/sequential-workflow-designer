export function isElementAttached(dom: Document | ShadowRoot, element: HTMLElement): boolean {
	return !(dom.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_DISCONNECTED);
}
