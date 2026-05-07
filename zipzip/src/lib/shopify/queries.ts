export const GET_PRODUCTS_QUERY = /* GraphQL */ `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          availableForSale
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
export const GET_PRODUCT_QUERY = /* GraphQL */ `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
      availableForSale
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
  edges {
    node {
      id
      title
      availableForSale
      quantityAvailable
      price {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
    }
  }
}
`;
export const GET_HOME_SLIDES_QUERY = /* GraphQL */ `
  query GetHomeSlides($type: String!, $first: Int!) {
    metaobjects(type: $type, first: $first) {
      edges {
        node {
          id
          handle
          type
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const GET_MONTHLY_DROP_OVERLAY_QUERY = /* GraphQL */ `
  query GetMonthlyDropOverlay($type: String!, $first: Int!) {
    metaobjects(type: $type, first: $first) {
      edges {
        node {
          id
          handle
          type
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const GET_PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
    }
  }
`;
