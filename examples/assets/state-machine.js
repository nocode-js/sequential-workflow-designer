/* global setTimeout */

function uid() {
	return Math.ceil(Math.random() * 10 ** 16).toString(16);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class StateMachine {
	isInterrupted = false;

	constructor(definition, speed, handler) {
		this.definition = definition;
		this.speed = speed;
		this.handler = handler;
		this.data = {};
		this.callstack = [
			{
				sequence: this.definition.sequence,
				index: 0,
				unwind: null
			}
		];
		this.isRunning = false;
	}

	executeStep(step) {
		this.handler.executeStep(step, this.data);
	}

	unwindStack() {
		this.callstack.pop();
	}

	executeIfStep(step) {
		const value = this.handler.executeIf(step, this.data);
		const branchName = value ? 'true' : 'false';

		this.callstack.push({
			sequence: step.branches[branchName],
			index: 0,
			unwind: this.unwindStack.bind(this)
		});
	}

	executeLoopStep(step) {
		this.handler.initLoopStep(step, this.data);

		const program = {
			sequence: step.sequence,
			index: 0,
			unwind: () => {
				if (this.handler.canReplyLoopStep(step, this.data)) {
					program.index = 0;
				} else {
					this.unwindStack();
				}
			}
		};
		this.callstack.push(program);
	}

	execute() {
		if (this.isInterrupted) {
			this.handler.onInterrupted();
			return;
		}

		const depth = this.callstack.length - 1;
		const program = this.callstack[depth];

		if (program.sequence.length === program.index) {
			if (depth > 0) {
				program.unwind();
				this.execute();
			} else {
				this.isRunning = false;
				this.handler?.onFinished(this.data);
			}
			return;
		}

		const step = program.sequence[program.index];
		program.index++;

		if (this.handler.beforeStepExecution) {
			this.handler.beforeStepExecution(step, this.data);
		}

		switch (step.type) {
			case 'if':
				this.executeIfStep(step);
				break;
			case 'loop':
				this.executeLoopStep(step);
				break;
			default:
				this.executeStep(step);
				break;
		}

		if (this.handler.onStepExecuted) {
			this.handler.onStepExecuted(step, this.data);
		}
		setTimeout(this.execute.bind(this), this.speed);
	}

	start() {
		if (this.isRunning) {
			throw new Error('Already running');
		}
		this.isRunning = true;
		this.callstack[0].index = 0;
		this.execute();
	}

	interrupt() {
		if (!this.isRunning) {
			throw new Error('Not running');
		}
		this.isInterrupted = true;
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class StateMachineSteps {
	static createIfStep(name, properties, trueSteps, falseSteps) {
		return {
			id: uid(),
			componentType: 'switch',
			type: 'if',
			name,
			branches: {
				true: trueSteps || [],
				false: falseSteps || []
			},
			properties
		};
	}

	static createLoopStep(name, properties, steps) {
		return {
			id: uid(),
			componentType: 'container',
			type: 'loop',
			name,
			sequence: steps || [],
			properties
		};
	}

	static createTaskStep(name, type, properties) {
		return {
			id: uid(),
			componentType: 'task',
			type,
			name,
			properties
		};
	}
}
