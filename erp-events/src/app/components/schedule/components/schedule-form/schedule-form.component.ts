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
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Event as EventModel } from '../../../../models/event.model';
import { EventService } from '../../../../services/event.service';
import { AlertService } from '../../../../services/alert.service';
import { TimeSchedule, TimeSchedulePost } from '../../../../models/schedule.model';
import { ScheduleService } from '../../../../services/schedule.service';
import { Task } from '../../../../models/task.model';
import { TaskService } from '../../../../services/task.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { toLocalDateTimeString } from '../../../../utils/date';
import { FormFieldErrorComponent } from '../../../shared/components/form-field-error/form-field-error.component';

@Component({
  selector: 'app-schedule-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    FormFieldErrorComponent
  ],
  templateUrl: './schedule-form.component.html',
  styleUrl: './schedule-form.component.scss',
})
export class ScheduleFormComponent {
  form: FormGroup;
  events: EventModel[] = [];
  eventSelected: EventModel | null = null;
  uploadedTasks: Record<string, number> = {};
  uploadedTasksKeys: string[] = [];
  tasks: Task[] = [];
  taskSchedule: Record<number, string> = {};
  scheduleId: number | null = null;

  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private alertService = inject(AlertService);
  private scheduleService = inject(ScheduleService);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.form = this.fb.group({
      idEvent: new FormControl(null, Validators.required),
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      file: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.scheduleId = +idParam;
        this.loadTimeSchedule(this.scheduleId);
      }
    });
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar eventos: ${err.error?.message || err.message}`
        );
      },
    });
  }

  onEventChange(): void {
    const eventId = this.form.value.idEvent;
    if (!eventId) return;
    this.eventSelected =
      this.events.find((event) => event.idEvent === eventId) || null;
    this.taskService.getTasksFromEvent(eventId).subscribe({
      next: (data) => {
        this.tasks = data;
        this.taskSchedule = {};
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar tareas: ${err.error?.message || err.message}`
        );
      },
    });
  }

  updateTaskSchedule(task: Task, horario: string | null): void {
    if (horario !== null) {
      this.taskSchedule[task.idTask] = horario;
    } else {
      delete this.taskSchedule[task.idTask];
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) this.parseCsvFile(file);
  }

  parseCsvFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const rows = content
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r);

      if (!rows.length) return;

      const header = rows[0].split(',').map((h) => h.trim().toLowerCase());
      const expectedHeaders = ['horario', 'id_tarea'];

      const isValidHeader = expectedHeaders.every((h) => header.includes(h));
      if (!isValidHeader) {
        this.alertService.showErrorToast(
          'El archivo CSV debe tener las columnas: horario, id_tarea.'
        );
        return;
      }

      const timeIndex = header.indexOf('horario');
      const taskIndex = header.indexOf('id_tarea');

      const tasks: Record<string, number> = {};
      const taskMap: Record<number, string> = {};

      rows.slice(1).forEach((line) => {
        const cols = line.split(',').map((c) => c.trim());
        const time = cols[timeIndex];
        const taskId = parseInt(cols[taskIndex], 10);
        if (time && !isNaN(taskId)) {
          tasks[time] = taskId;
          taskMap[taskId] = time;
        }
      });

      this.uploadedTasks = tasks;
      //this.taskSchedule = taskMap;
      //this.uploadedTasksKeys = Object.keys(this.uploadedTasks);
      this.alertService.showSuccessToast(
        'Archivo procesado correctamente. Puedes proceder a cargar el cronograma.'
      );
    };

    reader.readAsText(file);
  }

  loadTimeSchedule(id: number): void {
    this.scheduleService.getById(id).subscribe({
      next: (schedule: TimeSchedule) => {
        this.form.patchValue(schedule);
        this.onEventChange();
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error al cargar cronograma: ${err.error.readableMessage}`);
      },
    });
  }

  onSubmit(): void {
    // if (this.form.invalid || Object.keys(this.uploadedTasks).length === 0) return;

    const fileTasks = Object.fromEntries(
      Object.entries(this.uploadedTasks).map(([time, taskId]) => [
        this.setDateTime(time),
        +taskId,
      ])
    );
    const selectedTasks = Object.fromEntries(
      Object.entries(this.taskSchedule).map(([taskId, time]) => [
        this.setDateTime(time),
        +taskId,
      ])
    )

    const dto: TimeSchedulePost = {
      idEvent: this.form.value.idEvent,
      title: this.form.value.title,
      description: this.form.value.description,
      scheduledTasks: {...fileTasks, ...selectedTasks}
    };

    this.scheduleService.create(dto).subscribe({
      next: () => {
        this.alertService.showSuccessToast('Cronograma cargado exitosamente.');
        this.router.navigate(['/schedules']);
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar cronograma: ${err.error.readableMessage}`
        );
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/schedules']);
  }

  setDateTime(horario: string): any {;
    if (this.eventSelected) {
      const [hours, minutes] = horario.split(':').map(Number);
      const eventDate = new Date(this.eventSelected.startDate);
      eventDate.setHours(hours);
      eventDate.setMinutes(minutes);
      eventDate.setSeconds(0);
      return toLocalDateTimeString(eventDate);
    }
  }
}
