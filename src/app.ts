import { Designer } from './designer';
import { TaskStep, Branches, SwitchStep, Step, StepType, Sequence } from './definition';

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
	createTask('lorem'),
	createTask('ipsum'),
	createSwitch('if', {
		'true': createSequence([
			createTask('hihiih'),
			createTask('hihiih'),
			createSwitch('if2', {
				'alfa': createSequence([
					// createTask('xxxx')
				]),
				'beta': createSequence([
					createTask('hihiih'),
					createTask('hihiih'),
				])
			})
		]),
		'false': createSequence([
			createTask('huehue'),
			createTask('hihiih'),
			createSwitch('if2', {
				'alfa': createSequence([
					createTask('xxxx')
				]),
				'beta': createSequence([
					//createTask('hihiih'),
					createTask('hihiih'),
				])
			}),
			createTask('hihiih')
		])
	})
]);

window.addEventListener('load', () => {
	Designer.create(document.getElementById('example') as HTMLElement, sequence);
});
