import gql from 'graphql-tag';

export const SearchGrps = gql`
query SearchGrps(
  $name: String, 
  $point: PointI, 
  $polygon: PolygonI,
  $sort_by: SortTypes
){
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
            address_line_1
            city
            state
            postal_code
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
`
