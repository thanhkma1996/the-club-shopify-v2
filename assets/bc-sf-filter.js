var onSale = false;
var soldOut = false;
var priceVaries = false;
var images = [];
var firstVariant = {};
// Override Settings
var bcSfFilterSettings = {
    general: {
        // limit: bcSfFilterConfig.custom.products_per_page,
        limit: 12,
        /* Optional */
        loadProductFirst: false
    }
};
// Declare Templates
var bcSfFilterTemplate = {
    'soldOutClass': ' sold-out',
    'saleClass': ' on-sale',
    'soldOutLabelHtml': '<span class="soldout bc-sf-filter-label">' + bcSfFilterConfig.label_basic.sold_out + '</span>',
    'saleLabelHtml': '<span class="sale bc-sf-filter-label">' + bcSfFilterConfig.label_basic.sale + '</span>',
    'tagLabelHtml': '<span class="tag bc-sf-filter-label {{labelTag}}" >{{labelTag}}</span>',
    'vendorHtml': '<p class="bc-sf-filter-product-item-vendor">{{itemVendorLabel}}</p>',
    // Pagination Template
    'previousActiveHtml': '<li><a href="{{itemUrl}}">&larr;</a></li>',
    'previousDisabledHtml': '<li class="disabled"><span>&larr;</span></li>',
    'nextActiveHtml': '<li><a href="{{itemUrl}}">&rarr;</a></li>',
    'nextDisabledHtml': '<li class="disabled"><span>&rarr;</span></li>',
    'pageItemHtml': '<li><a href="{{itemUrl}}">{{itemTitle}}</a></li>',
    'pageItemSelectedHtml': '<li><span class="active">{{itemTitle}}</span></li>',
    'pageItemRemainHtml': '<li><span>{{itemTitle}}</span></li>',
    'paginateHtml': '<ul>{{previous}}{{pageItems}}{{next}}</ul>',
    // Sorting Template
    'sortingHtml': '<label>' + bcSfFilterConfig.label.sorting + '</label><select class="bc-sf-filter-filter-dropdown">{{sortingItems}}</select>',
    // Show Limit Template
    'showLimitHtml': '<label>' + bcSfFilterConfig.label.show_limit + '</label><select class="bc-sf-filter-filter-dropdown">{{showLimitItems}}</select>',
    // Breadcrumb Template
    'breadcrumbHtml': '<a href="/">' + bcSfFilterConfig.label.breadcrumb_home + '</a> {{breadcrumbDivider}} {{breadcrumbItems}}',
    'breadcrumbDivider': '<span class="divider">/</span>',
    'breadcrumbItemLink': '<a href="{{itemLink}}">{{itemTitle}}</a>',
    'breadcrumbItemSelected': '<span>{{itemTitle}}</span>',
};
/************************** CUSTOMIZE DATA BEFORE BUILDING PRODUCT ITEM **************************/
function prepareShopifyData(data) {
  // Displaying price base on the policy of Shopify, have to multiple by 100
  soldOut = !data.available; // Check a product is out of stock
  onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
  priceVaries = data.price_min != data.price_max; // Check a product has many prices
  // Convert images to array
  images = data.images_info;
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
    var paramVariant = data.variants.filter(function(e) {
      return e.id == getParam('variant');
    });
    if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
  } else {
    for (var i = 0; i < data['variants'].length; i++) {
      if (data['variants'][i].available) {
        firstVariant = data['variants'][i];
        break;
      }
    }
  }
  return data;
}
/************************** END CUSTOMIZE DATA BEFORE BUILDING PRODUCT ITEM **************************/
/************************** BUILD PRODUCT LIST **************************/
// Build Product Grid Item
BCSfFilter.prototype.buildProductGridItem = function(data, index) {
  return '';
};
// Build Product List Item
BCSfFilter.prototype.buildProductListItem = function(data) {
  return '';
};



