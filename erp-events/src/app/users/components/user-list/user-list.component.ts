import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ExportService } from '../../../services/export.service';
import { User } from '../../../models/user.model';
import { OptionsComponent } from '../../../shared/components/options/options.component';
import { UserService } from '../../../services/user.service';

import type { ColDef, GridApi, GridReadyEvent } from '@ag-grid-community/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { isPlatformBrowser } from '@angular/common';
import { ViewDialogComponent } from '../../../shared/components/view-dialog/view-dialog.component';
import { AlertService } from '../../../services/alert.service';
import { URLTargetType } from '../../../models/user.model';
import { renderIconField } from '../../../utils/render-icon';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ViewDialogComponent,
    OptionsComponent,
    AgGridAngular,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  isBrowser: boolean;

  users: User[] = [];
  allUsers: User[] = [];
  displayedColumns = [
    'idUser',
    'firstName',
    'lastName',
    'email',
    'role',
    'actions',
  ];
  gridApi!: GridApi<User>;
  searchValue: string = '';

  columnDefs: ColDef<User>[] = [
    { headerName: 'ID', field: 'idUser', sortable: true, filter: true },
    { headerName: 'Nombre', field: 'firstName', sortable: true, filter: true },
    { headerName: 'Apellido', field: 'lastName', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    {
      headerName: 'Rol',
      field: 'role.name',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('roleName'),
    },
    {
      headerName: 'Acciones',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (action: 'VIEW' | 'EDIT' | 'DELETE' | string, user: User) => {
          this.handleAction(action, user);
        },
        actions: [
          { label: 'Ver', icon: 'visibility', action: 'VIEW' },
          { label: 'Promocionar', icon: 'upgrade', action: 'ROLE' },
          { label: 'Eliminar', icon: 'delete', action: 'DELETE' },
        ],
      },
    },
  ];

  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  getRowId = (params: any) => params.data.idUser;

  onGridReady(params: GridReadyEvent<User>): void {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }
  private userService = inject(UserService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private exportService = inject(ExportService);
  private alertService = inject(AlertService);
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.allUsers = data;
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar usuarios: ${err.error.readableMessage}`
        );
      },
    });
  }

  onSearch(): void {
    if (this.gridApi) {
      this.gridApi.setGridOption(
        'quickFilterText',
        this.searchValue.trim().toLowerCase()
      );
    }
  }

  goToCreate(): void {
    this.router.navigate(['/users/create']);
  }

  viewUser(id: number): void {
    const user = this.users.find((u) => u.idUser === id);
    if (!user) return;

    this.dialog.open(ViewDialogComponent, {
      data: user,
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  editUser(id: number): void {
    this.router.navigate(['/users/edit', id]);
  }

  deleteUser(id: number): void {
    this.alertService.delete('este usuario').then((confirmed) => {
      if (confirmed) {
        this.userService.delete(id).subscribe({
          next: () => {
            this.users = this.users.filter((u) => u.idUser !== id);
            this.alertService.showSuccessToast(
              'Usuario eliminado correctamente.'
            );
          },
          error: () => {
            this.alertService.showErrorToast('Error al eliminar el usuario.');
          },
        });
      }
    });
  }

  upgradeUser(id: number): void {
    const roleOptions = [
      { value: URLTargetType.ADMIN, label: 'Administrador' },
      { value: URLTargetType.SUPERVISOR, label: 'Supervisor' },
      { value: URLTargetType.EMPLOYEE, label: 'Empleado' },
    ];

    this.alertService
      .selectOption<number>(
        'Asignar nuevo rol',
        'Seleccione un rol para el usuario:',
        roleOptions
      )
      .then((roleCode) => {
        if (roleCode === null) return;
        console.log('Rol seleccionado:', roleCode);
        this.userService.upgrade(id, roleCode).subscribe({
          next: (user) => {
            this.users = this.users.map((u) => (u.idUser === id ? user : u));
            this.alertService.showSuccessToast(
              'Usuario actualizado correctamente.'
            );
          },
          error: (err) => {
            this.alertService.showErrorToast(
              `Error al actualizar el usuario: ${err.error.readableMessage}`
            );
          },
        });
      });
  }

  goHome(): void {
    this.router.navigate(['/landing']);
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.users,
      'Usuarios',
      [['Nombre', 'Apellido', 'Email', 'Rol']],
      (user) => [user.firstName, user.lastName, user.email, user.role.name]
    );
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.users, 'Usuarios', (user) => ({
      ID: user.idUser,
      Nombre: user.firstName,
      Apellido: user.lastName,
      Email: user.email,
      Rol: user.role.name,
    }));
  }

  handleAction(
    actionType: 'VIEW' | 'EDIT' | 'DELETE' | string,
    user: User
  ): void {
    if (actionType === 'VIEW') {
      this.viewUser(user.idUser);
    } else if (actionType === 'EDIT') {
      this.editUser(user.idUser);
    } else if (actionType === 'DELETE') {
      this.deleteUser(user.idUser);
    } else if (actionType === 'ROLE') {
      this.upgradeUser(user.idUser);
    }
  }
}
