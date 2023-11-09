<script lang="ts">
	import type { StepEditorContext, Definition, Step } from 'sequential-workflow-designer';

	export let context: StepEditorContext;
	export let definition: Definition;
	export let step: Step;
	export let isReadonly: boolean;

	let name = step.name;
	let comment = step.properties.comment;

	$: {
		console.log('Changed', { definition, name, comment });
	}

	function onNameChanged(event: Event) {
		name = (event.target as HTMLInputElement).value;
		step.name = name;
		context.notifyNameChanged();
	}

	function onCommentChanged(event: Event) {
		comment = (event.target as HTMLInputElement).value;
		step.properties.comment = comment;
		context.notifyPropertiesChanged();
	}
</script>

<h2>Step Editor {step.type}</h2>

<h3>Name</h3>

<input value={name} readonly={isReadonly} on:input={onNameChanged} />

<h3>Comment</h3>

<input value={comment} readonly={isReadonly} on:input={onCommentChanged} />
