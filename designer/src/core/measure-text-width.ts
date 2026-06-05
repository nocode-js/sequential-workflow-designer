export function measureTextWidth(text: SVGTextElement): number {
	return text.getBBox().width;
}
