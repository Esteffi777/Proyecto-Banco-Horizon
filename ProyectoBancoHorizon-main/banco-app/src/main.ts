import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appConfig } from './app/app.config';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
 .catch(err => console.log(err));
