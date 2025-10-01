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
import { Group } from '../../types/group.type';
import { TuiStringMatcher } from '@taiga-ui/cdk';
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
    const newNumber = this.groups().length + this.draftGroups().length;

    const draft: Group = {
      number: newNumber,
      name: '',
      coordinates: { x: 0, y: 0 },
      creationDate: new Date().toISOString(),
      studentsCount: 0,
      expelledStudents: 0,
      transferredStudents: 0,
      formOfEducation: 0,
      shouldBeExpelled: 0,
      semesterEnum: Semester.EIGHT,
      groupAdmin: {
        name: '',
        height: 0,
        eyeColor: null as any,
        hairColor: null as any,
        nationality: null as any,
        location: { x: 0, y: 0, z: 0 },
      },
    };
    this.selectedRow = draft;
    this.showEditDialog = true;
    this.store$.dispatch(groupActions.createDraft({ group: draft }));
  }

  protected applyRows() {
    //this.store$.dispatch(groupActions.create({ group: this.data[rowId - 1] }));
  }

  protected removeRows() {
    console.log(this.selected);
  }

  protected addButtonClicked() {
    //this.store$.dispatch() кнопка добавления
  }

  protected editRow(row) {
    console.log(row);
    this.selectedRow = row;
    this.showEditDialog = true;
    this.store$.dispatch(groupActions.startEditDraft({ group: row }));
  }



  protected readonly matcher: TuiStringMatcher<string> = (item, query) => {
    return item.toLowerCase().includes(query.toLowerCase());
  };
}
