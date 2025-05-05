export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Task {
  idTask: number;
  title: string;
  description: string;
  status: TaskStatus | string;
  idEvent: number;
}
