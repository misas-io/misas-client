import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { HttpModule } from '@angular/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { MdlModule } from 'angular2-mdl';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { ApolloModule } from 'apollo-angular';
import { ResponsiveModule, ResponsiveConfig, ResponsiveConfigInterface } from 'ng2-responsive';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { getClient } from './app.client';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { XLarge } from './home/x-large';

import { LoadingBar } from './services/loading-bar';
import { SearchComponent } from './search';
import { MapComponent } from './map';
import { ListComponent } from './list';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { LocaleDate } from './pipes/locale.date';

import '../styles/styles.scss';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

let config: ResponsiveConfigInterface = {
  breakPoints: {
    xs: {max: 509},
    sm: {min: 510, max: 869},
    md: {min: 870, max: 1279},
    lg: {min: 1280, max: 1919},
    xl: {min: 1920}
  },
  debounceTime: 100 // allow to debounce checking timer
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    NoContentComponent,
    XLarge,
    SearchComponent,
    MapComponent,
    ListComponent,
    LocaleDate,
  ],
  imports: [ // import Angular's modules
    ApolloModule.withClient(getClient),
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    ResponsiveModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    AgmCoreModule.forRoot({
      apiKey: process.env.GOOGLE_API_KEY 
    }),
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    {provide: ResponsiveConfig, useFactory: () => new ResponsiveConfig(config) },
    LoadingBar,
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}

