import { Designer } from './designer';

declare global {
	interface Window {
		sequentialWorkflowDesigner: typeof Designer;
	}
}

window.sequentialWorkflowDesigner = Designer;
