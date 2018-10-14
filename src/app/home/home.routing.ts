import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';

export const HomeRoutes: Routes = [
  {
    path: '',
    data: {
      title: 'Home',
      urls: [{title: 'Home', url: '/'}, {title: 'Home'}]
    },
    component: HomeComponent,
    children: [
    {
      path: 'home',
      component: HomeComponent,
      data: {
        title: 'Home',
        urls: [{title: 'Home', url: '/home'}, {title: 'Home'}]
      }
    }]
  }
];
