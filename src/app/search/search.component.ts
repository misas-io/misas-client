import { set, get, isEqual, isNil, isEmpty } from 'lodash';
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
  // current location info
  locationValue: any = {};
  @Output() locationChange: any = new EventEmitter<any>();
  get location(): any {
    return this.locationValue;
  };
  set location(value) {
    this.locationValue = value;
    this.locationChange.emit(this.grpsValue);
  };
	// form properties
	public searchForm: FormGroup;
  public oldSearchFormValue: any = {};
  private searchFormSub: Subscription;
  private gettingLocation: boolean = false;
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
  @Output() grpsChange: EventEmitter<any> = new EventEmitter<any>();
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
    const locationOption: any = get(s.queryParams,'locationOption', '');
    const sortOption: string = get(s.queryParams,'sortBy', '');
    const name: string = get(s.queryParams,'name','');
    const cityState: string = get(s.queryParams,'cityState','');
		this.searchForm = this.fb.group({
			name: '',
      cityState: '',
			city: '',
			state: '',
			useMap: true,
			sortBy: '',
			polygon: null,
			locationOption: '' 
		});

    this.searchFormSubscribe();

    if (locationOption !== '')
      this.locationOption = locationOption;
    this.sortOptions = getLocationOptionSortOptions(this.locationOption);
    if (sortOption !== '')
      this.sortBy = sortOption;
    if (cityState && cityState !== '')
      this.cityState = cityState;
    if (name && name !== '')
      this.name = name;

    // on changes to location, set sorting to default if available
    this.searchForm
      .controls['locationOption']
      .valueChanges
      .subscribe((locationOpt) => {
        let defaultSort = get(locationOpt, 'defaultSort');
        this.searchForm.controls['sortBy'].setValue(defaultSort);
      });

        
    // setup search grps 
    this.searchOptions.subscribe((options) => {
      this._switchQuery(options);
    });
  };

  ngOnInit(): void {
    // currently getting location flag
    this.gettingLocation = true;
    // setup to get current location 
    this.searchFields.fieldEvents((result) => {
      if (!result || !(result.location)) {
        this.gettingLocation = false;
        return;
      }
      let location = result.location;
      let lat = get(result, 'location.lat', 0.0);
      let lon = get(result, 'location.lon', 0.0);
      if (lat != 0.0 && lon != 0.0) {
        this.location = { coordinates: [lon, lat] };
        this.gettingLocation = true;
        // only use location when using the current location option
        if (this.locationOption === 'CURRENT_LOCATION') {
          if (!this.sortBy || this.sortBy === '') {
            this.sortBy = 'BEST';
          }
          console.log('sending next search options');
          // directly send new options
          this.searchOptions.next({
            point: this.location,
            sort_by: this.sortBy 
          });
        }
      } else if (this.locationOption === '') {
        this.gettingLocation = false;
      }
    });
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
  /**
   * Use the new query and unsubscribe from the old query
   */
  public _switchQuery(options) {
    // check if we got any options
    console.log(`switched query`, options);
    this.loadingBar.reset();
    this.loadingBar.addLoading();
    if (isNil(options) || isEmpty(options)){
      this.grps = {};
      this.loadingBar.removeLoading();
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
        this.loadingBar.removeLoading();
        this.grps = get(data,'searchGrps', null);
        this.loading = loading;
      }
    );
  };
  
  private searchFormSubscribe() {
    // on changes update URL parameters and make the approriate query
    this.searchFormSub = this.searchForm
                           .valueChanges
                           .debounceTime(300)
                           .subscribe((data) => {
      let queryParams = {};
      let locationOption: string = get(data, 'locationOption.value', '');  
      let cityState: string = get(data, 'cityState', '');  
      let name: string = get(data, 'name', '');  
      let sortOption = get(data, 'sortBy');  
      let {
        form,
        formChanged,
        locationOptionChanged,
        sortByChanged
      } = this.formChanged(data);
      if (!formChanged) {
        console.log(`form did not changed`);
        this.oldSearchFormValue = data;
        return;
      }
      if (locationOption) { 
        set(queryParams, 'locationOption', locationOption);
        this.sortOptions = getLocationOptionSortOptions(locationOption);
      }
      if (cityState && cityState !== '') {
        set(queryParams, 'cityState', cityState);
      }
      if (name && name !== '') {
        set(queryParams, 'name', name);
      }
      console.log(`searchForm changed`, data);
      if (sortOption) set(queryParams, 'sortBy', sortOption);
      // change URL parameters here
      this.router.navigate([], {
        queryParams: queryParams,
        relativeTo: this.r
      });
      // send new searchOptions based on form fields 
      if (locationOption === 'CURRENT_LOCATION') {
        console.log('new current_location search');
        this.searchOptions.next({
          point: this.location,
          sort_by: this.sortBy 
        });
      // if OTHER_LOCATION query is wanted
      } else if (locationOption === 'OTHER_LOCATION') {
        console.log('new other_location search');
        if (cityState && cityState !== '') {
          let [city, state] = cityState.split(',');
          let query: any = {};
          if (city) {
            city = city.trim();
            query.city = city;
          }
          if (state) {
            state = state.trim();
            query.state = state;
          }
          if (name && name !== '') {
            name = name.trim();
            query.name = name;
          }
          //query.point = this.location;
          query.sort_by = this.sortBy;
          console.log(query);
          this.searchOptions.next(query);
        }
      }
      this.oldSearchFormValue = data;
    });
  };

  private searchFormUnsubscribe() {
    this.searchFormSub.unsubscribe();
  };

  /* SET and GET functions */
  // sortBy form field
  get sortBy(): string {
    return this.searchForm.controls['sortBy'].value;
  };
  set sortBy(value: string){
    this.searchForm.controls['sortBy'].setValue(value);
  };
  get cityState(): string {
    return this.searchForm.controls['cityState'].value;
  };
  set cityState(value: string){
    this.searchForm.controls['cityState'].setValue(value);
  };
  get name(): string {
    return this.searchForm.controls['name'].value;
  };
  set name(value: string){
    this.searchForm.controls['name'].setValue(value);
  };
  // locationOption form field
  get locationOption(): string {
    const locationOption = this.searchForm.controls['locationOption'].value;
    return get(locationOption, 'value','');
  };
  set locationOption(value: string){
    const locationOption: any = getLocationOption(value);
    this.searchForm.controls['locationOption'].setValue(locationOption.object);
  };

  private getSearchFormValue(): any {
    return this.searchForm.value;
  };


  /* HELPER functions */
  private formChanged(data: any): any {
    const currentSearchFormValue: any = data;
    //console.log(data);
    //console.log(this.oldSearchFormValue);
    return {
      form: currentSearchFormValue,
      formChanged: !isEqual(currentSearchFormValue, this.oldSearchFormValue),
      locationOptionChanged: !isEqual(currentSearchFormValue.locationOption, this.oldSearchFormValue.locationOption),
      sortByChanged: !isEqual(currentSearchFormValue.sortBy, this.oldSearchFormValue.sortBy),
    };
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
