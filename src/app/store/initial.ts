import { NgRedux } from '@angular-redux/store'; 
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
  IState,
  searchReducer as reducer   
} from '../components/search/search.actions';


export { IState };
export { reducer }; 

export function configureStore(ngRedux: NgRedux<IState>) {
  const logger = reduxLogger();
  const store: Store<IState> = createStore(
    reducer,
    compose(
      applyMiddleware(thunk as Middleware, logger)
    ),    
  );
  ngRedux.provideStore(store);
};
