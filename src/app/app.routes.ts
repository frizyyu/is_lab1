import { Route } from '@angular/router';
import { GroupListPageComponent } from '../islab/feat/group-list-page.component/group-list-page.component';
import { MainPageComponent } from '../islab/feat/main-page.component/main-page.component';

export const appRoutes: Route[] = [
  {path: '', component: MainPageComponent},
  {path: 'groups', component: GroupListPageComponent},
];
