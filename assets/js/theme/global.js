import 'focus-within-polyfill';

import './global/jquery-migrate';
import './common/select-option-plugin';
import PageManager from './page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import mobileMenuToggle from './global/mobile-menu-toggle';
import menu from './global/menu';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import privacyCookieNotification from './global/cookieNotification';
import adminBar from './global/adminBar';
import carousel from './common/carousel';
import loadingProgressBar from './global/loading-progress-bar';
import svgInjector from './global/svg-injector';
import "regenerator-runtime/runtime";
import { setWishlistIcon, addToWishlist, removeFromWishlist } from './global/setWishlistIcon';
import { getProductEntityIds, getProductOptions, updateColorSwatches } from './color-swatch';
import { DateTime } from 'luxon';

export default class Global extends PageManager {
  onReady() {
        const {
            channelId, cartId, productId, categoryId, secureBaseUrl, maintenanceModeSettings, adminBarLanguage, storefrontAPIToken
        } = this.context;
        cartPreview(secureBaseUrl, cartId);
        const userLogged = this.context.userLogged;
        quickSearch();
        currencySelector(cartId);
        foundation($(document));
        quickView(this.context);
        carousel(this.context);
        menu();
        mobileMenuToggle();
        privacyCookieNotification();
        adminBar(secureBaseUrl, channelId, maintenanceModeSettings, JSON.parse(adminBarLanguage), productId, categoryId);
        loadingProgressBar();
        svgInjector();
        setWishlistIcon(storefrontAPIToken, userLogged);
        const $productCardSet = $('.product-card-wishlist');
        $productCardSet.each(function () {
            $(this).on("click", function () {
                if ($(this).hasClass("is-in-wishlist")) {
                    removeFromWishlist(userLogged, storefrontAPIToken, $(this));
                } else {
                    addToWishlist(userLogged, storefrontAPIToken, $(this));
                }
            })
        });

        const productEntityIds = getProductEntityIds();
        if(productEntityIds){
          getProductOptions(productEntityIds,storefrontAPIToken).then((result)=>{
            updateColorSwatches(result.data.site.products.edges);
          })
        }

        let observer = new MutationObserver(mutations => {
          for (let mutation of mutations) {
              for (let node of mutation.addedNodes) {
                  if ($(node).hasClass('ss__content')) {
                      $(node.childNodes[1].childNodes).each(function (param, item) {
                          $(item).find('.wishlist-icon').on('click', function (e) {
                              if ($(this).hasClass("is-in-wishlist")) {
                                  removeFromWishlist(userLogged, storefrontAPIToken, $(this));
                              } else {
                                  addToWishlist(userLogged, storefrontAPIToken, $(this));
                              }
                          });
                      });
                  } else {
                      $(node).find('.wishlist-icon').on('click', function (e) {
                          if ($(this).hasClass("is-in-wishlist")) {
                              removeFromWishlist(userLogged, storefrontAPIToken, $(this));
                          } else {
                              addToWishlist(userLogged, storefrontAPIToken, $(this));
                          }
                      })

                      
                  }
              }
            }
        });
        function mobileOnlySlider($slidername, $dots, $arrows, $breakpoint) {
            // console.log(`line 118 is:::>`,$slidername,$breakpoint);
          var slider = $($slidername);
            var settings = {
                mobileFirst: true,
                dots: $dots,
                centerMode: false,
                prevArrow: $('.grid-manual-prev'),
                nextArrow: $('.grid-manual-next'),
                responsive: [
                    {
                        breakpoint: $breakpoint,
                        settings: "unslick"
                    }
                ]
            };
            var $progressBar = $('.manual-grid-progress');

             // Reset progress bar
    // $progressBar.css('background-size', '0% 100%').attr('aria-valuenow', 0);

            slider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {   
              var calc = ( (nextSlide) / (slick.slideCount-1) ) * 100;
              
              $progressBar
                .css('background-size', calc + '% 100%')
                .attr('aria-valuenow', calc );
            });
          slider.not('.slick-initialized').slick(settings);

            $(window).on("resize", function () {
                if ($(window).width() > $breakpoint) {
                    return;
                }
                if (!slider.hasClass("slick-initialized")) {
                    return slider.slick(settings);
                }
            });
        }