BCSfFilter.prototype.buildProductList = function(data, eventType) {
  if(eventType != 'sort' && eventType != 'history') {
    theme.ProductFilterAndSearch.onFilterSelected()
  }

  // if(eventType == 'init') {
  //   theme.ProductFilterAndSearch.loadSubcollectionView();
  // } else 

  if($('.subcollection-bar').length > 0 &&  eventType != 'init' && location.href.includes('_=pf') == false){
    theme.ProductFilterAndSearch.loadSubcollectionView();
  } else if (0 == this.loadProductFirst || this.isSearchPage() || this.isVendorPage() || this.isTagPage() || "best-selling" == this.defaultSorting || 1 == this.getSettingValue("general.productAndVariantAvailable") || 1 == this.loadProductFirst && ("init" != eventType || window.location.search.length > 0)) {
    data = this.prepareProductData(data);
    
    if ((this.getSettingValue('general.paginationType') == 'infinite' || this.getSettingValue('general.paginationType') == 'load_more') && eventType == 'page') {
      theme.current.collection.products = _.concat(theme.current.collection.products, data);
    } else {
      theme.current.collection.products = data;
    }

    theme.ProductFilter.buildCollectionPage(data, eventType);
  }
}

/************************** END BUILD PRODUCT LIST **************************/

