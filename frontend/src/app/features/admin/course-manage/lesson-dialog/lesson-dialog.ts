import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Lesson } from '../../../../core/models/course.model';

export interface LessonDialogData {
  lesson: Lesson | null;
}

export interface LessonDialogResult {
  title: string;
  duration: number;
  video: File | null;
  pdf: File | null;
}

@Component({
  selector: 'app-lesson-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './lesson-dialog.html',
  styleUrl: './lesson-dialog.scss',
})
export class LessonDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<LessonDialog, LessonDialogResult>);
  protected readonly data = inject<LessonDialogData>(MAT_DIALOG_DATA);

  readonly isEditMode = this.data.lesson !== null;
  readonly selectedVideo = signal<File | null>(null);
  readonly selectedPdf = signal<File | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: [this.data.lesson?.title ?? '', [Validators.required]],
    duration: [this.data.lesson?.duration ?? 0, [Validators.min(0)]],
  });

  onVideoSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedVideo.set(target.files?.[0] ?? null);
  }

  onPdfSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedPdf.set(target.files?.[0] ?? null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      ...this.form.getRawValue(),
      video: this.selectedVideo(),
      pdf: this.selectedPdf(),
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
