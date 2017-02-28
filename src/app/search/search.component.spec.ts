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
import { ReactiveFormsModule } from '@angular/forms'; 
import { Router, ActivatedRoute } from '@angular/router';
import util from 'util';
import { ApolloModule } from 'apollo-angular';
import ApolloClient from 'apollo-client';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// MISAS modules
import { mockClient } from '../testing/_mocks';
import { LoadingBar } from '../services/loading-bar';
import { SearchFieldsObserver } from '../services/search-fields-observer';
import { SearchComponent } from './search.component';
import { SearchGrps } from './search.model';

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
class SearchFieldsObserverStub {
  public fieldEvents(callback: Function): void {
    callback({
      location: {
        lat: 31.6903638,
        lon: -106.42454780000003
      }
    });
  }
};

@Injectable()
class RouterStub {
	public navigate(){
	};
};


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
        ReactiveFormsModule,
        MdlModule,
        MdlPopoverModule,
        MdlSelectModule,
        ApolloModule.withClient(getClient),
      ],
      providers: [
        LoadingBar,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: queryParams } }}, 
      ],
    })
    // Override component's own provider
    .overrideComponent(SearchComponent, {
      set: {
        providers: [
          { provide: SearchFieldsObserver, useClass: SearchFieldsObserverStub }
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

    it('should create component', () => expect(comp).toBeDefined() );

    it('it should have default params if no query params available', () => {
      expect(comp.sortBy).toEqual('');
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

		it('it should have default params if no query params available', () => {
			expect(comp.sortBy).toEqual('');
			expect(comp.locationOption).toEqual('CURRENT_LOCATION');
		});

		it('if searchForm doesn\'t change then it should not call switchQuery', function(){
			fixture.detectChanges();
			// use comp as any to access private properties
			expect((comp as any)._switchQuery.calls.any()).toEqual(true);
		});

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
	});
});
