export type StatusSend = 'SENT' | 'VISUALIZED';

export interface KeyValueCustomPair {
  key: string;
  value: string;
}

export interface Notification {
  idNotification: number;
  recipient: string;
  idContact: number;
  subject: string;
  idTemplate: number;
  templateName: string;
  body: string;
  dateSend: string;
  statusSend: StatusSend;
  variables: KeyValueCustomPair[];
}

export interface NotificationPost {
  idTemplate: number;
  contactIds: number[];
  subject: string;
  variables: KeyValueCustomPair[];
  notificationType?: string;
}
