import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home';
import { AboutComponent } from './components/about';
import { PrivacyAndTermsComponent } from './components/privacy-and-terms';
import { NoContentComponent } from './components/no-content';
import { GrpDetailComponent } from './components/grp-detail';
import { DataResolver } from './components/app.resolver';


export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'parroquia/:id', component: GrpDetailComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'privacy-and-terms', component: PrivacyAndTermsComponent },
  { path: '**',    component: NoContentComponent },
];
