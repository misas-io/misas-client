//import '../testing/_common';
//import { ReflectiveInjector } from '@angular/core';
import { Injectable } from '@angular/core';
import {
  inject,
  TestBed,
	ComponentFixture
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MdlModule } from 'angular2-mdl';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { Router, ActivatedRoute } from '@angular/router';
import util from 'util';
import { ApolloModule } from 'apollo-angular';
import ApolloClient from 'apollo-client';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NgReduxModule, NgRedux } from '@angular-redux/store'; 
import { NgZone } from '@angular/core';
// MISAS modules
import { mockClient } from '../../testing/_mocks';
import { LoadingBar } from '../../services/loading-bar';
import { SearchComponent } from './search.component';
import { SearchGrps } from './search.model';
import { SearchActions } from './search.actions';
import { IState, reducer, configureStore } from '../../store/initial';

import gql from 'graphql-tag';

interface Hero {
  name: string;
}

interface AllHeroesQueryResult {
  allHeroes: {
    heroes: Hero[];
  };
}

const query = SearchGrps; 

const data = {
	searchGrps: [],
};

const data2 = {
	searchGrps: [],
};

const data3 = {
	searchGrps: [],
};

@Injectable()
class RouterStub {
	public navigate(){
	};
};

export function _ngReduxFactory(ngZone: NgZone) {
  let redux = new NgRedux(ngZone);
	configureStore(redux as NgRedux<IState>);
  return redux;
}

@Injectable()
export class ActivatedRouteStub {

  // ActivatedRoute.params is Observable
  private subject = new BehaviorSubject(this.testParams);
  params = this.subject.asObservable();

  // Test parameters
  private _testParams: {};
  get testParams() { return this._testParams; }
  set testParams(params: {}) {
    this._testParams = params;
    this.subject.next(params);
  }

  // ActivatedRoute.snapshot.params
  get snapshot() {
    return { params: this.testParams };
  }
}

describe('Search', () => {
  let defaultClient;
	let getClient;
	let comp: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

	const clientSettings = [{
		request: { query },
		result: { data },
	}, {
		request: { query, variables: { sortBy: 'BEST', point: { coordinates: [-106.42454780000003, 31.6903638] } } },
		result: { data: data2 },
	}, {
		request: { query, variables: { foo: 'Bar' } },
		result: { data: data3 },
	}, {
		request: { query, variables: { foo: 'Foo', bar: 'Bar' } },
		result: { data: data2 },
	}, {
		request: { query, variables: { foo: 'Foo', bar: 'Baz' } },
		result: { data: data3 },
	}];

  getClient = function(){
    return defaultClient;
  };	

  let configureModule = (queryParams) => {
    return TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
      imports: [
        FormsModule,
        MdlModule,
        MdlPopoverModule,
        MdlSelectModule,
        ApolloModule.withClient(getClient),
        NgReduxModule,
      ],
      providers: [
        LoadingBar,
        SearchActions,
        { provide: NgRedux, useFactory: _ngReduxFactory, deps: [ NgZone ] },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: queryParams } }}, 
      ],
    })
    // Override component's own provider
    .overrideComponent(SearchComponent, {
      set: {
        providers: [
        ]
      }
    });
  };

	describe('Search without query params', () => {

    beforeEach(() => {
      defaultClient = mockClient(...clientSettings);
      return configureModule({});
    });

		beforeEach(() => {
			fixture = TestBed.createComponent(SearchComponent);
			comp = fixture.componentInstance;
			spyOn(comp, '_switchQuery');
      //jasmine.clock().install();
    });

    afterEach(() => {
      //jasmine.clock().uninstall();
    });

  });

	describe('Search with query params', () => {

		beforeEach(() => {
			defaultClient = mockClient(...clientSettings);
      return configureModule({ locationOption: 'CURRENT_LOCATION' });
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(SearchComponent);
			comp = fixture.componentInstance;
			spyOn(comp, '_switchQuery');
      //jasmine.clock().install();
		});

    afterEach(() => {
      //jasmine.clock().uninstall();
    });

    /*
		it('if searchForm changes then it should call switch', (done) => {	
    
			fixture.detectChanges();
			setTimeout(() => {
				expect((comp as any)._switchQuery).toHaveBeenCalled();
				expect((comp as any)._switchQuery.calls.argsFor(0))
				.toEqual([
					{
						sort_by: 'BEST', 
						point: { 
							coordinates: [-106.42454780000003, 31.6903638] 
						} 
					} 
				]);
				done();
			},10);
		});
    */
	});
});
