export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Task {
  idTask: number;
  title: string;
  description: string;
  status: TaskStatus | string;
  idEvent: number;
  creationDate: string;
  updateDate: string;
  softDelete: boolean;
}

export interface TaskPost {
  title: string;
  description: string;
  status: TaskStatus;
  idEvent: number;
}

export interface TaskEventPost {
  title: string;
  description: string;
  status: TaskStatus;
}

export interface TaskPut {
  idTask: number;
  title: string;
  description: string;
  status: TaskStatus;
  idEvent: number;
}
