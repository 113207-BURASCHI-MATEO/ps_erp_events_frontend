import { Country, Province } from './generic.model';

export interface Location {
  idLocation: number;
  fantasyName: string;
  streetAddress: string;
  number: number;
  city: string;
  province: Province | string;
  country: Country | string;
  postalCode: number;
  latitude: number;
  longitude: number;
  creationDate: string;
  updateDate: string;
  softDelete: boolean;
}

export interface LocationPost {
  fantasyName: string;
  streetAddress: string;
  number: number;
  city: string;
  province: Province | string;
  country: Country | string;
  postalCode: number;
  latitude: string;
  longitude: string;
}

export interface LocationPut {
  idLocation: number;
  fantasyName: string;
  streetAddress: string;
  number: number;
  city: string;
  province: Province | string;
  country: Country | string;
  postalCode: number;
  latitude: string;
  longitude: string;
}
