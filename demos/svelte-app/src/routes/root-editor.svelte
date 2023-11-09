<script lang="ts">
	import type { RootEditorContext, Definition } from 'sequential-workflow-designer';

	export let context: RootEditorContext;
	export let definition: Definition;
	export let isReadonly: boolean;

	let velocity = definition.properties.velocity;

	$: {
		console.log('Changed', { velocity });
	}

	function onVelocityChanged(event: Event) {
		velocity = parseInt((event.target as HTMLInputElement).value);
		definition.properties.velocity = velocity;
		context.notifyPropertiesChanged();
	}
</script>

<h2>Root Editor</h2>

<h3>Velocity</h3>

<input type="number" value={String(velocity)} readonly={isReadonly} on:input={onVelocityChanged} />
