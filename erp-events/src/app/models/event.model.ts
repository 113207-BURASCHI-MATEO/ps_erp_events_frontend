import { Client } from './client.model';
import { Location } from './location.model';
import { Task } from './task.model';

export type EventType = 'CORPORATE' | 'SOCIAL' | 'CULTURAL' | 'ENTERTAINMENT';
export type EventStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'CANCELLED'
  | 'COMPLETED';

export interface Event {
  idEvent: number;
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  status: string;
  softDelete: boolean;
  creationDate: string;
  updateDate: string;
  client: Client;
  location: Location;
  employees: number[];
  suppliers: number[];
  guests: number[];
  tasks: Task[];
}

export interface EventPost {
  title: string;
  description: string;
  eventType: EventType | string;
  startDate: string; // ISO 8601 format e.g. '2025-12-31T20:00:00'
  endDate: string;
  status: EventStatus | string;
  clientId: number;
  locationId: number;
  employeeIds?: number[];
  supplierIds?: number[];
  guestIds?: number[];
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
  guestIds?: number[];
}
