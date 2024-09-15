export function isElementAttached(element: HTMLElement, documentBody: Node): boolean {
	return !(documentBody.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_DISCONNECTED);
}
