import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';
import { Apollo, ApolloQueryObservable} from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import get = require('lodash/get');
import isNil = require('lodash/isNil');
import isEmpty = require('lodash/isEmpty');
/* MISAS modules */
import { Grp } from './grp-detail.model';
import { LoadingBar } from '../../services/loading-bar';

@Component({
  selector: 'grps-detail', // <grps-detail></grps-detail>
  providers: [],
  styleUrls: [ './grp-detail.component.css' ],
  templateUrl: './grp-detail.component.html'
})
export class GrpDetailComponent implements OnInit {
  private id: string;
  private snapshot: ActivatedRouteSnapshot;
  private grpObs: Observable<ApolloQueryResult<any>>;
  private grpSub: any;
  public grp: any;
  public calendarOptions: any;

  constructor(
    private loadingBar: LoadingBar,
    private apollo: Apollo, 
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location
  ) {
    this.calendarOptions = {
      height: '100%',
      fixedWeekCount : false,
      defaultDate: '2016-09-12',
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: [
        {
          title: 'All Day Event',
          start: '2016-09-01'
        },
        {
          title: 'Long Event',
          start: '2016-09-07',
          end: '2016-09-10',
          color: '#C2185B'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2016-09-09T16:00:00'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2016-09-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2016-09-11',
          end: '2016-09-13'
        },
        {
          title: 'Meeting',
          start: '2016-09-12T10:30:00',
          end: '2016-09-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: '2016-09-12T12:00:00'
        },
        {
          title: 'Meeting',
          start: '2016-09-12T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: '2016-09-12T17:30:00'
        },
        {
          title: 'Dinner',
          start: '2016-09-12T20:00:00'
        },
        {
          title: 'Birthday Party',
          start: '2016-09-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2016-09-28'
        }
      ]
    };

    this.snapshot = this.route.snapshot;
    const params: any = this.snapshot.params;
    this.id = params.id; 
    this.query({
      id: this.id
    });
  }

  goToList() {
    this._location.back();
  }

  ngOnInit() {
  }
  
  query(options: any){
    console.log(`switched query %j`, options);
    this.loadingBar.reset();
    this.loadingBar.addLoading();
    if (isNil(options) || isEmpty(options)){
      this.grp = {};
      this.loadingBar.removeLoading();
      return;
    }
    // unsubscribe from previous query if we are subscribed
    if (!isNil(this.grpObs)){
      this.grpSub.unsubscribe();
    }
    // generate new query
    console.log(options);
    this.grpObs = this.apollo.query<any>({
      query: Grp,
      variables: options,
    });
    // subscribe to the new query to get results
    this.grpSub = this.grpObs.subscribe(
      ({data, loading}) => {
        this.loadingBar.removeLoading();
        this.grp = get(data,'grp', null);
      }
    );
  };
}
