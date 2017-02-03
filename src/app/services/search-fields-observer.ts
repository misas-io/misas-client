import { Injectable } from '@angular/core';
import { get } from 'lodash';
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
  query: String;
  location: LocationName | LocationCoordinates;
};

@Injectable()
export class SearchFieldsObserver {
  
  private _fieldEvents: BehaviorSubject<FieldEvent>;
  constructor() {
    this._fieldEvents = <BehaviorSubject<FieldEvent>>new BehaviorSubject(null);
    // get url fields if any, these preceed location
    // get location if any, these preceed getting location from server based on IP
    BrowserLocation.get((err, result) => {
      if (err) {
        return;
      }
      let fieldEvent = {
        query: "",
        location: {
          lat: get(result, 'coords.latitude', 0.0),
          lon: get(result, 'coords.longitude', 0.0) 
        }
      }; 
      this._fieldEvents.next(fieldEvent);
    });
  };
  fieldEvents(callback: any): void {
    this._fieldEvents.subscribe(callback);
  }
  init(): void {
  };
};
