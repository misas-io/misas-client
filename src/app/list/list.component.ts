import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'grps-list', // <grps-list></grps-list>
  providers: [],
  styleUrls: [ './list.component.css' ],
  templateUrl: './list.component.html'
})

export class ListComponent {
  @Input() grps: any;

  constructor() {}

}
