import { NgRedux } from '@angular-redux/store'; 
import { routerReducer } from '@angular-redux/router';
import {
  applyMiddleware,
  Store,
  combineReducers,
  compose,
  createStore,
  Middleware
} from 'redux';
import * as reduxLogger from 'redux-logger';
import thunk from 'redux-thunk';
// MISAS modules
import { 
  IState as ISearchState,
  searchReducer as reducer   
} from '../components/search/search.actions';

interface IState {
  search?: ISearchState,
  router?: any,
};


export { IState };
export { reducer }; 

export function configureStore(ngRedux: NgRedux<IState>) {
  const logger = reduxLogger();
  const store: Store<IState> = createStore(
    combineReducers({
      router: routerReducer,
      search: reducer,
    }),
    compose(
      applyMiddleware(thunk as Middleware, logger)
    ),    
  );
  ngRedux.provideStore(store);
};