/************************** BUILD TOOLBAR **************************/
// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
  // Get page info
  var currentPage = parseInt(this.queryParams.page);
  var totalPage = Math.ceil(totalProduct / this.queryParams.limit);
  // If it has only one page, clear Pagination
  if (totalPage == 1) {
    jQ(this.selector.pagination).html('');
    return false;
  }
  if (this.getSettingValue('general.paginationType') == 'default') {
    var paginationHtml = bcSfFilterTemplate.paginateHtml;
    // Build Previous
    var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousDisabledHtml;
    previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
    paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);
    // Build Next
    var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml : bcSfFilterTemplate.nextDisabledHtml;
    nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
    paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);
    // Create page items array
    var beforeCurrentPageArr = [];
    for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
      beforeCurrentPageArr.unshift(iBefore);
    }
    if (currentPage - 4 > 0) {
      beforeCurrentPageArr.unshift('...');
    }
    if (currentPage - 4 >= 0) {
      beforeCurrentPageArr.unshift(1);
    }
    beforeCurrentPageArr.push(currentPage);
    var afterCurrentPageArr = [];
    for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
      afterCurrentPageArr.push(iAfter);
    }
    if (currentPage + 3 < totalPage) {
      afterCurrentPageArr.push('...');
    }
    if (currentPage + 3 <= totalPage) {
      afterCurrentPageArr.push(totalPage);
    }
    // Build page items
    var pageItemsHtml = '';
    var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
    for (var iPage = 0; iPage < pageArr.length; iPage++) {
      if (pageArr[iPage] == '...') {
        pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
      } else {
        pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
      }
      pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
      pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
    }
    paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);
    jQ(this.selector.pagination).html(paginationHtml);
  }
};
// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
  if (bcSfFilterConfig.custom.show_sorting && bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
    jQ(this.selector.topSorting).html('');
    var sortingArr = this.getSortingList();
    if (sortingArr) {
      // Build content
      var sortingItemsHtml = '';
      for (var k in sortingArr) {
        sortingItemsHtml += '<option value="' + k + '">' + sortingArr[k] + '</option>';
      }
      var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
      jQ(this.selector.topSorting).html(html);
      // Set current value
      jQ(this.selector.topSorting + ' select').val(this.queryParams.sort);
    }
  }
};
// For Toolbar - Build Display type
BCSfFilter.prototype.buildFilterDisplayType = function() {
  var itemHtml = '<span>' + bcSfFilterConfig.label.toolbar_viewas + '</span>';
  itemHtml += '<a href="' + this.buildToolbarLink('display', 'list', 'grid') + '" title="Grid view" class="bc-sf-filter-display-item bc-sf-filter-display-grid" data-view="grid"><span class="icon-fallback-text"><i class="fa fa-th" aria-hidden="true"></i><span class="fallback-text">Grid view</span></span></a>';
  itemHtml += '<a href="' + this.buildToolbarLink('display', 'grid', 'list') + '" title="List view" class="bc-sf-filter-display-item bc-sf-filter-display-list" data-view="list"><span class="icon-fallback-text"><i class="fa fa-list" aria-hidden="true"></i><span class="fallback-text">List view</span></span></a>';
  var topDisplayTypeSelector = jQ(this.getSelector('topDisplayType'));
  var listProductSelector = jQ(this.getSelector('products'));
  topDisplayTypeSelector.html(itemHtml);
  // Active current display type
  topDisplayTypeSelector.find('.bc-sf-filter-display-item').removeClass('active');
  if (this.queryParams.display == 'list') {
    topDisplayTypeSelector.find('.bc-sf-filter-display-list').addClass('active');
    listProductSelector.removeClass('bc-sf-filter-grid-view-items').addClass('bc-sf-filter-list-view-items');
  } else if (this.queryParams.display == 'grid') {
    topDisplayTypeSelector.find('.bc-sf-filter-display-grid').addClass('active');
    listProductSelector.removeClass('bc-sf-filter-list-view-items').addClass('bc-sf-filter-grid-view-items');
  }
};
// Build Display type event
BCSfFilter.prototype.buildDisplayTypeEvent = function() {
  var _this = this;
  var topDisplayTypeSelector = jQ(this.getSelector('topDisplayType'));
  var listProductSelector = jQ(this.getSelector('products'));
  jQ(this.getSelector('topDisplayType') + ' a').click(function(e) {
    e.preventDefault();
    _this.internalClick = true;
    jQ(this).parent().children().removeClass('active');
    jQ(this).addClass('active');
    if (_this.queryParams.display == 'list') {
      topDisplayTypeSelector.find('.bc-sf-filter-display-list').addClass('active');
      listProductSelector.removeClass('bc-sf-filter-grid-view-items').addClass('bc-sf-filter-list-view-items');
    } else if (_this.queryParams.display == 'grid') {
      topDisplayTypeSelector.find('.bc-sf-filter-display-grid').addClass('active');
      listProductSelector.removeClass('bc-sf-filter-list-view-items').addClass('bc-sf-filter-grid-view-items');
    }
    var newUrl = jQ(this).attr('href');
    _this.onChangeData(newUrl, 'display');
  })
};
// Build Show Limit
BCSfFilter.prototype.buildFilterShowLimit = function() {
  if (bcSfFilterConfig.custom.show_limit && bcSfFilterTemplate.hasOwnProperty('showLimitHtml')) {
    jQ(this.selector.topShowLimit).html('');
    var numberList = this.getSettingValue('general.showLimitList');
    if (numberList != '') {
      // Build content
      var showLimitItemsHtml = '';
      var arr = numberList.split(',');
      for (var k = 0; k < arr.length; k++) {
        showLimitItemsHtml += '<option value="' + arr[k].trim() + '">' + arr[k].trim() + '</option>';
      }
      var html = bcSfFilterTemplate.showLimitHtml.replace(/{{showLimitItems}}/g, showLimitItemsHtml);
      jQ(this.selector.topShowLimit).html(html);
      // Set value
      jQ(this.selector.topShowLimit + ' select').val(this.queryParams.limit);
    }
  }
};
// Build Breadcrumb
BCSfFilter.prototype.buildBreadcrumb = function(colData, apiData) {
  if (bcSfFilterTemplate.hasOwnProperty('breadcrumbHtml')) {
    var breadcrumbItemsHtml = '';
    if (typeof colData !== 'undefined' && colData.hasOwnProperty('collection')) {
      var colInfo = colData.collection;
      if (typeof this.collectionTags !== 'undefined' && this.collectionTags !== null) {
        breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemLink.replace(/{{itemLink}}/g, '/collections/' + colInfo.handle).replace(/{{itemTitle}}/g, colInfo.title);
        breadcrumbItemsHtml += " {{breadcrumbDivider}} ";
        breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemSelected.replace(/{{itemTitle}}/g, this.collectionTags[0]);
      } else {
        breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemSelected.replace(/{{itemTitle}}/g, colInfo.title);
      }
    } else {
      breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemSelected.replace(/{{itemTitle}}/g, this.getSettingValue('label.defaultCollectionHeader'));
    }
    var html = bcSfFilterTemplate.breadcrumbHtml.replace(/{{breadcrumbItems}}/g, breadcrumbItemsHtml)
    html = html.replace(/{{breadcrumbDivider}}/g, bcSfFilterTemplate.breadcrumbDivider);
    jQ(this.selector.breadcrumb).html(html);
  }
};
/************************** END BUILD TOOLBAR **************************/
// var _origGetFilterData = BCSfFilter.prototype.getFilterData;
// BCSfFilter.prototype.getFilterData = function() {
//   if ($('.bc-sf-filter-filter-dropdown').val() == 'type') {
//     BCSfFilterCallback({total_product:''})
//     return;
//   }
//   _origGetFilterData.apply( this, arguments );
// };