        // code for featured products slider only
        function mobileOnlySliderFeatured($slidername, $dots, $arrows, $breakpoint) {
          // console.log(`line 118 is:::>`,$slidername,$breakpoint);
        var slider = $($slidername);
          var settings = {
              mobileFirst: true,
              dots: $dots,
              centerMode: false,
              prevArrow: $('.featured-product-prev-arrow'),
              nextArrow: $('.featured-product-next-arrow'),
              responsive: [
                  {
                      breakpoint: $breakpoint,
                      settings: "unslick"
                  }
              ]
          };
          var $progressBar = $('.progress');

           // Reset progress bar
  // $progressBar.css('background-size', '0% 100%').attr('aria-valuenow', 0);

          slider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {   
            var calc = ( (nextSlide) / (slick.slideCount-1) ) * 100;
            
            $progressBar
              .css('background-size', calc + '% 100%')
              .attr('aria-valuenow', calc );
          });
        slider.not('.slick-initialized').slick(settings);

          $(window).on("resize", function () {
              if ($(window).width() > $breakpoint) {
                  return;
              }
              if (!slider.hasClass("slick-initialized")) {
                  return slider.slick(settings);
              }
          });
      }

        function mobileOnlySliderRecommended($slidername, $dots, $arrows, $breakpoint) {
          // console.log(`line 118 is:::>`,$slidername,$breakpoint);
        var slider = $($slidername);
          var settings = {
              mobileFirst: true,
              dots: $dots,
              centerMode: false,
              prevArrow: $('.recommended-prev'),
              nextArrow: $('.recommended-next'),
              // arrows: $arrows,
              responsive: [
                  {
                      breakpoint: $breakpoint,
                      settings: "unslick"
                  }
              ]
          };
          var $progressBar = $('.progress-bar-recommended');

           // Reset progress bar
  $progressBar.css('background-size', '0% 100%').attr('aria-valuenow', 0);

          slider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {   
            var calc = ( (nextSlide) / (slick.slideCount-1) ) * 100;
            
            $progressBar
              .css('background-size', calc + '% 100%')
              .attr('aria-valuenow', calc );
          });
        slider.not('.slick-initialized').slick(settings);

          $(window).on("resize", function () {
              if ($(window).width() > $breakpoint) {
                  return;
              }
              if (!slider.hasClass("slick-initialized")) {
                  return slider.slick(settings);
              }
          });
      }

        function navDesk(){
          let navPage_L1_Link = $(".navPages-list > .navPages-item > .navPages-action.has-subMenu");
          let navPage_L2_Link = $(".navPage-subMenu-list .navPage-subMenu-item  a.has-subMenu");

          navPage_L1_Link.on('click', function (e) {
            e.preventDefault();
            $(".navPage-childList").hide();
            let collapsibleId = $(this).closest('.navPages-item').find('.navPage-childList').attr('id');
            $(".l3-container #" + collapsibleId).show();
            $(".navPage-subMenu-item").removeClass("active-item");
            $(".l2-container #" + collapsibleId).addClass("active-item");
          });
          
          navPage_L2_Link.on('click', function (e) {
            e.preventDefault();
            $(".navPage-childList").hide();
            $(".navPage-subMenu-item").removeClass("active-item");
            let collapsibleId = $(this).closest('.navPage-subMenu-item').attr('id');
            $(".l3-container #" + collapsibleId).show();
            $(this).closest('.navPage-subMenu-item').addClass("active-item");
          });
        }
        if (window.matchMedia("(min-width: 801px)").matches) {
          navDesk();
        }
        
        $(window).on('resize', function() {
          if (window.matchMedia("(min-width: 801px)").matches) {
            navDesk();
          }
        });
        let attrLists = document.querySelectorAll("[data-level-id]");

        attrLists.forEach(attr => {
            attr.addEventListener("click", function(e) {
                e.preventDefault();
                let levelId = e.target.dataset.levelId;
                document.querySelector(levelId).classList.toggle("active");
            });
        })

        function toggleFooterInfo() {
          if ($(window).width() <= 550) {
              $('.footer-info-heading').off('click').on('click', function() {
                  var $footerInfoList = $(this).next('.footer-info-list');
                  var $arrow = $(this).find('img');
  
                  $footerInfoList.slideToggle(300);
                  $arrow.toggleClass('rotate');
              });
          } else {
              $('.footer-info-heading').off('click');
              $('.footer-info-list').removeAttr('style');
              $('.footer-info-heading img').removeClass('rotate');
          }
        }
  
        toggleFooterInfo();
  
        $(window).on('resize',function() {
            toggleFooterInfo();
        });

        // Custom logic for Featured product Widget

        var firsttabID = $('.featured-tab-heading-container .tab-item').first().attr('data-tab');
        console.log(`firstTabItem is:::>`,firsttabID);
        $('#tab-'+firsttabID).addClass('active').siblings().removeClass('active');
        $('.tab-item').first().addClass('active-tab').siblings().removeClass('active-tab');

        function blogSlickEble(){
          $('.featured-tab-heading-container .tab-item').click( function(event) {
              event.preventDefault();
              var tabID = $(this).attr('data-tab');
              $(this).addClass('active-tab').siblings().removeClass('active-tab');
              $('.featured-product-tab-container').removeClass('active');
              $('#tab-'+tabID).addClass('active');
              let containerSelector = $('.featured-product-tab-container.active div[data-container="productSliderContainer"]').attr('class');
              // console.log(`container selector is:::>`,containerSelector);
   
              mobileOnlySliderFeatured('.' +containerSelector, false, false, 981);
   
          });
            // custom logic for onClick event
            if ($(window).width() <= 981) { 
              $(".featured-tab-heading-container .tab-item:first-child").trigger("click");
            }
   
            if ($('.recommended-products').length) {
              console.log(`recommended products div present`);
                  let recommendedContainerSelector = 'recommended-products';
                  mobileOnlySliderRecommended('.' +recommendedContainerSelector, false, false, 981);
            } else {
              console.log(`recommended products div not present`);
            }
          }
          blogSlickEble();
          $(window).on('resize',function() {
            blogSlickEble();
          });
          
          // code for blog tags
          getAllTags(storefrontAPIToken).then((tags) => {
            renderAllTags(tags);
          });
          function renderAllTags(tags) {
            let tagsArray = [];
            let name; 
            $.each(tags, function (key, element) {
              name = Array.from(element.tags)[0];
              if (name !== '') {
                if ($.inArray(name, tagsArray) < 0) {
                  tagsArray.push(name);
                }    
              }
            });
            
            var $html = '<ul class="blog-navs">';
            $.each(tagsArray, function(index, value) {
              if (value === undefined || value === '') { 
                return;
              }
              if (index === 0) {
                $html += '<li class="active">';
              } else {
                $html += '<li>';
              }
              $html += '<a href="javascript:void(0)">' + value + '</a></li>';
            });
            $html += '</ul>';
            $('#blog-navigation').append($html);
          
            var firstTag = $('.blog-navs li:first-child').text();
            localStorage.setItem("blogTagActive", firstTag);
            logActiveTag(storefrontAPIToken);
          
            $('.blog-navs li').click(function() {
              $('.blog-navs li').removeClass('active');
              $(this).addClass('active');
              
              var activeTag = $(this).text(); 
              
              localStorage.setItem("blogTagActive", activeTag); 
          
              if($(window).width()<= 981) {
                  $('.blog-items-grid-container').slick('unslick');  
              }
    
              logActiveTag(storefrontAPIToken);
            });
          }

         function logActiveTag(storefrontAPIToken) {
            let blogTagItems = localStorage.getItem("blogTagActive");
            let blogContainer = document.querySelector('.blog-items-grid-container');
            blogContainer.innerHTML = '';
            // code for custom graphQL
            const query = `
            query blogtags {
              site {
                content {
                  blog {
                    name
                    description
                    path
                    posts(filters: {tags: "${blogTagItems}"}, first:5,sort:NEWEST) {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      edges {
                        node {
                          entityId
                          name
                          path
                          tags
                          plainTextSummary
                          thumbnailImage {
                            url(width: 100, height: 200)
                            urlOriginal
                          }
                          publishedDate {
                            utc
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            `;
          const variables = {};

          fetch("/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storefrontAPIToken}`,
          },
          body: JSON.stringify({
            query: query,
            variables: variables,
          }),
          })
          .then((response) => response.json())
          .then((data) => {
            let maxContentHeight = 0;
            const blogItems = data.data.site.content.blog.posts.edges;  
            blogItems.forEach((blog,index) => {
            const blogName = blog.node.name;
            const publishedDate = formatDate(new Date(blog.node.publishedDate.utc));
            let truncatedName;
            // Create elements for blog post
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            
            const itemImageDiv = document.createElement('div');
            itemImageDiv.classList.add('item-image');
        
            const image = document.createElement('img');
            image.classList.add('item-images');
            image.src = blog.node.thumbnailImage.urlOriginal;
            image.alt = blogName;
            if (index === 0) {
              image.classList.add('first-image');
               truncatedName = blogName.length > 60 ? blogName.substring(0, 60) + '...' : blogName;
            } else {
              truncatedName = blogName.length > 30 ? blogName.substring(0, 30) + '...' : blogName;
            }
            const contentWrapperDiv = document.createElement('div');
            contentWrapperDiv.classList.add('content-wrapper');
        
            const title = document.createElement('h6');
            //  truncatedName = blogName.length > 30 ? blogName.substring(0, 30) + '...' : blogName;
            title.textContent = truncatedName;
        
            const dateParagraph = document.createElement('p');
            dateParagraph.textContent = publishedDate;
        
            const readMoreLink = document.createElement('a');
            readMoreLink.href = blog.node.path;
            readMoreLink.classList.add('read-more');
            readMoreLink.innerHTML = '<span class="cart-icon">Read More</span>';
        
            // Append elements to the container
            itemImageDiv.appendChild(image);
            itemImageDiv.appendChild(readMoreLink);
            contentWrapperDiv.appendChild(title);
            contentWrapperDiv.appendChild(dateParagraph);
            itemDiv.appendChild(itemImageDiv);
            itemDiv.appendChild(contentWrapperDiv);
            
            blogContainer.appendChild(itemDiv);

            function blogSlickEnablee(){
              if ($(window).width() >= 981) {
                const contentHeight = contentWrapperDiv.offsetHeight;
                if (contentHeight > maxContentHeight) {
                  maxContentHeight = contentHeight;
                }
                var imgHeight = image.height;
                console.log(`image height is:::>`, imgHeight);
                // var contentHeight = contentWrapperDiv.offsetHeight;
                console.log(`content wrapper height is:::>`, contentHeight);
                var result = imgHeight * 2 + 18 + maxContentHeight;
                document.querySelector(".first-image").style.height =
                  result + "px";
              }else{
                $('.first-image').css("height", "250px");
              }
          }
          blogSlickEnablee();
          $(window).on('resize',function() {
            blogSlickEnablee();
          });
          
            


          });
          function mobileOnlySliderTest($slidernames, $dots, $arrows, $breakpoint) {
            var slider = $($slidernames);
            var settings = {
                mobileFirst: true,
                dots: $dots,
                arrows: $arrows,
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                responsive: [
                {
                    breakpoint: $breakpoint,
                    settings: "unslick",
                },
                ],
            };
            var $progressBar = $(".topsellerr-progress");

            $progressBar.css("background-size", "0% 100%").attr("aria-valuenow", 0);

            slider.on("beforeChange", function (event, slick, currentSlide, nextSlide) {
                var calc = (nextSlide / (slick.slideCount - 1)) * 100;

                $progressBar
                .css("background-size", calc + "% 100%")
                .attr("aria-valuenow", calc);
            });
            slider.not(".slick-initialized").slick(settings);

            $(window).on("resize", function () {
                if ($(window).width() > $breakpoint) {
                return;
                }
                if (!slider.hasClass("slick-initialized")) {
                return slider.slick(settings);
                }
            });   
          }
          function blogSlickEnable(){
              if($(window).width()<= 981) {
                mobileOnlySliderTest(blogContainer, false, false, 981);             
              }
          }
          blogSlickEnable();
          $(window).on('resize',function() {
            blogSlickEnable();
          });
          })
          .catch((error) => {
            console.error(error);
          });
    }
        function formatDate(date) {
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'long' });
          const year = date.getFullYear();
          
          const daySuffix = getDaySuffix(day);
        
          return `${day}${daySuffix} ${month}, ${year}`;
        }
        
        function getDaySuffix(day) {
          if (day > 3 && day < 21) return 'th';
          switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
          }
        }
        $(".blog-container-line-prev").click(function () {
          $(".blog-items-grid-container").slick("slickPrev");
        });
      
        $(".blog-container-line-next").click(function () {
          $(".blog-items-grid-container").slick("slickNext");
        });
        // luxon implementation

      //   let luxonTime = DateTime.fromObject({}, {zone: 'Australia/Brisbane'});
      //   let hour = luxonTime.c.hour;
      //   if(hour >= 15 ){  
      //     $('.promo-text').css('display','block');
      //     $('.promo-text').html('<p>Our new product has launched!</p>');
      //   }else{
      //     createcountDown();
  
      //   }
        
  
      //   function createcountDown()
      //   {
          
      //     setInterval(function () {
  
      //     let luxonTime = DateTime.fromObject({}, {zone: 'Australia/Brisbane'});
      //     let currentDate = luxonTime.c.day;
      //     let currentMonth = luxonTime.c.month;
      //     let currentYear = luxonTime.c.year;
  
      //     const currentTime = new Date(currentYear, currentMonth,currentDate, luxonTime.c.hour , luxonTime.c.minute , luxonTime.c.second);
          
      //     let cutDownTime = new Date(currentYear, currentMonth,currentDate, 15 , 0 , 0);
          
      //     let timeDifference = (cutDownTime - currentTime  )/ 1000;
      //     if(timeDifference >= 0){
     
      //       $('.promo-text p span').html(findTimeDifferceInHMS(timeDifference));
      //     }else{
  
      //     $('.promo-text').html('<p>Our new product has launched!</p>');
      //     }
          
      //     },1000);
          
      //   }
  
      //   function findTimeDifferceInHMS(seconds) {
      //     var date = new Date(null);
      //     date.setSeconds(seconds);
      //     var countDownTime = date.toISOString().substr(11, 8).split(":");
      //     var timerString = countDownTime[0] + "h " + countDownTime[1] + "m " + countDownTime[2] + "s";
      //     return timerString; 
         
      //  }

    }
  }

// export function for blog tags
async function getAllTags(storefrontAPIToken){
  let hasNextPage = true;
  let endCursor = '';
  let tags = [];

  while (hasNextPage) {
    const query = `
      query paginateTags(
        $pageSize: Int = 30
        $endCursor: String
      ) {
        site {
          content{
          blog{
          posts (first: $pageSize, after:$endCursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              cursor
                  node {
                      tags     
                  }
              }
             }
            }
          }
        }
      }
      `;

    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storefrontAPIToken}`
      },
      body: JSON.stringify({
        query,
        variables: {
          endCursor: endCursor
        }
      })
    });

    const { data, errors } = await response.json();
    if (errors) {
      throw new Error(errors[0].message);
    };

    const { edges, pageInfo } = data.site.content.blog.posts;
    tags = tags.concat(edges.map(edge => edge.node));
    hasNextPage = data.site.content.blog.posts.pageInfo.hasNextPage;
    endCursor = data.site.content.blog.posts.pageInfo.endCursor;
  }
  return tags;
}