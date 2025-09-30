import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { Store } from '@ngrx/store';
import { routerActions } from '../../../state/actions/router.actions';
import { rootActions } from '../../../state/actions/root.actions';
import { groupActions } from '../../../state/actions/group.actions';
import { LoaderComponent } from '../loader.component/loader.component';
import { selectShowLoader } from '../../../state/selectors/root.selector';

@Component({
  selector: 'app-main-page.component',
  imports: [TuiButton, LoaderComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent {
  protected readonly store$ = inject(Store);
  protected readonly showLoader = this.store$.selectSignal(selectShowLoader);

  public onListOpenCick() {
    this.store$.dispatch(groupActions.load());
  }
}
