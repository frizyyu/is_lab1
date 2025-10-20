import { Component, inject } from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { Store } from '@ngrx/store';
import { selectShowLoader } from '../../../state/selectors/root.selector';
import { routerActions } from '../../../state/actions/router.actions';

@Component({
  selector: 'app-error-page',
  imports: [TuiCardLarge],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.less',
})
export class ErrorPageComponent {
  protected readonly store$ = inject(Store);
  protected readonly showLoader = this.store$.selectSignal(selectShowLoader);

  public backButtonClicked() {
    this.store$.dispatch(routerActions.navigateBack());
  }
}
