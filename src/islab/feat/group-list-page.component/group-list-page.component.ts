import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';

import { TuiComparator, TuiTable, TuiTableControl } from '@taiga-ui/addon-table';
import {
  TuiButton,
  TuiDialog,
  TuiScrollable,
  TuiScrollbar,
  TuiTextfieldComponent,
} from '@taiga-ui/core';

import { EditComponent } from '../edit.component/edit.component';

import {
  selectDraftGroups,
  selectGroups,
  selectPageMeta,
  selectStats,
} from '../../../state/selectors/group.selector';
import { groupActions } from '../../../state/actions/group.actions';
import { routerActions } from '../../../state/actions/router.actions';

import { FormOfEducation } from '../../enums/form-of-education.enum';
import { Semester } from '../../enums/semester.enum';
import { Color } from '../../enums/color.enum';
import { Country } from '../../enums/country.enum';
import { ArrDatePipe } from '../../pipes/arr-date.pipe';
import { TableComponent } from '../info-page.component/table.component/table.component';
import { TuiChevron, TuiInputInline, TuiNativeSelect } from '@taiga-ui/kit';
import { TuiForm } from '@taiga-ui/layout';
import { debounceTime, distinctUntilChanged, filter, map, Subject, takeUntil } from 'rxjs';
import { isInteger } from '../../utils/validator';

type StringColumnKey =
  | 'name'
  | 'formOfEducation'
  | 'semesterEnum'
  | 'groupAdmin.name'
  | 'groupAdmin.eyeColor'
  | 'groupAdmin.hairColor'
  | 'groupAdmin.nationality'
  | 'creationDate';

