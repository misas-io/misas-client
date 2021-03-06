import { 
  Component, 
  Output,
  Input, 
  OnChanges, 
  OnInit, 
  SimpleChange, 
  EventEmitter } from '@angular/core';
import { LatLngBounds, LatLng, MapsAPILoader } from 'angular2-google-maps/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/debounceTime";
import isNil = require('lodash/isNil');
// MISAS modules
import { style } from './map.component.style';

declare const google: any;

class GrpMarker {
  public infoWindowOpen = false;
  constructor(
    public lat: Number, 
    public lng: Number,
    public label: String
  ) {};
  /**
   * Whenever the mouse is over any given marker it 
   * will show the info window
   */
  mouseOver($event: any) {
    this.infoWindowOpen = true; 
    //console.log(`grpMarker(${this.label}): mouse over`);
  }
  /**
   * Whenever the mouse is out any given marker it
   * will close the info window
   */
  mouseOut($event: any) {
    this.infoWindowOpen = false; 
    //console.log(`grpMarker(${this.label}): mouse out`);
  }
};

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'grps-map', // <grps-map></grps-map>
  // We need to tell Angular's Dependency Injection which
  // providers are in our app.
  providers: [],
  // Our list of styles in our component. We may add more
  // to compose many styles together
  styleUrls: [ './map.component.css' ],
  // Every Angular template is first compiled by the browser
  // before Angular runs it's compiler
  templateUrl: './map.component.html'
})
export class MapComponent implements OnChanges, OnInit {
  //@Input() grps: any[];
  @Input() grps: any;
  public grpMarkers: Array<GrpMarker> = [];
  @Input() currentLocation: any;
  @Output('boundsChanged') bounds = new EventEmitter<Number[][]>();
  private boundsChangedByGrps = true;
  private debouncer = new BehaviorSubject<any>(null);
  private mapBounds: LatLngBounds;
  center: any;
  mapOptions: Object = {
		lat: 31.721012524697652,
		lng: -106.43022537231445,
		style: style,
    zoom: 12,
    scrollwheel: false
  };
  constructor(private _loader: MapsAPILoader) {
    //register subject for emitting events only after .5 secs
    //have passed and the event hasn't been generated by new
    //grps
    this.boundsChangedByGrps = true;
    this.debouncer
      .debounceTime(500)
      .subscribe(($event) => { 
        if (!isNil($event)) {
          if (this.boundsChangedByGrps) {
            console.log('map.component: grps changed bounds so no changes emitted');
            this.boundsChangedByGrps = false;
          } else {
            console.log('map.component: send new bounds');
            this.bounds.emit([
              [ $event.b.b, $event.b.f ],
              [ $event.b.b, $event.b.b ],
              [ $event.b.f, $event.b.b ],
              [ $event.b.f, $event.b.f ],
              [ $event.b.b, $event.b.f ]
            ]);
          }
        }
      });
  }

  boundsChange($event: any) {
    //console.log('map.component: boundsChanged');
    //console.log($event);
    this.debouncer.next($event);
  }
  /**
   * Check for changes on the Grps property
   */
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes['grps'] && !isNil(this.grps)) {
        this.recalculateBounds();
    }
    //let from = JSON.stringify(changedProp.previousValue);
    //let to =   JSON.stringify(changedProp.currentValue);
  };

  ngOnInit() {};
  /**
   * Loop thru new Grps and calculate the new bounds
   * using LatLngBounds.extend
   */
  recalculateBounds() {
    this._loader.load().then(()=> {
      if (isNil(google)) {
        return;
      }
      let bounds;
      this.grpMarkers = [];
      if (this.grps) {
        //this.grpMarkers.splice(0, this.grpMarkers.length);
        for (let edge of this.grps.edges) {
          let grp = edge.node;
          if (grp.location.coordinates.length != 2) {
            continue;
          }
          let lat = grp.location.coordinates[1];
          let lng = grp.location.coordinates[0];
          let label = grp.name;
          //console.log(`map.component: adding marker ${grp.label}`);
          this.grpMarkers.push(new GrpMarker(lat, lng, label));
          let latlng: LatLng = new google.maps.LatLng(lat, lng);
          if (!bounds) {
            bounds = new google.maps.LatLngBounds(latlng, latlng);
          } else {
            bounds.extend(latlng);
          }    
        }
        //console.log(this.grpMarkers);
        if (bounds) {
          console.log(`map.component: set new map bounds`);
          // set map's new bounds
          this.boundsChangedByGrps = true;
          this.mapBounds = bounds;
        }
      }
    });
  };
}
