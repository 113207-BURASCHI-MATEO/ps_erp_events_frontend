import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-supplier-view-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './supplier-view-dialog.component.html',
  styleUrl: './supplier-view-dialog.component.css'
})
export class SupplierViewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public supplier: Supplier) {}
}
