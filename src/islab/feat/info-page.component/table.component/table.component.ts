import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  TuiTableDirective,
  TuiTableTbody,
  TuiTableTd,
  TuiTableTh,
  TuiTableThGroup,
  TuiTableTr,
} from '@taiga-ui/addon-table';
import { Group } from '../../../types/group.type';
import { CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { TuiScrollable, TuiScrollbar } from '@taiga-ui/core';
import { ArrDatePipe } from '../../../pipes/arr-date.pipe';

@Component({
  selector: 'app-table',
  imports: [
    DatePipe,
    TuiTableDirective,
    TuiTableTbody,
    TuiTableTd,
    TuiTableTh,
    TuiTableThGroup,
    TuiTableTr,
    CdkFixedSizeVirtualScroll,
    CdkVirtualScrollViewport,
    TuiScrollable,
    TuiScrollbar,
    ArrDatePipe,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.less',
})
export class TableComponent {
  readonly source = input<Group[]>([]);
}
