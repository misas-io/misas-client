import { 
  Component, 
  Input, 
  Output, 
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Unsubscribe } from 'redux';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import get = require('lodash/get');
import isNil = require('lodash/isNil');
import isEmpty = require('lodash/isEmpty');
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
export class SearchComponent implements OnDestroy  {
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
  public cityStateChanged = new Subject<string>();
  public nameChanged = new Subject<string>();
  public LocationStatusOptions: any = LOCATION_STATUS_OPTIONS;
  public LocationTypeOptions: any = LOCATION_TYPE_OPTIONS;
  public SortOptions: any = SORT_OPTIONS;
  public animationOptions: any = {};
  // grps property
  private grpsObs: Observable<ApolloQueryResult<any>>;
  private grpsSub: Subscription;
  private stateSub: Unsubscribe;
  private subscriptions: { [key: string]: Subscription } = {};
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
    this.stateSub = ngRedux.subscribe(() => {
      let state = ngRedux.getState().search;
      let foundLocation = get(state, 'location.foundLocation', undefined);
      this.locationDetermined = foundLocation == LOCATION_STATUS.FOUND || foundLocation == LOCATION_STATUS.NOT_FOUND;
      if (this.locationDetermined)
        this.loadingBar.reset();
      else 
        this.loadingBar.addLoading();
      this.searchType = get(state, 'search.type', undefined);
      this.searchTypes = get(state, 'search.typeOptions', undefined);
      this.sortBy = get(state, 'queryParams.sortBy', undefined);
      this.router.navigate([], {
        queryParams: {
          state: JSON.stringify(state)
        },
        relativeTo: this.r
      });
			if (state.queryParams)
				this._switchQuery(state.queryParams);
    });

		this.subscriptions['cityState'] = this.cityStateChanged
			.debounceTime(300) // wait 300ms after the last event before emitting last event
			.distinctUntilChanged() // only emit if value is different from previous value
			.subscribe((cityState) => {
				let [city, state] = cityState.split(',');
				this.actions.setOtherLocation(city, state);
			});

		this.subscriptions['nameChanged'] = this.nameChanged
			.debounceTime(300) // wait 300ms after the last event before emitting last event
			.distinctUntilChanged() // only emit if value is different from previous value
			.subscribe((name) => {
				this.actions.setName(name);
			});
     
		if (isEmpty(s.queryParams)) {
			actions.initial();
      // get GPS location if possible
      actions.findLocation();
		} else {
      let state = JSON.parse(decodeURIComponent(s.queryParams['state']));
			actions.initialWithParams({state});
		}
  };


	public _switchQuery(options) {
    // check if we got any options
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

    this.grpsObs = this.apollo.query<any>({
      query: SearchGrps,
      variables: options,
    });
    // subscribe to the new query to get results
    this.grpsSub = this.grpsObs.subscribe(
      ({data, loading}) => {
        this.loadingBar.removeLoading();
        this.grps = get(data,'searchGrps', null);
      }
    );
	};

	public cityStateChange(field: string){
		this.cityStateChanged.next(field);
	}	

	public nameChange(field: string){
		this.nameChanged.next(field);
	}	

  ngOnDestroy(){
    // unsubscribe from all subscriptions
    if (!isNil(this.grpsObs)){
      this.grpsSub.unsubscribe();
    }
    for (let key of Object.keys(this.subscriptions)){
      this.subscriptions[key].unsubscribe(); 
    }
    this.stateSub();
  } 
};
