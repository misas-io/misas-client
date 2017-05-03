import { Injectable } from '@angular/core';
import get from 'lodash/get';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as BrowserLocation from 'browser-location';

interface LocationName {
  state: String;
  country: String;
}

interface LocationCoordinates {
  lat: number;
  lon: number;
}

export interface FieldEvent {
  location?: LocationName | LocationCoordinates;
};

@Injectable()
export class SearchFieldsObserver {
  
  public _fieldEvents: BehaviorSubject<FieldEvent>;
  constructor() {
    this._fieldEvents = <BehaviorSubject<FieldEvent>>new BehaviorSubject(null);
    // get url fields if any, these preceed location
    // get location if any, these preceed getting location from server based on IP
    try {
      BrowserLocation.get((err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('got coordinates');
        let fieldEvent = {
          query: "",
          location: {
            lat: get(result, 'coords.latitude', 0.0),
            lon: get(result, 'coords.longitude', 0.0) 
          }
        }; 
        this._fieldEvents.next(fieldEvent);
      });
    } catch (err) {
      console.log('got error');
      console.log(err);
      this._fieldEvents.next({});
    }
  };
  fieldEvents(callback: any): void {
    this._fieldEvents.subscribe(callback);
  }
  init(): void {
  };
};
