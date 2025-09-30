import { Component, inject } from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { groupActions } from '../../../state/actions/group.actions';
import { Store } from '@ngrx/store';
import { LoaderComponent } from '../loader.component/loader.component';
import { selectShowLoader } from '../../../state/selectors/root.selector';

@Component({
  selector: 'app-error-page',
  imports: [TuiCardLarge, LoaderComponent],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.less',
})
export class ErrorPageComponent {
  protected readonly store$ = inject(Store);
  protected readonly showLoader = this.store$.selectSignal(selectShowLoader);

  public reloadButtonClicked() {
    this.store$.dispatch(groupActions.load());
  }
}
