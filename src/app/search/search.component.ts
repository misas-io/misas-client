import { get, isNil, isEmpty } from 'lodash';
import { Component, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { OnInit } from '@angular/core';
import { Apollo, ApolloQueryObservable} from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RxObservableQuery } from 'apollo-client-rxjs';
import 'rxjs/add/operator/map';
import 'apollo-client-rxjs';

import { SearchFieldsObserver } from '../services/search-fields-observer';
import { LoadingBar } from '../services/loading-bar';
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
  public loading = false;
  public initial = true;
  public searchOptions: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private grpsObs: Observable<ApolloQueryResult<any>>;
  private grpsSub: any;
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
  private advOptions = false;

	constructor(
    public loadingBar: LoadingBar,
		private apollo: Apollo, 
		private searchFields: SearchFieldsObserver, 
		private fb: FormBuilder
	) {
    this.loadingBar.addLoading();
		this.grps = {};
		this.searchForm = this.fb.group({
			name: '',
			city: '',
			state: '',
			useMap: true,
			sortBy: "",
			polygon: null,
			location: ''
		});
    // setup search grps 
    this.searchOptions.subscribe((options) => {
      console.log('got new searchOptions');
      console.log(options);
      // check if we got any options
      if (isNil(options) || isEmpty(options)){
        this.grps = {};
        return;
      }
      // unsubscribe from previous query if we are subscribed
      if (!isNil(this.grpsObs)){
        this.grpsSub.unsubscribe();
      }
      // generate new query
      this.loading = true;
      this.grpsObs = this.apollo.query<any>({
        query: SearchGrps,
        variables: options,
      });
      // subscribe to the new query to get results
      this.grpsSub = this.grpsObs.subscribe(
        ({data, loading}) => {
          console.log('got new results');
          console.log(data);
          if (!loading) 
            this.loadingBar.removeLoading();
          this.grps = get(data,'searchGrps', null);
          this.loading = loading;
        }
      );
    });
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
