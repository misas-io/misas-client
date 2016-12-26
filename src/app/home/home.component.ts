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
  // Set our default values
  localState = { value: '' };

  // Graphql vars
  loading: boolean;
  searchGrps: any;
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
    });
  }

  submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }
}
