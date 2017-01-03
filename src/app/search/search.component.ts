import { Component } from '@angular/core';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';


@Component({
  selector: 'grps-search', // <grps-search></grps-search>
  styleUrls: [ './search.component.css' ],
  templateUrl: './search.component.html'
})

export class SearchComponent {
  loading: boolean;
  grps: any;
  grpMarkers: {
    lat: Number,
    lng: Number,
    label: String
  }[] = [];

  searchModel: {
    name: String
  } = {
    name: ''
  };

  constructor(private apollo: Angular2Apollo) {}

	onSubmit() {
		console.log("Submitted");
    let query = gql`
		{
			searchGrps(
        sortBy: RELEVANCE,
        name: "${this.searchModel.name}",
        city: "Juárez"
      )
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

    this.apollo.watchQuery({
      query: query
    }).subscribe(({data}) => {
      this.loading = data.loading;
      this.grps = data.searchGrps;
      console.log(this.grps);

      this.grps.edges.forEach((grp: any) => {
				let marker = {
					lat: grp.node.location.coordinates[1],
					lng: grp.node.location.coordinates[0],
					label: grp.node.name
				};
				this.grpMarkers.push(marker);
      });

    });

  }

}
