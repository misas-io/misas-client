import {get, findIndex } from 'lodash';

export const LocationOptions: any[] = [ 
  {
    title: 'Mi Localizacion',
    object: { 
      value: 'CURRENT_LOCATION',
      icon: 'location_searching',
      cityStateSearch: false,
      sorts: ['BEST', 'TIME', 'NEAR'],
      defaultSort: 'BEST',
    },
  },
  {
    title: 'Otra Localizacion',
    object: { 
      value: 'OTHER_LOCATION',
      icon: 'location_city',
      cityStateSearch: true,
      sorts: ['TIME', 'RELEVANCE'],
      defaultSort: 'TIME',
    },
  }/*,
  {
    title: 'Localizacion Compartida',
    object: { 
      value: 'SHARED_LOCATION',
      icon: 'explore',
    },
  }
 */
];

export function getLocationOption(value: string): any {
  let i = findIndex(LocationOptions, (locationOption) => {
    let optionValue = get(locationOption, 'object.value');
    return optionValue && optionValue === value; 
  });
  return LocationOptions[i];
};

export function getLocationOptionSortOptions(value: string): Array<any> {
  let sorts: Array<any> = get(getLocationOption(value),'object.sorts',[]);
  return SortOptions.filter(option => {
    return sorts.indexOf(option.value) > -1;
  });
};

export function isCitySearchVisible(locationOption: string, sortOption: string){
  if ('OTHER_LOCATION' === locationOption){
    return true;
  }
  return false;
};

export const SortOptions: any[] = [
  {
    title: 'Mas cercanas con el evento mas temprano',
    value: 'BEST'
  },
  {
    title: 'Nombre mas parecido',
    value: 'RELEVANCE'
  },
  {
    title: 'Mas cercanas',
    value: 'NEAR'
  },
  {
    title: 'Evento mas temprano',
    value: 'TIME'
  },
];


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

