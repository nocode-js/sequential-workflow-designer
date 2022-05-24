import { Designer } from './designer';

declare global {
	interface Window {
		sequentialWorkflowDesigner: Designer;
	}
}

window.sequentialWorkflowDesigner = Designer;
