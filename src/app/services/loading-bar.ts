import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class LoadingBar {
  private loadingCounter = 0;
  private loadingValue: boolean = false;
  private loadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  get loading(): boolean {
    return this.loadingValue;
  };
  set loading(value: boolean){
    this.loadingValue = value;
    this.loadingChange.emit(this.loadingValue);
  };
  constructor() {};
  // counter to keep track number of loading components
  public addLoading(){
    if (++this.loadingCounter > 0)
      this.loading = true;
  };
  public removeLoading(){
    if (--this.loadingCounter <= 0)
      this.loading = false;
  };
  public reset(){
    this.loadingCounter = 0;
    this.loading = false;
  };
}
