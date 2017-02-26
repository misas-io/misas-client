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

import gql from 'graphql-tag';

interface Hero {
  name: string;
}

interface AllHeroesQueryResult {
  allHeroes: {
    heroes: Hero[];
  };
}

const query = gql`
  query heroes {
    allHeroes {
      heroes {
        name
      }
    }
  }
`;

const data = {
  allHeroes: {
    heroes: [{ name: 'Mr Foo' }, { name: 'Mr Bar' }],
  },
};

const data2 = {
  allHeroes: {
    heroes: [{ name: 'Mrs Foo' }, { name: 'Mrs Bar' }],
  },
};

const data3 = {
  allHeroes: {
    heroes: [{ name: 'Mr Bar' }],
  },
};

@Injectable()
class SearchFieldsObserverStub {
  public fieldEvents(callback: Function): void {
    console.log('calling fiedlEvents');     
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
		request: { query, variables: { foo: 'Foo' } },
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

	beforeEach(() => {
    defaultClient = mockClient(...clientSettings);
		getClient = function(){
			return defaultClient;
		};	
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
        { 
          provide: SearchFieldsObserver, useValue: { 
            fieldEvents: function(callback: Function): void {
              callback({
                location: {
                  lat: 31.6903638,
                  lon: -106.42454780000003
                }
              });
            }
          }
        },
        { provide: Router, useClass: RouterStub },
				{ provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } }}, 
			],
    });
  });

	beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    comp = fixture.componentInstance;
  });

	it('should create component', () => expect(comp).toBeDefined() );

	describe('searchForm', function(){
    
		it('it should have default params if no query params available', () => {
      expect(comp.sortBy).toEqual('');
		});

		it('it should call switchQuery', () => {
      // use comp as any to access private properties
			spyOn((comp as any), 'switchQuery');
      expect((comp as any).switchQuery.calls.any()).toEqual(false);
		});
	});
});
