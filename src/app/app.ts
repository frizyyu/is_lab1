import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TUI_DARK_MODE, TuiRoot } from '@taiga-ui/core';
import { Store } from '@ngrx/store';
import { rootActions } from '../state/actions/root.actions';

@Component({
  imports: [RouterModule, TuiRoot, TuiRoot],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App implements OnInit {
  protected readonly store$ = inject(Store);
  protected readonly darkMode = inject(TUI_DARK_MODE);

  public ngOnInit() {
    this.store$.dispatch(rootActions.applicationStart());
  }
}
