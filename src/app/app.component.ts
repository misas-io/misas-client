/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AppState } from './app.service';
import { LoadingBar } from './services/loading-bar';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
<mdl-layout mdl-layout-fixed-header mdl-layout-header-seamed>
    <mdl-layout-header mdl-shadow="2">
      <mdl-layout-header-row>
        <mdl-layout-title [routerLink]=" ['./'] "><div><img src="/assets/img/church-119x75.png" alt="church" style="max-height: 50px;"></div></mdl-layout-title>
        <mdl-layout-spacer></mdl-layout-spacer>
        <!-- Navigation. We hide it in small screens. -->
        <mdl-textfield type="text" [(ngModel)]="text6" icon="search"></mdl-textfield>
        <nav class="mdl-navigation mdl-layout--large-screen-only">
          <!--
          <a class="mdl-navigation__link" [routerLink]=" ['./misas'] ">
            MISAS
          </a>
          <a class="mdl-navigation__link" [routerLink]=" ['./confesiones'] ">
            CONFESIONES
          </a>
          <a class="mdl-navigation__link" [routerLink]=" ['./parroquias'] ">
            PARROQUIAS
          </a>
          <button mdl-button mdl-button-type="raised" mdl-ripple mdl-colored="accent">
            QUIERO IR A MISA
          </button>
          -->
        </nav>
      </mdl-layout-header-row>
    </mdl-layout-header>
    <mdl-layout-drawer>
      <mdl-layout-title></mdl-layout-title>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" [routerLink]=" ['./'] ">
          MISAS
        </a>
        <a class="mdl-navigation__link" [routerLink]=" ['./'] ">
          CONFESIONES
        </a>
        <a class="mdl-navigation__link" [routerLink]=" ['./'] ">
          PARROQUIAS
        </a>
        <a class="mdl-navigation__link" [routerLink]=" ['./'] ">
          ACERCA DE
        </a>
        <a class="mdl-navigation__link" [routerLink]=" ['./home'] ">
          HOME
        </a>
        <a class="mdl-navigation__link" [routerLink]=" ['./detail'] ">
          DETAIL
        </a>
        <a class="mdl-navigation__link" [routerLink]=" ['./about'] ">
          ABOUT
        </a>
      </nav>
    </mdl-layout-drawer>
    <mdl-layout-content>
      <mdl-progress *ngIf="loadingBar.loading" [indeterminate]="loadingBar.loading" style="width: 100%;"></mdl-progress>
      <!-- Your content goes here -->
      <main>
        <router-outlet class='contentfilterinator-container'></router-outlet>
      </main>


      <footer class="mdl-mini-footer">
        <div class="mdl-mini-footer__left-section">
          <div class="mdl-logo">Misas.io</div>
          <ul class="mdl-mini-footer__link-list">
            <li><a href="#">Help</a></li>
            <li><a href="#">Privacy & Terms</a></li>
            <li>Misas.io &copy; {{ copyYear }}</li>
          </ul>
        </div>
      </footer>
    </mdl-layout-content>
  </mdl-layout>
  `
})
export class AppComponent implements OnInit {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';
  copyYear: number;
  constructor(public appState: AppState, public loadingBar: LoadingBar) {}

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
    this.copyYear = new Date().getFullYear();
  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
