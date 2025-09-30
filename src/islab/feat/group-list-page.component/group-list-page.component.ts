import {AsyncPipe, DatePipe, NgForOf} from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiTableControl, TuiTable} from '@taiga-ui/addon-table';
import {
  TuiButton,
  TuiDropdown,
  TuiFormatNumberPipe,
  TuiIcon,
  TuiInitialsPipe,
  TuiLink,
  TuiLoader,
  TuiScrollable,
  TuiScrollbar, TuiTextfieldComponent, TuiTextfieldDropdownDirective,
} from '@taiga-ui/core';
import { select, Store } from '@ngrx/store';
import {
  selectDraftGroups,
  selectGroups,
} from '../../../state/selectors/group.selector';
import { groupActions } from '../../../state/actions/group.actions';
import { LoaderComponent } from '../loader.component/loader.component';
import { TuiIslandDirective } from '@taiga-ui/legacy';
import { TuiCardLarge } from '@taiga-ui/layout';
import { Observable } from 'rxjs';
import { ErrorPageComponent } from '../error-page.component/error-page.component';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import {
  TuiCheckbox, TuiChevron,
  TuiChip, TuiComboBox, TuiDataListWrapper, TuiFilterByInputPipe,
  TuiItemsWithMore,
  TuiProgressBar,
  TuiRadioList,
  TuiStatus,
} from '@taiga-ui/kit';
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
  ],
  templateUrl: './group-list-page.component.html',
  styleUrl: './group-list-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupListPageComponent {
  protected readonly store$ = inject(Store);
  protected readonly Color = Color;
  protected readonly Nationality = Country;
  protected readonly FormOfEducation = FormOfEducation;
  protected readonly groups = this.store$.selectSignal(selectGroups);
  protected readonly draftGroups = this.store$.selectSignal(selectDraftGroups);
  protected data = this.groups();
  protected selected = [];
  protected educationValue: string | null = null;
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
      semesterEnum: null as any,
      groupAdmin: {
        name: '',
        height: 0,
        eyeColor: null as any,
        hairColor: null as any,
        nationality: null as any,
        location: { x: 0, y: 0, z: 0 },
      },
    };

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
    console.log(row)
    this.selectedRow = row;
    this.store$.dispatch(groupActions.startUpdate({ group: row }));
  }

  protected readonly formOfEducation = Object.keys(FormOfEducation).filter(
    (k) => isNaN(Number(k))
  );

  protected readonly matcher: TuiStringMatcher<string> = (item, query) => {
    return item.toLowerCase().includes(query.toLowerCase());
  };
}
