import Cookies from 'js-cookie';

/**
 * Gather current user wishlist and populate wishlist count and styling in header
 * Set wishlist icon on product cards
 */
let filledSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M13.9988 24.1926L12.3748 22.7366C10.4895 21.038 8.93083 19.5726 7.69883 18.3406C6.46683 17.1086 5.48683 16.0026 4.75883 15.0226C4.03083 14.0426 3.52216 13.142 3.23283 12.3206C2.94349 11.4993 2.79883 10.6593 2.79883 9.80062C2.79883 8.04596 3.38683 6.58062 4.56283 5.40462C5.73883 4.22862 7.20416 3.64062 8.95883 3.64062C9.92949 3.64062 10.8535 3.84596 11.7308 4.25662C12.6082 4.66729 13.3642 5.24596 13.9988 5.99262C14.6335 5.24596 15.3895 4.66729 16.2668 4.25662C17.1442 3.84596 18.0682 3.64062 19.0388 3.64062C20.7935 3.64062 22.2588 4.22862 23.4348 5.40462C24.6108 6.58062 25.1988 8.04596 25.1988 9.80062C25.1988 10.6593 25.0542 11.4993 24.7648 12.3206C24.4755 13.142 23.9668 14.0426 23.2388 15.0226C22.5108 16.0026 21.5308 17.1086 20.2988 18.3406C19.0668 19.5726 17.5082 21.038 15.6228 22.7366L13.9988 24.1926ZM13.9988 21.1686C15.7908 19.5633 17.2655 18.1866 18.4228 17.0386C19.5802 15.8906 20.4948 14.892 21.1668 14.0426C21.8388 13.1933 22.3055 12.4373 22.5668 11.7746C22.8282 11.112 22.9588 10.454 22.9588 9.80062C22.9588 8.68062 22.5855 7.74729 21.8388 7.00062C21.0922 6.25396 19.62 9.5 18.5 9.5C17.6227 9.5 15.5 7.5 16.6028 6.62262C31 3.5 19.78 16.2347 19.5 17L14 23.5L8.5 17.5L12.9348 8.51262C12.6548 7.74729 9.74667 8.49467 9 8C8.25333 7.50533 7.38291 5.88062 8.95883 5.88062C7.83883 5.88062 13 8.5 13 8.5C13 8.5 5.03883 8.68062 5.03883 9.80062C4.75883 9.19683 5.23867 6.83733 5.5 7.5C5.76133 8.16267 13.328 7.65067 14 8.5C14.672 9.34933 8.41749 15.8906 9.57483 17.0386C10.7322 18.1866 12.2068 19.5633 13.9988 21.1686Z" fill="#888888"/>
                         </svg>`;
let defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                <path d="M13.9988 24.1926L12.3748 22.7366C10.4895 21.038 8.93083 19.5726 7.69883 18.3406C6.46683 17.1086 5.48683 16.0026 4.75883 15.0226C4.03083 14.0426 3.52216 13.142 3.23283 12.3206C2.94349 11.4993 2.79883 10.6593 2.79883 9.80062C2.79883 8.04596 3.38683 6.58062 4.56283 5.40462C5.73883 4.22862 7.20416 3.64062 8.95883 3.64062C9.92949 3.64062 10.8535 3.84596 11.7308 4.25662C12.6082 4.66729 13.3642 5.24596 13.9988 5.99262C14.6335 5.24596 15.3895 4.66729 16.2668 4.25662C17.1442 3.84596 18.0682 3.64062 19.0388 3.64062C20.7935 3.64062 22.2588 4.22862 23.4348 5.40462C24.6108 6.58062 25.1988 8.04596 25.1988 9.80062C25.1988 10.6593 25.0542 11.4993 24.7648 12.3206C24.4755 13.142 23.9668 14.0426 23.2388 15.0226C22.5108 16.0026 21.5308 17.1086 20.2988 18.3406C19.0668 19.5726 17.5082 21.038 15.6228 22.7366L13.9988 24.1926ZM13.9988 21.1686C15.7908 19.5633 17.2655 18.1866 18.4228 17.0386C19.5802 15.8906 20.4948 14.892 21.1668 14.0426C21.8388 13.1933 22.3055 12.4373 22.5668 11.7746C22.8282 11.112 22.9588 10.454 22.9588 9.80062C22.9588 8.68062 22.5855 7.74729 21.8388 7.00062C21.0922 6.25396 20.1588 5.88062 19.0388 5.88062C18.1615 5.88062 17.3495 6.12796 16.6028 6.62262C15.8562 7.11729 15.3428 7.74729 15.0628 8.51262H12.9348C12.6548 7.74729 12.1415 7.11729 11.3948 6.62262C10.6482 6.12796 9.83616 5.88062 8.95883 5.88062C7.83883 5.88062 6.90549 6.25396 6.15883 7.00062C5.41216 7.74729 5.03883 8.68062 5.03883 9.80062C5.03883 10.454 5.16949 11.112 5.43083 11.7746C5.69216 12.4373 6.15883 13.1933 6.83083 14.0426C7.50283 14.892 8.41749 15.8906 9.57483 17.0386C10.7322 18.1866 12.2068 19.5633 13.9988 21.1686Z" fill="black" stroke="white" stroke-width="0.5"/>
                          </svg>`;
