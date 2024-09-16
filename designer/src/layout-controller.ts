export class LayoutController {
	public constructor(private readonly placeholder: HTMLElement) {}

	public isMobile(): boolean {
		return this.placeholder.clientWidth < 400; // TODO
	}
}
