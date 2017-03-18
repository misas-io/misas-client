import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'grps-list', // <grps-list></grps-list>
  providers: [],
  styleUrls: [ './list.component.css' ],
  templateUrl: './list.component.html'
})

export class ListComponent {
  @Input() grps: any;

  constructor(
    private router: Router
  ) {}

  public viewGrp(grpId){
    console.log('viewing grp');
    this.router.navigate(['/parroquia', grpId], { queryParams: {} });
  };
}
