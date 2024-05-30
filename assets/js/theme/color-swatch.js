export function getProductEntityIds(){
    var ulElement = document.querySelector(".productGrid");
    if (ulElement) {

        var articleElements = ulElement.querySelectorAll("article");
    
        if (articleElements && articleElements.length > 0) {
            let entityIdArray = [];
    
            articleElements.forEach(function(articleElement) {
                let entityId = parseInt(articleElement.getAttribute("data-entity-id"), 10);
                entityIdArray.push(entityId);
            });
            let uniqueSortedEntityIds = entityIdArray.filter((value, index, self) => {
              return self.indexOf(value) === index;
            }).sort((a, b) => a - b); 
            return uniqueSortedEntityIds;
        }
    }
}

export async function getProductOptions(productIds, storefrontAPIToken) {
    try {
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storefrontAPIToken}`
            },
            body: JSON.stringify({
                query: `
        query MyQuery($productIds: [Int!]) {
          site {
            products(entityIds: $productIds, first: 50) {
              edges {
                node {
                  productOptions {
                    edges {
                      node {
                        ... on MultipleChoiceOption {
                          values {
                            edges {
                              node {
                                ... on SwatchOptionValue {
                                  isSelected
                                  hexColors
                                  entityId
                                  isDefault
                                  label
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  name
                  entityId
                  path
                }
              }
            }
          }
        }
        `,
                variables: {
                    "productIds": productIds
                },
            }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching product options:', error);
    }
}

export function updateColorSwatches(products) {
    products.forEach(product => {
        const productOptions = product.node.productOptions.edges;

        if (productOptions.length > 0) {
            const entityId = product.node.entityId;
            const path = product.node.path;

            const articles = document.querySelectorAll(`article[data-entity-id="${entityId}"]`);

            if (articles) {
              articles.forEach(article => {
                const colorSwatchesContainer = article.querySelector('.product-options-wrapper');
                const ulElement = document.createElement('ul');
                ulElement.classList.add('color-list');

                productOptions.forEach(option => {
                    const colorValues = option.node.values.edges;
                    colorValues.forEach(color => {
                      if(color.node.hexColors){
                        const hexColor = color.node.hexColors[0];
                        const label = color.node.label;
                    
                        const variantId = color.node.entityId;

                        const liElement = document.createElement('li');
                        liElement.innerHTML = `<span class="swatch-selection"><a href="${path}"><span title="${label}" data-variant-id="${variantId}" class="color-swatch" style="background-color: ${hexColor}"></span></a></span>`;
                        liElement.addEventListener('click', function () {
                          handleColorSwatchClick(variantId);
                        });
                        ulElement.appendChild(liElement);
                      }
                    });
                });

                colorSwatchesContainer.appendChild(ulElement);
              });
            }
        }
    });
}
function handleColorSwatchClick(variantId) {
  localStorage.setItem('selectedVariantId', variantId);
}