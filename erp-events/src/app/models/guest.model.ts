export type GuestType = 'VIP' | 'REGULAR' | 'STAFF' | 'FAMILY' | 'FRIEND' | 'OTHER' | 'GENERAL'; // Ajusta según tus tipos reales

export interface Guest {
  idGuest: number;
  firstName: string;
  lastName: string;
  type: GuestType | string;
  email: string;
  note?: string;
}

export interface GuestPost {
  firstName: string;
  lastName: string;
  type: GuestType | string;
  email: string;
  note?: string;
  idEvent: number;
}

export interface GuestPut {
  idGuest: number;
  firstName: string;
  lastName: string;
  type: GuestType | string;
  email: string;
  note?: string;
  idEvent: number;
}