// Build additional elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {
  // var sortType = bcsffilter.queryParams.sort;

  // if(eventType == 'sort' && sortType == 'type') {
  //   theme.ProductFilterAndSearch.buildCollectionpage(data, eventType);
  // } else {
    var totalProduct = data.total_product + '<span> ' + bcSfFilterConfig.label.items_with_count_other + '</span>';
    jQ('#bc-sf-filter-total-product').html(totalProduct);
    if (data.total_product == 1) {
      totalProduct = data.total_product + '<span> ' + bcSfFilterConfig.label.items_with_count_one + '</span>';
    }
    var self = this;
    if (typeof StampedFn !== 'undefined' && typeof StampedFn.loadBadges == 'function' && self.queryParams.event_type !== 'init') {
        StampedFn.loadBadges();
    }
  // }
};


// Build Default layout
function buildDefaultLink(a,b){var c=window.location.href.split("?")[0];return c+="?"+a+"="+b}BCSfFilter.prototype.buildDefaultElements=function(a){if(bcSfFilterConfig.general.hasOwnProperty("collection_count")&&jQ("#bc-sf-filter-bottom-pagination").length>0){var b=bcSfFilterConfig.general.collection_count,c=parseInt(this.queryParams.page),d=Math.ceil(b/this.queryParams.limit);if(1==d)return jQ(this.selector.pagination).html(""),!1;if("default"==this.getSettingValue("general.paginationType")){var e=bcSfFilterTemplate.paginateHtml,f="";f=c>1?bcSfFilterTemplate.hasOwnProperty("previousActiveHtml")?bcSfFilterTemplate.previousActiveHtml:bcSfFilterTemplate.previousHtml:bcSfFilterTemplate.hasOwnProperty("previousDisabledHtml")?bcSfFilterTemplate.previousDisabledHtml:"",f=f.replace(/{{itemUrl}}/g,buildDefaultLink("page",c-1)),e=e.replace(/{{previous}}/g,f);var g="";g=c<d?bcSfFilterTemplate.hasOwnProperty("nextActiveHtml")?bcSfFilterTemplate.nextActiveHtml:bcSfFilterTemplate.nextHtml:bcSfFilterTemplate.hasOwnProperty("nextDisabledHtml")?bcSfFilterTemplate.nextDisabledHtml:"",g=g.replace(/{{itemUrl}}/g,buildDefaultLink("page",c+1)),e=e.replace(/{{next}}/g,g);for(var h=[],i=c-1;i>c-3&&i>0;i--)h.unshift(i);c-4>0&&h.unshift("..."),c-4>=0&&h.unshift(1),h.push(c);for(var j=[],k=c+1;k<c+3&&k<=d;k++)j.push(k);c+3<d&&j.push("..."),c+3<=d&&j.push(d);for(var l="",m=h.concat(j),n=0;n<m.length;n++)"..."==m[n]?l+=bcSfFilterTemplate.pageItemRemainHtml:l+=m[n]==c?bcSfFilterTemplate.pageItemSelectedHtml:bcSfFilterTemplate.pageItemHtml,l=l.replace(/{{itemTitle}}/g,m[n]),l=l.replace(/{{itemUrl}}/g,buildDefaultLink("page",m[n]));e=e.replace(/{{pageItems}}/g,l),jQ(this.selector.pagination).html(e)}}if(bcSfFilterTemplate.hasOwnProperty("sortingHtml")&&jQ(this.selector.topSorting).length>0){jQ(this.selector.topSorting).html("");var o=this.getSortingList();if(o){var p="";for(var q in o)p+='<option value="'+q+'">'+o[q]+"</option>";var r=bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g,p);jQ(this.selector.topSorting).html(r);var s=void 0!==this.queryParams.sort_by?this.queryParams.sort_by:this.defaultSorting;jQ(this.selector.topSorting+" select").val(s),jQ(this.selector.topSorting+" select").change(function(a){window.location.href=buildDefaultLink("sort_by",jQ(this).val())})}}};

