import { ChangeDetectionStrategy, Component, inject, input, output, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TuiForm } from '@taiga-ui/layout';
import { TuiChevron, TuiInputInline, TuiSelect } from '@taiga-ui/kit';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';

import { Group } from '../../types/group.type';
import { FormOfEducation } from '../../enums/form-of-education.enum';
import { Semester } from '../../enums/semester.enum';
import { Color } from '../../enums/color.enum';
import { Country } from '../../enums/country.enum';

import { groupActions } from '../../../state/actions/group.actions';

import { greaterThan, isInteger, nonEmptyString } from '../../utils/validator';
import { selectDraftGroups, selectGroups } from '../../../state/selectors/group.selector';

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
export class EditComponent implements OnInit {
  protected readonly store$ = inject(Store);
  closed = output<void>();
  currentRow = input<Group>();

  protected readonly eyeColor = Object.keys(Color).filter((key) => isNaN(Number(key)));
  protected readonly hairColor = Object.keys(Color).filter((key) => isNaN(Number(key)));
  protected readonly nationality = Object.keys(Country).filter((key) => isNaN(Number(key)));
  protected readonly semesterEnum = Object.keys(Semester).filter((key) => isNaN(Number(key)));
  protected readonly formOfEducation = Object.keys(FormOfEducation).filter((key) =>
    isNaN(Number(key)),
  );

  protected readonly draftGroups = this.store$.selectSignal(selectDraftGroups);

  protected readonly groups = this.store$.selectSignal(selectGroups);

  protected readonly fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control<string>('', { validators: [nonEmptyString] }),

    studentsCount: this.fb.control<number | null>(null, {
      validators: [Validators.required, isInteger, greaterThan(0)],
    }),
    shouldBeExpelled: this.fb.control<number | null>(null, {
      validators: [Validators.required, isInteger, greaterThan(0)],
    }),
    x: this.fb.control<number | null>(null, {
      validators: [Validators.required, isInteger],
    }),
    y: this.fb.control<number | null>(null, {
      validators: [Validators.required, isInteger],
    }),
    height: this.fb.control<number | null>(null, {
      validators: [Validators.required, greaterThan(0)],
    }),
    locationY: this.fb.control<number | null>(null, {
      validators: [Validators.required, isInteger],
    }),

    expelledStudents: this.fb.control<number | null>(0, {
      validators: [isInteger],
      updateOn: 'change',
    }),
    transferredStudents: this.fb.control<number | null>(0, {
      validators: [isInteger],
    }),
    locationX: this.fb.control<number | null>(null),
    locationZ: this.fb.control<number | null>(null, { validators: [isInteger] }),

    formOfEducation: this.fb.control<FormOfEducation | null>(null, {
      validators: [Validators.required],
    }),
    semesterEnum: this.fb.control<Semester | null>(null),
    groupAdminName: this.fb.control<string>('', { validators: [nonEmptyString] }),
    eyeColor: this.fb.control<Color | null>(null, { validators: [Validators.required] }),
    hairColor: this.fb.control<Color | null>(null, { validators: [Validators.required] }),
    nationality: this.fb.control<Country | null>(null),
  });

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getError(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return null;

    if (control.errors['required']) return 'This field is required';
    if (control.errors['nonEmptyString']) return 'This field cannot be empty';
    if (control.errors['isInteger']) return 'Value must be an integer';
    if (control.errors['greaterThan']) return 'Value must be greater than zero';
    if (control.errors['enumRequired']) return 'Please select a value';

    return 'Invalid value';
  }

  private patchFromDraft(d) {
    this.form.reset(
      {
        name: d.name,
        x: d.coordinates.x,
        y: d.coordinates.y,
        studentsCount: d.studentsCount,
        expelledStudents: d.expelledStudents,
        transferredStudents: d.transferredStudents,
        formOfEducation: d.formOfEducation,
        shouldBeExpelled: d.shouldBeExpelled,
        semesterEnum: d.semesterEnum,
        groupAdminName: d.groupAdmin.name,
        eyeColor: d.groupAdmin.eyeColor,
        hairColor: d.groupAdmin.hairColor,
        locationX: d.groupAdmin.location.x,
        locationY: d.groupAdmin.location.y,
        locationZ: d.groupAdmin.location.z,
        height: d.groupAdmin.height,
        nationality: d.groupAdmin.nationality,
      },
      { emitEvent: false },
    );

    this.form.markAsPristine();
    this.form.updateValueAndValidity({ emitEvent: false });
  }

  public ngOnInit(): void {
    const nextId = this.draftGroups().length
      ? Math.max(...this.draftGroups().map((d) => d.draftId))
      : 0;

    const draft = {
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
    this.patchFromDraft(draft);
  }

  applyChangesClicked(): Group {
    const row = this.currentRow();
    if (!row || this.form.invalid) return;

    const v = this.form.getRawValue();

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

      formOfEducation: v.formOfEducation as FormOfEducation | null,
      shouldBeExpelled: v.shouldBeExpelled as number,
      semesterEnum: v.semesterEnum as Semester | null,

      groupAdmin: {
        ...(row.groupAdmin ?? {}),
        name: v.groupAdminName ?? row.groupAdmin?.name,
        eyeColor: v.eyeColor as Color | null,
        hairColor: v.hairColor as Color | null,
        location: {
          ...(row.groupAdmin?.location ?? { x: null, y: null, z: null }),
          x: v.locationX != null ? Number(v.locationX) : null,
          y: v.locationY != null ? Number(v.locationY) : null,
          z: v.locationZ != null ? Number(v.locationZ) : null,
        },
        height: v.height != null ? Number(v.height) : null,
        nationality: v.nationality as Country | null,
      },
    };

    return updated;
  }

  public createNewGroup(): void {
    const updated = this.applyChangesClicked();
    this.store$.dispatch(groupActions.create({ groups: [updated] }));
    this.closed.emit();
  }

  public updateGroup(): void {
    const updated = this.applyChangesClicked();
    this.store$.dispatch(groupActions.update({ groups: [updated] }));
    this.closed.emit();
  }
}
