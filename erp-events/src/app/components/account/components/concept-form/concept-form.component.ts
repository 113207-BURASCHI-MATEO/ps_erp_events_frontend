import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { ConceptService } from '../../../../services/concept.service';
import { Concept, ConceptPost, ConceptPut } from '../../../../models/account.model';
import { FormFieldErrorComponent } from '../../../shared/components/form-field-error/form-field-error.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FileService } from '../../../../services/file.service';
import { File } from '../../../../models/file.model';

@Component({
  selector: 'app-concept-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormFieldErrorComponent,
    MatAutocompleteModule
  ],
  templateUrl: './concept-form.component.html',
  styleUrl: './concept-form.component.scss',
})
export class ConceptFormComponent {
  form: FormGroup;
  conceptId: number | null = null;
  accountId: number | null = null;
  files: File[] = [];
  filteredFiles : File[] = [];

  private fb = inject(FormBuilder);
  private service = inject(ConceptService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private fileService = inject(FileService);

  constructor() {
    this.form = this.fb.group({
      accountingDate: new FormControl('', [Validators.required]),
      concept: new FormControl('', [Validators.required]),
      comments: new FormControl(''),
      amount: new FormControl('', [Validators.required]),
      idFile: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('conceptId');
      const idAccount = params.get('id');
      if (idAccount) {
        this.accountId = +idAccount;
      }
      if (idParam) {
        this.conceptId = +idParam;
        this.loadConcept(this.conceptId);
      }
    });
    this.loadFiles();
    this.form.get('idFile')?.valueChanges.subscribe(value => {
      const filterValue = value?.toString().toLowerCase() || '';
      this.filteredFiles = this.files.filter(file =>
        file.fileName.toLowerCase().includes(filterValue)
      );
    });
  }

  loadFiles(): void {
    this.fileService.getAll().subscribe({
      next: (data) => {
        this.files = data;
        this.filteredFiles  = data;
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar archivos: ${err.error?.message || err.message}`
        );
        console.error('Error al cargar archivos:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.accountId) return;

    const formValue = this.form.value;

    let fileContentType;
    if(this.form.value.idFile){
      fileContentType = this.files.filter(f => f.idFile === Number(this.form.value.idFile))[0].fileContentType;
    }
    
    if (this.conceptId) {
      const dataPut: ConceptPut = {
        idConcept: this.conceptId,
        idAccount: this.accountId,
        fileContentType: fileContentType && fileContentType,
        ...formValue,
      };
      console.log("FORM", dataPut);
      this.service.update(this.conceptId, dataPut).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Concepto actualizado correctamente.');
          this.router.navigate(['/events', 'account', this.accountId]);
        },
        error: (err) => {
          this.alertService.showErrorToast(
            `Error al actualizar concepto: ${err?.error?.readableMessage || 'Error desconocido'}`
          );
        },
      });
    } else {
      const dataPost: ConceptPost = {
        idAccount: this.accountId,
        fileContentType: fileContentType && fileContentType,
        ...formValue,
      };
      console.log("FORM", dataPost);
      this.service.create(dataPost).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Concepto creado correctamente.');
          this.router.navigate(['/events', 'account', this.accountId]);
        },
        error: (err) => {
          this.alertService.showErrorToast(
            `Error al crear concepto: ${err?.error?.readableMessage || 'Error desconocido'}`
          );
        },
      });
    }
  }

  loadConcept(id: number): void {
    this.service.getById(id).subscribe({
      next: (concept: Concept) => {
        this.form.patchValue({
          ...concept,
        });
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar concepto: ${err?.error?.readableMessage || 'Error desconocido'}`
        );
      },
    });
  }

  goBack(): void {
    if (this.accountId) {
      this.router.navigate(['/events/account', this.accountId]);
    } else {
      this.router.navigate(['/events']);
    }
  }
}
