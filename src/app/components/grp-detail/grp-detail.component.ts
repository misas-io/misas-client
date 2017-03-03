import { set, get, isEqual, isNil, isEmpty } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';
import { Apollo, ApolloQueryObservable} from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
/* MISAS modules */
import { Grp } from './grp-detail.model';
import { LoadingBar } from '../../services/loading-bar';

@Component({
  selector: 'grps-detail', // <grps-detail></grps-detail>
  providers: [  ],
  styleUrls: [ './grp-detail.component.css' ],
  templateUrl: './grp-detail.component.html'
})
export class GrpDetailComponent implements OnInit {
  private id: string;
  private snapshot: ActivatedRouteSnapshot;
  private grpObs: Observable<ApolloQueryResult<any>>;
  private grpSub: any;
  public grp: any;

  constructor(
    private loadingBar: LoadingBar,
		private apollo: Apollo, 
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location
  ) {
    this.snapshot = this.route.snapshot;
    const params: any = this.snapshot.params;
    this.id = params.id; 
    console.log(`got grp id ${this.id}`);
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
