export function RootEditor() {
	return (
		<>
			<h2>🔴 Save Required Editor Demo</h2>

			<p>
				This demo shows how to implement an editor that requires saving changes before they’re applied to the workflow definition.
			</p>

			<p>
				It also demonstrates how to prevent users from navigating away from the editor when there are unsaved changes. To test this
				feature, edit the name of any step and then try to unselect that step on the canvas.
			</p>
		</>
	);
}
