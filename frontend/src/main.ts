import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { createCustomElement } from '@angular/elements';
import { AppModule } from './app/app.module';
import { CitySearchComponent } from './app/city-search/city-search.component';

// Bootstrap the module and create custom element
platformBrowserDynamic().bootstrapModule(AppModule)
  .then((module) => {
    const injector = module.injector;
    const citySearchElement = createCustomElement(CitySearchComponent, { injector });
    customElements.define('city-search-element', citySearchElement);
  })
  .catch(err => console.error(err));
