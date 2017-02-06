import { get, isNil } from 'lodash';
import { Component, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';
import { Apollo, ApolloQueryObservable} from 'apollo-angular';
import { ApolloQueryResult, ObservableQuery } from 'apollo-client';
import { RxObservableQuery } from 'apollo-client-rxjs';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import 'rxjs/add/operator/map';

import { SearchFieldsObserver } from '../services/search-fields-observer';
import { SortOptions, EventTypeOptions } from './search.component.options';
import { SearchGrps } from './search.model';

@Component({
  selector: 'grps-search', 
  styleUrls: [ './search.component.css' ],
  templateUrl: './search.component.html',
  providers: [ SearchFieldsObserver ],
})
export class SearchComponent implements OnInit {
  @Input('queryBounds') queryBounds: Number[][];
  @Output() currentLocation: any = new EventEmitter<any>();
	// form properties
	public searchForm: FormGroup;
  /*
	public point: any = {
		coordinates: [-106.43022537231445, 31.721012524697652],
	};
  */
  public loading = true;
  public searchOptions: BehaviorSubject<any> = new BehaviorSubject<any>({
    sort_by: 'RELEVANCE'
  });
  public point: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public grpsObs: ApolloQueryObservable<any>;
  // grps property
  grpsValue: any;
  @Output()
  grpsChange: EventEmitter<any> = new EventEmitter<any>();
	@Input()
  get grps(): any {
    return this.grpsValue;
  };
  set grps(value) {
    this.grpsValue = value;
    this.grpsChange.emit(this.grpsValue);
  };
  public sortOptions: any[] = SortOptions;
  public eventTypes: any[] = EventTypeOptions;
  private searchArea: any = null;
  private advOptions = false;

	constructor(
		private apollo: Apollo, 
		private searchFields: SearchFieldsObserver, 
		private fb: FormBuilder
	) {
		this.grps = [];
		this.searchForm = this.fb.group({
			name: '',
			city: '',
			state: '',
			useMap: true,
			sortBy: "BEST",
			polygon: null,
			location: ''
		});
    // setup search grps 
    this.grpsObs = this.apollo.watchQuery({
      query: SearchGrps,
      variables: {},
    });
    this.grpsObs.subscribe(
      ({data, loading}) => {
        this.grps = get(data,'searchGrps', null);
        this.loading = loading;
        console.log('got result');
      }
    );
    this.grpsObs.refetch({
      sort_by: 'BEST'
    });
    /*
    this.searchOptions.subscribe((options) => {
      console.log(this.grpsObs);
      if (this.grps && this.grpsObs && this.grpsObs instanceof RxObservableQuery) {
        console.log(this.grpsObs.refetch);
        this.grpsObs.refetch(options);
        console.log('is instance');
      }
      console.log('options where updated to ');
    });
   */
  };

  ngOnInit(): void {
    // setup to get current location 
    this.searchFields.fieldEvents((result) => {
      if (!result || !(result.location))
        return;
      let location = result.location;
      let lat = get(result, 'location.lat', 0.0);
      let lon = get(result, 'location.lon', 0.0);
      if (lat != 0.0 && lon != 0.0) {
        console.log(`search.component: got new coordinates [${lon}, ${lat}]`);
        let currentLocation = { coordinates: [lon, lat] };
        this.currentLocation.emit(currentLocation);
        this.searchOptions.next({
          point: currentLocation,
          sort_by: 'BEST'
        });
      }
    });
  };

	/*
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes['queryBounds'] && !isNil(this.queryBounds)) {
      this.searchArea = {
        coordinates: this.queryBounds 
      };
    }
  };
	*/

  getFormFieldObserver(name: string): Observable<any> {
    return this.searchForm
      .get(name)
      .valueChanges;
  };

  query() {
    /*
		let point = this.searchModel.point;
    let name = this.searchModel.name;
    let sort_by = this.searchModel.sort_by;
    if (sort_by === "RELEVANCE") {
      this.searchModel.point = null;
    } else { 
      this.searchModel.name = null;
    } 
		*/
  };
};
