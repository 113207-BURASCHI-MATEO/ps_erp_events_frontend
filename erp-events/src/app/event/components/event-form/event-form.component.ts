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
import { Task } from '../../../models/task.model';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '../../../models/location.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LocationService } from '../../../services/location.service';
import { Country, Province } from '../../../models/generic.model';
import { docValidator } from '../../../validators/document.validator';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';
import { first } from 'rxjs';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { log } from 'console';

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
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
})
export class EventFormComponent {
  form: FormGroup;
  eventId: number | null = null;
  tasks: Task[] = [];
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
    private employeeService: EmployeeService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      eventType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
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
        city: new FormControl(
          { value: '', disabled: !this.isNewLocation },
          [Validators.required]
        ),
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
        latitude: new FormControl({ value: '', disabled: !this.isNewLocation }),
        longitude: new FormControl({ value: '', disabled: !this.isNewLocation })
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
      }),
      
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id;
        this.loadEvent(this.eventId);
        this.form.get('isNewLocation')?.disable(); // checkbox bloqueado en edición
        this.form.get('locationForm')?.disable(); // form no se usa en edición
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
    console.log('Empleados:', this.employees);
    

    this.form.get('clientDocumentNumber')?.statusChanges.subscribe((status) => {
      const docType = this.form.get('clientDocumentType')?.value;
      const docNumber = this.form.get('clientDocumentNumber')?.value;

      if (status === 'VALID' && docType && docNumber) {
        this.clientService.getByDocument(docType, docNumber).subscribe({
          next: (client) => {
            console.log('Cliente encontrado:', client);

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
      error: (err) => console.error('Error cargando ubicaciones', err),
    });
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (res) => (this.employees = res),
      error: (err) => console.error('Error cargando empleados', err),
    });
  }

  loadEvent(id: number): void {
    this.eventService.getById(id).subscribe({
      next: (event: Event) => {
        this.form.patchValue({
          ...event,
          startDate: event.startDate,
          endDate: event.endDate,
          clientId: event.client?.idClient,
          locationId: event.location?.idLocation,
        });
      },
      error: (err) => console.error('Error al cargar evento', err),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { isNewLocation, locationForm, taskForm, ...baseData } =
      this.form.value;

    if (this.eventId) {
      const dataPut: EventPut = {
        idEvent: this.eventId,
        ...baseData,
      };
      console.log('dataPut', dataPut);

      /* this.eventService.update(this.eventId, dataPut).subscribe({
        next: () => this.router.navigate(['/events']),
        error: (err) => {
          alert('Error al actualizar evento: ' + err.message);
          console.error(err);
        },
      }); */
    } else {
      if (isNewLocation) {
        this.locationService.create(locationForm).subscribe({
          next: (newLoc) => {
            const dataPost: EventPost = {
              ...baseData,
              locationId: newLoc.idLocation,
            };
            this.createEvent(dataPost);
          },
          error: (err) => {
            alert('Error al crear ubicación: ' + err.message);
            console.error(err);
          },
        });
      } else {
        const dataPost: EventPost = {
          ...baseData,
        };
        this.createEvent(dataPost);
      }
    }
  }

  private createEvent(data: EventPost): void {
    console.log('dataPost', data);
    /* this.eventService.create(data).subscribe({
      next: () => this.router.navigate(['/events']),
      error: (err) => {
        alert('Error al crear evento: ' + err.message);
        console.error(err);
      },
    }); */
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

    const task: Task = {
      idTask: Date.now(), // ID temporal
      title: formValue.title!,
      description: formValue.description!,
      status: formValue.status!,
      idEvent: 0,
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
 /*  toggleEmployeeSelection(id: number): void {
    const index = this.selectedEmployeeIds.indexOf(id);
    if (index >= 0) {
      this.selectedEmployeeIds.splice(index, 1);
    } else {
      this.selectedEmployeeIds.push(id);
    }
  } */

  /* isEmployeeSelected(id: number): boolean {
    return this.selectedEmployeeIds.includes(id);
  }
  
  onEmployeeCheckboxChange(checked: boolean, id: number): void {
    if (checked) {
      this.selectedEmployeeIds.push(id);
      console.log('Empleados seleccionados:', this.selectedEmployeeIds);
      
    } else {
      this.selectedEmployeeIds = this.selectedEmployeeIds.filter(eid => eid !== id);
    }
  } */

    toggleEmployeeSelection(id: number, checked: boolean): void {
      if (checked) {
        if (!this.selectedEmployeeIds.includes(id)) {
          this.selectedEmployeeIds.push(id);
          console.log('Empleados seleccionados:', this.selectedEmployeeIds);
        }
      } else {
        this.selectedEmployeeIds = this.selectedEmployeeIds.filter(eid => eid !== id);
      }
    }
  //endregion Employee Methods
}
