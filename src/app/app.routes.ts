import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ViewEcosystem } from './view-ecosystem/view-ecosystem';
import { ViewPackage } from './view-package/view-package';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Package List - End-of-Life Report',
  },
  {
    path: ':ecosystem',
    component: ViewEcosystem,
    title: 'Ecosystem Packages',
  },
  {
    path: ':ecosystem/:package',
    component: ViewPackage,
    title: 'Package Details',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
