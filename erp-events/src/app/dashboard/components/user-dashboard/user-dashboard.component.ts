import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    BaseChartDirective,
    MatIconModule,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent {
  users: User[] = [];
  filterForm: FormGroup;
  kpiData = {
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
  };

  colors = [
    '#13505B', '#9FC2CC', '#040404', '#FF7F11', '#D7D9CE', '#CC650D',
    '#FF8080', '#FFC7C7', '#C11414', '#F8F9FA', '#FFFFFF', '#333333',
    '#777777', '#08703B', '#FFAB91'
  ];

        private fb = inject(FormBuilder);
          private userService = inject(UserService);
          private alertService = inject(AlertService);

  constructor(
  ) {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const { startDate, endDate } = this.filterForm.value;

    this.userService.getAll()
      .pipe(map((users) => this.filterUsers(users, startDate, endDate)))
      .subscribe({
        next: (filteredUsers) => {
          this.users = filteredUsers;
          this.calculateKPIs();
          this.prepareChartData();
        },
        error: (err) => {
          this.alertService.showErrorToast(
            `Error al cargar usuarios: ${err.error?.message || err.message}`
          );
          console.error('Error al cargar usuarios:', err);
        },
      });
  }

  filterUsers(users: User[], start: Date | null, end: Date | null): User[] {
    if (!start && !end) return users;
    return users.filter((u) => {
      const birthDate = new Date(u.birthDate);
      return (!start || birthDate >= start) && (!end || birthDate <= end);
    });
  }

  calculateKPIs(): void {
    this.kpiData.totalUsers = this.users.length;
    this.kpiData.adminUsers = this.users.filter(u => u.role.name === 'ADMIN').length;
    this.kpiData.regularUsers = this.users.filter(u => u.role.name === 'USER').length;
  }

  prepareChartData(): void {
    const roleCounts = this.users.reduce((acc, user) => {
      acc[user.role.name] = (acc[user.role.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.pieChartUserRoleLabels = Object.keys(roleCounts);
    this.pieChartUserRoleDatasets[0].data = Object.values(roleCounts);

    const docTypeCounts = this.users.reduce((acc, user) => {
      acc[user.documentType] = (acc[user.documentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.barChartUserDocTypeLabels = Object.keys(docTypeCounts);
    this.barChartUserDocTypeDatasets[0].data = Object.values(docTypeCounts);
  }

  applyFilters(): void {
    this.loadData();
  }

  //#region Chart.js Config
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      datalabels: { color: '#fff', anchor: 'end', align: 'start' },
    },
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: { color: '#fff', anchor: 'end', align: 'top' },
    },
  };

  public pieChartPlugins = [ChartDataLabels];

  public pieChartUserRoleLabels: string[] = [];
  public pieChartUserRoleDatasets: ChartDataset<'pie', number[]>[] = [
    {
      data: [],
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];

  public barChartUserDocTypeLabels: string[] = [];
  public barChartUserDocTypeDatasets: ChartDataset<'bar', number[]>[] = [
    {
      data: [],
      label: 'Tipos de Documento',
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];
  //#endregion
}

