import { set, get, findIndex, isNil, isEmpty } from 'lodash';
import { 
  Component, 
  Input, 
  Output, 
  OnChanges, 
  SimpleChange, 
  EventEmitter, 
  OnInit
} from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Apollo, ApolloQueryObservable} from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RxObservableQuery } from 'apollo-client-rxjs';
import 'rxjs/add/operator/map';
import 'apollo-client-rxjs';
// MISAS modules 
import { SearchFieldsObserver } from '../services/search-fields-observer';
import { LoadingBar } from '../services/loading-bar';
import { 
  LocationOptions, 
  SortOptions, 
  EventTypeOptions,
  getLocationOption,
  getLocationOptionSortOptions,
  isCitySearchVisible
} from './search.options';
import { SearchAnimations } from './search.animations';
import { SearchGrps } from './search.model';

@Component({
  selector: 'grps-search', 
  styleUrls: [ './search.component.css' ],
  templateUrl: './search.component.html',
  providers: [ SearchFieldsObserver ],
  animations: SearchAnimations,
})
export class SearchComponent implements OnInit {
  @Input('queryBounds') queryBounds: Number[][];
  @Output() currentLocation: any = new EventEmitter<any>();
	// form properties
	public searchForm: FormGroup;
  public loading = false;
  public search: any = {};
  public locationOptions: any[] = LocationOptions;
  public sortOptions: Array<any>;
  public animationOptions: any = {};
  public eventTypes: any[] = EventTypeOptions;
  private searchOptions: BehaviorSubject<any> = new BehaviorSubject<any>({});
  // grps property
  private grpsObs: Observable<ApolloQueryResult<any>>;
  private grpsSub: any;
  grpsValue: any = {};
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

	constructor(
    public loadingBar: LoadingBar,
		private apollo: Apollo, 
		private searchFields: SearchFieldsObserver, 
		private fb: FormBuilder,
    private router: Router,
    private r: ActivatedRoute
	) {

    // setup initial values based on URL
    const s: ActivatedRouteSnapshot = r.snapshot;
    const locationOption: string = getLocationOption(get(s.queryParams,'locationOption', ''));
    const sortOption: string = get(s.queryParams,'sortBy', '');
		this.searchForm = this.fb.group({
			name: '',
			city: '',
			state: '',
			useMap: true,
			sortBy: sortOption,
			polygon: null,
			locationOption: get(locationOption, 'object')
		});
    this.sortOptions = getLocationOptionSortOptions(get(locationOption,'object.value',''));
    this.loadingBar.addLoading();

    // on changes to location, set sorting to default if available
    this.searchForm.controls['locationOption'].valueChanges.subscribe((locationOpt) => {
      let defaultSort = get(locationOpt, 'defaultSort');
      this.searchForm.controls['sortBy'].setValue(defaultSort);
    });

    // on changes update URL parameters and make the approriate query
    this.searchForm.valueChanges.subscribe((data) => {
      let queryParams = {};
      let locationOption: string = get(data, 'locationOption.value', '');  
      let sortOption = get(data, 'sortBy');  
      if (locationOption) { 
        set(queryParams, 'locationOption', locationOption);
        // We don't have sortBy for this location type
        if (locationOption === 'SHARED_LOCATION')
          sortOption = undefined;
        this.sortOptions = getLocationOptionSortOptions(locationOption);
      }
      if (sortOption) set(queryParams, 'sortBy', sortOption);
      this.router.navigate([], {
        queryParams: queryParams,
        relativeTo: this.r
      });
    });

    // setup search grps 
    this.searchOptions.subscribe((options) => {
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
      this.search = options;
      this.grpsSub = this.grpsObs.subscribe(
        ({data, loading}) => {
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

  getFormFieldObserver(name: string): Observable<any> {
    return this.searchForm
      .get(name)
      .valueChanges;
  };
  /**
   * checks whether the city search field should be visible
   */
  public isCitySearchVisible(){
    let locationOption: any = this.searchForm.get('locationOption').value;
    let sortBy: string = this.searchForm.get('sortBy').value;
    if (locationOption && sortBy) {
      return isCitySearchVisible(locationOption.value, sortBy);
    }
    return false;
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
