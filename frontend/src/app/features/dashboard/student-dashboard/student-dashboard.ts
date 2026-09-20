import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService, StudentDashboard as StudentDashboardData } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [RouterLink, MatCardModule, MatProgressBarModule, MatProgressSpinnerModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly data = signal<StudentDashboardData | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.dashboardService.getStudentDashboard().subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
