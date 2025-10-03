import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiTable, TuiTableControl } from '@taiga-ui/addon-table';
import {
  TuiButton,
  TuiDialog,
  TuiScrollable,
  TuiScrollbar,
} from '@taiga-ui/core';
import { Store } from '@ngrx/store';
import {
  selectDraftGroups,
  selectGroups,
} from '../../../state/selectors/group.selector';
import { groupActions } from '../../../state/actions/group.actions';
import { TuiCardLarge } from '@taiga-ui/layout';
import { ErrorPageComponent } from '../error-page.component/error-page.component';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { TuiCheckbox } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { FormOfEducation } from '../../enums/form-of-education.enum';
import { Semester } from '../../enums/semester.enum';
import { Color } from '../../enums/color.enum';
import { Country } from '../../enums/country.enum';
import { EditComponent } from '../edit.component/edit.component';

@Component({
  selector: 'app-group-list-page.component',
  imports: [
    TuiTable,
    DatePipe,
    TuiCardLarge,
    ErrorPageComponent,
    TuiScrollbar,
    CdkFixedSizeVirtualScroll,
    TuiScrollable,
    TuiScrollbar,
    CdkVirtualScrollViewport,
    TuiTableControl,
    TuiCheckbox,
    FormsModule,
    TuiButton,
    EditComponent,
    TuiDialog,
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
  protected readonly semester = Semester;
  protected readonly groups = this.store$.selectSignal(selectGroups);
  protected readonly draftGroups = this.store$.selectSignal(selectDraftGroups);
  protected data = this.groups();
  protected selected = [];
  protected showEditDialog = false;
  protected selectedRow = null;

  protected addRow() {
    const nextId = this.draftGroups().length
      ? Math.max(...this.draftGroups().map(d => d.draftId))
      : 0;
    const draft = {
      draftId: nextId,
      id: null,
      name: 'default',
      coordinates: { x: 0, y: 0 },
      creationDate: new Date().toISOString(),
      studentsCount: 0,
      expelledStudents: 0,
      transferredStudents: 0,
      formOfEducation: 0,
      shouldBeExpelled: 0,
      semesterEnum: 0,
      groupAdmin: {
        name: 'default',
        height: 0,
        eyeColor: 0,
        hairColor: 0,
        nationality: 0,
        location: { x: 0, y: 0, z: 0 },
      },
    };
    this.selectedRow = draft;
    this.showEditDialog = true;
    this.store$.dispatch(groupActions.createDraft({ group: draft }));
  }

  protected applyRows() {
    this.store$.dispatch(groupActions.create({ groups: this.selected.filter(g => !g.id) }));
  }

  protected removeRows() {
    const ids = this.selected
      .map((g) => g.id)
      .filter((id): id is number => id != null);
    const draftIds = this.selected
      .map((g) => g.draftId)
      .filter((draftId) => draftId != null);
    this.store$.dispatch(groupActions.delete({ ids, draftIds}));
  }

  protected editRow(row) {
    this.selectedRow = row;
    this.showEditDialog = true;
    this.store$.dispatch(groupActions.startEdit({ group: row }));
  }
}
