import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from '@ag-grid-community/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

type GenericAction = 'VIEW' | 'EDIT' | 'DELETE';

interface GenericRenderParams<T> extends ICellRendererParams {
  onClick: (action: GenericAction, data: T) => void;
}

@Component({
  selector: 'app-employee-options',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss'
})
export class OptionsComponent<T = any> implements ICellRendererAngularComp {

  params!: GenericRenderParams<T>;

  agInit(params: GenericRenderParams<T>): void {
    this.params = params;
  }

  refresh(params: GenericRenderParams<T>): boolean {
    this.params = params;
    return true;
  }

  action(action: GenericAction): void {
    this.params.onClick(action, this.params.data);
  }
}
