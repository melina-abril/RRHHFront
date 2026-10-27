import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.ts';
import { appConfig } from './app/app.config.ts';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
