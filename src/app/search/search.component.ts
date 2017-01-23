import { get, isNil } from 'lodash';
import { Component, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SearchFieldsObserver } from '../services/search-fields-observer';
import gql from 'graphql-tag';

const query = gql`
query SearchGrps(
  $name: String, 
  $point: PointI, 
  $polygon: PolygonI,
  $sort_by: SortTypes
)
{
  searchGrps(
    sortBy: $sort_by,
    name: $name,
    point: $point,
    polygon: $polygon
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

@Component({
  selector: 'grps-search', 
  styleUrls: [ './search.component.css' ],
  templateUrl: './search.component.html',
  providers: [Angular2Apollo, SearchFieldsObserver]
})
export class SearchComponent implements OnInit, OnChanges {
  @Input('queryBounds') queryBounds: Number[][];
  @Output('boundsChanged') bounds = new EventEmitter<Number[][]>();
  @Output() currentLocation: any = new EventEmitter<any>();
  // grps property
  grpsValue: any;
  @Output()
  grpsChange: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  get grps(): any {
    return this.grpsValue;
  };
  set grps(value) {
    this.grpsValue = value;
    this.grpsChange.emit(this.grpsValue);
  };
  private sortOptions: any[] = [
    {
      title: 'Mejor',
      value: 'BEST'
    },
    {
      title: 'Nombre Relevante',
      value: 'RELEVANCE'
    },
    {
      title: 'Cercana',
      value: 'NEAR'
    },
    {
      title: 'Temprano',
      value: 'TIME'
    },
  ];
  private eventTypes: any[] = [
    {
      name: 'Misa',
      value: 'misa'
    }, 
    {
      name: 'Confesion',
      value: 'confesion'
    }, 
    {
      name: 'Evento',
      value: 'evento'
    }, 
  ];
  private eventType: any[];
  private loading: boolean;
  private searchArea: any = null;
  private searchOptions: any = {
    showAllOptions: true,
  };
  searchModel: any = {
    name: '',
    city: '',
    state: '',
    point: {
		  coordinates: [-106.43022537231445, 31.721012524697652],
    },
    useMap: true,
    sort_by: "BEST",
    polygon: null,
    event_types: {},
  };

  constructor(private apollo: Angular2Apollo, private searchFields: SearchFieldsObserver) {};

  ngOnInit(): void {
    console.log('search.component: initializing');
    this.query();
    this.searchFields.fieldEvents((result) => {
      if (!result || !(result.location))
        return;
      let location = result.location;
      let lat = get(result, 'location.lat', 0.0);
      let lon = get(result, 'location.lon', 0.0);
      if (lat != 0.0 && lon != 0.0) {
        console.log(`search.component: got new coordinates [${lon}, ${lat}]`);
        let currentLocation = { coordinates: [lon, lat] };
        this.currentLocation.emit(currentLocation);
        this.searchModel.point = currentLocation;
        this.refreshSearch();
      }
    });
  };

  onSubmit() {
    console.log('search.component: research');
    this.refreshSearch();
  };

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes['queryBounds'] && !isNil(this.queryBounds)) {
      this.searchArea = {
        coordinates: this.queryBounds 
      };
    }
  };

  query() {
    let point = this.searchModel.point;
    let name = this.searchModel.name;
    let sort_by = this.searchModel.sort_by;
    if (sort_by === "RELEVANCE") {
      this.searchModel.point = null;
    } else { 
      this.searchModel.name = null;
    }
    this.apollo.query({
      query: query,
      variables: this.searchModel
    }).subscribe(
      ({data}) => {
        console.log('search.component: new search data!');
        this.grps = data.searchGrps;
        console.log(this.grps);
        this.loading = data.loading;

        this.searchModel.point = point;
        this.searchModel.name = name;
      }, (error) => {
        console.log('search.component: error querying');
        console.log(error);
        this.searchModel.point = point;
        this.searchModel.name = name;
      }
    );
  };

  refreshSearch() {
    console.log('search.component: refreshing search');
    this.query();
  };
}