@Component({
  selector: 'app-group-list-page.component',
  standalone: true,
  imports: [
    FormsModule,
    CdkFixedSizeVirtualScroll,
    CdkVirtualScrollViewport,
    TuiTable,
    TuiTableControl,
    TuiScrollbar,
    TuiScrollable,
    TuiButton,
    TuiDialog,

    EditComponent,
    NgForOf,
    CdkVirtualForOf,
    ArrDatePipe,
    ReactiveFormsModule,
    TableComponent,
    TuiChevron,
    TuiForm,
    TuiInputInline,
    TuiNativeSelect,
    TuiTextfieldComponent,
  ],
  templateUrl: './group-list-page.component.html',
  styleUrl: './group-list-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupListPageComponent {
  protected readonly store$ = inject(Store);

  protected readonly color = Color;
  protected readonly nationality = Country;
  protected readonly formOfEducation = FormOfEducation;

  protected readonly groups = this.store$.selectSignal(selectGroups);
  protected readonly drafts = this.store$.selectSignal(selectDraftGroups);
  protected readonly total = this.store$.selectSignal(selectPageMeta);

  protected selected = [];
  protected showEditDialog = false;
  protected selectedRow = null;

  protected readonly columns: string[] = [
    'select',
    'id',
    'name',
    'coordinates',
    'creationDate',
    'studentsCount',
    'expelledStudents',
    'transferredStudents',
    'formOfEducation',
    'shouldBeExpelled',
    'semesterEnum',
    'admin',
    'eyeColor',
    'hairColor',
    'location',
    'height',
    'nationality',
    'actions',
  ];

  protected readonly stringColumnOptions: Array<{
    key: StringColumnKey;
    label: string;
  }> = [
    { key: 'name', label: 'Name' },
    { key: 'formOfEducation', label: 'Form' },
    { key: 'semesterEnum', label: 'Semester' },
    { key: 'groupAdmin.name', label: 'Admin' },
    { key: 'groupAdmin.eyeColor', label: 'Eyes' },
    { key: 'groupAdmin.hairColor', label: 'Hair' },
    { key: 'groupAdmin.nationality', label: 'Nationality' },
    { key: 'creationDate', label: 'Creation Date (ISO)' },
  ];

  protected filter: { key: '' | StringColumnKey; value: string } = { key: '', value: '' };

  protected page = 0;
  protected size = 5;
  protected sortKey: '' | StringColumnKey | 'id' | 'groupAdmin.height' = 'id';
  protected sortDir: 'asc' | 'desc' = 'asc';

  private buildSort(): string {
    return this.sortKey ? `${this.sortKey},${this.sortDir}` : '';
  }

  protected applyFilters() {
    const f =
      this.filter.key && this.filter.value?.trim()
        ? { key: this.filter.key, value: this.filter.value.trim() }
        : null;

    this.page = 0;
    this.store$.dispatch(
      groupActions.load({
        filter: f,
        page: this.page,
        size: this.size,
        sort: this.buildSort(),
      }),
    );
  }

  protected reload() {
    const f =
      this.filter.key && this.filter.value?.trim()
        ? { key: this.filter.key, value: this.filter.value.trim() }
        : null;

    this.store$.dispatch(
      groupActions.load({
        filter: f,
        page: this.page,
        size: this.size,
        sort: this.buildSort(),
      }),
    );
  }

  protected nextPage() {
    if (this.total().totalSize / 5 - 1 > this.page) {
      this.page += 1;
      this.reload();
    }
  }

  protected prevPage() {
    if (this.page > 0) {
      this.page -= 1;
      this.reload();
    }
  }

  protected clearFilters() {
    this.filter = { key: '', value: '' };
    this.page = 0;
    this.reload();
  }

  private s = (pick: (x) => unknown): TuiComparator<unknown> => {
    return (a, b) =>
      String(pick(a) ?? '')
        .toLowerCase()
        .localeCompare(String(pick(b) ?? '').toLowerCase());
  };

  private n = (pick: (x) => number | null | undefined): TuiComparator<unknown> => {
    return (a, b) => Number(pick(a) ?? 0) - Number(pick(b) ?? 0);
  };

  protected readonly sorterId = this.n((x) => x.id ?? -1);
  protected readonly sorterName = this.s((x) => x.name);
  protected readonly sorterCreation = this.s((x) => x.creationDate);
  protected readonly sorterStudents = this.n((x) => x.studentsCount);
  protected readonly sorterExpelled = this.n((x) => x.expelledStudents);
  protected readonly sorterTransferred = this.n((x) => x.transferredStudents);
  protected readonly sorterForm = this.s((x) => x.formOfEducation);
  protected readonly sorterShouldExpel = this.n((x) => x.shouldBeExpelled);
  protected readonly sorterSemester = this.s((x) => x.semesterEnum);
  protected readonly sorterAdmin = this.s((x) => x.groupAdmin?.name);
  protected readonly sorterEye = this.s((x) => x.groupAdmin?.eyeColor);
  protected readonly sorterHair = this.s((x) => x.groupAdmin?.hairColor);
  protected readonly sorterHeight = this.n((x) => x.groupAdmin?.height);
  protected readonly sorterNationality = this.s((x) => x.groupAdmin?.nationality);

  protected addRow() {
    const nextId = this.drafts().length ? Math.max(...this.drafts().map((d) => d.draftId)) : 0;

    const draft = {
      draftId: nextId + 1,
      id: null,
      name: `default${nextId + 1}`,
      coordinates: { x: 1, y: 1 },
      creationDate: new Date().toISOString(),
      studentsCount: 1,
      expelledStudents: 1,
      transferredStudents: 1,
      formOfEducation: FormOfEducation.DISTANCE_EDUCATION,
      shouldBeExpelled: 1,
      semesterEnum: Semester.FOURTH,
      groupAdmin: {
        name: 'default',
        height: 1,
        eyeColor: Color.BLACK,
        hairColor: Color.BLACK,
        nationality: Country.RUSSIA,
        location: { x: 1, y: 1, z: 1 },
      },
    };

    this.selectedRow = draft;
    this.showEditDialog = true;
    this.store$.dispatch(groupActions.createDraft({ group: draft }));
  }

  protected removeRows(row) {
    const ids = [];
    const draftIds = [];
    if (row.id) {
      ids.push(row.id);
    } else {
      draftIds.push(row.draftId);
    }
    this.store$.dispatch(groupActions.delete({ ids, draftIds }));
  }

  protected editRow(row) {
    this.selectedRow = row;
    this.showEditDialog = true;
    this.store$.dispatch(groupActions.startEdit({ group: row }));
  }

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
