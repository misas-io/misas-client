import gql from 'graphql-tag';

export const Grp = gql`
query Grp(
  $id: ID!
){
  grp(
    id: $id,
  )
  {
    id
    name
    address {
      address_line_1
      city
      state
      postal_code
    }
    distance
    location {
      type
      coordinates
    }
  }
}
`
