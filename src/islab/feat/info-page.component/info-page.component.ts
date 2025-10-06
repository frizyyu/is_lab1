import { Component, computed, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectGroups, selectStats } from '../../../state/selectors/group.selector';
import { TuiButton, TuiTextfieldComponent } from '@taiga-ui/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TuiChevron, TuiInputInline, TuiNativeSelect } from '@taiga-ui/kit';
import { groupActions } from '../../../state/actions/group.actions';
import { isInteger } from '../../utils/validator';
import { TuiForm } from '@taiga-ui/layout';
import { TableComponent } from './table.component/table.component';
import { debounceTime, distinctUntilChanged, filter, map, Subject, takeUntil } from 'rxjs';
import { routerActions } from '../../../state/actions/router.actions';

@Component({
  selector: 'app-info-page.component',
  imports: [
    TuiButton,
    ReactiveFormsModule,
    TuiChevron,
    TuiNativeSelect,
    TuiTextfieldComponent,
    TuiInputInline,
    TuiForm,
    TableComponent,
  ],
  templateUrl: './info-page.component.html',
  styleUrl: './info-page.component.less',
})
export class InfoPageComponent implements AfterViewInit, OnDestroy {
  protected readonly store$ = inject(Store);
  protected readonly destroy$ = new Subject<void>();
  protected readonly stats = this.store$.selectSignal(selectStats);
  protected readonly group = this.store$.selectSignal(selectGroups);
  protected readonly groupIds = computed(() => this.group().map((g) => g.id));
  protected readonly fb = inject(FormBuilder);
  protected readonly form = this.fb.group({
    groupIds: this.fb.control<number>(0, { validators: [isInteger] }),
    groupNum: this.fb.control<number>(0, { validators: [isInteger] }),
    num: this.fb.control<number>(0, { validators: [isInteger] }),
  });

  public ngAfterViewInit() {
    this.form
      .get('num')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((v) => (typeof v === 'string' ? Number(v) : v)),
        filter((v) => !Number.isNaN(v)),
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        this.store$.dispatch(groupActions.groupsSortedByAdminRequired({ min: value }));
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public expellAllFromGroup() {
    const groupNum = this.form.getRawValue().groupNum;
    this.store$.dispatch(groupActions.expelButtonClicked({ groupNum }));
  }

  public addStudentInGroup() {
    const groupNum = this.form.getRawValue().groupNum;
    this.store$.dispatch(groupActions.addStudentButtonClicked({ groupNum }));
  }

  public backButtonClicked() {
    this.store$.dispatch(routerActions.navigateBack());
  }
}
