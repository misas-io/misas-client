import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

export interface ISearchAction {
  type: string,
  point?: number[],
  sortBy?: string,  
  name?: string,
  city?: string,
  state?: string,
  params: any,
};

export interface IState {
  path: string,
  location?: {
    foundLocation?: string,
    requestedLocation?: boolean,
    point: number[],
  },
  requestedQuery?: boolean,
  queryParams?: {
    point?: {
      coordinates: number[],
    },
    city?: string,
    state?: string,
    sortBy?: string,
    name?: string,
  },
  params?: any,
};

export const SEARCH_PATH = 'search';

export const ACTIONS = {
  INITIAL: 'SEARCH_INITAL',
  INITIAL_WITH_PARAMS: 'SEARCH_INITAL_WITH_PARAMS',
  FIND_LOCATION: 'SEARCH_FIND_LOCATION',
  FOUND_LOCATION: 'SEARCH_FOUND_LOCATION',
  NOT_FOUND_LOCATION: 'SEARCH_NOT_FOUND_LOCATION',
  USE_CURRENT_LOCATION: 'SEARCH_USE_CURRENT_LOCATION',
  USE_OTHER_LOCATION: 'SEARCH_USE_OTHER_LOCATION',
  SET_OTHER_LOCATION: 'SEARCH_SET_OTHER_LOCATION',
  SET_SORT_BY: 'SEARCH_SORT_BY',
  SET_NAME: 'SEARCH_SET_NAME',
};

export const LOCATION_TYPES = {
  CURRENT: 'CURRENT_LOCATION',
  OTHER: 'OTHER_LOCATION',
};

export const LOCATION_STATUS = {
  FOUND: 'FOUND',
  NOT_FOUND: 'NOT_FOUND',
  LOOKING: 'LOOKING',
};

@Injectable()
export class SearchActions {

  constructor(private ngRedux: NgRedux<any>) {}
  
  public initial() {
    this.ngRedux.dispatch({
      type: ACTIONS.INITIAL,
      params: {},
      data: {}
    });
  }

  public initalWithParams(params: any){
    this.ngRedux.dispatch({
      type: ACTIONS.INITIAL_WITH_PARAMS,
      params: params,
      data: {}, 
    });  
  };

  public findLocation(){
    this.ngRedux.dispatch({
      type: ACTIONS.FIND_LOCATION,
      params: {},
      data: {
        retrivingLocation: true,
      }, 
    });  
  };

  public foundLocation(point: number[]){
    this.ngRedux.dispatch({
      type: ACTIONS.FOUND_LOCATION,
      point: point,
    });  
  };

  public notFoundLocation(){
    this.ngRedux.dispatch({
      type: ACTIONS.NOT_FOUND_LOCATION,
    });  
  };

  public useCurrentLocation(){
    this.ngRedux.dispatch({
      type: ACTIONS.USE_CURRENT_LOCATION,
    });  
  };

  public useOtherLocation(){
    this.ngRedux.dispatch({
      type: ACTIONS.USE_OTHER_LOCATION,
    });  
  };

  public setOtherLocation(city: string, state: string){
    this.ngRedux.dispatch({
      type: ACTIONS.SET_OTHER_LOCATION,
      city: city,
      state: state,
    });  
  };

  public setSortBy(sortBy: string){
    this.ngRedux.dispatch({
      type: ACTIONS.SET_SORT_BY,
      params: {},
      data: {
        location: LOCATION_TYPES.OTHER, 
        queryParams: {
          sortBy: sortBy,
        },
      }, 
    });  
  };

  public setName(name: string){
    this.ngRedux.dispatch({
      type: ACTIONS.SET_NAME,
      name: name
    });  
  };
};

const initialState: IState = {
  path: 'search',
};

function searchReducer(state: IState = initialState, action: ISearchAction): any {
  switch (action.type) {
    case ACTIONS.FIND_LOCATION:
      return Object.assign({}, state, {
        location: {
          foundLocation: LOCATION_STATUS.LOOKING,
          requestedLocation: true,     
        },
      });
    case ACTIONS.FOUND_LOCATION:
      return Object.assign({}, state, {
        location: {
          foundLocation: LOCATION_STATUS.FOUND,
          requestedLocation: true,     
          point: action.point,
        },
      });
    case ACTIONS.NOT_FOUND_LOCATION:
      return Object.assign({}, state, {
        location: {
          foundLocation: LOCATION_STATUS.NOT_FOUND,
          requestedLocation: true,     
          point: action.point,
        },
      });
    case ACTIONS.USE_CURRENT_LOCATION:
      return Object.assign({}, state, {
        location: Object.assign({}, state.location, {
          use: LOCATION_TYPES.CURRENT
        }),
        queryParams: {
          point: {
            coordinates: state.location.point,
          },
          sortBy: 'BEST',
        }
      });
    case ACTIONS.USE_OTHER_LOCATION: 
      return Object.assign({}, state, {
        location: Object.assign({}, state.location, {
          use: LOCATION_TYPES.OTHER,
        }),
        queryParams: {
          sortBy: 'TIME',
        },
      });
    case ACTIONS.SET_OTHER_LOCATION: 
      return Object.assign({}, state, {
        queryParams: Object.assign({}, state.queryParams, {
          city: action.city,
          state: action.state,
        }),
      });
    case ACTIONS.SET_SORT_BY: 
      return Object.assign({}, state, {
        queryParams: Object.assign({}, state.queryParams, {
          sortBy: action.sortBy,
        }),
      });
    case ACTIONS.SET_NAME: 
      return Object.assign({}, state, {
        queryParams: Object.assign({}, state.queryParams, {
          name: action.name,
        }),
      });
    // INITIAL ACTIONS
    case ACTIONS.INITIAL_WITH_PARAMS:
      return Object.assign({}, state, {
        params: action.params,    
      });
    case ACTIONS.INITIAL:
    default:    
      return initialState;
  }    
};