export function setWishlistIcon(token, userLogged) {
    let $wishlist = $('[data-wishlist-preview]');
    const $productCardSet = $('.product-card-wishlist');
    if (userLogged) {
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query: `
                query wishlistCountByCustomer {
                    customer {
                        firstName
                        wishlists {
                        edges {
                            node {
                                entityId
                            items {
                                edges {
                                node {
                                    productEntityId
                                }
                                }
                            }
                            }
                        }
                        }
                    }
                    }
                `
            }),
        })
            .then((res) => res.json())
            .then((result) => updateWishlistCards(result.data, $productCardSet));
    } else {
        $wishlist.addClass('navUser-item--wishlist__hidden-s');
    }
}

export function updateWishlistHeader(data, wishlistElem) {
    let wishListCount = Object.keys(data.customer.wishlists.edges[0].node.items.edges).length;
    if (wishListCount > 0) {
        $('#wishlistCount').text(wishListCount);
        $('#wishlistCount').css("display", "inline-block");
    } else {
        wishlistElem.addClass('navUser-item--wishlist__hidden-s');
    }
}

export function updateWishlistCards(data, productCards) {
    let wishListItemIds = [];
    $.each(data.customer.wishlists.edges[0].node.items.edges, function (i, item) {
        wishListItemIds.push(item.node.productEntityId);
    });

    if (productCards.length > 0) {
        productCards.each(function () {
            let product_id = $(this).data("product-id");
            if (wishListItemIds.indexOf(product_id) > -1) {
                $(this).addClass('is-in-wishlist');
                $(this).find('svg').replaceWith(filledSvg);
            } else {
                $(this).removeClass('is-in-wishlist')
                $(this).find('svg').replaceWith(defaultSvg);
            }
        });
    }
}

export function addToWishlistById(token, productId) {
    fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            query: `
                query wishlistCountByCustomer {
                    customer {
                        firstName
                        wishlists {
                        edges {
                            node {
                                entityId
                            }
                        }
                        }
                    }
                    }
                `
        }),
    })
    .then((res) => res.json())
    .then((result) => addtoWishListHelper(result.data, productId, null)); 

    function addtoWishListHelper(data, productId, product) {
        let wishListIds = [];
        $.each(data.customer.wishlists.edges, function (i, item) {
            wishListIds.push(item.node.entityId);
        });
        const activeWishlistId = wishListIds[0];
        $.ajax(
            {
                url: `/wishlist.php?action=add&wishlistid=${activeWishlistId}&product_id=${productId}`,
                method: "post",
                success: function () {
                    if(product != null){
                        product.addClass('is-in-wishlist');
                    }
                }
            }
        )
    }
}

export function addToWishlist(userLogged, token, product) {
    if (userLogged) {
        const productId = product.data("product-id");
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query: `
                query wishlistCountByCustomer {
                    customer {
                        firstName
                        wishlists {
                        edges {
                            node {
                                entityId
                            }
                        }
                        }
                    }
                    }
                `
            }),
        })
            .then((res) => res.json())
            .then((result) => addtoWishListHelper(result.data, productId, product));
    } else {
        // Store ID of product in cookie
        Cookies.set('addToWl', product.data("product-id"));
        window.location.replace('/login.php');
    }

    function addtoWishListHelper(data, productId, product) {
        let wishListIds = [];
        $.each(data.customer.wishlists.edges, function (i, item) {
            wishListIds.push(item.node.entityId);
        });
        const activeWishlistId = wishListIds[0];
        $.ajax(
            {
                url: `/wishlist.php?action=add&wishlistid=${activeWishlistId}&product_id=${productId}`,
                method: "post",
                success: function () {
                    if(product != null){
                        product.addClass('is-in-wishlist');
                        product.find('svg').replaceWith(filledSvg);
                    }
                }
            }
        )
    }
}

export function removeFromWishlist(userLogged, token, product) {
    if (userLogged) {
        const productId = product.data("product-id")
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query: `
                query wishlistCountByCustomer {
                    customer {
                        firstName
                        wishlists {
                        edges {
                            node {
                                entityId
                            items {
                                edges {
                                node {
                                    productEntityId
                                    entityId
                                    product {
                                        entityId
                                    }
                                }
                                }
                            }
                            }
                        }
                        }
                    }
                    }
                `
            }),
        })
            .then((res) => res.json())
            .then((result) => removeFromWishListHelper(result.data, productId, product));
    }

    function removeFromWishListHelper(data, productId, product) {
        let wishListIds = [];
        $.each(data.customer.wishlists.edges, function (i, item) {
            wishListIds.push(item.node.entityId);
        });
        const activeWishlistId = wishListIds[0];

        let targetId = null;
        $.each(data.customer.wishlists.edges[0].node.items.edges, function (i, item) {
            if (item.node.product.entityId == productId) {
                targetId = item.node.entityId;
                return true;
            }
        });

        $.ajax(
            {
                url: `/wishlist.php?wishlistid=${activeWishlistId}&action=remove&item_id=${targetId}`,
                method: "post",
                success: function () {
                    product.removeClass('is-in-wishlist');
                    product.find('svg').replaceWith(defaultSvg);
                }
            }
        )
    }
}
