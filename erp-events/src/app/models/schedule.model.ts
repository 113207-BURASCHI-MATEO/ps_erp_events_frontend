export interface TimeSchedule {
  idTimeSchedule: number;
  title: string;
  description: string;
  idEvent: number;
  scheduledTasks: Record<string, number>; // formato ISO -> idTask
}
export interface TimeSchedulePost {
  idEvent: number;
  title: string;
  description: string;
  scheduledTasks: Record<string, number>;
}
export interface TimeSchedulePut {
  idTimeSchedule: number;
  title: string;
  description: string;
  scheduledTasks: Record<string, number>;
}
