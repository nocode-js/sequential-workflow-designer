import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

window.addEventListener(
	'load',
	() => {
		platformBrowserDynamic()
			.bootstrapModule(AppModule)
			.catch(err => console.error(err));
	},
	false
);
