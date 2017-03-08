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
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RxObservableQuery } from 'apollo-client-rxjs';
import 'rxjs/add/operator/map';
import 'apollo-client-rxjs';
// MISAS modules 
import { LoadingBar } from '../../services/loading-bar';
import { 
	LOCATION_STATUS,
  LOCATION_STATUS_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  SORT_OPTIONS
} from './search.options';
import { SearchAnimations } from './search.animations';
import { SearchGrps } from './search.model';
import { SearchActions } from './search.actions';

@Component({
  selector: 'grps-search', 
  styleUrls: [ './search.component.css' ],
  templateUrl: './search.component.html',
  providers: [ SearchActions ],
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

  public locationDetermined: boolean;
  public searchType: string;
  public searchTypes: string[];
  public sortBy: string;
  public LocationStatusOptions: any = LOCATION_STATUS_OPTIONS;
  public LocationTypeOptions: any = LOCATION_TYPE_OPTIONS;
  public animationOptions: any = {};
  public SortOptions: any = SORT_OPTIONS;
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
		private fb: FormBuilder,
    private router: Router,
    private r: ActivatedRoute,
		public actions: SearchActions
	){

    // setup initial values based on URL
    const s: ActivatedRouteSnapshot = r.snapshot;
		/*
    const locationOption: any = get(s.queryParams,'locationOption', '');
    const sortOption: string = get(s.queryParams,'sortBy', '');
    const name: string = get(s.queryParams,'name','');
    const cityState: string = get(s.queryParams,'cityState','');
		*/
    // setup variables based on state
    let ngRedux = this.actions.getNgRedux();
    ngRedux.subscribe(() => {
      let state = ngRedux.getState();
      console.log('got updated state');
      console.log(state);
      let foundLocation = get(state, 'location.foundLocation', undefined);
      this.locationDetermined = foundLocation == LOCATION_STATUS.FOUND || foundLocation == LOCATION_STATUS.NOT_FOUND;
      this.searchType = get(state, 'search.type', undefined);
      this.searchTypes = get(state, 'search.typeOptions', undefined);
      this.sortBy = get(state, 'queryParams.sortBy', undefined);
    });
     
		if (isEmpty(s.queryParams)) {
			actions.initial();
		} else {
			actions.initialWithParams(s.queryParams);
		}
		// get GPS location if possible
		actions.findLocation();
		/*
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
		*/
  };

  ngOnInit(): void {
		/*
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
		*/
  };
    
};
