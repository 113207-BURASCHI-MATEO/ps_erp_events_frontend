import { Client, ClientPost } from './client.model';
import { Location, LocationPost } from './location.model';
import { Task, TaskEventPost } from './task.model';
import { Supplier } from './supplier.model';
import { Employee } from './employee.model';

export type EventType = 'CORPORATE' | 'SOCIAL' | 'CULTURAL' | 'ENTERTAINMENT';
export type EventStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'CANCELLED' | 'COMPLETED';

// DTO Principal
export interface Event {
  idEvent: number;
  title: string;
  description: string;
  eventType: EventType | string;
  startDate: string; // ISO DateTime string e.g., '2025-12-31T20:00:00'
  endDate: string;
  status: EventStatus | string;
  softDelete: boolean;
  creationDate: string;
  updateDate: string;
  client: Client;
  location: Location;
  employeesIds: number[];
  employees: Employee[]; // Relación con información de pagos y estados
  suppliersIds: number[];
  suppliers: Supplier[];
  guests: number[];
  tasks: Task[];
}

export interface EventPost {
  title: string;
  description: string;
  eventType: EventType | string;
  startDate: string;
  endDate: string;
  status: EventStatus | string;
  clientId: number;
  client?: ClientPost;
  locationId: number;
  location?: LocationPost;
  employeeIds?: number[];
  supplierIds?: number[];
  tasks: TaskEventPost[];
}
export interface EventPut {
  idEvent: number;
  title: string;
  description: string;
  eventType: EventType | string;
  startDate: string;
  endDate: string;
  status: EventStatus | string;
  locationId: number;
  employeeIds?: number[];
  supplierIds?: number[];
}
