import { TaskStep, Branches, SwitchStep, Step, StepType, Sequence } from './definition';
import { Designer } from './designer';

function createSequence(nodes: Step[]): Sequence {
	return { steps: nodes };
}

function createTask(name: string): TaskStep {
	return { type: StepType.task, name };
}

function createSwitch(name: string, branches: Branches): SwitchStep {
	return { type: StepType.switch, name,  branches };
}

const sequence: Sequence = createSequence([
	createTask('alfa'),
	createTask('beta'),
	createSwitch('if', {
		'true': createSequence([
			createTask('gamma'),
			createTask('111'),
			createSwitch('if2', {
				'alfa': createSequence([
					// createTask('xxxx')
				]),
				'beta': createSequence([
					createTask('222'),
					createTask('333'),
				])
			})
		]),
		'false': createSequence([
			createTask('444'),
			createTask('555'),
			createSwitch('if2', {
				'alfa': createSequence([
					createTask('666')
				]),
				'beta': createSequence([
					createTask('777'),
					createTask('888'),
				])
			}),
			createTask('999')
		])
	})
]);

window.addEventListener('load', () => {
	Designer.append(document.getElementById('example') as HTMLElement, sequence);
});
