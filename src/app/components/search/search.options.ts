import {get, findIndex } from 'lodash';

export const LOCATION_TYPES = {
  CURRENT: 'CURRENT_LOCATION',
  OTHER: 'OTHER_LOCATION',
};

export const LOCATION_STATUS = {
  FOUND: 'FOUND',
  NOT_FOUND: 'NOT_FOUND',
  LOOKING: 'LOOKING',
};

export const LOCATION_STATUS_OPTIONS = {
  FOUND: ['CURRENT_LOCATION', 'OTHER_LOCATION'],
  NOT_FOUND: ['OTHER_LOCATION'],
};

export const LOCATION_TYPE_OPTIONS = {
  CURRENT_LOCATION: {
    title: 'Mi Localizacion',
    value: 'CURRENT_LOCATION',
    icon: 'location_searching',
    cityStateSearch: false,
		pointNeeded: true,
    sorts: ['BEST', 'TIME', 'NEAR'],
    defaultSort: 'BEST',
  },
  OTHER_LOCATION: {
    title: 'Otra Localizacion',
    value: 'OTHER_LOCATION',
    icon: 'location_city',
    cityStateSearch: true,
		pointNeeded: false,
    sorts: ['TIME', 'RELEVANCE'],
    defaultSort: 'TIME',
  },
};

export const SORT_OPTIONS: any = {
  BEST: {
    title: 'Mas cercanas con el evento mas temprano',
    value: 'BEST',
  },
  RELEVANCE: {
    title: 'Nombre mas parecido',
    value: 'RELEVANCE',
    needName: true,
  },
  NEAR: {
    title: 'Mas cercanas',
    value: 'NEAR',
  },
  TIME: {
    title: 'Evento mas temprano',
    value: 'TIME'
  },
};

export const EventTypeOptions: any[] = [
  {
    name: 'Misa',
    value: 'misa'
  }, 
  {
    name: 'Confesion',
    value: 'confesion'
  }, 
  {
    name: 'Evento',
    value: 'evento'
  }
];

