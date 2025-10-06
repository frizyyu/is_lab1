import { Route } from '@angular/router';
import { GroupListPageComponent } from '../islab/feat/group-list-page.component/group-list-page.component';
import { MainPageComponent } from '../islab/feat/main-page.component/main-page.component';
import { InfoPageComponent } from '../islab/feat/info-page.component/info-page.component';
import { ErrorPageComponent } from '../islab/feat/error-page.component/error-page.component';

export const appRoutes: Route[] = [
  { path: '', component: MainPageComponent },
  { path: 'groups', component: GroupListPageComponent },
  { path: 'stats', component: InfoPageComponent },
  { path: 'error', component: ErrorPageComponent },
];
