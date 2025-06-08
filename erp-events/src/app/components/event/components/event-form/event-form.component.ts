import { CommonModule } from '@angular/common';
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
import { EventService } from '../../../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, EventPost, EventPut } from '../../../../models/event.model';
import { Task, TaskEventPost } from '../../../../models/task.model';
import { MatIconModule } from '@angular/material/icon';
import { Location, LocationPost } from '../../../../models/location.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LocationService } from '../../../../services/location.service';
import { Country, Province } from '../../../../models/generic.model';
import { docValidator } from '../../../../validators/document.validator';
import { ClientService } from '../../../../services/client.service';
import { Client, ClientPost } from '../../../../models/client.model';
import { Employee } from '../../../../models/employee.model';
import { EmployeeService } from '../../../../services/employee.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AlertService } from '../../../../services/alert.service';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { Supplier } from '../../../../models/supplier.model';
import { SupplierService } from '../../../../services/supplier.service';
import { toLocalDateTimeString } from '../../../../utils/date';
import { FormFieldErrorComponent } from '../../../shared/components/form-field-error/form-field-error.component';

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
    MatStepperModule,
    FormFieldErrorComponent
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
  suppliers: Supplier[] = [];
  selectedEmployeeIds: number[] = [];
  selectedSupplierIds: number[] = [];
  locationIndex?: number;
  isNewLocation = false;
  foundClient: Client | null = null;
  showClientForm: boolean = false;

  provinces = Object.values(Province);
  coutries = Object.values(Country);

  ProvinceOptions = Object.values(Province);
  CountryOptions = Object.values(Country);

  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private locationService = inject(LocationService);
  private clientService = inject(ClientService);
  private employeeService = inject(EmployeeService);
  private alertService = inject(AlertService);
  private supplierService = inject(SupplierService);

  constructor() {
    this.form = this.fb.group({
      eventData: this.fb.group({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        eventType: new FormControl('', [Validators.required]),
        startDate: new FormControl('', [Validators.required]),
        startTime: new FormControl('', [Validators.required]),
        endDate: new FormControl('', [Validators.required]),
        endTime: new FormControl('', [Validators.required]),
        status: new FormControl('', [Validators.required]),
      }),
      clientData: this.fb.group({
        clientDocumentNumber: new FormControl(
          '',
          [Validators.required, Validators.pattern('^[0-9]*$')],
          [docValidator(this.clientService)]
        ),
        clientDocumentType: new FormControl('', [Validators.required]),
        /* clientForm: this.fb.group({
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
        }), */
        clientForm: this.fb.group({
          firstName: new FormControl({
            value: '',
            disabled: this.showClientForm,
          }),
          lastName: new FormControl({
            value: '',
            disabled: this.showClientForm,
          }),
          email: new FormControl({ value: '', disabled: this.showClientForm }),
          phoneNumber: new FormControl({
            value: '',
            disabled: this.showClientForm,
          }),
          aliasCbu: new FormControl({
            value: '',
            disabled: this.showClientForm,
          }),
        }),
      }),
      locationData: this.fb.group({
        locationId: new FormControl(''),
        isNewLocation: new FormControl(false),
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
          country: new FormControl(
            { value: '', disabled: !this.isNewLocation },
            [Validators.required]
          ),
          postalCode: new FormControl(
            { value: null, disabled: !this.isNewLocation },
            [Validators.required]
          ),
          latitude: new FormControl({
            value: '',
            disabled: !this.isNewLocation,
          }),
          longitude: new FormControl({
            value: '',
            disabled: !this.isNewLocation,
          }),
        }),
      }),
      taskForm: this.fb.group({
        title: new FormControl('', [Validators.maxLength(100)]),
        description: new FormControl('', []),
        status: new FormControl('PENDING', []),
      }),
    });
  }

  get eventForm(): FormGroup {
    return this.form.get('eventData') as FormGroup;
  }

  get clientDataForm(): FormGroup {
    return this.form.get('clientData') as FormGroup;
  }

  get locationDataForm(): FormGroup {
    return this.form.get('locationData') as FormGroup;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id;
        this.loadEvent(this.eventId);
        this.form.get('locationData.isNewLocation')?.disable();
        this.form.get('locationData.locationForm')?.disable();
        this.form.get('clientData.clientForm')?.disable();
        this.form.get('clientData.clientDocumentNumber')?.disable();
        this.form.get('clientData.clientDocumentType')?.disable();
        this.form.get('taskForm')?.disable();
      }
    });

    this.form
      .get('locationData.isNewLocation')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.form.get('locationData.locationId')?.disable();
          this.form.get('locationData.locationForm')?.enable();
        } else {
          this.form.get('locationData.locationId')?.enable();
          this.form.get('locationData.locationForm')?.disable();
        }
      });

    this.loadLocations();
    this.loadEmployees();
    this.loadSuppliers();

    this.form
      .get('clientData.clientDocumentNumber')
      ?.statusChanges.subscribe((status) => {
        const docType = this.form.get('clientData.clientDocumentType')?.value;
        const docNumber = this.form.get(
          'clientData.clientDocumentNumber'
        )?.value;

        if (status === 'VALID' && docType && docNumber) {
          this.clientService.getByDocument(docType, docNumber).subscribe({
            next: (client) => {
              this.foundClient = client;
              this.showClientForm = false;
              this.setConditionalValidators();
            },
            error: (err) => {
              if (err.status === 404) {
                this.foundClient = null;
                this.showClientForm = true;
                this.setConditionalValidators();
              }
            },
          });
        } else {
          this.foundClient = null;
          this.showClientForm = false;
          this.setConditionalValidators();
        }
      });
  }

  setConditionalValidators(): void {
    const validatorsEnabled = this.showClientForm;

    this.form
      .get('clientData.clientForm.firstName')
      ?.setValidators(
        validatorsEnabled ? [Validators.required, Validators.minLength(2)] : []
      );
    this.form
      .get('clientData.clientForm.lastName')
      ?.setValidators(
        validatorsEnabled ? [Validators.required, Validators.minLength(2)] : []
      );
    this.form
      .get('clientData.clientForm.email')
      ?.setValidators(
        validatorsEnabled ? [Validators.required, Validators.email] : []
      );
    this.form
      .get('clientData.clientForm.phoneNumber')
      ?.setValidators(
        validatorsEnabled
          ? [Validators.required, Validators.pattern(/^(?=(?:.*\d){10,})\+?[0-9\s-]+$/)]
          : []
      );
    this.form
      .get('clientData.clientForm.aliasCbu')
      ?.setValidators(validatorsEnabled ? [Validators.required] : []);

    const clientForm = this.form.get('clientData.clientForm') as FormGroup;
    Object.values(clientForm.controls).forEach((control) =>
      control.updateValueAndValidity()
    );
  }

  loadLocations(): void {
    this.locationService.getAll().subscribe({
      next: (res) => (this.locations = res),
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar ubicaciones: ${err.error.readableMessage}`
        );
      },
    });
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (res) => (this.employees = res),
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar empleados: ${err.error.readableMessage}`
        );
      },
    });
  }

  loadSuppliers(): void {
    this.supplierService.getAll().subscribe({
      next: (res) => (this.suppliers = res),
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar proveedores: ${err.error.readableMessage}`
        );
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
          `Error al cargar evento: ${err.error.readableMessage}`
        );
      },
    });
  }

  setForm(event: Event): void {
    const eventDataGroup = this.form.get('eventData') as FormGroup;
    eventDataGroup.patchValue({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      status: event.status,
      startDate: event.startDate,
      startTime: event.startDate.split('T')[1]?.slice(0, 5),
      endDate: event.endDate,
      endTime: event.endDate.split('T')[1]?.slice(0, 5),
    });

    if (event.client) {
      this.foundClient = event.client;
    }

    const locationDataGroup = this.form.get('locationData') as FormGroup;
    locationDataGroup.patchValue({
      locationId: event.location?.idLocation,
    });

    this.tasks = event.tasks.map(
      (task) =>
        ({
          title: task.title,
          description: task.description,
          status: task.status,
        } as TaskEventPost)
    );

    this.selectedEmployeeIds = event.employeesIds;
    this.selectedSupplierIds = event.suppliersIds;
  }

  onSubmit(): void {
    /* if (this.form.invalid) {
        this.alertService.showErrorToast('Por favor, completa todos los campos requeridos.');
        return;
      } */

    const eventData = this.form.get('eventData')?.value;
    const locationData = this.form.get('locationData')?.value;

    const startDate = this.setDateTime(
      eventData.startDate,
      eventData.startTime
    );
    const endDate = this.setDateTime(eventData.endDate, eventData.endTime);

    const baseEventData = {
      ...eventData,
      startDate: startDate,
      endDate: endDate,
      locationId: locationData.locationId,
    };

    if (this.eventId) {
      this.updateEvent(this.eventId, baseEventData);
    } else {
      this.createEvent(baseEventData, locationData);
    }
  }

  createEvent(baseEventData: any, locationData: any): void {
    const client = this.getClient();
    const tasks: TaskEventPost[] = this.tasks;
    const employeeIds: number[] = this.selectedEmployeeIds;
    const supplierIds: number[] = this.selectedSupplierIds;

    const dataPost: EventPost = {
      title: baseEventData.title,
      description: baseEventData.description,
      eventType: baseEventData.eventType,
      startDate: baseEventData.startDate,
      endDate: baseEventData.endDate,
      status: baseEventData.status,
      clientId: client?.idClient ?? 0,
      client: this.showClientForm ? (client as ClientPost) : undefined,
      locationId: locationData.locationId,
      location: locationData.isNewLocation
        ? (this.form.get('locationData.locationForm')?.value as LocationPost)
        : undefined,
      employeeIds: employeeIds.length > 0 ? employeeIds : undefined,
      supplierIds: supplierIds.length > 0 ? supplierIds : undefined,
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
    /* if (this.form.get('clientData.clientForm')?.invalid) {
        this.alertService.showErrorToast('Complete correctamente los datos del cliente.');
      } */
    const clientDataGroup = this.form.get('clientData') as FormGroup;
    const clientForm = clientDataGroup.get('clientForm') as FormGroup;

    const clientData: ClientPost = clientForm.value;
    clientData.documentNumber = clientDataGroup.get(
      'clientDocumentNumber'
    )?.value;
    clientData.documentType = clientDataGroup.get('clientDocumentType')?.value;

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
      supplierIds: this.selectedSupplierIds,
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
    return this.form.get('locationData.locationForm') as FormGroup;
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
  toggleSupplierSelection(id: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedSupplierIds.includes(id)) {
        this.selectedSupplierIds.push(id);
      }
    } else {
      this.selectedSupplierIds = this.selectedSupplierIds.filter(
        (sid) => sid !== id
      );
    }
  }
  //endregion Employee Methods

  setDateTime(date: any, time: any): any {
    try {
      const split = time.includes('AM') ? 'AM' : 'PM';
      const [hours, minutes] = time.split(split)[0].split(':').map(Number); // 6:00 AM
      const updatedDate = new Date(date);
      updatedDate.setHours(hours, minutes);
      return toLocalDateTimeString(updatedDate);
    } catch (error: any) {
      this.alertService.showErrorToast(`Error al cargar los horarios`);
      console.error('Error', error);
    }
  }
}
