import { Component } from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLarge } from './x-large';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';


const firsttest = gql`
  {
    searchGrps(sortBy: NEAR, point: { coordinates: [
            -106.43022537231445,
            31.721012524697652
          ]
    })
    {
      edges {
        node {
           id
           ... on Grp {
            name
            address {
              city
              state
            }
            nextEvents(next: 5)
            distance
            location {
              type
              coordinates
            }
          }
        }
      }
    }
  }
`;

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    Title
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent {
  // lat: number = 51.678418;
  // lng: number = 7.809007;
  mapOptions: Object = {
		lat: 31.721012524697652,
		lng: -106.43022537231445,
		style: [{"featureType":"road","stylers":[{"hue":"#5e00ff"},{"saturation":-79}]},{"featureType":"poi","stylers":[{"saturation":-78},{"hue":"#6600ff"},{"lightness":-47},{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"lightness":22}]},{"featureType":"landscape","stylers":[{"hue":"#6600ff"},{"saturation":-11}]},{},{},{"featureType":"water","stylers":[{"saturation":-65},{"hue":"#1900ff"},{"lightness":8}]},{"featureType":"road.local","stylers":[{"weight":1.3},{"lightness":30}]},{"featureType":"transit","stylers":[{"visibility":"simplified"},{"hue":"#5e00ff"},{"saturation":-16}]},{"featureType":"transit.line","stylers":[{"saturation":-72}]},{}],
    zoom: 12
  }

  // Set our default values
  localState = { value: '' };

  // Graphql vars
  loading: boolean;
  searchGrps: any;

  markers = [];

  // TypeScript public modifiers
  constructor(private apollo: Angular2Apollo, public appState: AppState, public title: Title) {
  }

  ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);

    this.apollo.watchQuery({
      query: firsttest
    }).subscribe(({data}) => {
      this.loading = data.loading;
      this.searchGrps = data.searchGrps;
      console.log(this.searchGrps);
      this.createMarkers();
    });
  }

  createMarkers() {
		this.searchGrps.edges.forEach((grp: any) => {
			let marker = {
				lat: grp.node.location.coordinates[1],
				lng: grp.node.location.coordinates[0],
				label: grp.node.name
			};
			this.markers.push(marker);
		});
  }

  submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }
}
