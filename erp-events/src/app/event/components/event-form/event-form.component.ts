import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { EventService } from '../../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, EventPost, EventPut } from '../../../models/event.model';
import { Task, TaskEventPost } from '../../../models/task.model';
import { MatIconModule } from '@angular/material/icon';
import { Location, LocationPost } from '../../../models/location.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LocationService } from '../../../services/location.service';
import { Country, Province } from '../../../models/generic.model';
import { docValidator } from '../../../validators/document.validator';
import { ClientService } from '../../../services/client.service';
import { Client, ClientPost } from '../../../models/client.model';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AlertService } from '../../../services/alert.service';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { start } from 'repl';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatTimepickerModule,
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent {
  form: FormGroup;
  eventId: number | null = null;
  tasks: TaskEventPost[] = [];
  taskIndex: number | undefined;
  locations: Location[] = [];
  employees: Employee[] = [];
  selectedEmployeeIds: number[] = [];
  locationIndex?: number;
  isNewLocation = false;
  foundClient: Client | null = null;
  showClientForm: boolean = false;

  ProvinceOptions = Object.values(Province);
  CountryOptions = Object.values(Country);

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private clientService: ClientService,
    private employeeService: EmployeeService,
    private alertService: AlertService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      eventType: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      status: ['', Validators.required],
      clientDocumentNumber: new FormControl(
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
        [docValidator(this.clientService)]
      ),
      clientDocumentType: new FormControl('', [Validators.required]),
      locationId: [''], // solo se usará si no es ubicación nueva
      isNewLocation: [false],
      taskForm: new FormGroup({
        title: new FormControl('', [Validators.maxLength(100)]),
        description: new FormControl('', []),
        status: new FormControl('PENDING', []),
      }),
      locationForm: this.fb.group({
        fantasyName: new FormControl(
          { value: '', disabled: !this.isNewLocation },
          [Validators.required]
        ),
        streetAddress: new FormControl(
          { value: '', disabled: !this.isNewLocation },
          [Validators.required]
        ),
        number: new FormControl(
          { value: null, disabled: !this.isNewLocation },
          [Validators.required]
        ),
        city: new FormControl({ value: '', disabled: !this.isNewLocation }, [
          Validators.required,
        ]),
        province: new FormControl(
          { value: '', disabled: !this.isNewLocation },
          [Validators.required]
        ),
        country: new FormControl({ value: '', disabled: !this.isNewLocation }, [
          Validators.required,
        ]),
        postalCode: new FormControl(
          { value: null, disabled: !this.isNewLocation },
          [Validators.required]
        ),
        latitude: new FormControl({ value: '', disabled: !this.isNewLocation }),
        longitude: new FormControl({
          value: '',
          disabled: !this.isNewLocation,
        }),
      }),
      clientForm: this.fb.group({
        firstName: new FormControl(
          { value: '', disabled: this.showClientForm },
          [Validators.required, Validators.minLength(2)]
        ),
        lastName: new FormControl(
          { value: '', disabled: this.showClientForm },
          [Validators.required, Validators.minLength(2)]
        ),
        email: new FormControl({ value: '', disabled: this.showClientForm }, [
          Validators.required,
          Validators.email,
        ]),
        phoneNumber: new FormControl(
          { value: '', disabled: this.showClientForm },
          [Validators.required, Validators.pattern('^[0-9]{10}$')]
        ),
        aliasCbu: new FormControl(
          { value: '', disabled: this.showClientForm },
          [Validators.required]
        ),
        documentType: new FormControl(
          { value: '', disabled: this.showClientForm },
          [Validators.required]
        ),
        documentNumber: new FormControl(
          { value: '', disabled: this.showClientForm },
          [Validators.required, Validators.pattern('^[0-9]*$')]
        ),
      }),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id;
        this.loadEvent(this.eventId);
        this.form.get('isNewLocation')?.disable();
        this.form.get('locationForm')?.disable();
        this.form.get('clientForm')?.disable();
        this.form.get('clientDocumentNumber')?.disable();
        this.form.get('clientDocumentType')?.disable();
        this.form.get('taskForm')?.disable();
      }
    });

    this.form.get('isNewLocation')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('locationId')?.disable();
        this.form.get('locationForm')?.enable();
      } else {
        this.form.get('locationId')?.enable();
        this.form.get('locationForm')?.disable();
      }
    });

    this.loadLocations();
    this.loadEmployees();

    this.form.get('clientDocumentNumber')?.statusChanges.subscribe((status) => {
      const docType = this.form.get('clientDocumentType')?.value;
      const docNumber = this.form.get('clientDocumentNumber')?.value;

      if (status === 'VALID' && docType && docNumber) {
        this.clientService.getByDocument(docType, docNumber).subscribe({
          next: (client) => {
            this.foundClient = client;
            this.showClientForm = false;
          },
          error: (err) => {
            if (err.status === 404) {
              this.foundClient = null;
              this.showClientForm = true;
            }
          },
        });
      } else {
        this.foundClient = null;
        this.showClientForm = false;
      }
    });
  }

  loadLocations(): void {
    this.locationService.getAll().subscribe({
      next: (res) => (this.locations = res),
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar ubicaciones: ${err.error.message}`
        );
        console.error('Error al cargar ubicaciones', err.err.message);
      },
    });
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (res) => (this.employees = res),
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar empleados: ${err.error.message}`
        );
        console.error('Error al cargar empleados', err.err);
      },
    });
  }

  loadEvent(id: number): void {
    this.eventService.getById(id).subscribe({
      next: (event: Event) => {
        this.setForm(event);
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar evento: ${err.error.message}`
        );
        console.error('Error al cargar evento', err.error.message);
      },
    });
  }

  setForm(event: Event): void {
    this.form.patchValue({
      ...event,
      startDate: event.startDate,
      startTime: event.startDate.split('T')[1]?.slice(0, 5),
      endDate: event.endDate,
      endTime: event.endDate.split('T')[1]?.slice(0, 5),
      clientId: event.client?.idClient,
      locationId: event.location?.idLocation,
    });
    this.foundClient = event.client;
    this.tasks = event.tasks.map(
      (task) =>
        ({
          title: task.title,
          description: task.description,
          status: task.status,
        } as TaskEventPost)
    );
    this.selectedEmployeeIds = event.employeesIds;
  }

  onSubmit(): void {

    /* if (this.form.invalid) {
      this.alertService.showErrorToast('Por favor, completa todos los campos requeridos.');
      return;
    } */

    const { isNewLocation, locationForm, clientForm, taskForm, ...baseData } =
      this.form.value;

    const startDate = this.setDateTime(baseData.startDate, baseData.startTime);
    const endDate = this.setDateTime(baseData.endDate, baseData.endTime);

    const baseEventData = {
      ...baseData,
      startDate: startDate,
      endDate: endDate,
    };

    if (this.eventId) {
      this.updateEvent(this.eventId, baseEventData);
    } else {
      this.createEvent(baseEventData);
    }
  }

  createEvent(baseEventData: any): void {
    const client = this.getClient();
    const tasks: TaskEventPost[] = this.tasks;
    const employeeIds: number[] = this.selectedEmployeeIds;
    //const supplierIds: number[] = this.selectedSupplierIds;

    const dataPost: EventPost = {
      title: baseEventData.title,
      description: baseEventData.description,
      eventType: baseEventData.eventType,
      startDate: baseEventData.startDate,
      endDate: baseEventData.endDate,
      status: baseEventData.status,
      clientId: client?.idClient ?? 0,
      client: this.showClientForm ? (client as ClientPost) : undefined,
      locationId: baseEventData.locationId,
      location: this.isNewLocation
        ? (this.form.get('locationForm')?.value as LocationPost)
        : undefined,
      employeeIds: employeeIds.length > 0 ? employeeIds : undefined,
      //supplierIds: supplierIds.length > 0 ? supplierIds : undefined,
      tasks: tasks.length > 0 ? tasks : [],
    };

    console.log('Event data to post:', dataPost);

    this.eventService.create(dataPost).subscribe({
      next: () => {
        this.alertService.showSuccessToast('Evento creado correctamente.');
        this.router.navigate(['/events']);
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al crear evento: ${err.error?.message || err.message}`
        );
        console.error(err);
      },
    });
  }

  private getClient(): any {
    if (this.foundClient && this.foundClient.idClient) {
      return this.foundClient;
    }
    /* if (this.form.get('clientForm')?.invalid) {
      this.alertService.showErrorToast('Complete correctamente los datos del cliente.');
    } */
    const clientData = this.form.get('clientForm')?.value;
    return clientData;
  }

  updateEvent(eventId: number, baseEventData: any): void {
    const dataPut: EventPut = {
      idEvent: this.eventId!,
      title: baseEventData.title,
      description: baseEventData.description,
      eventType: baseEventData.eventType,
      startDate: baseEventData.startDate,
      endDate: baseEventData.endDate,
      status: baseEventData.status,
      locationId: baseEventData.locationId,
      employeeIds: this.selectedEmployeeIds,
      //supplierIds: this.selectedSupplierIds,
    };

    console.log('Event data to put:', dataPut);

    this.eventService.update(eventId, dataPut).subscribe({
      next: () => {
        this.alertService.showSuccessToast('Evento actualizado correctamente.');
        this.router.navigate(['/events']);
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al actualizar evento: ${err.error?.message || err.message}`
        );
        console.error(err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  //#region Task Methods
  get taskForm(): FormGroup {
    return this.form.get('taskForm') as FormGroup;
  }

  addTask(): void {
    if (this.taskForm.invalid) return;

    const formValue = this.taskForm.value;

    const task: TaskEventPost = {
      title: formValue.title!,
      description: formValue.description!,
      status: formValue.status!,
    };

    if (this.taskIndex !== undefined) {
      this.tasks[this.taskIndex] = task;
      this.taskIndex = undefined;
    } else {
      this.tasks.push(task);
    }

    this.taskForm.reset({ status: 'PENDING' });
  }

  setTaskValue(index: number): void {
    const task = this.tasks[index];
    this.taskIndex = index;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  }

  removeTask(index: number): void {
    this.tasks.splice(index, 1);
    this.taskForm.reset({ status: 'PENDING' });
    this.taskIndex = undefined;
  }

  cancelTaskEdit(): void {
    this.taskForm.reset({ status: 'PENDING' });
    this.taskIndex = undefined;
  }
  //#endregion Task Methods

  //#region Location Methods
  get locationForm(): FormGroup {
    return this.form.get('locationForm') as FormGroup;
  }

  addLocation(): void {
    if (this.locationForm.invalid) return;

    const newLocation = this.locationForm.value;
    if (this.locationIndex !== undefined) {
      this.locations[this.locationIndex] = newLocation;
      this.locationIndex = undefined;
    } else {
      this.locations.push(newLocation);
    }

    this.locationForm.reset();
  }

  setLocationValue(index: number): void {
    this.locationForm.patchValue(this.locations[index]);
    this.locationIndex = index;
  }

  removeLocation(index: number): void {
    this.locations.splice(index, 1);
    if (this.locationIndex === index) this.cancelEditLocation();
  }

  cancelEditLocation(): void {
    this.locationIndex = undefined;
    this.locationForm.reset();
  }
  //#endregion Location Methods

  //#region Employee Methods
  toggleEmployeeSelection(id: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedEmployeeIds.includes(id)) {
        this.selectedEmployeeIds.push(id);
      }
    } else {
      this.selectedEmployeeIds = this.selectedEmployeeIds.filter(
        (eid) => eid !== id
      );
    }
  }
  //endregion Employee Methods

  setDateTime(date: any, time: any) {
    const [hours, minutes] = time.split('AM')[0].split(':').map(Number); // 6:00 AM
    const updatedDate = new Date(date);
    updatedDate.setHours(hours, minutes);
    return updatedDate.toISOString();
  }
}
