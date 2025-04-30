import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Employee } from '../../../models/employee.model';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-employee-view-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatCardModule, MatListModule,
    MatButtonModule],
  
  templateUrl: './employee-view-dialog.component.html',
  styleUrl: './employee-view-dialog.component.css'
})
export class EmployeeViewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public employee: Employee) {}
}
