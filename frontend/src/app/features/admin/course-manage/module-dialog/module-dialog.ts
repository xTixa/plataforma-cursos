import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CourseModule } from '../../../../core/models/course.model';

export interface ModuleDialogData {
  module: CourseModule | null;
}

export interface ModuleDialogResult {
  title: string;
}

@Component({
  selector: 'app-module-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './module-dialog.html',
  styles: `
    .full-width {
      width: 100%;
      min-width: 320px;
    }
  `,
})
export class ModuleDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ModuleDialog, ModuleDialogResult>);
  protected readonly data = inject<ModuleDialogData>(MAT_DIALOG_DATA);

  readonly isEditMode = this.data.module !== null;

  readonly form = this.fb.nonNullable.group({
    title: [this.data.module?.title ?? '', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