/* Customize data to suit the data of Shopify API */
BCSfFilter.prototype.prepareProductData = function(data) {
  var countData = data.length;
  for (var k = 0; k < countData; k++) {
    data[k]['images'] = data[k]['images_info'];
    if (data[k]['images'].length > 0) {
      data[k]['featured_image'] = data[k]['images'][0]
    } else {
      data[k]['featured_image'] = {
        src: bcSfFilterConfig.general.no_image_url,
        width: '',
        height: '',
        aspect_ratio: 0
      }
    }
    data[k]['url'] = '/products/' + data[k].handle;
    var optionsArr = [];
    var countOptionsWithValues = data[k]['options_with_values'].length;
    for (var i = 0; i < countOptionsWithValues; i++) {
      optionsArr.push(data[k]['options_with_values'][i]['name'])
    }
    data[k]['options'] = optionsArr;
    data[k]['price_min'] *= 100, data[k]['price_max'] *= 100, data[k]['compare_at_price_min'] *= 100, data[k]['compare_at_price_max'] *= 100;
    data[k]['price'] = data[k]['price_min'];
    data[k]['compare_at_price'] = data[k]['compare_at_price_min'];
    data[k]['price_varies'] = data[k]['price_min'] != data[k]['price_max'];
    var firstVariant = data[k]['variants'][0];
    if (getParam('variant') !== null && getParam('variant') != '') {
      var paramVariant = data.variants.filter(function(e) {
        return e.id == getParam('variant')
      });
      if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0]
    } else {
      var countVariants = data[k]['variants'].length;
      for (var i = 0; i < countVariants; i++) {
        if (data[k]['variants'][i].available) {
          firstVariant = data[k]['variants'][i];
          break
        }
      }
    }
    data[k]['selected_or_first_available_variant'] = firstVariant;
    var countVariants = data[k]['variants'].length;
    for (var i = 0; i < countVariants; i++) {
      var variantOptionArr = [];
      var count = 1;
      var variant = data[k]['variants'][i];
      var variantOptions = variant['merged_options'];
      if (Array.isArray(variantOptions)) {
        var countVariantOptions = variantOptions.length;
        for (var j = 0; j < countVariantOptions; j++) {
          var temp = variantOptions[j].split(':');
          data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1];
          data[k]['variants'][i]['option_' + temp[0]] = temp[1];
          variantOptionArr.push(temp[1])
        }
        data[k]['variants'][i]['options'] = variantOptionArr
      }
      data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100;
      data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100
    }
    data[k]['description'] = data[k]['content'] = data[k]['body_html'];
    /* Start Multi currency data */
    /* If this store has the multi-currency feature */
    if (typeof bcSfFilterConfig.general.currencies != 'undefined' && bcSfFilterConfig.general.currencies.length > 1) {
      /* Get the current currency code */
      var currentCurrency = bcSfFilterConfig.general.current_currency.toLowerCase().trim();

      /* Update the product price data */
      data[k].price_min = data[k]['price_min_' + currentCurrency];
      data[k].price_max = data[k]['price_max_' + currentCurrency];
      data[k].compare_at_price_min = data[k]['compare_at_price_min_' + currentCurrency];
      data[k].compate_at_price_max = data[k]['compare_at_price_max_' + currentCurrency];
    }
    /* End Multi currency data */
  }
  return data
};


/* Begin patch boost-010 run 2 */
BCSfFilter.prototype.initFilter=function(){return this.isBadUrl()?void(window.location.href=window.location.pathname):(this.updateApiParams(!1),void this.getFilterData("init"))},BCSfFilter.prototype.isBadUrl=function(){try{var t=decodeURIComponent(window.location.search).split("&"),e=!1;if(t.length>0)for(var i=0;i<t.length;i++){var n=t[i],a=(n.match(/</g)||[]).length,r=(n.match(/>/g)||[]).length,o=(n.match(/alert\(/g)||[]).length,h=(n.match(/execCommand/g)||[]).length;if(a>0&&r>0||a>1||r>1||o||h){e=!0;break}}return e}catch(l){return!0}};
/* End patch boost-010 run 2 */
