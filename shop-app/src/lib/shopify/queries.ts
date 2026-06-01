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
      relatedColors: metafield(namespace: "custom", key: "related_colors") {
        references(first: 10) {
          edges {
            node {
              ... on Product {
                id
                title
                handle
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
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
export const GET_CART_QUERY = /* GraphQL */ `
  query GetCart($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      totalQuantity
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  id
                  title
                  handle
                  featuredImage {
                    url
                    altText
                  }
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;
export const GET_CUSTOMER_PROFILE_QUERY = /* GraphQL */ `
  query GetCustomerProfile($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      displayName
      firstName
      lastName
      email
      phone
      defaultAddress {
        address1
        city
        country
      }
      orders(first: 5, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            fulfillmentStatus
            financialStatus
            fulfillments(first: 5) {
              trackingInfo {
                number
                company
                url
              }
            }
          }
        }
      }
    }
  }
`;