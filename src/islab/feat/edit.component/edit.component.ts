import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Group } from '../../types/group.type';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiForm } from '@taiga-ui/layout';
import { FormOfEducation } from '../../enums/form-of-education.enum';
import { Semester } from '../../enums/semester.enum';
import { Color } from '../../enums/color.enum';
import { Country } from '../../enums/country.enum';
import { TuiChevron, TuiInputInline, TuiSelect } from '@taiga-ui/kit';
import { TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-edit',
  imports: [
    ReactiveFormsModule,
    TuiForm,
    TuiInputInline,
    TuiSelect,
    TuiTextfield,
    TuiChevron,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent {
  currentRow = input<Group>();
  protected readonly eyeColor = Object.keys(Color)
    .filter(key => isNaN(Number(key)));
  protected readonly hairColor = Object.keys(Color)
    .filter(key => isNaN(Number(key)));
  protected readonly nationality = Object.keys(Country)
    .filter(key => isNaN(Number(key)));
  protected readonly semesterEnum = Object.keys(Semester)
    .filter(key => isNaN(Number(key)));
  protected readonly formOfEducation = Object.keys(FormOfEducation)
    .filter(key => isNaN(Number(key)));
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
    shouldBeExpelled: this.fb.control<boolean>(false),
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
}
