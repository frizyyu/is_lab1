import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  model,
  output,
  Output,
} from '@angular/core';
import { Group } from '../../types/group.type';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiForm } from '@taiga-ui/layout';
import { FormOfEducation } from '../../enums/form-of-education.enum';
import { Semester } from '../../enums/semester.enum';
import { Color } from '../../enums/color.enum';
import { Country } from '../../enums/country.enum';
import { TuiChevron, TuiInputInline, TuiSelect } from '@taiga-ui/kit';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { groupActions } from '../../../state/actions/group.actions';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit',
  imports: [
    ReactiveFormsModule,
    TuiForm,
    TuiInputInline,
    TuiSelect,
    TuiTextfield,
    TuiChevron,
    TuiButton,
    DatePipe,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent {
  protected readonly store$ = inject(Store);
  closed = output<void>();
  currentRow = input<Group>();
  protected readonly eyeColor = Object.keys(Color).filter((key) =>
    isNaN(Number(key))
  );
  protected readonly hairColor = Object.keys(Color).filter((key) =>
    isNaN(Number(key))
  );
  protected readonly nationality = Object.keys(Country).filter((key) =>
    isNaN(Number(key))
  );
  protected readonly semesterEnum = Object.keys(Semester).filter((key) =>
    isNaN(Number(key))
  );
  protected readonly formOfEducation = Object.keys(FormOfEducation).filter(
    (key) => isNaN(Number(key))
  );
  protected readonly fb = inject(FormBuilder);
  form = this.fb.group({
    name: this.fb.control<string>('', {
      validators: [Validators.required, Validators.maxLength(256)],
    }),
    studentsCount: this.fb.control<number>(0, {
      validators: [Validators.min(0)],
    }),
    expelledStudents: this.fb.control<number>(0, {
      validators: [Validators.min(0)],
    }),
    transferredStudents: this.fb.control<number>(0, {
      validators: [Validators.min(0)],
    }),
    formOfEducation: this.fb.control<FormOfEducation | null>(null),
    shouldBeExpelled: this.fb.control<number>(0, {
      validators: [Validators.min(1)],
    }),
    semesterEnum: this.fb.control<Semester | null>(null),
    x: this.fb.control<number>(0, { validators: [Validators.required] }),
    y: this.fb.control<number>(0, { validators: [Validators.required] }),
    z: this.fb.control<number>(0, { validators: [Validators.required] }),

    groupAdminName: this.fb.control<string>('', {
      validators: [Validators.required, Validators.maxLength(256)],
    }),
    eyeColor: this.fb.control<Color | null>(null),
    hairColor: this.fb.control<Color | null>(null),
    height: this.fb.control<number | null>(null, {
      validators: [Validators.min(0)],
    }),
    nationality: this.fb.control<Country | null>(null),
    locationX: this.fb.control<number>(0, {
      validators: [Validators.required],
    }),
    locationY: this.fb.control<number>(0, {
      validators: [Validators.required],
    }),
    locationZ: this.fb.control<number>(0, {
      validators: [Validators.required],
    }),
  });

  applyChangesClicked(): void {
    const row = this.currentRow();
    if (!row || this.form.invalid) return;

    const v = this.form.getRawValue();

    function toEnumValue<TEnum extends Record<string, unknown>>(
      enumType: TEnum,
      value: unknown
    ): TEnum[keyof TEnum] | null {
      if (value == null) return null;
      if (typeof value === 'number') return value as any;
      const num = Number(value);
      if (!Number.isNaN(num) && enumType[num as keyof TEnum] !== undefined) {
        return num as any;
      }
      if (typeof value === 'string' && enumType[value as keyof TEnum] !== undefined) {
        return enumType[value as keyof TEnum] as any;
      }

      return null;
    }

    const updated: Group = {
      ...row,
      name: v.name ?? row.name,
      coordinates: {
        ...(row.coordinates ?? { x: null, y: null }),
        x: Number(v.x),
        y: Number(v.y),
      },
      studentsCount: Number(v.studentsCount),
      expelledStudents: Number(v.expelledStudents),
      transferredStudents: Number(v.transferredStudents),
      
      formOfEducation: toEnumValue(FormOfEducation, v.formOfEducation) as FormOfEducation | null,
      shouldBeExpelled: v.shouldBeExpelled,
      semesterEnum: toEnumValue(Semester, v.semesterEnum) as Semester | null,

      groupAdmin: {
        ...(row.groupAdmin ?? {}),
        name: v.groupAdminName ?? row.groupAdmin?.name,
        eyeColor: toEnumValue(Color, v.eyeColor) as Color | null,
        hairColor: toEnumValue(Color, v.hairColor) as Color | null,
        location: {
          ...(row.groupAdmin?.location ?? { x: null, y: null, z: null }),
          x: Number(v.locationX),
          y: Number(v.locationY),
          z: Number(v.locationZ),
        },
        height: v.height != null ? Number(v.height) : null,
        nationality: toEnumValue(Country, v.nationality) as Country | null,
      },
    };
    this.store$.dispatch(groupActions.endEditDraft({group: updated}));
    this.closed.emit();
  }
}
