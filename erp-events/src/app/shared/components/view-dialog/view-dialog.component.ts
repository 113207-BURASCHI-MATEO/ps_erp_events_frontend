import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { GenericDictionary } from '../../../utils/dictionaries';

@Component({
  selector: 'app-view-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
  ],
  templateUrl: './view-dialog.component.html',
  styleUrl: './view-dialog.component.scss',
})
export class ViewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Record<string, any>) {}

  getKeys(): string[] {
    return Object.keys(this.data);
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  translate(text: string): string {
    return GenericDictionary[text.toLowerCase()] || text;
  }

  formatValue(value: any): string {
    const isValidDate = (val: any): boolean =>
      typeof val === 'string' && !isNaN(new Date(val).getTime());
  
    if (value === null) {
      return 'sin datos';
    }
  
    if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.entries(value)
        .map(([k, v]) => {
          const keyDate = new Date(k);
          const valDate = new Date(v as string | number);
  
          const rawKey = !isNaN(keyDate.getTime())
            ? keyDate.toLocaleString()
            : this.translate(k);
  
          const rawValue =
            v === null
              ? 'sin datos'
              : isValidDate(v)
                ? valDate.toLocaleString()
                : this.translate(String(v));
  
          return `${rawKey}: ${rawValue}`;
        })
        .join('; ');
    }
  
    if (isValidDate(value)) {
      return new Date(value).toLocaleString();
    }
  
    return this.translate(String(value));
  }
  
}
