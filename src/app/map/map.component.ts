import { Component, Input } from '@angular/core';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'grps-map', // <grps-map></grps-map>
  // We need to tell Angular's Dependency Injection which
  // providers are in our app.
  providers: [
  ],
  // Our list of styles in our component. We may add more
  // to compose many styles together
  styleUrls: [ './map.component.css' ],
  // Every Angular template is first compiled by the browser
  // before Angular runs it's compiler
  templateUrl: './map.component.html'
})

export class MapComponent {

  @Input() grps: any[];

  mapOptions: Object = {
		lat: 31.721012524697652,
		lng: -106.43022537231445,
		style: [{"featureType":"road","stylers":[{"hue":"#5e00ff"},{"saturation":-79}]},{"featureType":"poi","stylers":[{"saturation":-78},{"hue":"#6600ff"},{"lightness":-47},{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"lightness":22}]},{"featureType":"landscape","stylers":[{"hue":"#6600ff"},{"saturation":-11}]},{},{},{"featureType":"water","stylers":[{"saturation":-65},{"hue":"#1900ff"},{"lightness":8}]},{"featureType":"road.local","stylers":[{"weight":1.3},{"lightness":30}]},{"featureType":"transit","stylers":[{"visibility":"simplified"},{"hue":"#5e00ff"},{"saturation":-16}]},{"featureType":"transit.line","stylers":[{"saturation":-72}]},{}],
    zoom: 12
  }

}
