import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-form-field-error',
  standalone: true,
  imports: [MatFormFieldModule],
  templateUrl: './form-field-error.component.html',
  styleUrl: './form-field-error.component.scss'
})
export class FormFieldErrorComponent {
  @Input() control!: AbstractControl | null;
}
