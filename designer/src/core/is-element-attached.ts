export function isElementAttached(element: HTMLElement): boolean {
	return !(document.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_DISCONNECTED);
}
