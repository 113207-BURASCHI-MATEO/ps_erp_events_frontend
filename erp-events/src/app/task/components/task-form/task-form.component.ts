import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { TaskService } from '../../../services/task.service';
import { Task, TaskPost, TaskPut, TaskStatus } from '../../../models/task.model';
import { Event } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  form: FormGroup;
  taskId: number | null = null;
  events: Event[] = [];

  taskStatusOptions: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  private fb = inject(FormBuilder);
  private service = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private eventService = inject(EventService);
  constructor(
  ) {
    this.form = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      idEvent: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.taskId = +idParam;
        this.loadTask(this.taskId);
      }
    });
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
        console.log('Eventos cargados:', this.events);
        
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error al cargar eventos: ${err.error?.message || err.message}`);
        console.error('Error al cargar eventos:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    if (this.taskId) {
      const dataPut: TaskPut = { idTask: this.taskId, ...formValue };
      this.service.update(this.taskId, dataPut).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Tarea actualizada correctamente.');
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.alertService.showErrorToast(`Error al actualizar tarea: ${err.error.readableMessage}`);
        },
      });
    } else {
      const dataPost: TaskPost = formValue;
      this.service.create(dataPost).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Tarea creada correctamente.');
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.alertService.showErrorToast(`Error al crear tarea: ${err.error.readableMessage}`);
        },
      });
    }
  }

  loadTask(id: number): void {
    this.service.getById(id).subscribe({
      next: (task: Task) => {
        this.form.patchValue(task);
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error al cargar tarea: ${err.error.readableMessage}`);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}

