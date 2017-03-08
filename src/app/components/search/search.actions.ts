import { Injectable } from '@angular/core';
import { get } from 'lodash';
import { Action } from 'redux';
//import { ThunkAction } from 'redux-thunk';
import { NgRedux } from '@angular-redux/store';
import * as BrowserLocation from 'browser-location';
import { 
  LOCATION_TYPES,  
  LOCATION_STATUS, 
  LOCATION_STATUS_OPTIONS,
  LOCATION_TYPE_OPTIONS 
} from './search.options';

export interface ISearchAction extends Action {
  type: string,
  point?: number[],
  sortBy?: string,  
  name?: string,
  city?: string,
  state?: string,
  params?: any,
  searchType?: string,
};

export interface IState {
  path: string,
  location?: {
    foundLocation?: string,
    requestedLocation?: boolean,
    point: number[],
  },
  search?: {
    type?: string,
    typeOptions?: string[]
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
  USE_SEARCH_TYPE: 'SEARCH_USE_SEARCH_TYPE',
  SET_SORT_BY: 'SEARCH_SORT_BY',
  SET_OTHER_LOCATION: 'SEARCH_SET_OTHER_LOCATION',
  SET_NAME: 'SEARCH_SET_NAME',
};

@Injectable()
export class SearchActions {

  constructor(private ngRedux: NgRedux<any>) {}

  public getNgRedux(): NgRedux<any> {
    return this.ngRedux;
  }
  
  public initial() {
    this.ngRedux.dispatch({
      type: ACTIONS.INITIAL,
    });
  }

  public initialWithParams(params: any){
    this.ngRedux.dispatch({
      type: ACTIONS.INITIAL_WITH_PARAMS,
      params: params,
    });  
  };

  public findLocation(){
    this.ngRedux.dispatch(this.getLocation() as any);
  };

  private getLocation(){
    return (dispatch, getState) => {
      dispatch({
        type: ACTIONS.FIND_LOCATION,
      });  
      // try to get GPS location
      BrowserLocation.get({}, (err, result) => {
        if (err) {
          dispatch(this.notFoundLocation());
          return;
        }
        const point: number[] = [ 
          get(result, 'coords.latitude', 0.0),
          get(result, 'coords.longitude', 0.0) 
        ]
        dispatch(this.foundLocation(point));
      });
      // if there is no response after 5 seconds then
      // set as not found
      setTimeout(() => {
        let foundType = get(getState(), 'location.foundLocation');
        if (foundType == 'LOOKING') {
          dispatch(this.notFoundLocation());
        }
      },10000); 
    }
  };

  private foundLocation(point: number[]): ISearchAction {
    return {
      type: ACTIONS.FOUND_LOCATION,
      point: point,
    };  
  };

  private notFoundLocation(): ISearchAction {
    return {
      type: ACTIONS.NOT_FOUND_LOCATION,
    };
  };

  public useCurrentLocation(){
    this.ngRedux.dispatch({
      type: ACTIONS.USE_CURRENT_LOCATION,
    });  
  };

  public useSearchType(searchType: string){
    console.log(searchType);
    this.ngRedux.dispatch({
      type: ACTIONS.USE_SEARCH_TYPE,
      searchType: searchType,
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
      sortBy: sortBy,
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

export function searchReducer(state: IState = initialState, action: ISearchAction): any {
  let pointParam;
  switch (action.type) {
    case ACTIONS.FIND_LOCATION:
      return Object.assign({}, state, {
        location: {
          foundLocation: LOCATION_STATUS.LOOKING,
          requestedLocation: true,     
        },
      });
    case ACTIONS.FOUND_LOCATION:
      pointParam = action.point ? { point: { coordinates: action.point } } : {};
      return Object.assign({}, state, {
        location: {
          foundLocation: LOCATION_STATUS.FOUND,
          requestedLocation: true,     
          point: action.point,
        },
        search: {
          type: LOCATION_TYPES.CURRENT,
          typeOptions: LOCATION_STATUS_OPTIONS[LOCATION_STATUS.FOUND],
        },
        queryParams: Object.assign({}, pointParam, {
          sortBy: LOCATION_TYPE_OPTIONS[action.searchType].defaultSort,
        }),
      });
    case ACTIONS.NOT_FOUND_LOCATION:
      return Object.assign({}, state, {
        location: {
          foundLocation: LOCATION_STATUS.NOT_FOUND,
          requestedLocation: true,     
          point: action.point,
        },
        search: {
          type: LOCATION_TYPES.OTHER,
          typeOptions: LOCATION_STATUS_OPTIONS[LOCATION_STATUS.NOT_FOUND],
        },
        queryParams: {
          sortBy: LOCATION_TYPE_OPTIONS[LOCATION_TYPES.OTHER].defaultSort,
        },
      });
    case ACTIONS.USE_SEARCH_TYPE:
      pointParam = state.location.point ? { point: { coordinates: state.location.point } } : {};
      return Object.assign({}, state, {
        search: {
          type: action.searchType,
          typeOptions: LOCATION_STATUS_OPTIONS[state.location.foundLocation],
        },
        queryParams: Object.assign({}, pointParam, {
          sortBy: LOCATION_TYPE_OPTIONS[action.searchType].defaultSort,
        }),
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
