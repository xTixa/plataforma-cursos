import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-course-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss',
})
export class CourseForm implements OnInit {
  readonly id = input<string>();

  private readonly fb = inject(FormBuilder);
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly isEditMode = signal(false);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const courseId = this.id();
    if (courseId) {
      this.isEditMode.set(true);
      this.loading.set(true);
      this.courseService.getById(courseId).subscribe({
        next: (course) => {
          this.form.patchValue({
            title: course.title,
            description: course.description,
            category: course.category,
          });
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedFile.set(target.files?.[0] ?? null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload = { ...this.form.getRawValue(), thumbnail: this.selectedFile() };
    const courseId = this.id();

    const request = courseId
      ? this.courseService.update(courseId, payload)
      : this.courseService.create(payload);

    request.subscribe({
      next: (course) => {
        this.saving.set(false);
        this.snackBar.open('Curso guardado com sucesso', 'Fechar', { duration: 3000 });
        this.router.navigate(['/courses', course._id]);
      },
      error: (err) => {
        this.saving.set(false);
        this.snackBar.open(err.error?.error ?? 'Erro ao guardar o curso', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }
}
