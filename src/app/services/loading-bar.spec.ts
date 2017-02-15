import {
  inject,
  TestBed
} from '@angular/core/testing';
import util from 'util';
import { LoadingBar } from './loading-bar';
describe('Loading Bar Service', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LoadingBar
    ]
  }));
  it('it should not be loading initially', inject([ LoadingBar ], (loadingBar: LoadingBar) => {
    expect(loadingBar.loading).toEqual(false);
  }));
  it('it should be loading after one element adds to loading', inject([ LoadingBar ], (loadingBar: LoadingBar) => {
    loadingBar.addLoading();
    expect(loadingBar.loading).toEqual(true);
  }));
  it('it should not be loading no element has loading', inject([ LoadingBar ], (loadingBar: LoadingBar) => {
    loadingBar.addLoading();
    loadingBar.removeLoading();
    expect(loadingBar.loading).toEqual(false);
  }));
});
