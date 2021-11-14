window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    options.$tables.wrap(
      '<div class="' + options.tableWrapperClass + '"></div>'
    );
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + options.iframeWrapperClass + '"></div>');

      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};
 
slate.Sections.prototype = _.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = _.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    document.querySelectorAll('[data-section-type=' + type + ']').forEach(function(container, index){
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = $.extend({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = _.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        triggerElement: event.target,
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this._updateOptions(variant);
      this._updateSKU(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Trigger event when available variant options change.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantOptionChange
     */
    _updateOptions: function(variant) {
      if (!variant) {
        return;
      }

      this.$container.trigger({
        type: 'variantOptionChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant sku changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantSKUChange
     */
    _updateSKU: function(variant) {
      if (variant.sku === this.currentVariant.sku) {
        return;
      }

      this.$container.trigger({
        type: 'variantSKUChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  });

  return Variants;
})();


/*================ Global ================*/
/*============================================================================
  Helper utilities
==============================================================================*/
window.theme = window.theme || {};

theme.utils = {

  /**
   * Locks the page scroll.
   *
   * @param      {element}  scrollEl  optional
   */
  lockPageScroll: function(scrollEl) {

    document.documentElement.classList.add('scroll-locked');
    if ('bodyScrollLock' in window) {
      bodyScrollLock.lock(scrollEl);
    }

  },

    /**
   * Unlocks the page scroll.
   */
  unlockPageScroll: function() {

    document.documentElement.classList.remove('scroll-locked');

    if ('bodyScrollLock' in window) {
      bodyScrollLock.unlock();
    }

    if (theme.stickyHeader) {
      theme.stickyHeader.update();
    }
  },

  /**
   * Turns a string into a handle. Mimics Shopify's format.
   */
  handleize: function(str) {
    return str.toLowerCase().replace(/[^\w\u00C0-\u024f]+/g, "-").replace(/^-+|-+$/g, "");
  },

  /**
   * Cross-browser URL query param getter
   */
  getQueryParams: function(qs) {
    qs = qs || document.location.search;

    if (!qs) { 
      return;
    }

    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
  },

  getQueryParam: function(param) {
    var params = this.getQueryParams();
    return params ? params[param] : undefined;
  },

  updateQueryStringParameter: function(key, value, url) {
    if (!url) url = window.location.href;

    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
    hash;

    if (re.test(url)) {
      if (typeof value !== 'undefined' && value !== null)
        return url.replace(re, '$1' + key + "=" + value + '$2$3');
      else {
        hash = url.split('#');
        url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
        if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
          url += '#' + hash[1];
        return url;
      }
    } else {
      if (typeof value !== 'undefined' && value !== null) {
        var separator = url.indexOf('?') !== -1 ? '&' : '?';
        hash = url.split('#');
        url = hash[0] + separator + key + '=' + value;
        if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
          url += '#' + hash[1];
        return url;
      }
      else
        return url;
    }
  },

  getYoutubeId: function(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  },

  getProductJSON: function(handle, success, error) {
    return $.ajax({
      url: '/products/' + handle + '?view=json',
      success: success || $.noop,
      error: error || $.noop
    });
  },

  hexToRgb: function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  forceRedraw: function(elem) {
    if (!elem) {
      return;
    }

    var disp = elem.style.display;
    elem.style.display = 'none';
    var redrawElem = elem.offsetHeight;
    elem.style.display = disp;
  },

  flash: function(elements, color, duration) {
    var opacity = 100;
    color = color || '255, 255, 136';
    duration = duration || 1500;
    
    if (color.indexOf('#') > -1) {
      var rgbColor = theme.utils.hexToRgb(color);
      color = [rgbColor.r,rgbColor.g,rgbColor.b].join(',');
    }
    
    var interval = setInterval(function() {
      opacity -= 2.5;
      
      $(elements).css({ background: 'rgba(' + color + ', ' + opacity / 100 + ')' });
      
      if (opacity <= 0) {
        clearInterval(interval);
        return;
      }
    }, duration / 40);
  },

  getOffset: function(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  },

  // Gets the rendered size of an image using object-fit
  getRenderedImgSize: function(contains, cWidth, cHeight, width, height, pos) {
    var oRatio = width / height,
    cRatio = cWidth / cHeight;
    return function() {
      if (contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
        this.width = cWidth;
        this.height = cWidth / oRatio;
      } else {
        this.width = cHeight * oRatio;
        this.height = cHeight;
      }      
      this.left = (cWidth - this.width)*(pos/100);
      this.right = this.width + this.left;
      return this;
    }.call({});
  },

  // Returns size info for an image rendered with object-fit
  getImgSizeInfo: function(img) {
    var pos = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');
    return theme.utils.getRenderedImgSize(true,
      img.width,
      img.height,
      img.naturalWidth,
      img.naturalHeight,
      parseInt(pos[0]));
  },

  // Returns content of template placed into snippets/js-tempales.liquid
  getTemplate: function(template) {
    return $('[data-template-for="' + template + '"]').html();
  },

  // Returns a HTML element from a string
  createElementFromHTML: function(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  },

  // Returns deep differences between objects, ignoring functions
  difference: function(object, base) {
    function changes(object, base) {
      return _.transform(object, function(result, value, key) {
        if (typeof value !== 'function' && !_.isEqual(value, base[key])) {
          var comparison = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;

          if (!_.isNil(comparison)) {
            result[key] = comparison;
          }
        }
      });
    }
    return changes(object, base);
  },

  // Adds syntax highlighting to JSON output
  syntaxHighlight: function(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
    json = json.replace(/([\n\r]|^)(\s*){/g, '<span class="group">$2<span class="group-handle">{</span>').replace(/([\n\r]|^)(\s*)}(,|)/g, '$1$2}$3</span>');
    json = json.replace(/(<\/span>|^)(\s*)\[/g, '$1<span class="group group--inline">$2<span class="group-handle">[</span>').replace(/([\n\r]|^)(\s*)](,|)/g, '$2]$3</span>');
    return json;
  },

  getStyleValue: function(variable) {
    var value = window.getComputedStyle(document.documentElement).getPropertyValue(variable);
    if (value) {
      return value.trim();
    }
    return '';
  },

  // returns cross-browser CSS property name
  getCSSProperty: function(propertyName) {
    var properties;

    switch(propertyName) {

      case 'transform':
        properties = ['transform', 'msTransform', 'webkitTransform', 'mozTransform', 'oTransform'];
        break;
    }

    function getSupportedPropertyName(properties) {
      for (var i = 0; i < properties.length; i++) {
        if (typeof document.body.style[properties[i]] != 'undefined') {
          return properties[i];
        }
      }
      return null;
    }

    return getSupportedPropertyName(properties);
  },

  getBottomOffsetFromViewportTop: function(el) {
    var rect = el.getBoundingClientRect();
    return rect.top + rect.height;
  },

  errorTippy: function(target, message) {
    var $el = $(target);
    var tip = tippy($el[0], {
      showOnInit: true,
      content: message,
      theme: 'light',
      animation: 'shift-away',
      arrow: true,
      delay: [0, 1000],
      onHidden: function(e) {
        e.destroy();
      }
    });
  },

  showError: function(message) {
    iziToast.show({
      message: message,
      color: 'red',
      position: 'bottomCenter'
    });
  },

  highlightSubString: function(substring, string) {
    return substring ? string.replace(new RegExp(substring, 'gi'), function (str) {
      return '<strong>' + str + '</strong>';
    }) : '';
  }

};

if ('tinybind' in window) {

  tinybind.formatters.replace = function (value, search, replace) {
    return value.replace(search, replace);
  };

  tinybind.formatters.handle = function (string) {
    return theme.utils.handleize(string);
  };

  tinybind.formatters.startsWith = function (value, prefix) {
    return value.indexOf(prefix) === 0;
  };

  tinybind.formatters.endsWith = function (value, suffix) {
    return value.indexOf(suffix, value.length - suffix.length) !== -1;
  };

  tinybind.formatters.gte = function (a, b) {
    return a >= b;
  };

  tinybind.formatters.or = function (a, b) {
    return a || b;
  };

  tinybind.formatters.default = function (a, b) {
    return a ? a : b;
  };

  tinybind.formatters.and = function (a, b) {
    return a && b;
  };

  tinybind.formatters.and_three = function (a, b, c) {
    return a && b && c;
  };

  tinybind.formatters.size = function (a) {
    return _.size(a);
  };

  tinybind.formatters.style = function (a, b) {
    return b + ': ' + a + ';'
  };

  tinybind.formatters.truncate = function (a, b) {
    return a.length > b ? a.substring(0, b - 3) + '&#8230;' : a;
  };

  tinybind.formatters.get_url = function (a) {
    if (a.url) {
      return a.url;
    } else {
      return '/products/' + a.handle;
    }
    // return a.length > b ? a.substring(0, b - 3) + '&#8230;' : a;
  };

  tinybind.formatters.length = tinybind.formatters.size;

  tinybind.formatters.stripHtml = function (html) {
    var parsedHtml = new DOMParser().parseFromString(html, 'text/html');
    return parsedHtml.body.textContent || "";
  };

  tinybind.formatters.escape = function (string) {
    return JSON.stringify(string).replace(/(^"|"$)/g, '');
  };

  tinybind.formatters.json = function (a) {
    return JSON.stringify(a);
  };

  tinybind.formatters.log = function (value) {
    console.log(value);
    return value;
  };

  tinybind.formatters.format_tel = function (value) {
    return value ? value.toString().replace(/\ /g, '') : value;
  };

  tinybind.formatters.array_position = function (array, value) {
    return (value >= 0 ? array[value] : array[array.length + value]);
  };

  tinybind.formatters.percentage_of = function (a, b) {
    return b / a * 100;
  };

  tinybind.formatters.contains = function (a, b) {
    return (a.indexOf(b) > -1);
  };

  tinybind.formatters.containsAny = function (a, b) {
    var i, j;
    i = a.length;
    while (i--) {
      j = b.length;
      while (j--) {
        if (a[i] == b[j]) {
          return true;
        }
      }
    }
    return false;
  };

  tinybind.formatters.imageExists = function (a) {
    return (a && a.indexOf('no-image') == -1);
  };

  tinybind.formatters.findFirstContaining = function (a, b) {
    var matches = _.find(a, function (n) {
      return n.indexOf(b) > -1 ? n : false;
    }) || '';

    if (typeof matches != 'string') {
      matches = matches[0];
    }

    return matches;
  };

  tinybind.formatters.highlight = function (a, b) {
    if (b && a) {
      return theme.utils.highlightSubString(b, a);
    }
    return;
  };

  tinybind.formatters.img = function (image, alt, maxWidth, maxHeight) {

    if (!image) {
      return;
    }

    var imgTemplateURL,
        imgString,
        imgUrl;

    imgUrl = (typeof image == 'string' ? image : image.src);

    imgTemplateURL = slate.Image.getSizedImageUrl(imgUrl, '{width}x');

    maxWidth = maxWidth ? ((image.width ? image.width + 'px' : false) || (typeof maxWidth == 'string' ? maxWidth : maxWidth + 'px')) : 'none';
    maxHeight = maxHeight ? ((image.height ? image.height + 'px' : false) || (typeof maxHeight == 'string' ? maxHeight : maxHeight + 'px')) : 'none';

    alt = alt || null;

    imgString = '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="lazyload" style="max-width: ' + maxWidth + '; max-height: ' + maxHeight + ';" data-sizes="auto" data-src="' + imgTemplateURL + '" alt="' + alt + ' "/>'

    return imgString;
  };

  tinybind.formatters.map = function (a, b) {
    return _.map(a, b);
  };

  tinybind.formatters.sum = function (values) {
    return _.sum(values);
  };

  tinybind.binders['product-sku'] = function (el, value) {
    if (value) {
      var sku,
          groupTag = _.find(value.tags, function (tag) {
            return tag.indexOf('Group-') > -1 ? tag : false;
          }) || '';

      if (typeof groupTag != 'string') {
        groupTag = groupTag[0] || false;
      }

      if (groupTag) {
        sku = groupTag.replace('Group-', '');
      } else {
        sku = value.variants[0].sku.split('-')[0];
      }

      el.innerText = sku;
    }
  };

  tinybind.binders.selected = function (el, value) {
    if (value) {
      el.setAttribute('selected', 'selected');
    }
  };

  tinybind.formatters['price_with_addons'] = function (line_item) {
    var linePrice = line_item.line_price;

    for (var i = 0; i < CartJS.cart.items.length; i++) {
      if (CartJS.cart.items[i].key != line_item.key && CartJS.cart.items[i].properties._optionGroup == line_item.properties._optionGroup) {
        linePrice += CartJS.cart.items[i].line_price;
      }
    }

    return linePrice;
  };

  tinybind.binders['product-option-dropdown'] = function (el, option) {
    var optionHandle = theme.utils.handleize(option.name);

    $('[data-section-id="product"]').trigger({
      type: 'optionSelectAdded',
      detail: {
        el: el,
      }
    });

    if (optionHandle == 'color' || optionHandle == 'colour') {
      var color = this.model.$parent.item.product.options_with_values[this.model.$parent.item.product.options.indexOf(option.name)].values[0];

      $('[data-section-id="product"]').trigger({
        type: 'colorSelectAdded',
        detail: {
          color: color,
          el: el,
        }
      });
    }

  };

  tinybind.binders.focus = {
    bind: function (el) {
      el.focus();
    },

    routine: function (el, value) {
      if (value) {
        setTimeout(function () {
          el.focus();
        }, 25);
      }
    }
  };

  tinybind.binders['product-grid-item'] = function (el, product) {
    var gridIndex = el.dataset.index;
    var animateIn = typeof el.dataset.animateIn != 'undefined' ? el.dataset.animateIn : true;
    var options = {
      animateIn: animateIn == 'true' ? true : false
    };
    new theme.ProductGridItem(el, product, gridIndex, options);
  };


  tinybind.binders.transformx = function (el, value) {
    el.style[theme.utils.getCSSProperty('transform')] = 'translateX(' + value + ')';
  };

  tinybind.binders['scroll-to'] = function (el, value) {
    var parent;

    if (value) {
      parent = el.parentElement;
      $(parent).scrollTo(el, {
        duration: 500,
        interrupt: !isMobile.apple.device,
        offset: -20
      });
    }
  };

  tinybind.formatters.debug = function (a) {
    if ('debugger' in window) {
      debugger;
    }

    return a;
  };

  tinybind.formatters.get_description = function (a) {
    if (a.metafields) {
      let description = a.metafields.find(item => item.key === 'description' && item.namespace === 'alternative');
      if (description) {
        try {
          var k = JSON.parse(description.value).html;
          if (k !== '' && k) {
            return k;
          }
        } catch (e) {
          if (description.value) {
            return description.value
          } else {
            return a.description;
          }
        }
      } else {
        return a.description;
      }
    } else {
      return a.description;
    }
  };


  tinybind.formatters.get_type = function (a) {
    if (a.metafields) {
      let type = a.metafields.find(item => item.key === 'type' && item.namespace === 'alternative');
      if (type)
        if (type.value)
          return type.value;
        else
          return a.product_type;
      else
        return a.product_type;
    }
    return a.product_type;
  };


  tinybind.formatters.compare_data = function (a) {

    if (a) {

      var now = new Date().getTime();
      let data_product = Date.parse(a);
      let diff = now - data_product;
      let day, hour, minute, seconds;
      seconds = Math.floor(diff / 1000);
      minute = Math.floor(seconds / 60);
      hour = Math.floor(minute / 60);
      day = Math.floor(hour / 24);
      return 14 > day;
    }
  };

  tinybind.formatters.minimum_price = function (a) {
    return a[0].title;
  //   if (a) {
  //     if (a.length <= 1) {
  //       return a[0].title;
  //     }
  //     const sorted = _.sortBy(a, o => o.price);
  //     return sorted[0].title;
  //   }
  };


  tinybind.formatters.check_variants_count = function (a) {
    if (a) {
      var count = a.length;
      if (count > 1) {
        return false;
      }
      else if (count == 1 && a[0].price != 0 ) {
        return false;
      }
      else {
        return true;
      }
    }
  };

  tinybind.formatters.return_available_variant_price = function (a) {
    if (a) {
      if (a.length == 1) {
        return a[0].price;
      } else if (a[0].price !== 0) {
       return  a[0].price;
      }
      else {
        for (let i = 0; i < a.length; i++) {
           if (a[i].price !== 0 && a[i].available){
             return a[i].price;
           }
        }
      }
    }
    else return a[0].price;
  };


  tinybind.formatters.return_available_variant = function (a) {
    if (a) {
      if (a.length == 1) {
        return a[0].title;
      } else if (a[0].price !== 0) {
        return  a[0].title;
      }
      else {
        for (let i = 0; i < a.length; i++) {
          if (a[i].price !== 0 && a[i].available){
            return a[i].title;
          }
        }
      }
    }
    else return a[0].title;
  };


  tinybind.formatters.check_variants_null = function (a) {

    if (a) {
      var count = a.length;
      if (count > 1 && a[0].price !== 0) {
        return true;
      }
      else if (count == 1 && a[0].price != 0 ) {
        return true;
      }
    }
  };

}


window.theme = window.theme || {};
window.theme.drawers = window.theme.drawers || {};
/*============================================================================
  Drawer modules
==============================================================================*/
theme.Drawers = (function() {

  if ('Hammer' in window && isMobile.any) {
    theme.pageSwipeObject = new Hammer.Manager(document.getElementById('PageContainer'), {
      touchAction: 'auto',
      inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchMouseInput,
      recognizers: [
        [Hammer.Swipe, {
          direction: Hammer.DIRECTION_HORIZONTAL
        }]
      ]
    });

    theme.pageSwipeObject.on('swiperight', function(evt) {
      if ($('body').hasClass('js-drawer-open-right')) {
        var $drawer = $('.drawer.drawer--right');
        theme[$drawer.attr('id')].close();
        return;
      }

      var $drawer = $('.drawer.drawer--left');
      if (!$drawer.length) {
        return;
      }
      var delta_x = evt.deltaX;
      var final_x = evt.srcEvent.pageX || evt.srcEvent.screenX || 0;
      var startPosition = final_x - delta_x;
      if (startPosition >= 0 && startPosition <= 25) {
        theme[$drawer.attr('id')].open();
      }
      return false;
    });

    theme.pageSwipeObject.on('swipeleft', function(evt) {
      if ($('body').hasClass('js-drawer-open-left')) {
        var $drawer = $('.drawer.drawer--left');
        theme[$drawer.attr('id')].close();
        return;
      }

      var $drawer = $('.drawer.drawer--right');
      if (!$drawer.length) {
        return;
      }

      return;  // Do not open ajax cart with swipe right

      var delta_x = evt.deltaX;
      var final_x = evt.center.x || 0;
      var startPosition = final_x + -delta_x;
      var windowWidthOffset = $(window).width() - 25;
      if (startPosition >= windowWidthOffset) {
        theme[$drawer.attr('id')].open();
      }
      return false;
    });
  }
  
  function Drawer(id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position,
      pageContentSelector: '#PageContent',
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.nodes = {
      $parent: $('html').add('body'),
      $page: $(this.config.pageContentSelector)
    };

    this.$drawer = $('#' + id);

    this.$drawer.addClass('drawer--' + position);

    if (!this.$drawer.length) {
      return false;
    }

    theme.drawers[id] = this;

    this.drawerIsOpen = false;
    this.init();
  }

  Drawer.prototype.init = function() {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.on('click', this.config.close, $.proxy(this.close, this));
  };

  Drawer.prototype.closeAllDrawers = function(evt) {
    // Close all drawers
    _.forEach(theme.drawers, function(drawer) {
      if (drawer.drawerIsOpen) {
        drawer.close();
      }
    });
  };

  Drawer.prototype.open = function(evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to nodes.$page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    this.closeAllDrawers();

    // Run function when draw opens if set
    if (this.config.beforeDrawerOpen && typeof this.config.beforeDrawerOpen === 'function') {
      // if (!externalCall) {
        this.config.beforeDrawerOpen(this);
      // }
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$drawer.prepareTransition();
    this.$drawer.addClass('is-open');

    this.nodes.$parent.addClass(this.config.openClass + ' ' + this.config.dirOpenClass);
    this.drawerIsOpen = true;

    // theme.utils.lockPageScroll(this.$drawer.get(0));

    // Set focus on drawer
    slate.a11y.trapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    // Run function when draw opens if set
    if (this.config.onDrawerOpen && typeof this.config.onDrawerOpen === 'function') {
      if (!externalCall) {
        this.config.onDrawerOpen(this);
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.bindEvents();

    return this;
  };

  Drawer.prototype.close = function() {
    if (!this.drawerIsOpen) { // don't close a closed drawer
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$drawer.prepareTransition();
    this.$drawer.removeClass('is-open');

    this.nodes.$parent.removeClass(this.config.dirOpenClass + ' ' + this.config.openClass);

    this.drawerIsOpen = false;

    theme.utils.unlockPageScroll();

    // Remove focus on drawer
    slate.a11y.removeTrapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    // Run function when draw opens if set
    if (this.config.onDrawerClose && typeof this.config.onDrawerClose === 'function') {
      this.config.onDrawerClose();
    }

    this.unbindEvents();
  };

  Drawer.prototype.bindEvents = function() {
    this.nodes.$parent.on('keyup.drawer', $.proxy(function(evt) {
      // close on 'esc' keypress
      if (evt.keyCode === 27) {
        this.close();
        return false;
      } else {
        return true;
      }
    }, this));

    // Lock scrolling on mobile
    // this.nodes.$page.on('touchmove.drawer', function() {
    //   return false;
    // });

    this.nodes.$page.on('click.drawer', $.proxy(function() {

      if (!this.$drawer[0].contains(event.target)) {
        this.close();
      }

    }, this));
  };

  Drawer.prototype.unbindEvents = function() {
    this.nodes.$page.off('.drawer');
    this.nodes.$parent.off('.drawer');
  };

  Drawer.prototype.getProperties = function() {
    var header, headerLowerHeight, offsetTop;

    if (document.body.classList.contains('show-product-sticky')) {
      var productSticky = document.querySelector('.product-sticky');
      offsetTop = theme.utils.getBottomOffsetFromViewportTop(productSticky);
    } else if (document.body.classList.contains('show-header-lower')) {
      var headerLower = document.querySelector('.site-header-lower');
      offsetTop = theme.utils.getBottomOffsetFromViewportTop(headerLower);
    } else {
      // Calc height of visible header elements
      header = document.querySelector('.header');
      offsetTop = theme.utils.getBottomOffsetFromViewportTop(header);
    }

    return {
      top: Math.floor(offsetTop) + 'px',
      height: 'calc(100% - ' + Math.floor(offsetTop) + 'px)',
    };
  };

  return Drawer;
})();

window.theme = window.theme || {};

theme.Dropdown = (function() {

  var config = {
    modifiers: {
      option: _.noop,
      select: _.noop,
      dropdown: _.noop,
    },
    callbacks: {
      afterInit: _.noop,
    },
    defaults: {
      animateFill: false,
      animation: 'shift-away',
      appendTo: "parent",
      aria: null,
      distance: 0,
      interactive: true,
      offset: 0,
      placement: "bottom",
      role: "listbox",
      theme: "light select-dropdown",
      trigger: "click",
      flip: false,
    },
  };

  function Dropdown(elem, options, modifiers, callbacks) {
    var self = this;

    if (elem.tagName == 'SELECT') {
      options = _.defaults(options, config.defaults);
      this.modifiers = _.defaults(modifiers, config.modifiers);
      this.callbacks = _.defaults(callbacks, config.callbacks);

      var content = elem.outerHTML.replace(/<(\/|)select/g, '<$1div').replace(/(.*?)<option/, '$1<div><option').replace(/(.*)<\/option>/, '$1</option></div>').replace(/<(\/|)option/g, '<$1a').replace(/value=/g, 'data-value='),
          dropdown = theme.utils.createElementFromHTML(content),
          items = dropdown.querySelectorAll('a');
      
      this.button = document.createElement('button');

      this.modifiers.dropdown(dropdown);

      for (var i = 0; i < items.length; i++) {
        this.modifiers.option(items[i]);
      }

      this.selectedEl = items[elem.selectedIndex];

      this.button.type = 'button';
      this.button.classList.add('select-dropdown');
      this.button.innerHTML = elem.value || elem.placeholder;
      
      this.modifiers.select(this.button, this.selectedEl);

      var tabindex = elem.getAttribute('tabindex'); 
      tabindex && this.button.setAttribute('tabindex', tabindex);

      elem.parentElement.insertBefore(this.button, elem);
      this.button.offsetHeight;
      this.button.classList.add('loaded');

      if (typeof options.appendTo == 'undefined') {
        options.appendTo = this.button.parentElement;
      }

      options.content = dropdown.outerHTML;
      options.maxWidth = this.button.offsetWidth;

      this.instance = tippy(this.button, options);
      this.instance.popper.style.minWidth = options.maxWidth + 'px';
      this.instance.popper.addEventListener('click', this._onDropdownClick.bind(this));

      this.callbacks.afterInit.bind(this)();
    }

  }

  Dropdown.prototype = _.extend({}, Dropdown.prototype, {

    _onDropdownClick: function(evt) {

      if (evt.target.dataset.value !== undefined) {
        var originalSelectEl = this.instance.reference.nextElementSibling,
            selectedEl = evt.target,
            changeEvent = new Event('change'),
            previousEl = selectedEl.parentElement.querySelector('[selected]');

        previousEl && previousEl.removeAttribute('selected');
        selectedEl.setAttribute('selected', 'selected');

        this.selectedEl = selectedEl;

        originalSelectEl.value = selectedEl.dataset.value;

        this.button.innerHTML = selectedEl.dataset.value;

        this.modifiers.select(this.button, this.selectedEl);

        changeEvent.detail = _.omit(selectedEl.dataset, _.functions(selectedEl.dataset));
        originalSelectEl.dispatchEvent(changeEvent);

        this.instance.hide();
      }

    },

  });


  return Dropdown;

})();

window.theme = window.theme || {};

theme.Modal = (function() {

  var config = {

  };

  function Modal(content, options) {

    this.modalContent = content;
    this.options = options || {};
    this.modal = this._createNewModal();

  }

  Modal.prototype = _.extend(Modal.prototype, {

    _createNewModal: function() {

      var featherlightOptions = this.options.featherlightOptions;
      var modal = $.odModal($(this.modalContent), featherlightOptions);

      if (this.options.positionX || this.options.positionY) {
        modal.$instance.addClass('od-modal--' + this.options.positionX);
        modal.$instance.addClass('od-modal--' + this.options.positionY);
      }

      return modal;
    }

  });

  return Modal;
})();

(function() {
  var selectors = {
    tabHandles: '.tabs-menu a'
  };
  
  var classes = {
    qtySelector: 'js-qty-select'
  };

  var $tabHandles = $(selectors.tabHandles);

  if (!$tabHandles.length) {
    return;
  }

  $(selectors.tabHandles).click(function(e) {
    e.preventDefault();
    var $this = $(this);
    $this.parent().addClass("current");
    $this.parent().siblings().removeClass("current");
    var tab = $this.attr("href");
    $(".tab-content").not(tab).css("display", "none");
    $(tab).fadeIn();
  });
})();

window.theme = window.theme || {};
window.theme.tabsGroups = window.theme.tabsGroups || {};

/*============================================================================
  TAB GROUPS
==============================================================================*/

theme.TabsGroup = (function() {

  var selectors = {
    container: '.tabs-group',
    tab: '.tabs-group__tab'
  };

  var defaultOptions = {
    activeTab: 1,
    tabsActiveClass: 'tabs-group--active',
    navContainerClass: 'tabs-group__nav',
    tabNavItemClass: 'tabs-group__nav-item',
    accordionNavItemClass: 'tabs-group__accordion-nav-item',
    breakpoint: 990,
    transitionDuration: 0.5
  };

  function TabsGroup(el, options) {
    this.$tabsGroup = $(el);

    if (!this.$tabsGroup.length) {
      return;
    }

    this.options = _.defaults(options, defaultOptions);

    this.config = {
      mediaQueryAccordion: 'screen and (max-width: ' + this.options.breakpoint + 'px)',
      mediaQueryTabs: 'screen and (min-width:  ' + (this.options.breakpoint + 1) + 'px)'
    };

    this.$tabs          = this.$tabsGroup.find(selectors.tab);
    this.$navContainer = $('<div></div>').addClass(this.options.navContainerClass);

    // Set initial tab states
    for (var j =  this.$tabs.length - 1; j >= 0; j--) {
      var $tab = $(this.$tabs[j]);
      var tabId = $tab.data('tab');
      var tabTitle = $tab.data('tabTitle');

      var $navItem = $('<div></div>')
                      .attr('data-target', tabId)
                      .attr('data-target-title', tabTitle)
                      .html(tabTitle);

      if (tabId == this.options.activeTab) {
        this.activeTab = tabId;
        $tab.attr('data-active', 'true');
        $navItem.attr('data-active', 'true');
      } else {
        $tab.attr('data-active', 'false');
        $navItem.attr('data-active', 'false');
      }

      var $tabNavItem = $navItem;
      var $accordionNavItem = $navItem.clone();

      $tabNavItem.addClass(this.options.tabNavItemClass);
      this.$navContainer.prepend($tabNavItem);

      $accordionNavItem.addClass(this.options.accordionNavItemClass).insertBefore($tab);

    }

    this.$tabsGroup.prepend(this.$navContainer);
    this.$navItems = this.$tabsGroup.find('[data-target]');

    var self = this;

    enquire.register(this.config.mediaQueryAccordion, {
      match: function() {
        self.$tabsGroup.attr('data-tabs-type', 'accordion');
      }
    });

    enquire.register(this.config.mediaQueryTabs, {
      match: function() {
        self.$tabsGroup.attr('data-tabs-type', 'tabs');
      }
    });

    // Bind nav click events
    $(this.$navItems).on('click',function() {
      var target = $(this).data('target');

      if (self.activeTab == target) {
        self._closeAll();
      } else {
        self._goTo(target);
        self.activeTab = target;
      }

    });

    $(this.$tabsGroup).addClass(this.options.tabsActiveClass);
  }

  TabsGroup.prototype = $.extend({}, TabsGroup.prototype, {

    _closeAll: function() {
      var self = this;

      if (self.$tabsGroup.attr('data-tabs-type') != 'accordion') {
        return;
      }

      var $activeTab = $('[data-tab="' + self.activeTab + '"]', self.$tabsGroup);

      var animate = false;
      if ($(window).width() < this.options.breakpoint) {
        animate = true;
      }

      var height = {
        active: {}
      };

      if (animate) {
        height.active.current = $activeTab.height();
        $activeTab.css('height', height.active.current);
      }

      $(self.$tabs).attr('data-active', 'false');
      $(self.$navItems).attr('data-active', 'false');

      if (animate) {
        height.active.new = 0;

        $activeTab.height(height.active.current);
        
        $activeTab.height(height.active.new);

        setTimeout(function(){
          $activeTab.css('height','');
         }, self.options.transitionDuration * 1000);
      }

      self.activeTab = false;

    },
    _goTo: function(target) {
      var self = this;

      this.$tabsGroup.trigger({
        type: 'tabChange',
        tabIndex: target
      });

      var $tab = $('[data-tab="' + target + '"]', self.$tabsGroup);
      var $activeTab = $('[data-tab="' + self.activeTab + '"]', self.$tabsGroup);

      var animate = false;
      if ($(window).width() < this.options.breakpoint) {
        animate = true;
      }

      var height = {
        target: {},
        active: {}
      };

      if (animate) {
        height.target.current = 0;
        $tab.css('height', height.target.current);

        height.active.current = $activeTab.height();
        $activeTab.css('height', height.active.current);
      }

      $(self.$tabs).attr('data-active', 'false');
      $(self.$navItems).attr('data-active', 'false');

      var $target = self.$tabsGroup.find('[data-tab=' + target + ']');
      $($target).attr('data-active', 'true');

      var $targetNav = self.$tabsGroup.find('[data-target=' + target + ']');
      $($targetNav).attr('data-active', 'true');

      if (animate) {
        height.target.new = $tab.css('height','auto').get(0).scrollHeight;
        height.active.new = 0;

        $tab.height(height.target.current);
        $activeTab.height(height.active.current);
        
        $tab.height(height.target.new);
        $activeTab.height(height.active.new);

        setTimeout(function(){
          $tab.css('height','');
          $activeTab.css('height','');

          $(window).scrollTo($target, {
            duration: self.options.transitionDuration * 1000,
            interrupt: !isMobile.apple.device,
            offset: -100
          });

         }, self.options.transitionDuration * 1000);
      }

      self.activeTab = target;
    }

  })

  return TabsGroup;
})();

window.theme = window.theme || {};
window.accordions = window.accordions || {};

theme.SimpleAccordion = (function() {

  var defaults = {
    activeClass: 'active',
    accordionClass: 'simple-accordion',
    accordionTitleClass: 'simple-accordion__title'
  };

  var selectors = {
    accordion: '[data-simple-accordion]',
    title: '.' + defaults.accordionTitleClass,
  };

  function SimpleAccordion(el) {

    this.$el = $(el);

    var mediaQuery = this.$el.data('simpleAccordion');

    if (mediaQuery) {
      this.mediaQuery = theme.settings.mediaQuery[mediaQuery];
    }

    var styleValue = theme.utils.getStyleValue('--accordion-transition-duration') || '0.5s';
 
    this.animationDuration = styleValue.replace('s', '') * 1000;

    this.$titles = this.$el.find(selectors.title);
    if (!this.$titles.length) {
      this.$titles = this.$el.children().first();
      this.$titles.addClass(defaults.accordionTitleClass);
    }

    var self = this;

    if (self.mediaQuery) {
      _registerBreakpoints(self.mediaQuery);
    } else {
      initAccordion();
    }

    function initAccordion() {
      self.$el.addClass(defaults.accordionClass);
      self.$titles.on('click.accordion', _openClose);
    }

    function destroyAccordion() {
      self.$el.removeClass(defaults.accordionClass);
      self.$titles.off('click.accordion');
    }

    function _registerBreakpoints(mediaQuery) {

      enquire.register(mediaQuery, {
        match: function() {
          initAccordion();
        },
        unmatch: function() {
          destroyAccordion();
        }
      });

    }

    function _openClose() {

      var $currentTitle = $(this);

      var $target = $(this).next();
      var $active = self.$titles.filter('.' + defaults.activeClass).next();

      var close = false;
      if ($target[0] == $active[0]) {
        close = true;

        // If target is a link and accordion is open then go to link
        // if (event.target.href || event.currentTarget.href) {
        //   window.location.href = event.target.href || event.currentTarget.href;
        //   return;
        // }
      }

      event.preventDefault();

      self.$titles.removeClass(defaults.activeClass);

      var height = {
        target: {},
        active: {}
      };

      height.target.current = $target.height();
      height.active.new = 0;
      height.active.current = $active.height();

      $active.height(height.active.current);

      if (!close) {
        $(this).addClass(defaults.activeClass);
        $target.height(height.target.current);
        $target.addClass(defaults.activeClass);
      }

      $active.removeClass(defaults.activeClass);

      // if (!close) {
        $target.height('auto');
        $active.height('auto');
        $active.height(height.active.new);
        height.target.new = $target.get(0).scrollHeight;
        $target.offset();
        $active.offset();
        $currentTitle.trigger('accordionTransitionHeightCalc');
        $active.height('auto');
        $active.height(height.active.current);
        $target.height(height.target.current);
        $target.height(height.target.new);
      // }

      $active.height(height.active.new);

      setTimeout(function(){
        $target.height('');
        $active.height('');
        $currentTitle.trigger('accordionTransitionEnd');
       }, self.animationDuration);

      return;
    }
  }

  (function init() {
    var $accordions = $(selectors.accordion);
    if (!$accordions.length) {
      return;
    }
    for (var i = $accordions.length - 1; i >= 0; i--) {
      window.accordions[i] = new SimpleAccordion($accordions[i]);
    }
  })();

  return SimpleAccordion;

})();

/*============================================================================
  Quantity Selectors
==============================================================================*/
window.theme = window.theme || {};

theme.QuantitySelector = (function() {
  var selectors = {
    qtyInputs: 'input[type="number"]',
    excludeInputs: '#cart input[type="number"], .js-qty-select input[type="number"], .product-grid-item input[type="number"]',
    qtySelector: '.js-qty-select',
    qtyButtonAdd: '.js-qty-select-add',
    qtyButtonSubtract: '.js-qty-select-sub',
  };

  var classes = {
    qtySelector: 'js-qty-select',
    qtyButtonAdd: 'js-qty-select-add',
    qtyButtonSubtract: 'js-qty-select-sub',
  };

  var defaults = {
    template: 'quantity-selector',
    formatAsSize: false
  };

  function QuantitySelector(inputEl, userOptions) {
    if (!inputEl) {
      return false;
    }

    this.inputEl = inputEl;

    var parent,
        template,
        el,
        options;

    options = _.defaults(userOptions, defaults);

    parent = inputEl.parentNode;
    template = theme.utils.getTemplate(options.template);
    el = theme.utils.createElementFromHTML(template);

    this.data = {
      formatAsSize: (options.variantSize ? options.formatAsSize : false),
      variantSize: options.variantSize
    };

    this.data.input = {
      value: inputEl.value ? parseInt(inputEl.value) : 0,
      id: inputEl.id,
      class: inputEl.classList.toString(),
      max: inputEl.max ? parseInt(inputEl.max) : 10000,
      min: inputEl.min ? parseInt(inputEl.min) : 0,
      name: inputEl.name,
      pattern: inputEl.pattern,
    };

    inputEl.classList.add('hidden');
    parent.appendChild(el);

    tinybind.bind(el, {
      data: this.data,
      methods: {
        subtract: this.subtract.bind(this),
        add: this.add.bind(this),
      }
    });

  }

  QuantitySelector.prototype = _.extend({}, QuantitySelector.prototype, {

    subtract: function() {
      event.preventDefault();
      this.set((this.data.input.value - 1));
    },

    add: function() {
      event.preventDefault();
      this.set((this.data.input.value + 1));
    },

    set: function(value) {
      // #todo
      var updateEvent;

      if (this.data.input.value < this.data.input.min) {
        value = this.data.input.min;
      } else if (this.data.input.value > this.data.input.max) {
        value = this.data.input.max;
      }

      this.data.quantity = value;
      this.data.input.value = value;
      this.inputEl.value = value;

      $(this.inputEl).trigger('valueUpdated', value);

    },

  });

  return QuantitySelector;
})();

(function() {
  var classes = {
    notificationHidden: 'notification-message--hidden'
  };

  var queryParams = theme.utils.getQueryParams();

  if (queryParams === undefined || queryParams.status === undefined) {
    return;
  }

  $('[data-notification="' + queryParams.status + '"]').removeClass(classes.notificationHidden);

})();

/*
 * Currency tools
 *
 * Copyright (c) 2015 Caroline Schnapp (mllegeorgesand@gmail.com)
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */ 

if (typeof Currency === 'undefined') {
  var Currency = {};
}

Currency.cookie = {
  configuration: {
    expires: 365,
    path: '/',
    domain: window.location.hostname
  },
  name: 'currency',
  write: function(currency) {
    localStorage.setItem(this.name, currency);
  },
  read: function() {
    return localStorage.getItem(this.name);
  },
  destroy: function() {
    localStorage.removeItem(this.name);
  }
};

Currency.moneyFormats = {
  "USD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} USD"
  },
  "EUR":{
    "money_format":"&euro;{{amount}}",
    "money_with_currency_format":"&euro;{{amount}} EUR"
  },
  "GBP":{
    "money_format":"&pound;{{amount}}",
    "money_with_currency_format":"&pound;{{amount}} GBP"
  },
  "CAD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} CAD"
  },
  "ALL":{
    "money_format":"Lek {{amount}}",
    "money_with_currency_format":"Lek {{amount}} ALL"
  },
  "DZD":{
    "money_format":"DA {{amount}}",
    "money_with_currency_format":"DA {{amount}} DZD"
  },
  "AOA":{
    "money_format":"Kz{{amount}}",
    "money_with_currency_format":"Kz{{amount}} AOA"
  },
  "ARS":{
    "money_format":"${{amount_with_comma_separator}}",
    "money_with_currency_format":"${{amount_with_comma_separator}} ARS"
  },
  "AMD":{
    "money_format":"{{amount}} AMD",
    "money_with_currency_format":"{{amount}} AMD"
  },
  "AWG":{
    "money_format":"Afl{{amount}}",
    "money_with_currency_format":"Afl{{amount}} AWG"
  },
  "AUD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} AUD"
  },
  "BBD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} Bds"
  },
  "AZN":{
    "money_format":"m.{{amount}}",
    "money_with_currency_format":"m.{{amount}} AZN"
  },
  "BDT":{
    "money_format":"Tk {{amount}}",
    "money_with_currency_format":"Tk {{amount}} BDT"
  },
  "BSD":{
    "money_format":"BS${{amount}}",
    "money_with_currency_format":"BS${{amount}} BSD"
  },
  "BHD":{
    "money_format":"{{amount}}0 BD",
    "money_with_currency_format":"{{amount}}0 BHD"
  },
  "BYR":{
    "money_format":"Br {{amount}}",
    "money_with_currency_format":"Br {{amount}} BYR"
  },
  "BZD":{
    "money_format":"BZ${{amount}}",
    "money_with_currency_format":"BZ${{amount}} BZD"
  },
  "BTN":{
    "money_format":"Nu {{amount}}",
    "money_with_currency_format":"Nu {{amount}} BTN"
  },
  "BAM":{
    "money_format":"KM {{amount_with_comma_separator}}",
    "money_with_currency_format":"KM {{amount_with_comma_separator}} BAM"
  },
  "BRL":{
    "money_format":"R$ {{amount_with_comma_separator}}",
    "money_with_currency_format":"R$ {{amount_with_comma_separator}} BRL"
  },
  "BOB":{
    "money_format":"Bs{{amount_with_comma_separator}}",
    "money_with_currency_format":"Bs{{amount_with_comma_separator}} BOB"
  },
  "BWP":{
    "money_format":"P{{amount}}",
    "money_with_currency_format":"P{{amount}} BWP"
  },
  "BND":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} BND"
  },
  "BGN":{
    "money_format":"{{amount}} лв",
    "money_with_currency_format":"{{amount}} лв BGN"
  },
  "MMK":{
    "money_format":"K{{amount}}",
    "money_with_currency_format":"K{{amount}} MMK"
  },
  "KHR":{
    "money_format":"KHR{{amount}}",
    "money_with_currency_format":"KHR{{amount}}"
  },
  "KYD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} KYD"
  },
  "XAF":{
    "money_format":"FCFA{{amount}}",
    "money_with_currency_format":"FCFA{{amount}} XAF"
  },
  "CLP":{
    "money_format":"${{amount_no_decimals}}",
    "money_with_currency_format":"${{amount_no_decimals}} CLP"
  },
  "CNY":{
    "money_format":"&#165;{{amount}}",
    "money_with_currency_format":"&#165;{{amount}} CNY"
  },
  "COP":{
    "money_format":"${{amount_with_comma_separator}}",
    "money_with_currency_format":"${{amount_with_comma_separator}} COP"
  },
  "CRC":{
    "money_format":"&#8353; {{amount_with_comma_separator}}",
    "money_with_currency_format":"&#8353; {{amount_with_comma_separator}} CRC"
  },
  "HRK":{
    "money_format":"{{amount_with_comma_separator}} kn",
    "money_with_currency_format":"{{amount_with_comma_separator}} kn HRK"
  },
  "CZK":{
    "money_format":"{{amount_with_comma_separator}} K&#269;",
    "money_with_currency_format":"{{amount_with_comma_separator}} K&#269;"
  },
  "DKK":{
    "money_format":"{{amount_with_comma_separator}}",
    "money_with_currency_format":"kr.{{amount_with_comma_separator}}"
  },
  "DOP":{
    "money_format":"RD$ {{amount}}",
    "money_with_currency_format":"RD$ {{amount}}"
  },
  "XCD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"EC${{amount}}"
  },
  "EGP":{
    "money_format":"LE {{amount}}",
    "money_with_currency_format":"LE {{amount}} EGP"
  },
  "ETB":{
    "money_format":"Br{{amount}}",
    "money_with_currency_format":"Br{{amount}} ETB"
  },
  "XPF":{
    "money_format":"{{amount_no_decimals_with_comma_separator}} XPF",
    "money_with_currency_format":"{{amount_no_decimals_with_comma_separator}} XPF"
  },
  "FJD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"FJ${{amount}}"
  },
  "GMD":{
    "money_format":"D {{amount}}",
    "money_with_currency_format":"D {{amount}} GMD"
  },
  "GHS":{
    "money_format":"GH&#8373;{{amount}}",
    "money_with_currency_format":"GH&#8373;{{amount}}"
  },
  "GTQ":{
    "money_format":"Q{{amount}}",
    "money_with_currency_format":"{{amount}} GTQ"
  },
  "GYD":{
    "money_format":"G${{amount}}",
    "money_with_currency_format":"${{amount}} GYD"
  },
  "GEL":{
    "money_format":"{{amount}} GEL",
    "money_with_currency_format":"{{amount}} GEL"
  },
  "HNL":{
    "money_format":"L {{amount}}",
    "money_with_currency_format":"L {{amount}} HNL"
  },
  "HKD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"HK${{amount}}"
  },
  "HUF":{
    "money_format":"{{amount_no_decimals_with_comma_separator}}",
    "money_with_currency_format":"{{amount_no_decimals_with_comma_separator}} Ft"
  },
  "ISK":{
    "money_format":"{{amount_no_decimals}} kr",
    "money_with_currency_format":"{{amount_no_decimals}} kr ISK"
  },
  "INR":{
    "money_format":"Rs. {{amount}}",
    "money_with_currency_format":"Rs. {{amount}}"
  },
  "IDR":{
    "money_format":"{{amount_with_comma_separator}}",
    "money_with_currency_format":"Rp {{amount_with_comma_separator}}"
  },
  "ILS":{
    "money_format":"{{amount}} NIS",
    "money_with_currency_format":"{{amount}} NIS"
  },
  "JMD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} JMD"
  },
  "JPY":{
    "money_format":"&#165;{{amount_no_decimals}}",
    "money_with_currency_format":"&#165;{{amount_no_decimals}} JPY"
  },
  "JEP":{
    "money_format":"&pound;{{amount}}",
    "money_with_currency_format":"&pound;{{amount}} JEP"
  },
  "JOD":{
    "money_format":"{{amount}}0 JD",
    "money_with_currency_format":"{{amount}}0 JOD"
  },
  "KZT":{
    "money_format":"{{amount}} KZT",
    "money_with_currency_format":"{{amount}} KZT"
  },
  "KES":{
    "money_format":"KSh{{amount}}",
    "money_with_currency_format":"KSh{{amount}}"
  },
  "KWD":{
    "money_format":"{{amount}}0 KD",
    "money_with_currency_format":"{{amount}}0 KWD"
  },
  "KGS":{
    "money_format":"лв{{amount}}",
    "money_with_currency_format":"лв{{amount}}"
  },
  "LVL":{
    "money_format":"Ls {{amount}}",
    "money_with_currency_format":"Ls {{amount}} LVL"
  },
  "LBP":{
    "money_format":"L&pound;{{amount}}",
    "money_with_currency_format":"L&pound;{{amount}} LBP"
  },
  "LTL":{
    "money_format":"{{amount}} Lt",
    "money_with_currency_format":"{{amount}} Lt"
  },
  "MGA":{
    "money_format":"Ar {{amount}}",
    "money_with_currency_format":"Ar {{amount}} MGA"
  },
  "MKD":{
    "money_format":"ден {{amount}}",
    "money_with_currency_format":"ден {{amount}} MKD"
  },
  "MOP":{
    "money_format":"MOP${{amount}}",
    "money_with_currency_format":"MOP${{amount}}"
  },
  "MVR":{
    "money_format":"Rf{{amount}}",
    "money_with_currency_format":"Rf{{amount}} MRf"
  },
  "MXN":{
    "money_format":"$ {{amount}}",
    "money_with_currency_format":"$ {{amount}} MXN"
  },
  "MYR":{
    "money_format":"RM{{amount}} MYR",
    "money_with_currency_format":"RM{{amount}} MYR"
  },
  "MUR":{
    "money_format":"Rs {{amount}}",
    "money_with_currency_format":"Rs {{amount}} MUR"
  },
  "MDL":{
    "money_format":"{{amount}} MDL",
    "money_with_currency_format":"{{amount}} MDL"
  },
  "MAD":{
    "money_format":"{{amount}} dh",
    "money_with_currency_format":"Dh {{amount}} MAD"
  },
  "MNT":{
    "money_format":"{{amount_no_decimals}} &#8366",
    "money_with_currency_format":"{{amount_no_decimals}} MNT"
  },
  "MZN":{
    "money_format":"{{amount}} Mt",
    "money_with_currency_format":"Mt {{amount}} MZN"
  },
  "NAD":{
    "money_format":"N${{amount}}",
    "money_with_currency_format":"N${{amount}} NAD"
  },
  "NPR":{
    "money_format":"Rs{{amount}}",
    "money_with_currency_format":"Rs{{amount}} NPR"
  },
  "ANG":{
    "money_format":"&fnof;{{amount}}",
    "money_with_currency_format":"{{amount}} NA&fnof;"
  },
  "NZD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} NZD"
  },
  "NIO":{
    "money_format":"C${{amount}}",
    "money_with_currency_format":"C${{amount}} NIO"
  },
  "NGN":{
    "money_format":"&#8358;{{amount}}",
    "money_with_currency_format":"&#8358;{{amount}} NGN"
  },
  "NOK":{
    "money_format":"kr {{amount_with_comma_separator}}",
    "money_with_currency_format":"kr {{amount_with_comma_separator}} NOK"
  },
  "OMR":{
    "money_format":"{{amount_with_comma_separator}} OMR",
    "money_with_currency_format":"{{amount_with_comma_separator}} OMR"
  },
  "PKR":{
    "money_format":"Rs.{{amount}}",
    "money_with_currency_format":"Rs.{{amount}} PKR"
  },
  "PGK":{
    "money_format":"K {{amount}}",
    "money_with_currency_format":"K {{amount}} PGK"
  },
  "PYG":{
    "money_format":"Gs. {{amount_no_decimals_with_comma_separator}}",
    "money_with_currency_format":"Gs. {{amount_no_decimals_with_comma_separator}} PYG"
  },
  "PEN":{
    "money_format":"S/. {{amount}}",
    "money_with_currency_format":"S/. {{amount}} PEN"
  },
  "PHP":{
    "money_format":"&#8369;{{amount}}",
    "money_with_currency_format":"&#8369;{{amount}} PHP"
  },
  "PLN":{
    "money_format":"{{amount_with_comma_separator}} zl",
    "money_with_currency_format":"{{amount_with_comma_separator}} zl PLN"
  },
  "QAR":{
    "money_format":"QAR {{amount_with_comma_separator}}",
    "money_with_currency_format":"QAR {{amount_with_comma_separator}}"
  },
  "RON":{
    "money_format":"{{amount_with_comma_separator}} lei",
    "money_with_currency_format":"{{amount_with_comma_separator}} lei RON"
  },
  "RUB":{
    "money_format":"&#1088;&#1091;&#1073;{{amount_with_comma_separator}}",
    "money_with_currency_format":"&#1088;&#1091;&#1073;{{amount_with_comma_separator}} RUB"
  },
  "RWF":{
    "money_format":"{{amount_no_decimals}} RF",
    "money_with_currency_format":"{{amount_no_decimals}} RWF"
  },
  "WST":{
    "money_format":"WS$ {{amount}}",
    "money_with_currency_format":"WS$ {{amount}} WST"
  },
  "SAR":{
    "money_format":"{{amount}} SR",
    "money_with_currency_format":"{{amount}} SAR"
  },
  "STD":{
    "money_format":"Db {{amount}}",
    "money_with_currency_format":"Db {{amount}} STD"
  },
  "RSD":{
    "money_format":"{{amount}} RSD",
    "money_with_currency_format":"{{amount}} RSD"
  },
  "SCR":{
    "money_format":"Rs {{amount}}",
    "money_with_currency_format":"Rs {{amount}} SCR"
  },
  "SGD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} SGD"
  },
  "SYP":{
    "money_format":"S&pound;{{amount}}",
    "money_with_currency_format":"S&pound;{{amount}} SYP"
  },
  "ZAR":{
    "money_format":"R {{amount}}",
    "money_with_currency_format":"R {{amount}} ZAR"
  },
  "KRW":{
    "money_format":"&#8361;{{amount_no_decimals}}",
    "money_with_currency_format":"&#8361;{{amount_no_decimals}} KRW"
  },
  "LKR":{
    "money_format":"Rs {{amount}}",
    "money_with_currency_format":"Rs {{amount}} LKR"
  },
  "SEK":{
    "money_format":"{{amount_no_decimals}} kr",
    "money_with_currency_format":"{{amount_no_decimals}} kr SEK"
  },
  "CHF":{
    "money_format":"SFr. {{amount}}",
    "money_with_currency_format":"SFr. {{amount}} CHF"
  },
  "TWD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} TWD"
  },
  "THB":{
    "money_format":"{{amount}} &#xe3f;",
    "money_with_currency_format":"{{amount}} &#xe3f; THB"
  },
  "TZS":{
    "money_format":"{{amount}} TZS",
    "money_with_currency_format":"{{amount}} TZS"
  },
  "TTD":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}} TTD"
  },
  "TND":{
    "money_format":"{{amount}}",
    "money_with_currency_format":"{{amount}} DT"
  },
  "TRY":{
    "money_format":"{{amount}}TL",
    "money_with_currency_format":"{{amount}}TL"
  },
  "UGX":{
    "money_format":"Ush {{amount_no_decimals}}",
    "money_with_currency_format":"Ush {{amount_no_decimals}} UGX"
  },
  "UAH":{
    "money_format":"₴{{amount}}",
    "money_with_currency_format":"₴{{amount}} UAH"
  },
  "AED":{
    "money_format":"Dhs. {{amount}}",
    "money_with_currency_format":"Dhs. {{amount}} AED"
  },
  "UYU":{
    "money_format":"${{amount_with_comma_separator}}",
    "money_with_currency_format":"${{amount_with_comma_separator}} UYU"
  },
  "VUV":{
    "money_format":"${{amount}}",
    "money_with_currency_format":"${{amount}}VT"
  },
  "VEF":{
    "money_format":"Bs. {{amount_with_comma_separator}}",
    "money_with_currency_format":"Bs. {{amount_with_comma_separator}} VEF"
  },
  "VND":{
    "money_format":"{{amount_no_decimals_with_comma_separator}}&#8363;",
    "money_with_currency_format":"{{amount_no_decimals_with_comma_separator}} VND"
  },
  "XBT":{
    "money_format":"{{amount_no_decimals}} BTC",
    "money_with_currency_format":"{{amount_no_decimals}} BTC"
  },
  "XOF":{
    "money_format":"CFA{{amount}}",
    "money_with_currency_format":"CFA{{amount}} XOF"
  },
  "ZMW":{
    "money_format":"K{{amount_no_decimals_with_comma_separator}}",
    "money_with_currency_format":"ZMW{{amount_no_decimals_with_comma_separator}}"
  }
};

Currency.formatMoney = function(cents, format) {
  if (typeof Shopify.formatMoney === 'function') {
    return Shopify.formatMoney(cents, format);
  }
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || '${{amount}}';
  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }
  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');
    if (isNaN(number) || number == null) { return 0; }
    number = (number/100.0).toFixed(precision);
    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';
    return dollars + cents;
  }
  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }
  return formatString.replace(placeholderRegex, value);
};
  
Currency.currentCurrency = '';

Currency.format = 'money_with_currency_format';

Currency.convertAll = function(oldCurrency, newCurrency, selector, format) {
  if (newCurrency === undefined) {
    return;
  }
  
  $(selector || 'span.money').each(function() {
    // If the amount has already been converted, we leave it alone.
    if ($(this).attr('data-currency') === newCurrency) return;
    // If we are converting to a currency that we have saved, we will use the saved amount.
    if ($(this).attr('data-currency-'+newCurrency)) {
      $(this).html($(this).attr('data-currency-'+newCurrency));
    }
    else {
      // Converting to Y for the first time? Let's get to it!
      var cents = 0.0;
      var oldFormat = Currency.moneyFormats[oldCurrency][format || Currency.format] || '{{amount}}';
      var newFormat = Currency.moneyFormats[newCurrency][format || Currency.format] || '{{amount}}';
      if (oldFormat.indexOf('amount_no_decimals') !== -1) {
        cents = Currency.convert(parseInt($(this).html().replace(/[^0-9]/g, ''), 10)*100, oldCurrency, newCurrency);
      }
      else if (oldCurrency === 'JOD' || oldCurrency == 'KWD' || oldCurrency == 'BHD') {
        cents = Currency.convert(parseInt($(this).html().replace(/[^0-9]/g, ''), 10)/10, oldCurrency, newCurrency);
      }
      else { 
        cents = Currency.convert(parseInt($(this).html().replace(/[^0-9]/g, ''), 10), oldCurrency, newCurrency);
      }
      var newFormattedAmount = Currency.formatMoney(cents, newFormat);
      $(this).html(newFormattedAmount);
      $(this).attr('data-currency-'+newCurrency, newFormattedAmount);
    }
    // We record the new currency locally.
    $(this).attr('data-currency', newCurrency);
  });
  this.currentFormat = Currency.moneyFormats[newCurrency][format || Currency.format] || '{{amount}}';
  this.currentCurrency = newCurrency;
  this.cookie.write(newCurrency);
};

/*============================================================================
  Development Helpers
==============================================================================*/
(function() {
  var isDevelopment = window.location.hostname == 'localhost' || $(document.documentElement).hasClass('localhost'),
      debugMode = false;

  if (Shopify.designMode) {
    document.getElementsByTagName('html')[0].classList.add('designmode');
  }

  if (isDevelopment) {

    console.log('Theme name: ' + Shopify.theme.name + '. Theme ID: ' + Shopify.theme.id + '. Theme status: ' + (Shopify.theme.role == 'main' ? 'Live' : 'Unpublished') + '.');

    if (Shopify.theme.role == 'main') {
      console.warn('This is the live theme!');
    }

    document.documentElement.classList.add('localhost');
    // Shopify.designMode = true;

    // Media Query Infobox + Admin Links
    var themeTag = (Shopify.theme.name.indexOf('[') > -1) ? Shopify.theme.name.slice(Shopify.theme.name.indexOf('['), Shopify.theme.name.indexOf(']') + 1) : '';
    var globeIcon = '<svg aria-hidden="true" data-prefix="fas" data-icon="globe" class="svg-inline--fa fa-globe fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg>';
    var pencilIcon = '<svg aria-hidden="true" data-prefix="fas" data-icon="pencil-alt" class="svg-inline--fa fa-pencil-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"></path></svg>';
//     $('body').append('<div class="dev-helper"><div class="tag">' + themeTag + '</div><div class="links"><a href="https://shopify.com/admin" title="Admin" target="_blank" rel="noopener noreferrer">' + globeIcon + '</a><a href="https://shopify.com/admin/themes/' + Shopify.theme.id + '/editor" title="Customise" target="_blank" rel="noopener noreferrer">' + pencilIcon + '</a></div><div class="mq" title="' + Shopify.theme.name + '"><span class="visible-xs">XS</span><span class="visible-sm">SM</span><span class="visible-md">MD</span><span class="visible-lg">LG</span><span class="visible-xl">XL</span></div></div>');

    // Make SCSS debug info easier to see on the frontend
    // Checks to see if the hidden skiplink is showing and, shows a link to the debug output
    try {
      if (window.getComputedStyle(document.querySelector('a.visually-hidden.skip-link')).position == 'static') {
        debugMode = true;

        for (var i = 0; i < document.styleSheets.length; i++) {
          if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('/assets/theme.scss.css?') > -1) {
            $("body > *").hide(); $("body").append("<span>Please wait...</span>");
            // $.get('/collections', function(data){
            //   var scriptString = '<script';
            //   scriptString += data.split('id="theme-js"')[1].split('</script>')[0];
            //   scriptString += '$("body > *").hide(); $("body").append("<span>There was a problem loading styles. Check the customise area in the Shopify admin interface or </span> <a href=\'https://" + shop.permanantDomain + "/services/assets/" + Shopify.theme.id + "/editor_asset/theme.scss.css\' target=\'_blank\' rel=\'noopener noreferrer\'>click here for debug information.</a>");';
            //   scriptString += '</script>';
            //   $('head').append(scriptString);
            // });
            $.get(document.styleSheets[i].href).fail(function(data) {
              $("body").html('<pre>' + data.responseText + '</pre>');
            });
            break;
          }
        }
      }
    }
    catch(err) {}
  }

  if (debugMode = false && (Shopify.theme.role == "unpublished" || Shopify.designMode || isDevelopment)) {
    var pacifierIcon = '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon--full-color icon-pacifier" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><style>.cls-8{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:20px}</style></defs><title>pacifier</title><path d="M200.06 391.63a71.49 71.49 0 1 1-91.69-91.69 347.93 347.93 0 0 1-27.79-42.84A121.85 121.85 0 1 0 242.9 419.42a347.93 347.93 0 0 1-42.84-27.79z" fill="#faae3b"/><path d="M200.06 391.63c-.17.47-.41.92-.59 1.38.46.26.93.55 1.39.8A121.31 121.31 0 0 1 50 456a121.47 121.47 0 0 0 192.86-36.6 347.93 347.93 0 0 1-42.8-27.77z" fill="#f7991f"/><path d="M182.85 317.15C108.65 242.94 72 159.29 101 130.3l-31.8 31.78c-29 29 7.67 112.64 81.88 186.84s157.86 110.86 186.84 81.88L369.7 399c-28.99 29-112.64-7.65-186.85-81.85z" fill="#7f2424"/><path d="M322.86 251.3a71.18 71.18 0 0 0-7.64 12.42c-23.44 48-45.91 67.22-96 17.1s-30.87-72.6 17.1-96a71.18 71.18 0 0 0 12.42-7.64c-62.5-49.91-123.81-70.83-147.74-46.88-29 29 7.67 112.64 81.87 186.85S340.71 428 369.7 399c23.95-23.93 3.03-85.24-46.84-147.7z" fill="#d73939"/><path d="M322.86 251.3a71.18 71.18 0 0 0-7.64 12.42c-5.78 11.83-11.51 21.91-17.6 29.64 27.69 46.37 36 87.16 17.53 105.66a29.55 29.55 0 0 1-5.24 4.05c26.26 8.56 47.76 8 59.79-4.05 23.95-23.95 3.03-85.26-46.84-147.72zM214.23 197a209.6 209.6 0 0 1 22.05-12.21 71.18 71.18 0 0 0 12.42-7.64c-58.33-46.58-115.64-67.88-142.48-51 26.06 8.51 56.85 26.15 87.93 51 4.02 3.02 11.25 10.31 20.08 19.85z" fill="#be3434"/><path d="M219.18 280.82c50.13 50.12 72.6 30.87 96-17.1 27.76-56.81 77.69-10 139.61-72 76.51-76.51 0-146.59 0-146.59s-70.08-76.51-146.59 0c-61.92 61.92-15.15 111.85-72 139.61-47.89 23.48-67.14 45.95-17.02 96.08z" fill="#fcf1d1"/><path d="M454.83 45.17S410.2-3.45 353.31 15.71c28.41 9.25 47 29.46 47 29.46s76.5 70.08 0 146.59c-61.92 61.92-111.85 15.15-139.61 72-7.05 14.44-14 26.24-21.68 34.37 36.72 26.74 56.12 6.76 76.22-34.37 27.76-56.81 77.69-10 139.61-72 76.49-76.51-.02-146.59-.02-146.59z" fill="#f4ddaa"/><path class="cls-8" d="M182.85 317.15C108.65 242.94 72 159.29 101 130.3l-31.8 31.78c-29 29 7.67 112.64 81.88 186.84s157.86 110.86 186.84 81.88L369.7 399c-28.99 29-112.64-7.65-186.85-81.85z"/><path class="cls-8" d="M219.18 280.82c50.13 50.12 72.6 30.87 96-17.1 27.76-56.81 77.69-10 139.61-72 76.51-76.51 0-146.59 0-146.59s-70.08-76.51-146.59 0c-61.92 61.92-15.15 111.85-72 139.61-47.89 23.48-67.14 45.95-17.02 96.08z"/><path class="cls-8" d="M322.86 251.3a71.18 71.18 0 0 0-7.64 12.42c-23.44 48-45.91 67.22-96 17.1s-30.87-72.6 17.1-96a71.18 71.18 0 0 0 12.42-7.64c-62.5-49.91-123.81-70.83-147.74-46.88-29 29 7.67 112.64 81.87 186.85S340.71 428 369.7 399c23.95-23.93 3.03-85.24-46.84-147.7zm-122.8 140.33a71.49 71.49 0 1 1-91.69-91.69 347.93 347.93 0 0 1-27.79-42.84A121.85 121.85 0 1 0 242.9 419.42a347.93 347.93 0 0 1-42.84-27.79z"/></svg>';
    var dummyLinkTooltip = '<div class="hidden"><div id="dummy-link-tooltip">' + pacifierIcon + ' This is a dummy link.</div></div>';
    $('body').append(dummyLinkTooltip);
    
    tippy('a[href="#"]:not(.btn):not("#CartDrawer a")', {
      content: document.getElementById('dummy-link-tooltip'),
      size: 'small',
      animation: 'shift-toward',
      placement: 'right',
      trigger: 'mouseenter focus',
    });

    tippy('a[href="#"].btn', {
      content: document.getElementById('dummy-link-tooltip'),
      size: 'small',
      animation: 'shift-toward',
      placement: 'right',
      trigger: 'click',
    });
  }

  // Pretty variable dump outputs
  var elems = document.getElementsByClassName('vardump');
  for (var i = 0; i < elems.length; i++) {
    var json = JSON.stringify(JSON.parse(elems[i].dataset.json), undefined, 2);
    elems[i].innerHTML = theme.utils.syntaxHighlight(json);
  }

  tippy('.vardump', {
    content: 'Click items to copy',
    trigger: 'mouseenter',
    theme: 'light',
    placement: 'bottom-end',
    offset: "-20, -50",
    distance: 0,
    animation: 'fade'
  });

  $('.vardump span:not(.group):not(.group-handle)').on('click', function(){
    var $this = $(this);
    var $elem = $('<input value="' + $this.text().replace(/^"/, '').replace(/"$/, '') + '" />').appendTo('body');
    $elem.select();
    document.execCommand('copy');
    $elem.remove();

    tippy(this, {
      content: 'Copied to clipboard!',
      trigger: 'manual',
      theme: 'light',
      showOnInit: true,
      onShown: function(tip){
        window.setTimeout(function(){
          tip.hide();
        }, 2000);
      },
      onHidden: function(tip){
        tip.destroy();
      },
    });
  });
  
  $('.vardump span.group-handle').on('click', function(){
    $(this).parent('.group').toggleClass('closed');
  });

})();

/*============================================================================
  Scroll to utility
==============================================================================*/
window.theme = window.theme || {};

theme.scrollTo = (function() {

  var options = {

    scrollTo: {
      duration: 700,
      interrupt: !isMobile.apple.device, // Don't allow interupt on iOS
      offset: -140
    }

  }

  function init() {

    $('a[href^="#"]').click(function(e) {
      e.preventDefault();
      target(this.hash);
    });

    if (document.location.search && theme.utils.getQueryParams().scrollto) {
      $(window).stop(true).scrollTo('#' + theme.utils.getQueryParams().scrollto, options.scrollTo);
      history.replaceState(null, '', theme.utils.updateQueryStringParameter('scrollto', null));
    }

  }

  function target(hash) {
    $(window).stop(true).scrollTo(hash, options.scrollTo);
  }

  init();

  return {
    target: target
  }

})();

/*============================================================================
  Product Grid Item
==============================================================================*/
window.theme = window.theme || {};

theme.ProductGridItem = (function() {

  var defaults = {
    animateIn: true,
    animateDelay: 75,
    animateDuration: 300,
    reflectCart: isMobile.any,
  };

  var selectors = {
    wishlistButton: '.add-to-wishlist',
    productJSON: '[data-product-grid-item-json]',
    quantitySelector: '[name="quantity"]'
  };

  var cache = {
    productGridItemBadges: (function() {

      if (!theme.settings.productGridItemBadges) {
        return;
      }

      badges = theme.settings.productGridItemBadges.map(function(badge) {
        badge.tag = theme.utils.handleize(badge.title);
        badge.background_color = theme.utils.handleize(badge.background_color);
        return badge;
      });

      return badges.reverse();

    })(),
    template: theme.utils.getTemplate('product-grid-item'),
  };

  function ProductGridItem(container, product, gridIndex, options) {

    this.container = container;
    this.gridIndex = gridIndex;
    this.options = _.defaults(options, defaults);

    var productdata = container.querySelector(selectors.productJSON);
    var productOptions = {
      source: product ? 'boost' : 'shopify' // todo make this more robust
    };

    this.product = new theme.Product(product || JSON.parse(productdata.innerHTML), productOptions);

    this.selectedVariant = this.product.variants[0];
    this.SelectedVariantCache = new theme.SelectedVariantCache(this.selectedVariant.id);

    if (!this.container.innerHTML) {
      this.container.innerHTML = cache.template;
    }

    // this.product.isGiftCard = this.product.tags ? (this.product.tags.indexOf(theme.settings.products.giftCardTag) > -1) : false;

    tinybind.bind(this.container, {
      product: this.product,
      variant: this.selectedVariant,
      selected: this.SelectedVariantCache,
      options: this.options,
      settings: theme.settings,
      wishlistProducts: theme.wishlistProducts,
      methods: {
        addToCart: this.addToCart.bind(this)
      },
    }, {
      prefix: 'product-grid-item-view'
    });

    this.container.style.height = '100%';

    this.product.badge = this.getProductBadge();

    this.initQuantitySelectors();
    this.animateIn();

    this._bindWishlist();

    return this;

  }

  ProductGridItem.prototype = $.extend({}, ProductGridItem.prototype, {

    getProductBadge: function() {

      var productTags, i;

      if (!cache.productGridItemBadges || !this.product.tags) {
        return;
      }

      productTags = this.product.tags.map(function(tag) {
        return theme.utils.handleize(tag);
      });

      i = cache.productGridItemBadges.length;

      while(i--) {
        if (productTags.indexOf(cache.productGridItemBadges[i].tag) > -1) {
          return cache.productGridItemBadges[i];
        }
      }

    },

    initQuantitySelectors: function() {

      var self = this;

      var quantitySelectorEl = this.container.querySelector(selectors.quantitySelector);

      if (!quantitySelectorEl || quantitySelectorEl.dataset.display == 'hidden') {
        return;
      }

      var quantitySelectorOptions = {
        formatAsSize: true,
        variantTitle: this.selectedVariant.option1,
        reflectCart: this.options.reflectCart,
      };

      this.quantitySelector = new theme.QuantitySelector(quantitySelectorEl, quantitySelectorOptions);

      if (this.options.reflectCart) {

        $(this.quantitySelector.inputEl).on('addQuantity', function(event, value) {
          self.addToCart(value);
        });

        $(this.quantitySelector.inputEl).on('subtractQuantity', function(event, value) {
          self.updateCart(value);
        });

      }

      this.SelectedVariantCache.addQuantitySelector(this.quantitySelector);

    },

    animateIn: function() {

      if (!this.options.animateIn) {
        return;
      }

      var loadedProducts = theme.current.collection.loadedProducts || 0,
          delay = (this.gridIndex - loadedProducts) * this.options.animateDelay,
          duration = this.options.animateDuration;

      if ('anime' in window) {
        anime({
          targets: [this.container],
          translateY: [15, 0],
          opacity: [0, 1],
          duration: duration,
          easing: 'easeInOutCubic',
          delay: delay
        });
      }

    },

    addToCart: function(quantity) {

      var self = this;

      if (typeof quantity != "number") {
        quantity = this.SelectedVariantCache.quantity;
      }

      this.container.classList.add('loading');

      if (this.quantitySelector) {
        this.quantitySelector.toggleLoadState(true);
      }

      document.body.classList.add('cart-loading--opens-drawer');

      function addToCart() {
        var properties = {};

        if (this.product.parts) {
          var i = this.product.parts;
          for (var i = 0; i < this.product.parts.length; i++) {
            properties['Part ' + (i + 1)] = this.product.parts[i];
          }
        }

        CartJS.addItem(this.selectedVariant.id, quantity, properties, {
          success: function(data, textStatus, jqXHR) {
            if (self.quantitySelector) {
              self.quantitySelector.toggleLoadState(false);
            }
            self.container.classList.remove('loading');
            // theme.MiniCart.show(data);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            if (self.quantitySelector) {
              self.quantitySelector.toggleLoadState(false);
            }
            // theme.utils.showError(errorThrown);
            self.container.classList.remove('loading');
          }
        });
      }

      if (this.product.parts_count) {
         var self = this;
        $.get(theme.utils.updateQueryStringParameter('view', 'parts-json', this.product.url), function(data) {
          self.product.parts = JSON.parse(data);
          addToCart.call(self);
        })
      } else {
        addToCart.call(this);
      }

    },

    updateCart: function(quantity) {

      var self = this;

      this.quantitySelector.toggleLoadState(true);

      var newQuantity = this.SelectedVariantCache.cartQuantity - quantity;

      CartJS.updateItemById(this.selectedVariant.id, newQuantity, {
      }, {
        success: function(data, textStatus, jqXHR) {
          self.quantitySelector.toggleLoadState(false);
          // theme.MiniCart.show(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          self.quantitySelector.toggleLoadState(false);
          // theme.utils.showError(errorThrown);
        }
      });

    },

    _bindWishlist: function() {

      // todo: turn this into a tinybind binder
      var wishlistButton = this.container.querySelector(selectors.wishlistButton);
      if (wishlistButton) {
        theme.wishlist.addButton(wishlistButton);
      }

    }

  });

  return ProductGridItem;

})();
window.theme = window.theme || {};

theme.current.selected = theme.current.selected || [];

theme.SelectedVariantCache = (function() {

  var defaults = {
    quantity: 1
  };

  function SelectedVariantCache(variantId) {

    if (!variantId) {
      return false;
    }

    this.id = variantId;

    // Check for existing cache
    var existingCaches = theme.current.selected;

    for (var i = 0; i < existingCaches.length; i++) {
      if (existingCaches[i].id == this.id) {
        return (existingCaches[i]);
      }
    }

    this.quantity = defaults.quantity;

    this.cartQuantity = this._getCartQuantity();

    this.quantitySelectors = [];

    this._restore();
    theme.current.selected.push(this);

    return this;

  }

  SelectedVariantCache.prototype = _.extend({}, SelectedVariantCache.prototype, {

    _getCartQuantity: function() {

      var count = 0;

      for (var i = 0; i < CartJS.cart.items.length; i++) {
        var lineItem = CartJS.cart.items[i];
        if (lineItem.id == this.id) {
          count += lineItem.quantity;
        }
      }

      return count;
    },

    refreshCartQuantity: function() {

      this.cartQuantity = this._getCartQuantity();
      this._updateQuantitySelectors();

      return this.cartQuantity;

    },

    add: function() {

      this.quantity += 1;
      this._save();
      this._updateQuantitySelectors();

    },

    subtract: function() {

      this.quantity -= 1;
      this._save();
      this._updateQuantitySelectors();

    },

    set: function(value) {

      if (this.quantity == value) { return; };

      this.quantity = value;
      this._save();
      this._updateQuantitySelectors();

    },

    addQuantitySelector: function(quantitySelector) {
      
      var self = this;

      $(quantitySelector.inputEl).on('valueUpdated', function(event, value) {
        self.set(value);
      });

      this.quantitySelectors.push(quantitySelector);
      this._updateQuantitySelectors();
    },

    _updateQuantitySelectors: function() {

      var self = this;
      for (var i = 0; i < this.quantitySelectors.length; i++) {
        this.quantitySelectors[i].update(this.quantity, this.cartQuantity);
      }

    },

    _save: function() {

      var dataJSON,
          data,
          variantIndex,
          variantData;

      dataJSON = sessionStorage.getItem('selected-variant-cache');
      data = (dataJSON ? JSON.parse(dataJSON) : []);

      variantIndex = _.findIndex(data, {'id': this.id });

      variantData = {
        id: this.id,
        quantity: this.quantity,
      };

      if (variantIndex > -1) {
        data[variantIndex] = variantData;
      } else {
        data.push(variantData);
      }

      sessionStorage.setItem('selected-variant-cache', JSON.stringify(data));

    },

    _restore: function() {

      var dataJSON,
          data,
          variantIndex,
          variantData;

      dataJSON = sessionStorage.getItem('selected-variant-cache');
      data = (dataJSON ? JSON.parse(dataJSON) : []);

      variantData = _.find(data, {'id': this.id });

      if (variantData) {
        this.set(variantData.quantity);
      }

    }

  });

  return SelectedVariantCache;
})();

/*============================================================================
  Wishlist
  For Wishlist King App
==============================================================================*/
window.theme = window.theme || {};

theme.wishlist = (function() {

  // NOTE: theme.wishlist.init(); should be added to the 'ready' method in appmate-wishlist-king.liquid

  var selectors = {
    addToWishlist: '.add-to-wishlist',
  };

  var strings = {
    inWishlist: 'In wishlist',
    addToWishlist: 'Add to wishlist',
  }

  var cache = {
    buttons: []
  };

  // Keep a reference to "add to wishlist" buttons
  function _cacheButtons() {
    var buttons = document.querySelectorAll(selectors.addToWishlist);
    var i = buttons.length;

    while (i--) {
      cache.buttons.push(buttons[i]);
    }
  }

  // Set button initial state
  function _setInitialState(el) {
    var productId,
        product,
        isInWishlist;

    productId = el.dataset.productId;
    product = Appmate.wk.getProduct(productId);
    inWishlist = product ? true : false;

    el.dataset.inWishlist = inWishlist;

    if (el.dataset.displayMessage) {
      el.innerHTML = inWishlist ? strings.inWishlist : strings.addToWishlist;
    }

  }

  // Bind event
  function _bind(el) {
    el.addEventListener('click', _toggleProduct);
  }

  // Unbind event
  function _unbind(el) {
    el.removeEventListener('click', _toggleProduct);
  }

  // Add or remove product from wishlist
  function _toggleProduct() {

    var el,
        productId,
        oldState,
        newState;

    el = event.currentTarget;
    productId = el.dataset.productId;

    oldState = el.dataset.inWishlist == 'true' ? true : false;
    newState = !oldState;

    el.classList.add('loading');

    NProgress.start();

    if (!productId) {
      console.error(new Error('No product id'));
      return;
    }

    Appmate.wk.toggleProduct(productId)
    .then(function(data){

      // Update all elements with same product-id
      _.forEach(cache.buttons, function(elem, i) {
        if (elem.dataset.productId == productId) {
          elem.dataset.inWishlist = newState;

          if (elem.dataset.displayMessage) {
            elem.innerHTML = newState ? strings.inWishlist : strings.addToWishlist;
          }
        }
      });

      el.classList.remove('loading');

      NProgress.done();

    })
    .catch(function(err) {

      el.dataset.inWishlist = oldState;

      if (elem.dataset.displayMessage) {
        elem.innerHTML = oldState ? strings.inWishlist : strings.addToWishlist;
      }

      console.error(err);

      el.classList.remove('loading');
      NProgress.done();

    });

  }

  // Initialise and prepare buttons
  function init() {

    cache.isInit = true;
    _prepare();
    _bindViews();

  }

  function _bindViews() {
    tinybind.bind($('[data-wishlist-view]'), {
      data: {
        wishlists: Appmate.wk.collection.items
      }
    })
  }

  // set initial state and bind
  function _prepare() {

    _cacheButtons();

    _.forEach(cache.buttons, function(el, i) {
      _bind(el);
      _setInitialState(el);
    });

  }

  // Clear events and reinitialise
  function update() {

    if (!cache.isInit) {
      return;
    }

    _.forEach(cache.buttons, function(el, i) {
      _unbind(el);
    });

    _prepare();

  }

  function addButton(el) {
    cache.buttons.push(el);

    if (cache.isInit) {
      _bind(el);
      _setInitialState(el);
    }

  }

  // Load wishlist JS
  loadJS('https://az814789.vo.msecnd.net/toolkit/1.4.44/appmate.js');

  return {
    init: init,
    update: update,
    addButton: addButton
  };

})();


/*============================================================================
  show-on-load
==============================================================================*/
window.theme = window.theme || {};

theme.ShowOnLoad = (function() {

  $( window ).on( "load", function() {
    if ($('.show-on-load').length) {
      $( document ).ready(function() {
          $('.show-on-load').addClass('loaded');
      });
    }
  } );

})();


/*================ Modules ================*/
theme.Product = (function() {

  function Product(data, options) {
    this._options = typeof options == 'string' ? { source: options } : options || {};

    switch (this._options.source) {

      case 'boost':
        data = this._preFormatBoostFilterProductData(data);
        break;

      case 'shopify':
        data = this._preFormatShopifyProductData(data);
        break;

      case 'algolia':
        data = this._preFormatAlgoliaProductData(data);
        break;

    }

    _.extend(this, new Shopify.Product(data));
    this._formatData();

    if (this._options.requiredFields) {
      this.fetchRequiredFields();
    }
  }

  Product.prototype = _.extend(Product.prototype, {

    fetchRequiredFields: function() {
      var self = this;

      var requiredFields = this._options.requiredFields,
          i = requiredFields.length;

      // If any required fields are missing then retrieve additional details
      while(i--) {
        if (!_.get(this, requiredFields[i])) {

          $.get('/products/' + this.handle + '?view=json', function(data) {
            data = self._preFormatShopifyProductData(JSON.parse(data));
            self.assignRequiredFields(data);
            self._formatData();
          })

          break;
        }
      }
    },

    assignRequiredFields: function(data) {
      var self = this;

      var requiredFields = this._options.requiredFields,
          i = requiredFields.length;

      while(i--) {
        if (!_.get(this, requiredFields[i])) {
          _.set(this, requiredFields[i], _.get(data, requiredFields[i]));
        }
      }
    },

    _preFormatAlgoliaProductData: function(data) {
      data.price = data.price * 100;
      data.variants_min_price = data.variants_min_price * 100;
      data.variants_max_price = data.variants_max_price * 100;
      data.compare_at_price = data.compare_at_price * 100;
      data.variants = [];
      data.variants[0] = {
        inventory_quantity: data.inventory_quantity,
        title: data.variant_title,
        price: data.price,
        variant: data.id,
        available: data.inventory_quantity
      };
      data.url = '/products/' + data.handle;


      return this._preFormatShopifyProductData(data); 
    },

    _preFormatBoostFilterProductData: function(data) {

      // Remove images without src
      if (data.featured_image) {
        if (typeof data.featured_image.src == 'undefined' || data.featured_image.src.indexOf('bc-sf-filter-no-image') > -1) {
           delete data.featured_image;
        }
      }

      // Fix Boost Filter floating point issue
      var priceKeys = ['price', 'price_max', 'price_min'],
          i = priceKeys.length;
      while(i--) {
        if (typeof data[priceKeys[i]] != 'undefined') {
          data[priceKeys[i]] = parseFloat(data[priceKeys[i]]).toFixed();
        }
      }

      data['has_only_default_variant'] = true;

      if (data['options_with_values'].length > 1 || data['options_with_values'].length == 1 && data['options_with_values'][0].name != 'title') {
        data['has_only_default_variant'] = false;
      }

      data.images = data.images_info;
      delete data.images_info;

      return data;
    },

    _preFormatShopifyProductData: function(data) {

      // Remove redundant image. Ensure we have a featured image
      if (data.image) {
        data.featured_image = data.featured_image || data.image;
        delete data.image;
      }

      return data;

    },

    _formatData: function() {

      this.featured_image = this.featured_image ? this._formatImage(this.featured_image): null;
      this.images = this.images ? this._formatImages(this.images): [];

      if (this.images.length && !this.featured_image) {
        this.featured_image = this.images[0];
      }

    },

    _formatImage: function(image) {

      if (typeof image == 'string') {
        image = {
          src: image
        }
      }

      if (image.url) {
        image.src = image.url;
        delete image.url;
      }

      return image;
    },

    _formatImages: function(images) {

      var self = this;
      return images.map(function(image) {
        return self._formatImage(image);
      });
    }

  });

  return Product;
})();

window.theme = window.theme || {};

theme.AjaxCart = (function() {
  var selectors = {
    addToCartBtn: '[type="submit"]',
    addToCartForm: 'form[action="/cart/add"]',
    cartCount: '.site-header__cart',
    cartToggle: '.cart__toggle',
    cartDrawer: '.cart-drawer',
    cartDrawerOpen: '.cart-drawer--open',
    cartDrawerTabs: '.cart-drawer__tabs',
  };

  var settings = {
    // 'aboveForm' for top of add to cart form, 
    // 'belowForm' for below the add to cart form, 
    // 'nextButton' for next to add to cart button and
    // 'afterBody' for after the main body content (used for fixed notifications).
    feedbackPosition: 'afterBody'
  };

  var options = {
    requestBodyClass: 'cart-loading',
    moneyFormat: window.shop.moneyFormat,
    moneyWithCurrencyFormat: window.shop.moneyWithCurrencyFormat,
    weightUnit: 'kg', // g, kg, oz, lb
    weightPrecision: 0,
    tinybindModels: {
      'customer': window.shop.customer,
      'methods': {
        updateQuantityFromSelect: function() {
          var quantity = this.options[this.selectedIndex].value;
          var line_number = this.dataset.lineIndex;
          CartJS.updateItem(line_number, quantity);
        }
      }
    },
    errorHandling: {
      cartError: function() {
        $('.cart-loader.loading').removeClass('loading');
        if (this.description) {
          showFeedback('error', this.description);
        }
      }
    }
  };

  var cache = {
    previousCartItems: [],
    updatedItems: []
  };

  function init() {
    if (!$(selectors.cartDrawer).length) {
      return;
    }

    var $tabsGroup = $(selectors.cartDrawerTabs);
    $.each($tabsGroup, function(index, tabsGroup) {
      window.theme.tabsGroups[tabsGroup] = new theme.TabsGroup(tabsGroup, {
        breakpoint: 0
      });
    });

    $(document).on('click', '[data-add-to-cart], [data-cart-add], [data-cart-update], [data-cart-update-id], [data-cart-remove]', function(evt){
      var $this = $(this);
      var progressElementSelector = $this.data('progress-element');
      var $progressElement = progressElementSelector ? $(progressElementSelector) : $this;
      
      if (!$this.is('.disabled')) {
        if ($progressElement.length) {
          $progressElement.addClass('cart-loader loading');
        }

        if ($this.is('[data-opens-cart-drawer]')) {
          $('body').addClass('cart-loading--opens-drawer');
        }
      } else {
        evt.preventDefault();
        evt.stopPropagation();

        $progressElement.addClass('error');
        window.setTimeout(function(){
          $progressElement.removeClass('error');
        }, 1500);

        var highlightElements = $this.data('enable-requirements');
        if (highlightElements) {
          theme.utils.flash(highlightElements);
        }
      }
    });
    
    initDrawer();

    $(selectors.cartDrawerOpen).on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openCartDrawer();
    });

    cache.closeTooltip = tippy('.cart-drawer', { 
      target: '.cart-drawer-item__remove--button',
      theme: 'light',
      placement: 'left',
      animation: 'shift-away',
      arrow: true,
      offset: 0,
      distance: 5,
      trigger: 'mouseenter',
      lazy: false,
      onShow: function(instance) {
        if (isMobile.any) {
          return false;
        }
      }
    });

    CartJS.init(window.shop.cart, options);

    $('#cart-drawer-note, #cart-note').on('blur', function() {
      var note = $(this).val();
      if (note) {
        CartJS.setNote(note);
      } else {
        CartJS.setNote('');
      }
    });

    $('.cart-drawer__submit').click(function(){
      $(document.body).addClass('checkout-activated');
    });

    $(document).on('cart.requestStarted', function(event, cart, request) {
      cache.previousCartItems = _.values(_.omit(cart.items, _.functions(cart.items)));
      
      if ('NProgress' in window) {
        NProgress.start();
      }

      var variant, price, variantId = parseInt(request.data.id);

      if (variantId && theme.current.product) {
       variant = _.find(theme.current.product.variants, { id: variantId });
         }

      if (!variant) {
        variant = _.filter(theme.current.collection.products, { variants: [ { id: variantId } ]});
        variant = variant.length ? variant[0] : false;
      }

      if (variant) {
        price = variant.price * parseInt(request.data.quantity);
        
        // Analytics ATC Tracking
        // Pinterest
        if ('pintrk' in window) {
          pintrk('track', 'addtocart', {
            'value': price,
            'currency': shop.currency
          });
        }
      }
    });

    $(document).on('cart.requestComplete', function(event, cart) {
      if ('NProgress' in window) {
        NProgress.done();
      }
      
      $('.cart-loader.loading').removeClass('loading');

      // cache.updatedItems = theme.utils.difference(_.values(_.omit(cart.items, _.functions(cart.items))), cache.previousCartItems);
      // _.remove(cache.updatedItems, _.isEmpty);

      cache.updatedItems = cart.updatedLineItems;
      
      if (!cache.updatedItems.length && cart.items.length > 0) {
        // showFeedback('error', theme.strings.quantityUnavailable);
      }
      
      shop.cart = cart;

      if (theme.Favicon !== undefined) {
        if (cart.item_count_display > 0) {
          theme.Favicon.set(cart.item_count_display);
        } else {
          theme.Favicon.reset();
        }
      }

      var opensDrawer = $('body').is('.cart-loading--opens-drawer');
      
      if (opensDrawer !== undefined && opensDrawer) {
        if ((theme.cartQueue === undefined || theme.cartQueue.length == 0) && theme.cartQueueProcessing == false) {
          if (!theme.CartDrawer.drawerIsOpen) {
            $('body').removeClass('cart-loading--opens-drawer');

           openCartDrawer();

            _.each(cache.updatedItems, function(updatedItem) {
              var lineItem, previousItem;
              lineItem = _.find(cart.items, { 'id': updatedItem.id });

              if (lineItem) {
                previousItem = _.find(cache.previousCartItems, { 'id': lineItem.id });
              }

              if (typeof lineItem.properties._hidden == 'undefined' && (!previousItem || lineItem.quantity > previousItem.quantity)) {
               // showMiniCart(lineItem);


              }
              
            });
          }
        }
      }

      if (theme.CartDrawer.drawerIsOpen && cart.item_count_display < 1) {
        window.setTimeout(function() {
          theme.CartDrawer.close();
        }, 2500);
      }

      // Update selector caches
      for (var i = 0; i < theme.current.selected.length; i++) {
        theme.current.selected[i].refreshCartQuantity();
      }

    });
  }

  function showMiniCart(lineItem) {
    theme.MiniCart.show(lineItem);
  }

  function initDrawer() {
    $('#MainContent').addClass('drawer-page-content');
    $('.js-drawer-open-top').attr('aria-controls', 'CartDrawer').attr('aria-expanded', 'false');

    theme.CartDrawer = new theme.Drawers('CartDrawer', 'right', {
      onDrawerOpen: cartDrawerOpen,
      onDrawerClose: cartDrawerClose,
      beforeDrawerOpen: function(drawer) {
        theme.MiniCart.close({
          direction: 'left'
        });
      }
    });
  }

  function cartDrawerOpen() {
    // $(selectors.cartToggle).addClass(settings.cartDrawerOpen);

    if (cache.closeTooltip) {
      for (var i = cache.closeTooltip.length - 1; i >= 0; i--) {
        cache.closeTooltip[i].enable();
      }
    }
  }

  function cartDrawerClose() {
    // $(selectors.cartToggle).removeClass(settings.cartDrawerOpen);

    if (cache.closeTooltip) {
      for (var i = cache.closeTooltip.length - 1; i >= 0; i--) {
        cache.closeTooltip[i].hide();
        cache.closeTooltip[i].disable();
      }
    }
  }

  function openCartDrawer() {

    /*if (isMobile.any) {
      console.info('Navigating to cart page');
      window.location.href = '/cart';
    } else {
      theme.CartDrawer.open();
    }*/
    theme.CartDrawer.open();

  }

  function showFeedback(status, response, $addToCartForm) {
    $('.ajax-cart-feedback').remove();
    var feedback = '<div class="ajax-cart-feedback ' + status + '">' + response + '</div>';
    
    if ($addToCartForm !== undefined && $addToCartForm.length > 0) {
      switch (settings.feedbackPosition) {
        case 'aboveForm':
          $addToCartForm.before(feedback);
          break;
        case 'belowForm':
          $addToCartForm.after(feedback);
          break;
        case 'afterBody':
          $(document.body).append(feedback);
          break;
        case 'nextButton':
        default:
          $addToCartForm.find(selectors.addToCartBtn).after(feedback);
          break;
      }
    } else {
      theme.utils.showError(response);
    }
    
    var $feedbackElement = $('.ajax-cart-feedback');
    
    $feedbackElement.offset(); // redraw
    $feedbackElement.addClass('active');
    window.setTimeout(function(){
      $feedbackElement.removeClass('active');
    }, 6500);
  };

  return {
    init: init,
    openCartDrawer: openCartDrawer
  };
})();

theme.AjaxCart.init();

theme.cartQueue = [];
theme.cartQueueProcessing = false;
theme.processCartQueue = function() {
  // If there's something in the queue, process it
  if (theme.cartQueue.length) {
    theme.cartQueueProcessing = true;
    var request = theme.cartQueue.shift();
    var requestType = request.type || 'add';

    if (requestType == 'add') {
      CartJS.addItem(request.variant_id, request.quantity, request.properties, {
        "success": function(data, textStatus, jqXHR) {
          theme.processCartQueue();
        }
      });
    } else if (requestType == 'update') {
      CartJS.updateItem(line_number, quantity, properties = {}, options = {})
    } else {
      // CartJS.removeItem(line_number, options = {})
    }
    

    ShopifyAPI.addItem(request.variant_id, request.quantity, request.properties, ShopifyAPI.processQueue, requestType);
  }
  else {
    theme.cartQueueProcessing = false;
  }
};

/* Cookie Banner */
if ('cookieconsent' in window && theme.settings.cookiePolicyPopup.enable && !Shopify.designMode) {
  var setCookieStatusVar = function(status) {
    if (status == 'allow' || status == 'dismiss') {

    } else {
      
    }
  };

  window.cookieconsent.initialise({
    "palette": {
      "popup": {
        "background": theme.settings.cookiePolicyPopup.backgroundColor,
        "text": "var(--color-body-text)"
      },
      "button": {
        "background": "var(--color-secondary)",
        "text": "#fff"
      }
    },
    "theme": "classic",
    "mobileForceFloat": false,
    "content": {
      "message": theme.settings.cookiePolicyPopup.message,
      "dismiss": theme.settings.cookiePolicyPopup.dismissText,
      "link": theme.settings.cookiePolicyPopup.policyLinkText,
      "href": theme.settings.cookiePolicyPopup.policyLink
    },
    onInitialise: function(status) {
      setCookieStatusVar(status);
    },
    onPopupOpen: function(status) {
      setCookieStatusVar(status);
    },
    onStatusChange: function(status) {
      setCookieStatusVar(status);
    },
  });

  // $('.cc-customClose').on('click tap', function() {
  //   $(".cc-window[aria-label='cookieconsent']:first").hide();
  // });
}
window.theme = window.theme || {};

theme.Header = (function() {

  var selectors = {
    body: 'body',
    navigation: '#SiteNav',
    childDropdown: '.site-nav__dropdown',
    childlistGrid: '.site-nav__childlist-grid',
    featureData: 'script#header-data',
    accountDropdown: '.site-header__account-link--dropdown',
    headerUpper: '.site-header__main',
    headerLower: '.site-header-lower',
    dropdown: '.dropdown',
    searchInput: '.search__input',
    searchHeader: '.search-header',
    searchToggle: '.site-header__search-toggle',
    searchContainer: '.instant-search',
    searchContainerActive: 'active',
    searchClose: '.site-header__search-close',
    searchOpenClass: 'js-search--is-open'
  };

  var timeout;

  function Dropdown(handle, el, gridEl) {
    this.handle = handle;
    this.el = el;
    this.gridEl = gridEl;
  }

  function Header(el) {

    this.el = el;
    this.$el = $(el);
    this.$siteNav = this.$el.find(selectors.navigation);
    this.headerLower = document.querySelector(selectors.headerLower);
    this.$searchToggle = $(selectors.searchToggle);
    this.$searchClose = $(selectors.searchClose);
    this.headerLowerHiddenByDefault = this.headerLower && this.headerLower.classList.contains('retract') ? true : false;

    this.data = {
      hideLowerHeader: this.headerLowerHiddenByDefault,
      activeMenuItem: null,
    };

    theme.MegaMenuDropdowns = [];

    // var self = this;

    tinybind.bind(el, {
      data: this.data,
      methods: {
        setActiveMenuItemMouseover: this._handleSetActiveMenuItemMouseover.bind(this),
        setActiveMenuItemClick: this._handleSetActiveMenuItemClick.bind(this),
        clearActiveMenuItem: this._handleClearActiveMenuItem.bind(this)
      }
    });

    var self = this;

    // this._buildDropdowns();

    if (this.headerLower) {
      this._bindShowHideLowerHeader();
    }

    new theme.ResponsiveNavList(this.$siteNav, {
      overflowItemHtml: '<button class="site-nav__link site-nav__link--main"><span>More</span></button>'
    });
    this.$searchToggle.on('click', function() {
      if ($(this).hasClass('site-header__search-toggle--mobile')) {
        theme.drawers.MobileNavDrawer.close();
      }
      $(selectors.headerUpper).addClass(selectors.searchOpenClass);
      $(selectors.searchInput).focus();
    });

  }

  Header.prototype = $.extend({}, Header.prototype, {

    _prepareDropdown: function(handle) {

      var dropdown, el, gridEl;

      for (var i = theme.MegaMenuDropdowns.length - 1; i >= 0; i--) {
        if (theme.MegaMenuDropdowns[i].handle == handle) {
          dropdown = theme.MegaMenuDropdowns[i];
          break;
        }
      }

      if (!dropdown) {
        el = this.el.querySelector('.site-nav__dropdown[data-link-handle="' + handle + '"]');
        gridEl = el.querySelector('.site-nav__childlist-grid');
        dropdown = new Dropdown(handle, el, gridEl);
        theme.MegaMenuDropdowns.push(dropdown);
      }

      if ('MagicGrid' in window && !dropdown.magicGrid && dropdown.gridEl) {
      /*
        dropdown.magicGrid = new MagicGrid({
          container: dropdown.gridEl,
          static: true,
          animate: false,
          gutter: 0,
          maxColumns: 6,
          useTransform: true,
        });
      */

        var accordionTitles = dropdown.gridEl.querySelectorAll('.simple-accordion__title');

        if (isMobile.any) {
          $(accordionTitles).off('click.accordion');
        }

        $(accordionTitles).on('accordionTransitionHeightCalc', function() {
          dropdown.el.classList.add('accordion-transitioning');
          dropdown.magicGrid.positionItems();
        });

        $(accordionTitles).on('accordionTransitionEnd', function() {
          dropdown.el.classList.remove('accordion-transitioning');
        });

       /*dropdown.magicGrid.listen(); */
      }


      dropdown.el.style.position = '';
      dropdown.el.style.display = 'block';
      dropdown.el.offsetHeight;

      if (dropdown.gridEl) {
        var offset, maxWidth, cols, offsetWidth, gridGutter = 36;

        cols = parseInt(dropdown.gridEl.dataset.listLength);
        offset = theme.utils.getOffset(dropdown.gridEl);
        maxWidth = window.innerWidth - (gridGutter * 2);
        dropdown.gridEl.style.maxWidth = '';
        dropdown.gridEl.classList.remove('at-window-width');
        offsetWidth = dropdown.gridEl.offsetWidth;

        if (offsetWidth + offset.left >= (window.innerWidth - gridGutter)) {
          dropdown.el.style.position = 'fixed';
          dropdown.gridEl.classList.add('at-window-width');
          dropdown.el.style.left = Math.max(((window.innerWidth - gridGutter) - offsetWidth) / 2, gridGutter / 2) + 'px';
        }

        if (cols < 6) {
           //dropdown.el.style.position = 'absolute';
          offset = theme.utils.getOffset(dropdown.gridEl);
          maxWidth = window.innerWidth - offset.left - gridGutter;
          dropdown.gridEl.style.maxWidth = maxWidth;
        }

        if (dropdown.magicGrid) {
          dropdown.magicGrid.positionItems();
        }
      }

    },

    _bindShowHideLowerHeader: function() {

      var previousScrollPosition,
          currentScrollPosition,
          scrollingUp;

      var self = this;

      $(selectors.headerUpper, this.$el).on('mouseenter', function() {
        self.hideLowerHeader(false);
      });

      function checkScrollDirection() {
        currentScrollPosition = this.scrollY;

        scrollingUp = (previousScrollPosition > currentScrollPosition);

        if (currentScrollPosition < 40) {
          document.body.classList.add('scroll-top');
        } else {
          document.body.classList.remove('scroll-top');
        }

        if (currentScrollPosition < 200) {
          self.hideLowerHeader(self.headerLowerHiddenByDefault);
        } else if (scrollingUp) {
          self.hideLowerHeader(false);
        } else {
          self.hideLowerHeader(true);
          self.data.activeMenuItem = '';
        }

        previousScrollPosition = currentScrollPosition;
      }

      self.hideLowerHeader(self.headerLowerHiddenByDefault);

      window.onscroll = _.throttle(checkScrollDirection, 250);

    },

    hideLowerHeader: function(hide) {
      if (theme.current.search && theme.current.search.popupOpen || $('html').get(0).classList.contains('js-drawer-open')) {
        return;
      }

      if (hide) {
        document.body.classList.remove('show-header-lower');
      } else {
        document.body.classList.add('show-header-lower');
      }
      this.data.hideLowerHeader = hide;
    },

    _handleSetActiveMenuItemMouseover: function() {
      var target = event.currentTarget.dataset.linkHandle;

      if (isMobile.any) {
        return;
      }

      if (this.data.activeMenuItem == target) {
        return;
      }

      if (event.currentTarget.classList.contains('in-dropdown-menu')) {
        return;
      }

      event.preventDefault();

      this.setActiveMenuItem(target);
    },

    _handleSetActiveMenuItemClick: function() {
      var target = event.currentTarget.dataset.linkHandle;

      if (!event.currentTarget.classList.contains('in-dropdown-menu') && !isMobile.any) {
        return;
      }

      if (this.data.activeMenuItem == target) {
        return;
      }

      event.preventDefault();

      this.setActiveMenuItem(target);
    },


    _handleClearActiveMenuItem: function() {
      if (timeout != null) { 
         clearTimeout(timeout); 

         timeout = null;
      }

      this.setActiveMenuItem();
    },

    setActiveMenuItem: function(target) {
      var self = this;


      if (target) {

        this._prepareDropdown(target);
        if (timeout != null) { clearTimeout(timeout); }

        timeout = setTimeout(function(){
            self.data.activeMenuItem = target;
            theme.Drawers.prototype.closeAllDrawers();
            document.body.classList.add('mmenu-opened');

            if (theme.CartDrawer.drawerIsOpen) {
              theme.CartDrawer.close();
            }
          }, 400)

      } else {
        self.data.activeMenuItem = null;
        document.body.classList.remove('mmenu-opened');
      }

    },


  });

  return Header;

})();

// =require modules/product.js
// theme.current.collection.products[3].compare_at_price = "15000";
// theme.current.collection.products[2].tags.push('preorder');
// theme.current.collection.products[1].tags.push('new');
// theme.current.collection.products[0].available = false;

window.theme = window.theme || {};

theme.ProductFilter = (function() {

  var selectors = {
    collection: '.collection',
    collectionTitle: '[data-collection-title]',
    collectionDescription: '[data-collection-description]',
    collectionGrid: '.collection-grid',
    collectionGridRow: '.collection-grid .row',
    collectionSection: '#shopify-section-collection',
    pageHeader: '.page-header',
    filterTitle: '.bc-sf-filter-block-title h3',
    filterOptionMenuItem: '.bc-sf-filter-option-block',
    filtersDesktop: '.js-filter',
    filteredProductsContainer: '#bc-sf-filter-products',
    collectionVendorsData: '#collection-vendors-data',
    productGridItem: '.product-grid-item',
  };

  var options = {
    displayCollectionDescription: true,
    animateHeaderHeight: false
  };

  var cache = {
    headerHeightCurrent: 0,
    headerHeightNew: 0,
    sort: false,
    $vendorSections: {},
    vendorProducts: {},
    vendorData: {},
    viewBound: false,
  };

  function init() {
    if ('BCSfFilter' in window) {
      window.bcsffilter = new BCSfFilter();
      window.bcsffilter.init();

      if (theme.current.template.name == 'collection' || theme.current.template.name == 'search') {
        window.bcsffilter.initFilter();
      }
    }
  }

  function buildCollectionPage(data, eventType) {

    if (!$(selectors.collection).length) {
      return;
    }

    if (!cache.viewBound) {
      var $collectionSection = $(selectors.collectionSection);
      if ($collectionSection.length) {
        tinybind.bind($collectionSection, theme);
        cache.viewBound = true;
      }
    }

    cache.sort = bcsffilter.queryParams.sort;
    $(selectors.collection).attr('data-sort', cache.sort);

    if ('anime' in window) {
      anime({
        targets: '.product-grid-item',
        translateY: [15, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeInOutCubic',
        delay: anime.stagger(100, {grid: [4, 4]})
      });
    }
  }

  return {
    init: init,
    buildCollectionPage: buildCollectionPage
  };

})();

theme.ProductFilter.init();

theme.current = theme.current || {};
theme.current.search = theme.current.search || {};

theme.Search = (function() {
  var defaults = {
    searchProvider: theme.settings.search.provider, // boost, algolia, shopify
    faqPageUrl: theme.settings.faqPageUrl,
    clearResultsBetweenSearches: true,
    enabledSearchResultDataTypes: [
      'articles',
      'articles_returned_count',
      'articles_total_count',
      'blogs',
      'blogs_returned_count',
      'blogs_total_count',
      'collections',
      'collections_returned_count',
      'collections_total_count',
      // 'faq',
      // 'faq_returned_count',
      // 'faq_total_count',
      'pages',
      'pages_returned_count',
      'pages_total_count',
      'products',
      'products_returned_count',
      'products_total_count',
      'query',
    ]
  }

  var cache = {
    faqs: [],
    searches: []
  }

  function Search(searchInputs, options) {
    this.$searchInputs = $(searchInputs);

    options = options || {};
    this.options = _.defaults(options, defaults)
  }

  Search.prototype = _.extend(Search.prototype, {

   onSearchResult: function() {

      if (typeof this.options.onSearchResult == 'function') {
        this.options.onSearchResult()
      }

      this.$searchInputs.trigger('searchComplete.search')

      if ('NProgress' in window) {
        NProgress.done();
      }

    },

    search: function(value) {
      if (theme.current.search.query != value) {

        if ('NProgress' in window) {
          NProgress.start();
        }

        this.$searchInputs.trigger('searchStart.search')
        this.performQuery(value, this.onSearchResult.bind(this));

      }
    },

    clearResults: function() {

      /*if (!this.options.clearResultsBetweenSearches) {
        return;
      }*/

      var searchKeys = Object.keys(theme.current.search);
      var i = searchKeys.length;
      while(i--) {
        theme.current.search[searchKeys[i]] = undefined;
      }
    },

    setResults: function(dataType, data, provider) {

      if (this.options.enabledSearchResultDataTypes.indexOf(dataType) == -1) {
        return
      }

      provider = provider || defaults.searchProvider;
      theme.current.search[dataType] = data;

    },

    setIsLoading: function(state) {
      theme.current.search.isLoading = state;
    }, 

    getSearchProvider: function() {
      return this.options.searchProvider
    },

    getDesiredResultsCount: function(objectType) {
      var count = 4;
      return this.options.searchCount[objectType] || count
    },

    performQuery: function(value, callback) {
      var self = this;
      this.clearResults();
      this.setIsLoading(true);

      self.setResults('query', value);

      var callsToMake = 1;

      function checkRemainingCalls() {
        callsToMake -= 1
        if (callsToMake == 0) {
          callback();
        }
      }

      switch (this.options.searchProvider) {

        case 'shopify':
          this.performShopifySearch(value, checkRemainingCalls);
          break;

        case 'boost':
          this.performBoostFilterSearch(value, checkRemainingCalls);
          break;

        case 'algolia':
          this.performAlgoliaSearch(value, checkRemainingCalls);
          break;

      }

      if (this.options.enabledSearchResultDataTypes.indexOf('faq') != -1) {
        callsToMake += 1;
        this.performFaqSearch(value, checkRemainingCalls);
      }

    },

    performFaqSearch: function(value, callback) {
      var self = this;

      if (cache.faqs.length) {
        var faqResults = filterFaqs(value, cache.faqs);
        self.setResults('faq', faqResults.limitedResults);
        self.setResults('faq_count', faqResults.total);
        callback();
        return;
      }

      function filterFaqs(value, faqs) {
        var options = {
          shouldSort: true,
          includeScore: true,
          threshold: 0.3,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: [
            'question'
          ]
        };
        var fuse = new Fuse(faqs, options);
        var allResults = fuse.search(value);
        var limitedResults = allResults.slice(0, 5);
        return {
          limitedResults: limitedResults.map(function(result) {
            return result.item;
          }),
          total: allResults.length
        }

      }

      function formatFaqs(faqs) {
        var i = faqs.length, faqsCache = [];
        while(i--) {
          faqsCache.push(_.extend(faqs[i], {
            url: self.options.faqPageUrl + '?q=' + encodeURI(faqs[i].question),
            title: faqs[i].question
          }));
        }
        return faqsCache;
      }

      $.get(self.options.faqPageUrl + '?view=faq-json', function(data) {
        var faqJSON = JSON.parse(data);
        cache.faqs = formatFaqs(faqJSON);
        var faqResults = filterFaqs(value, cache.faqs);
        self.setResults('faq', faqResults.limitedResults);
        self.setResults('faq_count', faqResults.total);
        callback();
      });

    },

    performBoostFilterSearch: function(value, callback) {

      var self = this;

      var queryUrl = 'https://services.mybcapps.com/bc-sf-filter/search/suggest?event_type=suggest&shop=' + Shopify.shop;
      
      queryUrl = queryUrl + '&q=' + value;

      if (this.options.enabledSearchResultDataTypes.indexOf('products') > -1) {
        queryUrl = queryUrl + '&product_limit=' + 9;
      };

      if (this.options.enabledSearchResultDataTypes.indexOf('collections') > -1) {
        queryUrl = queryUrl + '&collection_limit=5';
      };

      if (this.options.enabledSearchResultDataTypes.indexOf('pages') > -1) {
        queryUrl = queryUrl + '&page_limit=5';
      };

      queryUrl = queryUrl + '&dym_limit=5';

      function submitResults(data) {
        self.setResults('products', self.formatProducts(data.products));
        self.setResults('products_total_count', data['total_product']);
        self.setResults('products_returned_count', data.products.length);

        self.setResults('pages', data.pages);
        self.setResults('pages_returned_count', data.pages.length);
        self.setResults('pages_total_count', data.pages.length);

        self.setResults('collections', data.collections);
        self.setResults('collections_returned_count', data.collections.length);

        if (typeof callback == 'function') {
          callback();
        }
      }

      var resultsFromCache = this.retrieveFromCache(queryUrl);

      if (resultsFromCache) {
        submitResults(resultsFromCache);
      } else {
        $.get(queryUrl, function(data) {
          self.submitToCache(queryUrl, data);
          submitResults(data);
        })
      }


      // https://services.mybcapps.com/bc-sf-filter/search/suggest?q=fruit&shop=huckleberry-nz.myshopify.com&t=1573186182535&suggestion_limit=5&collection_limit=5&product_limit=9&page_limit=5&dym_limit=2&event_type=suggest
    },

    performAlgoliaSearch: function(value, callback) {
      var searchableDataTypes= ['products', 'articles', 'collections'];
      var self = this;

      if (!('algoliaShopify' in window)) {
        console.error(new Error('Algolia not initialised'));
        return false;
      }

      var indexPrefix = algoliaShopify.config.index_prefix;

      var queries = [];

      var i = searchableDataTypes.length, query;
      while(i--) {
        if (this.options.dataTypes.indexOf(searchableDataTypes[i]) > -1) {
          query = {
            query: value,
            indexName: indexPrefix + searchableDataTypes[i],
            params: {
              hitsPerPage: this.getDesiredResultsCount(searchableDataTypes[i])
            }
          }
          queries.push(query)
        }
      }

      function submitResults(data) {
        var j = data.results.length, index, objectType;
        while(j--) {
          index = data.results[j];
          objectType = index.index.replace(indexPrefix, '');
          var hits = index.hits;

          if (objectType == 'products') {
            var hits = self.formatProducts(hits);
          }

          self.setResults(objectType, hits.reverse());
          self.setResults(objectType + '_returned_count', index.hits.length);
          self.setResults(objectType + '_total_count', index.nbHits);
        }

        if (typeof callback == 'function') {
          callback();
        }
      }

      // var resultsFromCache = this._retrieveFromCache(queries);

      // if (resultsFromCache) {
      //   submitResults(resultsFromCache);
      //   return;
      // }

      algoliaShopify.client.search(queries, function(error, data) {
        if (error) {
          return console.error(new Error(error));
        }
        self.submitToCache(queries, data);
        submitResults(data);
      })

    },

    retrieveFromCache: function(value) {
      var value = JSON.stringify(value);
      var i = cache.searches.length;
      while(i--) {
        if (cache.searches[i].value == value && cache.searches[i].provider == this.options.provider) {
          console.info('Results from cache');
          return JSON.parse(cache.searches[i].results);
        }
      }
    },

    submitToCache: function(value, results) {
      cache.searches.push({
        value: JSON.stringify(value),
        provider: this.options.provider,
        results: JSON.stringify(results)
      });
    },

    performShopifySearch: function(value, callback) {
      var self = this;

      $.getJSON("/search/suggest.json", {
        "q": value,
        "resources": {
          "type": "product,page,article",
          "limit": 999,
          "options": {
            "unavailable_products": "last",
          }
        }
      }, function(data) {

        var articles = data.resources.results.articles || [];
        var pages = data.resources.results.pages || [];
        var products = data.resources.results.products ? self.formatProducts(data.resources.results.products) : [];

        self.setResults('articles', articles.slice(0, self.getDesiredResultsCount('articles')));
        self.setResults('articles_count', articles.length);
        self.setResults('pages', pages.slice(0,  self.getDesiredResultsCount('pages')));
        self.setResults('pages_count', pages.length);
        self.setResults('products', products.slice(0,  self.getDesiredResultsCount('products')));
        self.setResults('products_returned_count', products.length);
        self.setIsLoading(false);

        if (typeof callback == 'function') {
          callback();
        }

      });
    },

    /*formatProducts: function(products) {
      var i = products.length,
              formattedProducts = [],
              options = {
                source: this.options.searchProvider,
                requiredFields: [
                  'metafields.stamped.badge'
                ]
              };
      while(i--) {
        formattedProducts.push(new theme.Product(products[i], options));
      }
      return formattedProducts;
    },*/
    formatProducts: function(products) {
          var i = products.length,
                  formattedProducts = [],
                  product,
                  options = {
                    source: this.options.searchProvider,
                    requiredFields: [
                      'metafields.stamped.badge'
                    ]
                  };
          while(i--) {
            product = products[i];
            if (this.options.searchProvider == 'boost') {
              if (!product.price && product.price_min) {
                product.price = product.price_min * 100;
              }
              if (!product.compare_at_price && product.compare_at_price_min) {
                product.compare_at_price = product.compare_at_price_min * 100;
              }
            }
            product.description = product.body_html;
            formattedProducts.push(new theme.Product(product, options));
          }
          return formattedProducts;
        },

    // triggerLoadedEvent(searchInput) {
    //   $(searchInput).trigger('resultsLoaded.search');
    // },

  });

  return Search
})();

window.theme = window.theme || {};

theme.Slideshow = (function() {
  this.$slideshow = null;
  var classes = {
    wrapper: 'slideshow-wrapper',
    slideshow: 'slideshow',
    currentSlide: 'slick-current',
    video: 'slideshow__video',
    videoBackground: 'slideshow__video--background',
    closeVideoBtn: 'slideshow__video-control--close',
    pauseButton: 'slideshow__pause',
    isPaused: 'is-paused'
  };
  // #TODO: Make these more global
  var config = {
    mediaQuerySmall: theme.settings.mediaQuery.small,
    mediaQueryMedium: theme.settings.mediaQuery.medium,
    mediaQueryLargeUp: theme.settings.mediaQuery.largeUp
  };
  var defaults = {
    accessibility: true,
    adaptiveHeight: false,
    arrows: false,
    asNavFor: null,
    autoplay: false,
    autoplaySpeed: 7000,
    centerMode: false,
    centerPadding: '40px',
    dots: false,
    draggable: true,
    fade: false,
    infinite: true,
    rows: 0,
    slidesPerRow: 1,
    slidesToScroll: 1,
    slidesToShow: 1,
    swipeToSlide: true,
    touchThreshold: 20,
  };

  function slideshow(el) {
    this.$slideshow = $(el);

    if (!this.$slideshow.length) {
      return;
    }

    this.$wrapper = this.$slideshow.closest('.' + classes.wrapper) || this.parent();
    this.$pause = this.$wrapper.find('.' + classes.pauseButton);
    this.sliderActive = false;
    var elementOptions = this.$slideshow.data();

    defaults.prevArrow = '#' + this.$slideshow.attr('id') + ' ~ .slideshow__prev';
    defaults.nextArrow = '#' + this.$slideshow.attr('id') + ' ~ .slideshow__next';

    this.settings = {};
    this.settings.all = {
      adaptiveHeight: elementOptions.adaptiveHeight,
      arrows: elementOptions.arrows,
      asNavFor: elementOptions.asNavFor,
      autoplay: elementOptions.autoplay,
      autoplaySpeed: elementOptions.speed,
      centerMode: elementOptions.centerMode,
      centerPadding: elementOptions.centerPadding,
      dots: elementOptions.dots,
      draggable: elementOptions.draggable,
      fade: elementOptions.fade,
      focusOnSelect: elementOptions.focusOnSelect,
      infinite: elementOptions.infinite,
      nextArrow: elementOptions.nextArrow,
      prevArrow: elementOptions.prevArrow,
      rows: elementOptions.rows,
      slidesPerRow: elementOptions.perRow,
      slidesToScroll: elementOptions.slidesScroll,
      slidesToShow: elementOptions.slidesShow,
      waitForAnimate: elementOptions.waitForAnimate,
    };
    this.settings.desktop = {
      adaptiveHeight: elementOptions.adaptiveHeightDesktop,
      arrows: elementOptions.arrowsDesktop,
      autoplay: elementOptions.autoplayDesktop,
      autoplaySpeed: elementOptions.speedDesktop,
      centerMode: elementOptions.centerModeDesktop,
      centerPadding: elementOptions.centerPaddingDesktop,
      dots: elementOptions.dotsDesktop,
      focusOnSelect: elementOptions.focusOnSelectDesktop,
      infinite: elementOptions.infiniteDesktop,
      rows: elementOptions.rowsDesktop,
      slidesPerRow: elementOptions.perRowDesktop,
      slidesToScroll: elementOptions.slidesScrollDesktop,
      slidesToShow: elementOptions.slidesShowDesktop,
    };
    this.settings.tablet = {
      adaptiveHeight: elementOptions.adaptiveHeightTablet,
      arrows: elementOptions.arrowsTablet,
      autoplay: elementOptions.autoplayTablet,
      autoplaySpeed: elementOptions.speedTablet,
      centerMode: elementOptions.centerModeTablet,
      centerPadding: elementOptions.centerPaddingTablet,
      dots: elementOptions.dotsTablet,
      focusOnSelect: elementOptions.focusOnSelectTablet,
      infinite: elementOptions.infiniteTablet,
      rows: elementOptions.rowsTablet,
      slidesPerRow: elementOptions.perRowTablet,
      slidesToScroll: elementOptions.slidesScrollTablet,
      slidesToShow: elementOptions.slidesShowTablet,
    };
    this.settings.mobile = {
      adaptiveHeight: elementOptions.adaptiveHeightMobile,
      arrows: elementOptions.arrowsMobile,
      autoplay: elementOptions.autoplayMobile,
      autoplaySpeed: elementOptions.speedMobile,
      centerMode: elementOptions.centerModeMobile,
      centerPadding: elementOptions.centerPaddingMobile,
      dots: elementOptions.dotsMobile,
      focusOnSelect: elementOptions.focusOnSelectMobile,
      infinite: elementOptions.infiniteMobile,
      rows: elementOptions.rowsMobile,
      slidesPerRow: elementOptions.perRowMobile,
      slidesToScroll: elementOptions.slidesScrollMobile,
      slidesToShow: elementOptions.slidesShowMobile,
    };

    _.defaults(this.settings.desktop, this.settings.all);
    _.defaults(this.settings.desktop, defaults);

    _.defaults(this.settings.tablet, this.settings.all);
    _.defaults(this.settings.tablet, defaults);

    _.defaults(this.settings.mobile, this.settings.all);
    _.defaults(this.settings.mobile, defaults);

    this.$slideshow.on('beforeChange', beforeChange.bind(this));
    this.$slideshow.on('init', slideshowA11y.bind(this));
    // this.$slideshow.slick(this.settings);

    var self = this;

    enquire.register(config.mediaQuerySmall, {
      match: function() {
        if (!elementOptions.disableMobile) {
          initSlider(self.$slideshow, self.settings.mobile);
        } else {
          destroySlider(self.$slideshow);
        }
      }
    });

    enquire.register(config.mediaQueryMedium, {
      match: function() {
        if (!elementOptions.disableTablet) {
          initSlider(self.$slideshow, self.settings.tablet);
        } else {
          destroySlider(self.$slideshow);
        }
      }
    });

    enquire.register(config.mediaQueryLargeUp, {
      match: function() {
        if (!elementOptions.disableDesktop) {
          initSlider(self.$slideshow, self.settings.desktop);
        } else {
          destroySlider(self.$slideshow);
        }
      }
    });

    function initSlider(sliderObj, args) {
      if (self.sliderActive) {
        sliderObj.slick('unslick');
        self.sliderActive = false;
      }

      sliderObj.on('beforeChange.slideshow', function(event, slick, currentSlide, nextSlide) {
        slick.$slider.addClass('slick-transitioning');
      });

      sliderObj.on('afterChange.slideshow', function(event, slick, currentSlide, nextSlide) {
        slick.$slider.removeClass('slick-transitioning');
      });

      sliderObj.slick(args);
      self.sliderActive = true;
    }

    function destroySlider(sliderObj) {
      if (self.sliderActive) {
        sliderObj.off('.slideshow');
        sliderObj.slick('unslick');
        self.sliderActive = false;
      }
    }

    this.$pause.on('click', this.togglePause.bind(this));
  }

  function slideshowA11y(event, obj) {
    var $slider = obj.$slider;
    var $list = obj.$list;
    var $wrapper = this.$wrapper;
    var autoplay = this.settings.autoplay;

    // Remove default Slick aria-live attr until slider is focused
    $list.removeAttr('aria-live');

    // When an element in the slider is focused
    // pause slideshow and set aria-live.
    $wrapper.on('focusin', function(evt) {
      if (!$wrapper.has(evt.target).length) {
        return;
      }

      $list.attr('aria-live', 'polite');

      if (autoplay) {
        $slider.slick('slickPause');
      }
    });

    // Resume autoplay
    $wrapper.on('focusout', function(evt) {
      if (!$wrapper.has(evt.target).length) {
        return;
      }

      $list.removeAttr('aria-live');

      if (autoplay) {
        // Manual check if the focused element was the video close button
        // to ensure autoplay does not resume when focus goes inside YouTube iframe
        if ($(evt.target).hasClass(classes.closeVideoBtn)) {
          return;
        }

        $slider.slick('slickPlay');
      }
    });

    // Add arrow key support when focused
    if (obj.$dots) {
      obj.$dots.on('keydown', function(evt) {
        if (evt.which === 37) {
          $slider.slick('slickPrev');
        }

        if (evt.which === 39) {
          $slider.slick('slickNext');
        }

        // Update focus on newly selected tab
        if ((evt.which === 37) || (evt.which === 39)) {
          obj.$dots.find('.slick-active button').focus();
        }
      });
    }
  }

  function beforeChange(event, slick, currentSlide, nextSlide) {
    var $slider = slick.$slider;
    var $currentSlide = $slider.find('.' + classes.currentSlide);
    var $nextSlide = $slider.find('.slideshow__slide[data-slick-index="' + nextSlide + '"]');

    if (isVideoInSlide($currentSlide)) {
      var $currentVideo = $currentSlide.find('.' + classes.video);
      var currentVideoId = $currentVideo.attr('id');
      theme.SlideshowVideo.pauseVideo(currentVideoId);
      $currentVideo.attr('tabindex', '-1');
    }

    if (isVideoInSlide($nextSlide)) {
      var $video = $nextSlide.find('.' + classes.video);
      var videoId = $video.attr('id');
      var isBackground = $video.hasClass(classes.videoBackground);
      if (isBackground) {
        theme.SlideshowVideo.playVideo(videoId);
      } else {
        $video.attr('tabindex', '0');
      }
    }
  }

  function isVideoInSlide($slide) {
    return $slide.find('.' + classes.video).length;
  }

  slideshow.prototype.togglePause = function() {
    var slideshowSelector = getSlideshowId(this.$pause);
    if (this.$pause.hasClass(classes.isPaused)) {
      this.$pause.removeClass(classes.isPaused);
      $(slideshowSelector).slick('slickPlay');
    } else {
      this.$pause.addClass(classes.isPaused);
      $(slideshowSelector).slick('slickPause');
    }
  };

  function getSlideshowId($el) {
    return '#Slideshow-' + $el.data('id');
  }

  return slideshow;
})();

// Youtube API callback
// eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
  theme.SlideshowVideo.loadVideos();
}

theme.SlideshowVideo = (function() {
  var autoplayCheckComplete = false;
  var autoplayAvailable = false;
  var playOnClickChecked = false;
  var playOnClick = false;
  var youtubeLoaded = false;
  var videos = {};
  var videoPlayers = [];
  var videoOptions = {
    ratio: 16 / 9,
    playerVars: {
      // eslint-disable-next-line camelcase
      iv_load_policy: 3,
      modestbranding: 1,
      autoplay: 0,
      controls: 0,
      showinfo: 0,
      wmode: 'opaque',
      branding: 0,
      autohide: 0,
      rel: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerChange
    }
  };
  var classes = {
    playing: 'video-is-playing',
    paused: 'video-is-paused',
    loading: 'video-is-loading',
    loaded: 'video-is-loaded',
    slideshowWrapper: 'slideshow-wrapper',
    slide: 'slideshow__slide',
    slideBackgroundVideo: 'slideshow__slide--background-video',
    slideDots: 'slick-dots',
    videoChrome: 'slideshow__video--chrome',
    videoBackground: 'slideshow__video--background',
    playVideoBtn: 'slideshow__video-control--play',
    closeVideoBtn: 'slideshow__video-control--close',
    currentSlide: 'slick-current',
    slickClone: 'slick-cloned',
    supportsAutoplay: 'autoplay',
    supportsNoAutoplay: 'no-autoplay'
  };

  /**
    * Public functions
   */
  function init($video) {
    if (!$video.length) {
      return;
    }

    videos[$video.attr('id')] = {
      id: $video.attr('id'),
      videoId: $video.data('id'),
      type: $video.data('type'),
      status: $video.data('type') === 'chrome' ? 'closed' : 'background', // closed, open, background
      videoSelector: $video.attr('id'),
      $parentSlide: $video.closest('.' + classes.slide),
      $parentSlideshowWrapper: $video.closest('.' + classes.slideshowWrapper),
      controls: $video.data('type') === 'background' ? 0 : 1,
      slideshow: $video.data('slideshow')
    };

    if (!youtubeLoaded) {
      // This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  function customPlayVideo(playerId) {
    // Do not autoplay just because the slideshow asked you to.
    // If the slideshow asks to play a video, make sure
    // we have done the playOnClick check first
    if (!playOnClickChecked && !playOnClick) {
      return;
    }

    if (playerId && typeof videoPlayers[playerId].playVideo === 'function') {
      privatePlayVideo(playerId);
    }
  }

  function pauseVideo(playerId) {
    if (videoPlayers[playerId] && typeof videoPlayers[playerId].pauseVideo === 'function') {
      videoPlayers[playerId].pauseVideo();
    }
  }

  function loadVideos() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var args = $.extend({}, videoOptions, videos[key]);
        args.playerVars.controls = args.controls;
        videoPlayers[key] = new YT.Player(key, args);
      }
    }

    initEvents();
    youtubeLoaded = true;
  }

  function loadVideo(key) {
    if (!youtubeLoaded) {
      return;
    }
    var args = $.extend({}, videoOptions, videos[key]);
    args.playerVars.controls = args.controls;
    videoPlayers[key] = new YT.Player(key, args);

    initEvents();
  }

  /**
    * Private functions
   */

  function privatePlayVideo(id, clicked) {
    var videoData = videos[id];
    var player = videoPlayers[id];
    var $slide = videos[id].$parentSlide;

    if (playOnClick) {
      // playOnClick means we are probably on mobile (no autoplay).
      // setAsPlaying will show the iframe, requiring another click
      // to play the video.
      setAsPlaying(videoData);
    } else if (clicked || (autoplayCheckComplete && autoplayAvailable)) {
      // Play if autoplay is available or clicked to play
      $slide.removeClass(classes.loading);
      setAsPlaying(videoData);
      player.playVideo();
      return;
    }

    // Check for autoplay if not already done
    if (!autoplayCheckComplete) {
      autoplayCheckFunction(player, $slide);
    }
  }

  function setAutoplaySupport(supported) {
    var supportClass = supported ? classes.supportsAutoplay : classes.supportsNoAutoplay;
    $(document.documentElement).addClass(supportClass);

    if (!supported) {
      playOnClick = true;
    }

    autoplayCheckComplete = true;
  }

  function autoplayCheckFunction(player, $slide) {
    // attempt to play video
    player.playVideo();

    autoplayTest(player)
      .then(function() {
        setAutoplaySupport(true);
      })
      .fail(function() {
        // No autoplay available (or took too long to start playing).
        // Show fallback image. Stop video for safety.
        setAutoplaySupport(false);
        player.stopVideo();
      })
      .always(function() {
        autoplayCheckComplete = true;
        $slide.removeClass(classes.loading);
      });
  }

  function autoplayTest(player) {
    var deferred = $.Deferred();
    var wait;
    var timeout;

    wait = setInterval(function() {
      if (player.getCurrentTime() <= 0) {
        return;
      }

      autoplayAvailable = true;
      clearInterval(wait);
      clearTimeout(timeout);
      deferred.resolve();
    }, 500);

    timeout = setTimeout(function() {
      clearInterval(wait);
      deferred.reject();
    }, 4000); // subjective. test up to 8 times over 4 seconds

    return deferred;
  }

  function playOnClickCheck() {
    // Bail early for a few instances:
    // - small screen
    // - device sniff mobile browser

    if (playOnClickChecked) {
      return;
    }

    if ($(window).width() < 750) {
      playOnClick = true;
    } else if (isMobile.any) {
      playOnClick = true;
    }

    if (playOnClick) {
      // No need to also do the autoplay check
      setAutoplaySupport(false);
    }

    playOnClickChecked = true;
  }

  // The API will call this function when each video player is ready
  function onPlayerReady(evt) {
    evt.target.setPlaybackQuality('hd1080');
    var videoData = getVideoOptions(evt);

    playOnClickCheck();

    // Prevent tabbing through YouTube player controls until visible
    $('#' + videoData.id).attr('tabindex', '-1');

    sizeBackgroundVideos();

    // Customize based on options from the video ID
    switch (videoData.type) {
      case 'background-chrome':
      case 'background':
        evt.target.mute();
        // Only play the video if it is in the active slide
        if (videoData.$parentSlide.hasClass(classes.currentSlide)) {
          privatePlayVideo(videoData.id);
        }
        break;
    }

    videoData.$parentSlide.addClass(classes.loaded);
  }

  function onPlayerChange(evt) {
    var videoData = getVideoOptions(evt);

    switch (evt.data) {
      case 0: // ended
        setAsFinished(videoData);
        break;
      case 1: // playing
        setAsPlaying(videoData);
        break;
      case 2: // paused
        setAsPaused(videoData);
        break;
    }
  }

  function setAsFinished(videoData) {
    switch (videoData.type) {
      case 'background':
        videoPlayers[videoData.id].seekTo(0);
        break;
      case 'background-chrome':
        videoPlayers[videoData.id].seekTo(0);
        closeVideo(videoData.id);
        break;
      case 'chrome':
        closeVideo(videoData.id);
        break;
    }
  }

  function setAsPlaying(videoData) {
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;

    $slide.removeClass(classes.loading);

    // Do not change element visibility if it is a background video
    if (videoData.status === 'background') {
      return;
    }

    $('#' + videoData.id).attr('tabindex', '0');

    switch (videoData.type) {
      case 'chrome':
      case 'background-chrome':
        $slideshow
          .removeClass(classes.paused)
          .addClass(classes.playing);
        $slide
          .removeClass(classes.paused)
          .addClass(classes.playing);
        break;
    }

    // Update focus to the close button so we stay within the slide
    $slide.find('.' + classes.closeVideoBtn).focus();
  }

  function setAsPaused(videoData) {
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;

    if (videoData.type === 'background-chrome') {
      closeVideo(videoData.id);
      return;
    }

    // YT's events fire after our click event. This status flag ensures
    // we don't interact with a closed or background video.
    if (videoData.status !== 'closed' && videoData.type !== 'background') {
      $slideshow.addClass(classes.paused);
      $slide.addClass(classes.paused);
    }

    if (videoData.type === 'chrome' && videoData.status === 'closed') {
      $slideshow.removeClass(classes.paused);
      $slide.removeClass(classes.paused);
    }

    $slideshow.removeClass(classes.playing);
    $slide.removeClass(classes.playing);
  }

  function closeVideo(playerId) {
    var videoData = videos[playerId];
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;
    var classesToRemove = [classes.pause, classes.playing].join(' ');

    $('#' + videoData.id).attr('tabindex', '-1');

    videoData.status = 'closed';

    switch (videoData.type) {
      case 'background-chrome':
        videoPlayers[playerId].mute();
        setBackgroundVideo(playerId);
        break;
      case 'chrome':
        videoPlayers[playerId].stopVideo();
        setAsPaused(videoData); // in case the video is already paused
        break;
    }

    $slideshow.removeClass(classesToRemove);
    $slide.removeClass(classesToRemove);
  }

  function getVideoOptions(evt) {
    return videos[evt.target.h.id];
  }

  function startVideoOnClick(playerId) {
    var videoData = videos[playerId];
    // add loading class to slide
    videoData.$parentSlide.addClass(classes.loading);

    videoData.status = 'open';

    switch (videoData.type) {
      case 'background-chrome':
        unsetBackgroundVideo(playerId, videoData);
        videoPlayers[playerId].unMute();
        privatePlayVideo(playerId, true);
        break;
      case 'chrome':
        privatePlayVideo(playerId, true);
        break;
    }

    // esc to close video player
    $(document).on('keydown.videoPlayer', function(evt) {
      if (evt.keyCode === 27) {
        closeVideo(playerId);
      }
    });
  }

  function sizeBackgroundVideos() {
    $('.' + classes.videoBackground).each(function(index, el) {
      sizeBackgroundVideo($(el));
    });
  }

  function sizeBackgroundVideo($player) {
    var $slide = $player.closest('.' + classes.slide);
    // Ignore cloned slides
    if ($slide.hasClass(classes.slickClone)) {
      return;
    }
    var slideWidth = $slide.width();
    var playerWidth = $player.width();
    var playerHeight = $player.height();

    // when screen aspect ratio differs from video, video must center and underlay one dimension
    if (slideWidth / videoOptions.ratio < playerHeight) {
      playerWidth = Math.ceil(playerHeight * videoOptions.ratio); // get new player width
      $player.width(playerWidth).height(playerHeight).css({
        left: (slideWidth - playerWidth) / 2,
        top: 0
      }); // player width is greater, offset left; reset top
    } else { // new video width < window width (gap to right)
      playerHeight = Math.ceil(slideWidth / videoOptions.ratio); // get new player height
      $player.width(slideWidth).height(playerHeight).css({
        left: 0,
        top: (playerHeight - playerHeight) / 2
      }); // player height is greater, offset top; reset left
    }

    $player
      .prepareTransition()
      .addClass(classes.loaded);
  }

  function unsetBackgroundVideo(playerId) {
    // Switch the background-chrome to a chrome-only player once played
    $('#' + playerId)
      .removeAttr('style')
      .removeClass(classes.videoBackground)
      .addClass(classes.videoChrome);

    videos[playerId].$parentSlideshowWrapper
      .removeClass(classes.slideBackgroundVideo)
      .addClass(classes.playing);

    videos[playerId].$parentSlide
      .removeClass(classes.slideBackgroundVideo)
      .addClass(classes.playing);

    videos[playerId].status = 'open';
  }

  function setBackgroundVideo(playerId) {
    // Switch back to background-chrome when closed
    var $player = $('#' + playerId)
      .addClass(classes.videoBackground)
      .removeClass(classes.videoChrome);

    videos[playerId].$parentSlide
      .addClass(classes.slideBackgroundVideo);

    videos[playerId].status = 'background';
    sizeBackgroundVideo($player);
  }

  function initEvents() {
    $(document).on('click.videoPlayer', '.' + classes.playVideoBtn, function(evt) {
      var playerId = $(evt.currentTarget).data('controls');
      startVideoOnClick(playerId);
    });

    $(document).on('click.videoPlayer', '.' + classes.closeVideoBtn, function(evt) {
      var playerId = $(evt.currentTarget).data('controls');
      closeVideo(playerId);
    });

    // Listen to resize to keep a background-size:cover-like layout
    $(window).on('resize.videoPlayer', _.debounce(function() {
      if (youtubeLoaded) {
        sizeBackgroundVideos();
      }
    }, 250));
  }

  function removeEvents() {
    $(document).off('.videoPlayer');
    $(window).off('.videoPlayer');
  }

  return {
    init: init,
    loadVideos: loadVideos,
    loadVideo: loadVideo,
    playVideo: customPlayVideo,
    pauseVideo: pauseVideo,
    removeEvents: removeEvents
  };
})();

(function() {
  var selectors = {
    backButton: '.return-link'
  };

  var $backButton = $(selectors.backButton);

  if (!document.referrer || !$backButton.length || !window.history.length) {
    return;
  }

  $backButton.one('click', function(evt) {
    evt.preventDefault();

    var referrerDomain = urlDomain(document.referrer);
    var shopDomain = urlDomain(window.location.href);

    if (shopDomain === referrerDomain) {
      history.back();
    }

    return false;
  });

  function urlDomain(url) {
    var anchor = document.createElement('a');
    anchor.ref = url;

    return anchor.hostname;
  }
})();

/**
* Module to show Recently Viewed Products
*
* Copyright (c) 2014 Caroline Schnapp (11heavens.com)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* Adapted to use Tinybind logic
* 
*/

window.theme = window.theme || {};
window.theme.slideshows = window.theme.slideshows || {};

theme.RecentlyViewed = (function() {

  var config = {
    howManyToShow: 4,
    howManyToStoreInMemory: 10,
    onComplete: null,
  };

  var selectors = {
    container: '#recently-viewed-products',
    list: '.recently-viewed-products__list',
  };

  var data = {
    products: [],
  };

  var productHandleQueue = [];
  var wrapper = null;
  var shown = 0;

  tinybind.bind($(selectors.container), {
    data: data
  });

  var cookie = {
    configuration: {
      expires: 90,
      path: '/',
      domain: window.location.hostname
    },
    name: 'shopify_recently_viewed',
    write: function(recentlyViewed) {
      localStorage.setItem(this.name, recentlyViewed.join(' '));
    },
    read: function() {
      var recentlyViewed = [];
      var cookieValue = localStorage.getItem(this.name);
      if (cookieValue !== null) {
        recentlyViewed = cookieValue.split(' ');
      }
      return recentlyViewed;
    },
    destroy: function() {
      localStorage.removeItem(this.name);
    },
    remove: function(productHandle) {
      var recentlyViewed = this.read();
      var position = $.inArray(productHandle, recentlyViewed);
      if (position !== -1) {
        recentlyViewed.splice(position, 1);
        this.write(recentlyViewed);
      }
    }
  };

  var moveAlong = function() {

    if (productHandleQueue.length && shown < config.howManyToShow && productHandleQueue[0] != '') {
      $.ajax({
        dataType: 'text',
        url: '/products/' + productHandleQueue[0] + '?view=json',
        cache: false,
        success: function(pr) {
          var product = JSON.parse(pr);
          var currentProduct = theme.current.product && theme.current.product.handle;

          if (currentProduct != product.handle) {
            product.featured_image = {
              src: product.featured_image,
            };

            for (var i = 0; i < product.images.length; i++) {
              product.images[i] = {
                src: product.images[i],
              };
            }

            data.products.push(product);
          }
          productHandleQueue.shift();
          shown++;

          moveAlong();
        },
        error: function() {
          cookie.remove(productHandleQueue[0]);
          productHandleQueue.shift();
          moveAlong();
        }
      });
    } else {
      var slideshow = $(selectors.list);
      theme.slideshows[slideshow] = new theme.Slideshow(slideshow);

      // if (typeof config.onComplete === "function") {
      //   config.onComplete();
      // }

      // $(selectors.list).slick({
      //   mobileFirst: true,
      //   slidesToScroll: 1,
      //   slidesToShow: 1.5,
      //   infinite: false,
      //   dots:false,
      //   responsive: [
      //     {
      //       breakpoint: 600,
      //       settings: "unslick",
      //     }
      //     // You can unslick at a given breakpoint now by adding:
      //     // settings: "unslick"
      //     // instead of a settings object
      //   ]
      // });
    }

  };

  return {

    showRecentlyViewed: function(params) {

      var params = params || {};

      // Update defaults.
      $.extend(config, params);

      // Read cookie.
      productHandleQueue = cookie.read();

      // How many products to show.
      config.howManyToShow = Math.min(productHandleQueue.length, config.howManyToShow);
      
      // If we have any to show.
      if (config.howManyToShow) {
        // Getting each product with an Ajax call and rendering it on the page.
        moveAlong();
      } else {
        $(selectors.container).hide();
      }
    },

    initSlider: function() {
      $(selectors.list).slick({
        mobileFirst: true,
        slidesToShow: 1.3,
        slidesToScroll: 1.3,
        dots:true,
        responsive: [
          {
            breakpoint: 600,
            settings: "unslick",
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
      });
    },

    getConfig: function() {
      return config;
    },

    clearList: function() {
      cookie.destroy();
    },

    recordRecentlyViewed: function(params) {

      var params = params || {};

      // Update defaults.
      $.extend(config, params);

      // Read cookie.
      var recentlyViewed = cookie.read();

      // If we are on a product page.
      if (window.location.pathname.indexOf('/products/') !== -1) {

        // What is the product handle on this page.
        var productHandle = window.location.pathname.match(/\/products\/([a-z0-9\-]+)/)[1];
        // In what position is that product in memory.
        var position = $.inArray(productHandle, recentlyViewed);
        // If not in memory.
        if (position === -1) {
          // Add product at the start of the list.
          recentlyViewed.unshift(productHandle);
          // Only keep what we need.
          recentlyViewed = recentlyViewed.splice(0, config.howManyToStoreInMemory);
        } else {
          // Remove the product and place it at start of list.
          recentlyViewed.splice(position, 1);
          recentlyViewed.unshift(productHandle);
        }

        // Update cookie.
        cookie.write(recentlyViewed);

      }

    }

  };

})();

(function() {
  var selectors = {
    backButton: '.back-to-top',
  };

  var classes = {
    visible: 'back-to-top--visible',
    fade: 'back-to-top--fade',
  };

  var config = {
    showAfter: 300,
    dimAfter: 1200,
    scrollDuration: 700,
  };

  $backButton = $(selectors.backButton);

  if (!$backButton.length) {
    return;
  }
  
  $(window).on('scroll', function(){
    ( $(this).scrollTop() > config.showAfter ) ? $backButton.addClass(classes.visible) : $backButton.removeClass(classes.visible + ' ' + classes.fade);
    if( $(this).scrollTop() > config.dimAfter ) {
      $backButton.addClass(classes.fade);
    }
  });

  $backButton.on('click', function(evt){
    evt.preventDefault();
    $('body,html').animate({scrollTop: 0}, config.scrollDuration);
  });
})();

/*============================================================================
  Favicon cart counter
==============================================================================*/
window.theme = window.theme || {};

theme.Favicon = (function() {

  if (window.Favico === undefined) {
    return;
  }

  var placeholderIcon = false;

  if (!document.querySelector('link[rel="shortcut icon"]')) {
    console.warn("You haven't set a favicon!");

    placeholderIcon = theme.utils.createElementFromHTML('<link rel="shortcut icon" href="https://i.imgur.com/wvh3pXX.gif?' + Date.now() + '" type="image/gif">');
    document.getElementsByTagName('head')[0].appendChild(placeholderIcon);
  }

  var icon = new Favico({
    bgColor: '#0cbdc9',
    textColor: '#fff',
    fontFamily: 'sans-serif', // Arial, Verdana, Times New Roman, serif, sans-serif, ...
    fontStyle: 'bold', // normal, italic, oblique, bold, bolder, lighter, 100, 200, 300, 400, 500, 600, 700, 800, 900
    type: 'circle', // circle, rectangle
    position: 'down', // up, down, left, upleft
    animation: 'none', // slide, fade, pop, popFade, none
    elementId: false, // Image element ID if there is need to attach badge to regular image
    element: false, // DOM element where to change "href" attribute (useful in case of multiple link icon elements)
    dataUrl: false, // Method that will be called for each animation from with data URI parameter
  });

  if (placeholderIcon) {
    var status = 0;
    setInterval(function() {
      if (status) {
        status = 0;
        reset();
      } else {
        status = 1;
        set('\u{1F631}');
      }
    }, 15000);
  } else if (window.shop.cart !== undefined && window.shop.cart.item_count > 0) {
    set(window.shop.cart.item_count);
  }

  function set(value) {
    icon.badge(value);
  }

  function reset() {
    icon.reset();
  }

  return {
    set: set,
    reset: reset
  };
})();

/*
 * Adapted from Currency tools by Caroline Schnapp
 *
 * Copyright (c) 2015 Caroline Schnapp (mllegeorgesand@gmail.com)
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */ 

window.theme = window.theme || {};

theme.CurrencySelectors = (function() {

  function init() {
    Currency.format = shop.currencyFormat;

    var shopCurrency = shop.currency;

    /* Sometimes merchants change their shop currency, let's tell our JavaScript file */
    Currency.moneyFormats[shopCurrency].money_with_currency_format = shop.moneyWithCurrencyFormat;
    Currency.moneyFormats[shopCurrency].money_format = shop.moneyFormat;
      
    /* Default currency */
    var defaultCurrency = shop.defaultCurrency;
      
    /* Cookie currency */
    var cookieCurrency = Currency.cookie.read();

    /* Fix for customer account pages */
    $('span.money span.money').each(function() {
      $(this).parents('span.money').removeClass('money');
    });

    /* Saving the current price */
    $('span.money').each(function() {
      $(this).attr('data-currency-' + shop.currency, $(this).html());
    });

    // If there's no cookie.
    if (cookieCurrency == null) {
      if (shopCurrency !== defaultCurrency) {
        Currency.convertAll(shopCurrency, defaultCurrency);
      }
      else {
        Currency.currentCurrency = defaultCurrency;
      }
    }
    // If the cookie value does not correspond to any value in the currency dropdown.
    else if ($('[name=currencies]').length && $('[name=currencies] option[value=' + cookieCurrency + ']').length === 0) {
      Currency.currentCurrency = shopCurrency;
      Currency.cookie.write(shopCurrency);
    }
    else if (cookieCurrency === shopCurrency) {
      Currency.currentCurrency = shopCurrency;
    }
    else {
      Currency.convertAll(shopCurrency, cookieCurrency);
    }

    $('[name=currencies]').val(Currency.currentCurrency).on('change', function() {
      var newCurrency = $(this).val();
      Currency.convertAll(Currency.currentCurrency, newCurrency);
      $('.selected-currency').text(Currency.currentCurrency);
    });

    var original_selectCallback = window.selectCallback;
    var selectCallback = function(variant, selector) {
      original_selectCallback(variant, selector);
      Currency.convertAll(shopCurrency, $('[name=currencies]').val());
      $('.selected-currency').text(Currency.currentCurrency);
    };

    $(document).on('cart.requestComplete', function(event, cart) {
      Currency.convertAll(shopCurrency, $('[name=currencies]').val());
      $('.selected-currency').text(Currency.currentCurrency);
    });

    $('.selected-currency').text(Currency.currentCurrency);
    $('.currency-picker__wrapper').removeClass('loading');
  }

  return {
    init: init,
  };
})();

theme.CurrencySelectors.init();

window.theme = window.theme || {};

theme.NewsletterPopup = (function() {

  var selectors = {
    el: '#newsletter-popup',
    successMessage: '.form-success',
    barTopParent: '#PageContent',
    barBottomParent: ''
  };

  var defaults = {
    cookieTitle: 'newsletter_popup'
  };

  /**
   * Create a new Newsletter Popup
   *
   * @class      NewsletterPopup
   * @param      {object}  options  The options
   */
  function NewsletterPopup(options) {

    this.el = document.querySelector(selectors.el);

    if (!this.el || this.hasBeenDismised) {
      return;
    }

    this.options = _.defaults(defaults, this.getOptions());

    if (this.options.devMode){
      this.openPopup();
    } else if (this.checkHasBeenDismissed() || window.location.pathname.indexOf('challenge') > -1) {
      return;
    } else if (this.checkHasBeenViewed()) {
      this.openPopup();
    } else {
      this.bindListener();
    }

  }

  NewsletterPopup.prototype = _.extend(NewsletterPopup.prototype, {

    bindListener: function() {
      var self = this;

      $(document).on('scroll.newsletterModal', function() {

        window.setTimeout(function(){
          self.openPopup();
        }, self.options.delay || 0);

        $(document).off('scroll.newsletterModal');
      });

    },

    /**
     * Get the options set as data attributes on the element
     *
     * @return     {Object}  The options set on the element data attribute.
     */
    getOptions: function() {

      var activationDelay,
          cookieExpiry,
          developerMode,
          popupType,
          options = {};

      activationDelay = this.el.dataset.delay;
      cookieExpiry = this.el.dataset.expiry;
      developerMode = this.el.dataset.developerMode;
      popupType = this.el.dataset.popupType;
      popupPosition = this.el.dataset.popupPosition;
      popupPositionX = this.el.dataset.popupPositionX;
      popupPositionY = this.el.dataset.popupPositionY;

      return {
        delay: activationDelay ? parseInt(activationDelay) : null,
        expiry: cookieExpiry ? parseInt(cookieExpiry) : null,
        devMode: developerMode ? (developerMode == 'true') : null,
        type: popupType ? popupType : null,
        position: popupPosition ? popupPosition : null,
        positionX: popupPositionX,
        positionY: popupPositionY,
      };

    },

    /**
     * Check if the popup has been viewed
     *
     * @return     {boolean}  Has the popup been viewed before?
     */
    checkHasBeenViewed: function() {
      return ($.cookie(this.options.cookieTitle + '_viewed') == 'true');
    },

    storeViewedState: function() {
      $.cookie(this.options.cookieTitle + '_viewed', 'true', { expires: this.options.expiry, path: '/' });
    },

    checkHasBeenDismissed: function() {
      return ($.cookie(this.options.cookieTitle + '_dismissed') == 'true');
    },

    storeDismissedState: function() {
      $.cookie(this.options.cookieTitle + '_dismissed', 'true', { expires: this.options.expiry, path: '/' });
    },

    /**
     * Check the popup type and open the popup
     */
    openPopup: function() {

      var self = this;

      switch(this.options.type) {
        case 'modal':
          this._openAsModal();
          break;
        case 'bar':
          this._openAsBar(this.options.position);
          break;
        default:
      }

      this.storeViewedState();

      $('.newsletter-popup-close').on('click.newsletterModal', function() {
        self.closePopup();
      });

      if (this.el.querySelector('.form-success')) {
        this.storeDismissedState();
      }

    },

    closePopup: function() {

      var self = this;

      switch(this.options.type) {
        case 'modal':
          this._closeModal();
          break;
        case 'bar':
          this._closeBar();
          break;
        default:
      }

      this.storeDismissedState();

      $('.newsletter-popup-close').on('click.newsletterModal', function() {
        self.closePopup();
      });

    },

    _closeBar: function() {
      this.el.remove();
    },

    /**
     * Open the popup as a modal
     */
    _openAsModal: function() {

      var self = this;

      new theme.Modal(this.el, {
        positionX: defaults.positionX,
        positionY: defaults.positionY,
        featherlightOptions: {
          variant: 'newsletter-modal',
          beforeClose: function() {
            self.storeDismissedState();
          },
          otherClose: '.newsletter-popup__close-modal'
        }
      });

    },

    /**
     * Open the popup as a bar at the desired position
     *
     * @param      {string}  position  Currently supports 'top'
     */
    _openAsBar: function(position) {

      var target;

      if (position == 'top') {
        target = document.querySelector(selectors.barTopParent);
        target.insertBefore(this.el, target.firstChild);

        $(this.el).stickybits({
          useFixed: true,
          useStickyClasses: true
        });

        this.el.classList.add('reveal');
      }

    }

  });

  return new NewsletterPopup();

})();

window.theme = window.theme || {};

theme.StickyAddToCart = (function() {

  var selectors = {
    productDetails: '.product__col--details'
  };

  var stickybitsDefaults = {
    useFixed: true
  };

  var defaults = {
    selectors: selectors,
    useStickybits: false,
    stickybits: stickybitsDefaults,
    parent: '#MainContent',
    templateName: 'product-sticky-add-to-cart',
    revealClass: 'show',
    showOnLoad: false
  };

  function StickyAddToCart(options) {

    this.options = _.defaultsDeep(options, defaults);
    this.product = this.options.product;

    if (!this.product) {
      console.error('No product defined');
      return;
    }

    var self = this;

    this._build();
    this._bindReveal();

    this.isHidden = true;
    if (this.options.showOnLoad) {
      this.show();
    }
  }

  StickyAddToCart.prototype = $.extend({}, StickyAddToCart.prototype, {

    _build: function() {
      var self = this;

      var template = theme.utils.getTemplate(this.options.templateName);
      self.$el = $(template);
      $(self.options.parent).prepend(self.$el);

      // Bind StickyBits
      if (self.options.useStickybits) {
        self.$el.stickybits(self.options.stickybits);
      }

      // Bind TinyBind view
      // You can either bind here or in product.js
      // self.view = tinybind.bind(self.$el, { data: self }); 

      return;
    },

    _bindReveal: function() {
      var self = this;

      var waypointElement = $(selectors.productDetails)[0];

      self.waypoint = new Waypoint({
        element: waypointElement,
        handler: function(direction) {
          if (direction == 'down') {
            self.show();
          } else {
            self.hide();
          }
        },
        offset: function() {
          return -this.element.clientHeight + 150;
        }
      });

    },

    show: function() {
      var self = this;
      if (self.isHidden) {
        self.isHidden = false;
        self.$el.addClass(self.options.revealClass);
      }

    },

    hide: function() {
      var self = this;
      if (!self.isHidden) {
        self.isHidden = true;
        self.$el.removeClass(self.options.revealClass);
      }
    },

    destroy: function() {
      var self = this;
      self.$el.remove();
    }

  });

  return StickyAddToCart;
})();
window.theme = window.theme || {};

theme.ResponsiveNavList = (function() {

  var selectors = {
    
  };

  var defaults = {
    breakPoint:       900,
    overflowItemHtml: '<a href="#">More</a>'
  };

  function ResponsiveNavList(el, options) {

    var settings,
        lastDocWidth;

    settings = _.defaults(options, defaults);

    lastDocWidth = $(document).width();

    var $list        = $(el);
    var container    = $list.parent();
    var overflowItem = $('<li class="dropdown hide" style="order:999">' + settings.overflowItemHtml + '<ul class="dropdown-menu"></ul></li>').appendTo($list);
    var overflowList = $(overflowItem).find('ul.dropdown-menu');

    var thisWidth    = $list[0].scrollWidth;
    var maxWidth     = $(container).width();

    $(overflowItem).not(overflowList).on('mouseenter', function() {
      $(this).addClass('active');
    });

    $(overflowItem).not(overflowList).on('mouseleave', function() {
      $(this).removeClass('active');
    });

    function reset() {
      var child = $(overflowList).children();

      //////////

      var count = child.length;
      if (count > 0) {
        for (var i = 0; i < count; i++) {
          $(child[i]).insertBefore($list.children(':last-child'));
        }
      }
      $(overflowItem).addClass('hide');
    }

    function grow() {
      var overflowWidth = $(overflowItem).width();
      var child         = $(overflowList).children();

      //////////

      var count         = child.length;

      if (count > 0) {
        for (var i = 0; i < count; i++) {
          // move the first dropdown item to end of list
          $(child[i]).removeClass('in-dropdown-menu');
          $(child[i]).insertBefore($list.children(':last-child'));
          thisWidth = $list[0].scrollWidth;
          if((i == count - 1 && thisWidth - overflowWidth > maxWidth) || (i != count - 1 && thisWidth > maxWidth)) {
            $(child[i]).prependTo(overflowList);
            break;
          }
        }
      }

      // Hide the overflow item if it has no children
      if($(overflowList).children().length == 0) {
        $(overflowItem).addClass('hide');
      }

      return;
    }

    function shrink() {
      var child = $list.children(':not(:last-child)');

      // Do not hide featured items
      child = $(child).filter(function() {
        return $(this).hasClass('featured') ? false : true;
      });

      var count = child.length;
      if (count < 1) return;

      // show the overflow link in case it's been hidden
      $(overflowItem).removeClass('hide');

      $($(container).parent().parent()).css('overflow', 'hidden');
       maxWidth  = $(container).width();

      for (var i = count - 1; i >= 0; i--) {

        // move the last item to dropdown
        $(child[i]).prependTo(overflowList);
        $(child[i]).addClass('in-dropdown-menu');

        // recalc width
        thisWidth = $list.width();
        if(thisWidth < maxWidth) break;
      }

      $($(container).parent().parent()).css('overflow', 'visible');
    }

    function refresh() {
      thisWidth = $list.width();
      maxWidth  = $(container).width() - ($(container).find('.navbar-header').width() || 0);
      var docWidth  = $(document).width();

      if ($(window).width() < settings.breakPoint) {
        reset();
      } else if (thisWidth > maxWidth) {
        shrink();
      } else if (0 < (docWidth - lastDocWidth)) {
        grow();
      }
      lastDocWidth = docWidth;
    }



    $(window).resize(_.throttle(refresh, 250)).trigger('resize');
  };

  return ResponsiveNavList;

})();

window.theme = window.theme || {};

var originalOnYouTubePlayerAPIReady = _.noop;

if (typeof onYouTubePlayerAPIReady == 'function') {
  originalOnYouTubePlayerAPIReady = onYouTubePlayerAPIReady;
}

window.onYouTubePlayerAPIReady = function() {
  var youTubeService = _.find(theme.videoServiceAPIs, {'name': 'youtube'});
  youTubeService.runOnReadyQueue();
  originalOnYouTubePlayerAPIReady();
};

theme.videoServiceAPIs = (function() {

    function PlayerServiceAPI(data) {
      _.extend(this, data);
      this._isloaded = false;
      this._isloading = false;
      this._onReadyQueue = [];
    }

    PlayerServiceAPI.prototype = _.extend(PlayerServiceAPI.prototype, {

      load: function(callback) {

        var self = this;

        if (this._isloaded || this._checkIsLoaded()) {
          callback();
          return;
        }

        this._onReadyQueue.push(callback);

        if (this._isloading || !this.url) {
          return;
        }

        loadJS(this.url, function() {

          if (self.name == 'vimeo') {
            self.runOnReadyQueue();
          }

        });

      },

      runOnReadyQueue: function() {

        this._isloaded = true;

        while (this._onReadyQueue.length) {
          this._onReadyQueue.shift().call();
        }

      }

    });

    return [

      // YouTube Player
      new PlayerServiceAPI({
        name: 'youtube',
        url: 'https://www.youtube.com/iframe_api',
        newPlayer: function(data) {
          return new YT.Player(data.node.id, {
            videoId: data.videoID,
            playerVars: {
              modestbranding: 1,
              rel: 0,
              iv_load_policy: 3,
              showinfo: 0,
              wmode: 'opaque',
              branding: 0,
              autohide: 0,
            },
            events: {
              'onReady': data.onPlayerReady || _.noop,
              'onStateChange': data.onPlayerStateChange || _.noop,
            }
          });
        },
        _checkIsLoaded: function() {
          return (typeof YT != 'undefined' && YT && YT.loaded);
        },
        isPlaying: function(player, event) {
          return (event.data == YT.PlayerState.PLAYING);
        },
        play: function(player) {
          player.playVideo();
        },
        pause: function(player) {
          player.pauseVideo();
        }
      }),

      // Vimeo player
      new PlayerServiceAPI({
        name: 'vimeo',
        url: 'https://player.vimeo.com/api/player.js',
        newPlayer: function(data) {
          var player = new Vimeo.Player(data.node, {
            id: data.videoID
          });
          player.on('play', function() {
            player._isPlaying = true;
            data.onPlayerStateChange() || _.noop;
          });
          player.on('pause', function() {
            player._isPlaying = false;
            data.onPlayerStateChange() || _.noop;
          });
          player.on('loaded', data.onPlayerReady || _.noop);
          return player;
        },
        isPlaying: function(player, event) {
          return player._isPlaying; // This is a custom attribute not implemented by Vimeo
        },
        _checkIsLoaded: function() {
          return (typeof Vimeo != 'undefined');
        },
        play: function(player) {
          // If multiple Vimeo videos exist on a page this
          // may throw an error. Feel free to ignore this if
          // the correct video is playing.
          player.play();
        },
        pause: function(player) {
          player.pause();
        }
      }),

      // HTML5 player
      new PlayerServiceAPI({
        name: 'html5',
        url: false,
        newPlayer: function(data) {
          var player = data.node;

          player.addEventListener('play', function() {
            data.onPlayerStateChange() || _.noop;
          });

          player.addEventListener('pause', function() {
            data.onPlayerStateChange() || _.noop;
          });

          return player;
        },
        isPlaying: function(player, event) {
          return !player.paused;
        },
        _checkIsLoaded: function() {
          return true;
        },
        play: function(player) {
          player.play();
        },
        pause: function(player) {
          player.pause();
        }
      }),

    ];

})();

theme.Video = (function() {

  var SELECTORS = {
    placeholder: '.video__placeholder'
  };

  function Video(container) {

    this.container = container;
    this.videoID = container.dataset.videoId;
    this.autoPlay = (container.dataset.videoAutoplay == 'true');
    this.placeholder = this.container.querySelector(SELECTORS.placeholder);

    if (this.container.dataset.placeholderOverlay) {
      this.additionalOverlay = document.querySelector(this.container.dataset.placeholderOverlay);
      // this.additionalOverlay.classList.add('video-is-paused');
    }

    var playerServiceName = container.dataset.videoType;

    this._loadPlayerServiceAPI(playerServiceName);
  }

  Video.prototype = _.extend(Video.prototype, {

    _loadPlayerServiceAPI: function(playerServiceName) {

      var self = this;

      var type,
          source;

      this.playerService = _.find(theme.videoServiceAPIs, {'name': playerServiceName});

      if (!this.playerService) {
        console.error(new Error('No service found'));
        return;
      }

      this.playerService.load(this._onServiceLoad.bind(this));

    },

    _onServiceLoad: function() {

      if (this.autoPlay) {

        this._bindWaypoint();

      } else {

        if (this.placeholder) {
          this._bindPlaceholder();
        } else {
           this._createPlayer();
        }
        
      }

    },

    _bindWaypoint: function() {
      var self = this;

        new Waypoint({
          element: this.container,
          offset: '100%',
          handler: function() {
            self._createPlayer(self.play.bind(self));
            this.destroy();
          },
        });

    },

    _bindPlaceholder: function() {

      var self = this;

      this.placeholder.addEventListener('click', function() {
        self._addPlaceholderLoadingState();
        self._createPlayer(self.play.bind(self));
      });

    },

    revealVideo: function() {
      this.container.dataset.videoVisible = true;
      this._removePlaceholderLoadingState();
    },

    _createPlayer: function(onPlayerReady) {

      var videoNode = document.getElementById('video-' + this.videoID);

      this.player = this.playerService.newPlayer({
        node: videoNode,
        videoID: this.videoID,
        onPlayerReady: onPlayerReady || _.noop,
        onPlayerStateChange: this._onStateChange.bind(this),
      });

    },

    _onStateChange: function(event) {

      if (this.playerService.isPlaying(this.player, event)) {

        this.revealVideo();

        if (this.additionalOverlay) {
          this.additionalOverlay.classList.add('video-is-playing');
          this.additionalOverlay.classList.remove('video-is-paused');
        }

      } else {

        if (this.additionalOverlay) {
          this.additionalOverlay.classList.add('video-is-paused');
          this.additionalOverlay.classList.remove('video-is-playing');
        }

      }

    },

    _addPlaceholderLoadingState: function() {
      this.container.classList.add('loading');
    },

    _removePlaceholderLoadingState: function() {
      this.container.classList.remove('loading');
    },

    play: function() {

      try {
        this.playerService.play(this.player);
      } catch(e) {
        console.error(e);
      }
      
    }

  });

  return Video;

})();

var videoContainers = document.getElementsByClassName('video');

theme.videos = [];

_.each(videoContainers, function(videoContainer) {
  var video = new theme.Video(videoContainer);
  theme.videos.push(video);
});
window.theme = window.theme || {};

theme.MiniCart = (function() {
  var selectors = {

  };

  var settings = {

  };

  var options = {

  };

  var cache = {
    toasts: []
  };

  function MiniCart() {

  }

  MiniCart.prototype = _.extend({}, MiniCart.prototype, {

    show: function(lineItem) {

     iziToast.success({
        animateInside: false,
        backgroundColor: 'var(--color-body)',
        close: false,
        displayMode: 'replace',
        id: null,
        message: theme.strings.itemAddedToCart,
        position: 'topRight',
        progressBarColor: 'var(--color-primary)',
        theme: 'mini-cart',
        timeout: 5000,
        title: lineItem.product_title,
        transitionIn: 'fadeInLeft',
        buttons: [
          [
            '<button class="btn btn--secondary">My bag <span rv-html="cart.total_price | money | prepend \' - \'"></span></button>',
            function (instance, toast) {
              // window.location.href = '/cart';
              theme.CartDrawer.open();
            },
            false
          ]
        ],
        onOpening: function(instance, toast) {
          tinybind.bind(toast, {
            cart: CartJS.cart
          });
        }
      });

    },

    close: function(options) {

      var toasts = document.querySelectorAll('.iziToast-theme-mini-cart');
      var transitionOut = 'fadeOutLeft';

      if (options && options.direction == 'right') {
        transitionOut = 'fadeOutRight';
      }

      var i = toasts.length;

      while(i--) {
        iziToast.hide({
          transitionOut: transitionOut
        }, toasts[i]);
      }

    }

  });

  return new MiniCart();
})();


// <button class="btn btn--secondary">My bag <span>- ' + Currency.formatMoney(CartJS.cart.total_price) + '</span></button>

theme.MobileNavDrawer = (function() {

  var selectors = {
    mobileNavDrawer: '.mobile-nav-drawer',
    accountMobileNavButton: '.js-drawer-open-account',
    mobileNavInner: '.mobile-nav__inner',
    drawerOpenTrigger: '.mobile-nav--open'
  };

  var headerHeight = theme.header ? theme.header.el.offsetHeight : 50;

  function List(handle, depth, listEl) {
    this.handle = handle;
    this.depth = parseInt(depth);
    this.listEl = listEl;

    listEl.style.display = 'block';
    this.height = height = listEl.offsetHeight + headerHeight + 'px';
    listEl.style.display = '';
  }

  function MobileNavDrawer() {

    this.el = document.querySelector(selectors.mobileNavDrawer);
    this.inner = document.querySelector(selectors.mobileNavInner);

    this.drawerId = 'MobileNavDrawer';

    if (!this.el) {
      return;
    }

    this.data = {
      depth: 0,
      activeLists: [],
      active: null,
      previous: null,
    };

    this.lists = [];

    this.methods = {
      goToList: this._handleGoToList.bind(this)
    };

    this._createDrawer();
    this._bindView();

  }

  MobileNavDrawer.prototype = _.extend(MobileNavDrawer.prototype, {

    _cacheList: function(handle) {

      var listEl, depth, height, list;

      listEl = this.el.querySelector('[data-list-handle="' + handle + '"]');

      if (!listEl) {
        console.error('Not found');
        return;
      }

      depth = listEl.dataset.depth;
      list = new List(handle, depth, listEl);
      this.lists.push(list);

      return list;
    },

    _getTarget: function() {
      return event.currentTarget.dataset.target ? event.currentTarget.dataset.target : this.data.previous.handle;
    },

    _getList: function(handle) {
      var targetList;

      for (var i = this.lists.length - 1; i >= 0; i--) {
        if (this.lists[i].handle == handle) {
          targetList = this.lists[i];
          break;
        }
      }

      if (!targetList) {
        targetList = this._cacheList(handle);
      }

      return targetList;
    },

    _handleGoToList: function() {
      var target = this._getTarget();
      this.transitionTo(target);
    },

    transitionTo: function(handle) {

      var targetList = this._getList(handle),
          self = this;

      if (targetList) {
        event.preventDefault();

        var validateDepth = this.data.depth + 1;
        if (validateDepth != targetList.depth) {
          var elem = targetList.listEl.parentNode,
              parentListEls = [],
              parentList;

          for ( ; elem && elem !== this.inner; elem = elem.parentNode ) {
            if (elem.dataset.depth && parseInt(elem.dataset.depth) > 0) {
              parentListEls.push(elem);
            }
          }

          for (var i = parentListEls.length - 1; i >= 0; i--) {
            parentList = this._getList(parentListEls[i].dataset.listHandle);
            this._setActiveList(parentList);
            // this._setDepth(parentListEls[i].dataset.depth);
          }

        }

        // if (this.data.active) {
        //   this.data.active.listEl.style.top = this.el.scrollTop * -1 + 'px';
        // }
        // 
        // this.el.classList.add('is-transitioning');

        this._setActiveList(targetList);

        this.el.scrollTop = 0;
        // targetList.listEl.style.top = 0;

        this._setDepth(targetList.depth);
        this._setScrollElementHeight(targetList.height);

        // setTimeout(function() {
        //   self.el.classList.remove('is-transitioning');
        // }, 750);
        
      } else {
        // The element has no target list but might have a href, so let's follow that link
      }

    },

    /**
     * Force the height of the wrapper to prevent scrolling when not required
     *
     * @param      {String}  height  The desired height
     */
    _setScrollElementHeight: function(height) {

      if (!this.inner) {
        return;
      }

      if (this.data.depth == 0) {
        var mobileNavLists = document.querySelectorAll('.site-nav--mobile-nav');
        var i = mobileNavLists.length;
        height = 0;
        while(i--) {
          height += mobileNavLists[i].offsetHeight;
        }
        height = height + headerHeight + 'px';
      }

      this.inner.style.height = height;
    },

    _setActiveList: function(list) {
      var depth;

      depth = list.depth;

      for (var i = this.data.activeLists.length - 1; i >= 0; i--) {
        if (this.data.activeLists[i].depth == depth) {
          this.data.activeLists.splice(i, 1);
        }
      }

      this.data.previous = this.data.active;
      this.data.active = list;
      this.data.activeLists.push(list);
    },

    _setDepth: function(depth) {
      this.data.depth = depth;
    },

    /**
     * Init the draw object
     *
     * @return     {object}  the drawer
     */
    _createDrawer: function() {

      var self = this;

      this.drawer = new theme.Drawers(this.drawerId, 'left', {
        beforeDrawerOpen: function(drawer) {

          self._setDepth(0);

          theme.header.hideLowerHeader(true);
          theme.MiniCart.close({
            direction: 'right'
          });

          var drawerProperties = drawer.getProperties();
          var el = drawer.$drawer.get(0);
          el.scrollTop = 0;
          el.style.top = drawerProperties.top;
          el.style.height = drawerProperties.height;
          // theme.utils.forceRedraw(el);
        },
        onDrawerClose: function() {

          theme.header.hideLowerHeader(false);
          self._setDepth(0);

        }
      });

      var drawerOpenTrigger = document.querySelector(selectors.drawerOpenTrigger);
      drawerOpenTrigger.addEventListener('click', function() {
        theme.drawers[self.drawerId].open(event);
      });

    },

    /**
     * Bind the view
     *
     * @return     {object}  the bound TinyBind view
     */
    _bindView: function() {

      return tinybind.bind(this.el, {
        data: this.data,
        methods: this.methods
      });

    },

    /**
     * Open the drawer
     */
    open: function() {
      this.drawer.open();
    },

    /**
     * Close the drawer
     */
    close: function() {
      this.drawer.close();
    }

  });

  return new MobileNavDrawer();

})();

(function() {
  if ($('#thank-popup').length) {
    console.log('popup');
    new theme.Modal($('#thank-popup'), {
      positionX: 50,
      positionY: 50,
      featherlightOptions: {
        variant: 'thank-modal',
      }
    });
  }
})();

(function() {
  var selectors = {
    showButton: '.js-show-testimonials',
    closestDesktop: '.testimonials-desktop',
    elemToHide: '.testimonial-to-hide',
    slider: '#Slideshow-testimonials'
  };

  var classes = {
    visible: 'show',
    toHide: 'less',
  };

  $(selectors.showButton).on('click', function() {
    if ($(this).hasClass(classes.toHide)) {
      $(this).removeClass(classes.toHide);
      $(selectors.elemToHide).removeClass(classes.visible);
      $([document.documentElement, document.body]).animate({
        scrollTop: $(selectors.showButton).closest(selectors.closestDesktop).offset().top - 150
      }, 200);
    } else {
      $(this).addClass(classes.toHide);
      $(selectors.elemToHide).addClass(classes.visible);
    }
  })

  if ($('.testimonials-mobile').length) {
    theme.slideshows[selectors.slider] = new theme.Slideshow(selectors.slider);
  }

  $('.testimonials-mobile').each(function() {
    function equalizeHeights() {
      var $this = $(this);
      var $track = $this.find('.slick-track');
      var $slides = $track.find('.testimonial');

      // layout thrashing here, can't help it since we need to remove
      // min-height to have the layout recalculate the auto height of the
      // slick track
      $slides.css('min-height', '');
      var minSlideHeight = $track.height();
      $slides.css('min-height', minSlideHeight);
    }

    var equalizeSlideHeights = throttle(equalizeHeights.bind(this), 250, true);
    $(window).on('DOMContentLoaded load resize', equalizeSlideHeights);
  });

  function throttle(fn, frequency) {
    frequency = frequency || 100;
    var timeout = false;

    return function() {
      if (timeout) {
        return;
      }

      timeout = setTimeout(function() {
        timeout = false;
      }, frequency);

      fn.apply(this, arguments);
    };
  }
  
})();

(function() {
  var selectors = {
    showButton: '.js-show-faq',
    elemToHide: '.faq-to-hide'
  };

  var classes = {
    visible: 'show',
    toHide: 'less',
  };

  $(selectors.showButton).on('click', function() {
    if ($(this).hasClass(classes.toHide)) {
      $(this).removeClass(classes.toHide);
      $(selectors.elemToHide).removeClass(classes.visible);
    } else {
      $(this).addClass(classes.toHide);
      $(selectors.elemToHide).addClass(classes.visible);
    }
  })
  
})();

window.theme = window.theme || {};

theme.ProductFilterAndSearch = (function() {

  var selectors = {
    topSorting: '.top-sorting-container .bc-sf-filter-filter-dropdown',
    bcsfProducts: '#bc-sf-filter-products',
    subcollectionsContainer: '#subcollection-container',
    subcollectionBar: '.subcollection-bar',
    subcollection: '.subcollection-bar__subcollection',
    subcollectionsPlaceholder: '#subcollection-container',
    productCount: '#bc-sf-filter-total-product'
    
  };

  var options = {
    sortingButton: 'type'
  };

  var state = {
    areSubcollectionsShown: false,
    currentCollection: null,
    lastSorting: "best-selling",
    tags: [],
    subcollections: [],
    totalProductsCount: 0,
    handles: []
  };

  var subCal = false;



  function init() {
    $(selectors.topSorting).on('change', buildCollectionpage);
  }

  function onFilterSelected() {
    if (location.href.includes('_=pf') == false && $(selectors.subcollectionsContainer).length) {
      showSubcollectionsView();
      loadSubcollectionView();
    } else {
      if(state.areSubcollectionsShown) {
        $(selectors.topSorting).val(state.lastSorting);
        hideSubcollectionsView();
      }
    }
  }

  function loadSubcollectionView() {
    if ($('.subcollection-bar__subcollection').length > $('.subcollection__container').length && subCal == false) {
      subCal = true;
      var collection = bcSfFilterConfig.general.collection_handle;
      getHandles();
      fetchProducts();
      state.currentCollection = collection;
    }
  }
  
  function buildCollectionpage() {
    var sorting = $( event.target ).val();

    
    if(sorting == options.sortingButton && !state.areSubcollectionsShown) {
      var collection = bcSfFilterConfig.general.collection_handle;
      // var newUrl = theme.utils.updateQueryStringParameter('sort', theme.utils.getQueryParams()['sort'], window.location.href.split('?')[0]);
      // bcsffilter.onChangeData(newUrl, "clearAllFilterOptions");
      // bcsffilter.onChangeData(window.location.href.split('?')[0], "clearAllFilterOptions")
      if(collection != state.currentCollection) {
        loadSubcollectionView()
      } else {
        showSubcollectionsView()
      }
    } else if(sorting != options.sortingButton && state.areSubcollectionsShown) {
      hideSubcollectionsView()
    } else {
      state.lastSorting = sorting;
    }
  }

  function showSubcollectionsView() {
    $(selectors.bcsfProducts).hide();
    $(selectors.subcollectionBar).removeClass('hidden');
    state.areSubcollectionsShown = true;
    $(selectors.subcollectionsContainer).show();
  }

  function hideSubcollectionsView() {
    $(selectors.bcsfProducts).show();
    $(selectors.subcollectionBar).addClass('hidden');
    state.areSubcollectionsShown = false;
    $(selectors.subcollectionsContainer).hide();
  }

  function createDOMElement() {
    var template = theme.utils.getTemplate('product-grid-item');
    var templateEl = theme.utils.createElementFromHTML(template);

    var allSubcollectionsContainer = $("<div></div>");

    for (var i = 0; i < state.handles.length; i++) {
      var subcollection = _.find(state.subcollections, function(s) { return s.handle == state.handles[i] ; });

      var subcollectionContainer = $("<div></div>").addClass("subcollection__container").attr('id', theme.utils.handleize(subcollection.title));
      var subcollectionContainerHeader = $("<div></div>").addClass("subcollection__container--header");
      var heading = $("<h4></h4>").text(subcollection.title);
      var headingDesc = $("<span></span>").text(subcollection.description);

      var gridItemsContainer = $("<div></div>").addClass("row");

      var numberOfProductsInCollection = subcollection.products.length;

      for (var  j = 0; j < numberOfProductsInCollection; j++) {
        tinybind.bind(templateEl, {
          product: subcollection.products[j]
        }, {
          prefix: 'product-grid-item-view'
        })

        gridItemsContainer.append($("<div></div>").addClass("product-grid-element-container col-xs-12 col-md-6 col-lg-4").append(templateEl))
        templateEl = theme.utils.createElementFromHTML(template);
      }


      var wideBanner = getSubcollectionsWideBanner(subcollection.handle)
      gridItemsContainer.append(wideBanner)

      var smallBanner = getSubcollectionsSmallBanner(subcollection.handle)
      gridItemsContainer.append(smallBanner)

      heading.append(headingDesc);
      subcollectionContainerHeader.append(heading);
      // subcollectionContainerHeader.append(headingDesc);
      subcollectionContainer.append(subcollectionContainerHeader);
      subcollectionContainer.append(gridItemsContainer);

      // allSubcollectionsContainer.append(subcollectionContainer);
      $(selectors.subcollectionsPlaceholder).append(subcollectionContainer)
    }

    // $(selectors.subcollectionsPlaceholder).append(allSubcollectionsContainer)
    theme.wishlist.update();
  }

  function fetchProducts() {
    var numberOfCollectionsToLoad = state.handles.length;
    for (let i = 0; i <  state.handles.length; i++) {
      $.get('/collections/' + state.handles[i] + '?view=json', function(data) {
          var subcollection = {}
          subcollection.title = getSubcollectionsTitle(state.handles[i]);
          subcollection.description = getSubcollectionsDescription(state.handles[i]);
          subcollection.products = jQuery.parseJSON(data);
          subcollection.handle = state.handles[i];

          state.subcollections.push(subcollection);
          state.totalProductsCount += subcollection.products.length;

          numberOfCollectionsToLoad -= 1;
          if(numberOfCollectionsToLoad <= 0) {
            createDOMElement()
            setProductCount(state.totalProductsCount)


          }

      })
    }
    if (location.href.includes('_=pf') == false && $(selectors.subcollectionsContainer).length) {
      showSubcollectionsView();
    } else {
      hideSubcollectionsView();
    }
  }

  function setProductCount(count) {
    $(selectors.productCount).text(count + ' Results')
  }

  function getSubcollectionsWideBanner(handle) {
    return $(selectors.subcollection + '[data-handle=' + handle + '] > .product-banner-container--wide');
  }

  function getSubcollectionsSmallBanner(handle) {
    return $(selectors.subcollection + '[data-handle=' + handle + '] > .product-banner-container--small');
  }

  function getSubcollectionsTitle(handle) {
    return $(selectors.subcollection + '[data-handle=' + handle + '] > a').text();
  }

  function getSubcollectionsDescription(handle) {
    return $(selectors.subcollection + '[data-handle=' + handle + ']').attr('data-description');
  }


  function getHandles() {
    const handles  = $(selectors.subcollection).map(function() {
        return $(this).data('handle');
    }).get();
    state.handles = handles;
  }


  return {
    init: init,
    buildCollectionpage: buildCollectionpage,
    onFilterSelected: onFilterSelected,
    state: state,
    loadSubcollectionView: loadSubcollectionView
  };

})();

theme.ProductFilterAndSearch.init();
(function() {
  var selectors = {
    container: '.product-feature-wrap',
    closestDesktop: '.product-feature-wrap',
    showButton: '.js-show-fetures',
    elemToHideMobile: '.to-hide-mobile',
    elemToHide: '.to-hide'
  };

  var classes = {
    visible: 'show',
    toHide: 'less',
  };

  var mobile = false;

  $(selectors.showButton).on('click', function() {
    if ($(window).width() > 599) {
      mobile = false;
    } else {
      mobile = true;
    }

    if ($(this).hasClass(classes.toHide)) {
      $([document.documentElement, document.body]).animate({
        scrollTop: $(selectors.showButton).closest(selectors.closestDesktop).offset().top - 150
      }, 200);
      $(this).removeClass(classes.toHide);
      if (mobile) {
        $(selectors.elemToHideMobile).removeClass(classes.visible);
      } else {
        $(selectors.elemToHide).removeClass(classes.visible);
      }
      $(selectors.container).removeClass(classes.visible);
    } else {
      $(this).addClass(classes.toHide);
      if (mobile) {
        $(selectors.elemToHideMobile).addClass(classes.visible);
      } else {
        $(selectors.elemToHide).addClass(classes.visible);
      }
      $(selectors.container).addClass(classes.visible);
    }
  })
  
})();

(function() {
  var unittypeselect = new Array();
  unittypeselect["Round6"] = 2.54;
  unittypeselect["Round8"] = 1;

  var ageselection = new Array();
  ageselection["one"] = 330;
  ageselection["year"] = 301;
  ageselection["wean"] = 280;

  function getunittype() {
      var selectionunittype = 0;
      var theForm = document.forms["weight"];
      var metimp = theForm.elements["metimp"];
      for (var i = 0; i < metimp.length; i++) {
          if (metimp[i].checked) {
              selectionunittype = unittypeselect[metimp[i].value];
              break;
          }
      }
      return selectionunittype;
  }

  function getHorseAge() {
      var horseageselection = 0;
      var theForm = document.forms["weight"];
      var selectedFilling = theForm.elements["age"];
      horseageselection = ageselection[selectedFilling.value];
      return horseageselection;
  }

  function getheartgirth() {
      retgirth = document.weight.girth.value
      if (retgirth-0 < 1 || isNaN(retgirth) == true) {
        document.weight.girth.classList.add('error');
      } else {
        document.weight.girth.classList.remove('error');
      }

      if (getunittype() > 1) {
          retgirth2 = retgirth / 2.54
          retgirth = retgirth2
      }
      return retgirth;
  }

  function getbodylength() {
      length = document.weight.bodylength.value
      if (length-0 < 1 || isNaN(length) == true) {
        document.weight.bodylength.classList.add('error');
      } else {
        document.weight.bodylength.classList.remove('error');
      }

      if (getunittype() > 1) {
          length2 = length / 2.54
          length = length2
      }
      return length;
  }



  function calculateTotal() {
      if (getunittype() > 1) {
          unitmeasure = " KG"
          correctunit = 2.2
      } else {
          unitmeasure = " LBS"
          correctunit = 1
      }
      var totalweight = getheartgirth() * getheartgirth() * getbodylength() / getHorseAge();
      var news = totalweight / correctunit
      var news2 = Math.round(news * 100) / 100
      var divobj = document.getElementById('totalPrice');
      divobj.style.display = 'block';
      divobj.innerHTML = "" + news2 + unitmeasure;
      if (totalweight > 0) {
        document.getElementById('calculator').classList.add('hide');
        document.getElementById('calculatorResult').classList.add('show');
      }
  }



  function hideTotal() {
      var divobj = document.getElementById('totalPrice');
      divobj.style.display = 'none';
  }

  var getResult = document.getElementById('show-result');
  if (getResult) {
    getResult.onclick = function() {
      calculateTotal();
    };
  }
  
  var oneMore = document.getElementById('calculateOneMore');
  if (oneMore) {
    oneMore.onclick = function() {
      document.getElementById('calculator').classList.remove('hide');
      document.getElementById('calculatorResult').classList.remove('show');
    };
  }
})();

(function() {
  var selectors = {
    subButton: '#js-subcollection',
    bcSfButton: '#bc-sf-filter-tree-mobile',
    subFilter: '.subcollection-bar__subcollections',
    bcSf: '#bc-sf-filter-tree',
  };

  var classes = {
    visible: 'show',
    noVisible: 'hide',
  };

  $subButton = $(selectors.subButton);
  $bcSfButton = $(selectors.bcSfButton);

  if (!$subButton.length) {
    return;
  }


  $subButton.on('click', function(evt){
    evt.preventDefault();
    $(selectors.subFilter).toggle('medium');
    $(selectors.bcSf).hide();
  });
  $bcSfButton.on('click', function(evt){
    evt.preventDefault();
    $(selectors.subFilter).hide();
  });
})();

/*================ Sections ================*/
window.theme = window.theme || {};

theme.Cart = (function() {
  var selectors = {
    edit: '.js-edit-toggle'
  };
  var config = {
    showClass: 'cart__update--show',
    showEditClass: 'cart__edit--active',
    cartNoCookies: 'cart--no-cookies'
  };

  function Cart(container) {
    this.$container = $(container);
    this.$edit = $(selectors.edit, this.$container);

    if (!this.cookiesEnabled()) {
      this.$container.addClass(config.cartNoCookies);
    }

    if (Shopify.designMode) {
      CartJS.init(window.shop.cart);
    }
    
    this.$edit.on('click', this._onEditClick.bind(this));
  }

  Cart.prototype = _.assignIn({}, Cart.prototype, {
    onUnload: function() {
      this.$edit.off('click', this._onEditClick);
    },

    _onEditClick: function(evt) {
      var $evtTarget = $(evt.target);
      var $updateLine = $('.' + $evtTarget.data('target'));

      $evtTarget.toggleClass(config.showEditClass);
      $updateLine.toggleClass(config.showClass);
    },

    cookiesEnabled: function() {
      var cookieEnabled = navigator.cookieEnabled;

      if (!cookieEnabled){
        document.cookie = 'testcookie';
        cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
      }
      return cookieEnabled;
    }
  });

  return Cart;
})();

theme.CartUpsell = theme.CartUpsell || {};

theme.CartUpsell = (function() {
    function CartUpsell(container) {
        var $container = this.$container = $(container);
        var sectionId = $container.attr('data-section-id');
        var slideshow = this.slideshow = '#Slideshow-' + sectionId;
        theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
    }

    return CartUpsell;
})();

theme.CartUpsell.prototype = _.assignIn({}, theme.CartUpsell.prototype, {
    onUnload: function() {
        delete theme.slideshows[this.slideshow];
    },

    onBlockSelect: function(evt) {
        var $slideshow = $(this.slideshow);

        // Ignore the cloned version
        var $slide = $('.slideshow__slide--' + evt.detail.blockId + ':not(.slick-cloned)');
        var slideIndex = $slide.data('slick-index');

        // Go to selected slide, pause autoplay
        $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
    },

    onBlockDeselect: function() {
        // Resume autoplay
        $(this.slideshow).slick('slickPlay');
    }
});

window.theme = window.theme || {};

theme.Filters = (function() {
  var constants = {
    SORT_BY: 'sort_by'
  };
  var selectors = {
    filterSelection: '.collection-filters__dropdown--filter',
    sortSelection: '.collection-filters__dropdown--sort',
    defaultSort: '.collection-filters__default-sort',
    filterPlaceholderDesktop: '.collection-filters-placeholder--desktop',
    filterPlaceholderMobile: '.collection-filters-placeholder--mobile',
    filterContentDesktop: '.collection-filters-content--desktop',
    filterContentMobile: '.collection-filters-content--mobile',
    filterSection: '[data-section-type="collection-filters"]',
    filterSectionWrapper: '#shopify-section-collection-filters',
  };

  function Filters(container) {
    var $container = this.$container = $(container);

    this.initFilters();
    
    this.$filterSelects = $(selectors.filterSelection, $container);
    this.$sortSelect = $(selectors.sortSelection, $container);
    this.$selects = $(selectors.filterSelection, $container).add($(selectors.sortSelection, $container));

    this.defaultSort = this._getDefaultSortValue();
    this._resizeSelect(this.$selects);
    this.$selects.removeClass('hidden');

    this.$filterSelects.on('change', this._onFilterChange.bind(this));
    this.$sortSelect.on('change', this._onSortChange.bind(this));
  }

  Filters.prototype = _.assignIn({}, Filters.prototype, {

    /**
     * Initialises filters
     */
    initFilters: function() {
      var self = this;
      var $filterSectionWrapper = $(selectors.filterSectionWrapper);

      var $filterContentMobile = $(selectors.filterContentMobile, $filterSectionWrapper).html();
      var $filterContentDesktop = $(selectors.filterContentDesktop, $filterSectionWrapper).html();

      $(selectors.filterPlaceholderMobile, this.$container).replaceWith($filterContentMobile);
      $(selectors.filterPlaceholderDesktop, this.$container).replaceWith($filterContentDesktop);
    },

    _onSortChange: function(evt) {
      var sort = this._sortValue();
      if (sort.length) {
        window.location.search = sort;
      } else {
        // clean up our url if the sort value is blank for default
        window.location.href = window.location.href.replace(window.location.search, '');
      }
      this._resizeSelect($(evt.target));
    },

    _onFilterChange: function(evt) {
      // window.location.href = $(evt.target).val() + window.location.search;
      var newLocation = $(evt.target).val();
      if (window.location.search != '') {
        var currentQueryParams = theme.utils.getQueryParams();
        for (var k in currentQueryParams) {
          if (currentQueryParams.hasOwnProperty(k)) {
            newLocation = theme.utils.updateQueryStringParameter(k, currentQueryParams[k], newLocation);
          }
        }
        var newQueryParams = theme.utils.getQueryParams(newLocation);
        for (var k in newQueryParams) {
          if (newQueryParams.hasOwnProperty(k)) {
            newLocation = theme.utils.updateQueryStringParameter(k, newQueryParams[k], newLocation);
          }
        }
        window.location.href = newLocation;
      }
      this._resizeSelect($(evt.target));
    },

    _getSortValue: function() {
      return this.$sortSelect.val() || this.defaultSort;
    },

    _getDefaultSortValue: function() {
      return $(selectors.defaultSort, this.$container).val();
    },

    _sortValue: function() {
      var sort = this._getSortValue();
      var query = '';

      if (sort !== this.defaultSort) {
        query = constants.SORT_BY + '=' + sort;
      }

      return query;
    },

    _resizeSelect: function($selection) {
      $selection.each(function() {
        var $this = $(this);
        var arrowWidth = 10;
        // create test element
        var text = $this.find('option:selected').text();
        var $test = $('<span>').html(text);

        // add to body, get width, and get out
        $test.appendTo('body');
        var width = $test.width();
        $test.remove();

        // set select width
        $this.width(width + 5 + arrowWidth);
      });
    },

    onUnload: function() {
      this.$filterSelects.off('change', this._onFilterChange);
      this.$sortSelect.off('change', this._onSortChange);
    }
  });

  return Filters;
})();

theme.HeaderSection = (function() {

  var settings = {
    stickyHeader: false
  };

  function Header(container) {
    var $container,
        stickyHeaderEl;

    theme.header = new theme.Header(container);

    if (($('body').hasClass('template-collection') & $('.page__header-image').length > 0) || $('body').hasClass('template-index')) {
      $('body').addClass('transparent-header');
    }

    var $noticeBar = $('.site-header__notice-bar');
    var $header = $('.header');
    $(window).scroll(function(){
      if (!$('html').hasClass('scroll-locked')) {
        if ($(window).scrollTop() >= $noticeBar.height()) {
          $('.site-header').css('padding-bottom', $header.height() + 'px');
          $('body').addClass('sticky-header');
        } else {
          $('body').removeClass('sticky-header');
          $('.site-header').css('padding-bottom', 0);
        }
      }
    });

    $(window).trigger('scroll');

    $container = $(container);
    if (settings.stickyHeader) {
      stickyHeaderEl = $container.parent().get(0);
      stickyHeaderEl.classList.add('sticky');
      theme.stickyHeader = new StickyState(stickyHeaderEl, {
          scrollClass: {
            down: 'sticky--down',
            up: 'sticky--up',
            none: 'sticky--none',
            persist: true
          }
      });
    }
  }

  Header.prototype = _.assignIn({}, Header.prototype, {
    onUnload: function() {
      theme.Header.unload();
    },
  });

  return Header;
})();

theme.FooterSection = (function() {

  function Footer(container) {
    var $container;
    $container = $(container);

    var $form = $container.find('.newsletter-section .contact-form');
    $form.submit(function () {
      var $email = $form.find('[type="email"]');
      $form.find('.errors').remove();
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!re.test($email.val())) {
        $form.prepend(`<div class="errors"><ul><li>${window.theme.strings.invalidEmail}</li></ul></div>`);
        return false;
      }
    });
  }

  return Footer;
})();

theme.Maps = (function() {
  var config = {
    zoom: 14
  };
  var apiStatus = null;
  var mapsToLoad = [];
  var key = theme.mapKey ? theme.mapKey : '';

  function Map(container) {
    this.$container = $(container);

    if (apiStatus === 'loaded') {
      this.createMap();
    } else {
      mapsToLoad.push(this);

      if (apiStatus !== 'loading') {
        apiStatus = 'loading';
        if (typeof window.google === 'undefined') {
          $.getScript('https://maps.googleapis.com/maps/api/js?key=' + key)
            .then(function() {
              apiStatus = 'loaded';
              initAllMaps();
            });
        }
      }
    }
  }

  function initAllMaps() {
    // API has loaded, load all Map instances in queue
    $.each(mapsToLoad, function(index, instance) {
      instance.createMap();
    });
  }

  function geolocate($map) {
    var deferred = $.Deferred();
    var geocoder = new google.maps.Geocoder();
    var address = $map.data('address-setting');

    geocoder.geocode({address: address}, function(results, status) {
      if (status !== google.maps.GeocoderStatus.OK) {
        deferred.reject(status);
      }

      deferred.resolve(results);
    });

    return deferred;
  }

  Map.prototype = _.assignIn({}, Map.prototype, {
    createMap: function() {
      var $map = this.$container.find('.map-section__container');

      return geolocate($map)
        .then(function(results) {
          var mapOptions = {
            zoom: config.zoom,
            center: results[0].geometry.location,
            disableDefaultUI: true
          };

          var map = this.map = new google.maps.Map($map[0], mapOptions);
          var center = this.center = map.getCenter();

          //eslint-disable-next-line no-unused-vars
          var marker = new google.maps.Marker({
            map: map,
            position: map.getCenter()
          });

          google.maps.event.addDomListener(window, 'resize', _.debounce(function() {
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
          }, 250));
        }.bind(this))
        .fail(function() {
          var errorMessage;

          switch (status) {
            case 'ZERO_RESULTS':
              errorMessage = theme.strings.addressNoResults;
              break;
            case 'OVER_QUERY_LIMIT':
              errorMessage = theme.strings.addressQueryLimit;
              break;
            default:
              errorMessage = theme.strings.addressError;
              break;
          }

          $map
            .parent()
            .addClass('page-width map-section--load-error')
            .html('<div class="errors text-center">' + errorMessage + '</div>');
        });
    },

    onUnload: function() {
      google.maps.event.clearListeners(this.map, 'resize');
    }
  });

  return Map;
})();

// Global function called by Google on auth errors.
// Show an auto error message on all map instances.
// eslint-disable-next-line camelcase, no-unused-vars
function gm_authFailure() {
  $('.map-section').addClass('map-section--load-error');
  $('.map-section__container').remove();
  $('.map-section__link').remove();
  $('.map-section__overlay').after('<div class="errors text-center">' + theme.strings.authError + '</div>');
}

/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

theme.ProductPage = (function() {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productJson: '[data-product-json-main]',
    productSku: '[data-product-variant-sku]',
    productPrice: '[data-product-price]',
    productImageWrap: '[data-product-images-wrap]',
    productImageContainer: '[data-product-images]',
    productImages: '[data-product-image]',
    productActiveImage: '[data-product-active-image]',
    productThumbContainer: '[data-product-thumbnails]',
    productThumbs: '[data-product-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]',
    singleOptionValue: '[data-single-option-value]',
    productQtyWrapper: '.product-form__item--quantity',
    optionSelector: '[data-option-selector]',
    quantitySelector: '#Quantity',
    productColoursData: 'script#product-colour-data',
    variantAvailableForm: '[data-available-form]',
    variantUnavailableForm: '[data-unavailable-form]',
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function ProductPage(container) {
    this.$container = $(container);
    this.$qtySelector = $(selectors.productQtySelector);
    var sectionId = this.$container.attr('data-section-id');

    this.settings = {
      // Breakpoints from src/styles/settings/variables.scss.liquid // $grid-breakpoints
      mediaQuerySmall: theme.settings.mediaQuery.small,
      mediaQueryMediumUp: theme.settings.mediaQuery.mediumUp,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      sectionId: sectionId,
      sliderActive: false,
      bpSmall: false,
      zoomEnabled: false,
      qtySelectorType: $(selectors.productQtySelector).is('select') ? 'select' : 'input'
    };
    this.namespace = '.product';

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html() && !theme.current.product) {
      return;
    }

    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);
    this.productSingleObject = theme.current.product;
    this.settings.imageSize = this.$featuredImage.length ? slate.Image.imageSize(this.$featuredImage.attr('src')) : 0;
    this.settings.zoomEnabled = $(selectors.productFeaturedImage).hasClass('js-zoom-enabled');

    // slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);

    // this.initBreakpoints();
    this.initImageSlider();
    this.initGallery();
    this.initVariants();
    // this.initQuantitySelectors();

    // build colour options if each colour is a seperate product
    this._buildColourOptions();

    var readMoreLink = '<button aria-hidden="true" focusable="false" role="presentation" class="read-more">Read more <svg class="icon icon-fa-caret-down" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19L403 749q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z"/></svg></button>';
    var productDescriptionReadMoreHeight = 200;

    // Only enable readmore if there's a decent amount of text to hide
    if ($('.product__description').innerHeight() >= (productDescriptionReadMoreHeight * 1.175)) {
      $('.product__description').readmore({
        speed: 75,
        collapsedHeight: productDescriptionReadMoreHeight,
        heightMargin: 20,
        moreLink: readMoreLink,
        lessLink: false,
        beforeToggle: function(trigger, element, expanded) {
          $(element).toggleClass('readmore-expanded');
        }
      });
    }
  }

  ProductPage.prototype = $.extend({}, ProductPage.prototype, {

    /**
     * Uses enquire.js to handle breakpoint related actions
     */
    // initBreakpoints: function() {
      // var self = this;

      // enquire.register(this.settings.mediaQuerySmall, {
      //   match: function() {
      //     self.settings.bpSmall = true;
      //   },
      //   unmatch: function() {
      //       self.settings.bpSmall = false;
      //   }
      // });

      // enquire.register(this.settings.mediaQueryMediumUp, {
      //   match: function() {
          
      //   }
      // });
    // },

    initQuantitySelectors: function() {

      var elem = document.querySelector(selectors.quantitySelector);

      if (!elem) { 
        return;
      }

      var quantitySelector = new theme.QuantitySelector(elem);

    },

    /**
     * Creates linked sliders for product main and thumb images
     */
    initImageSlider: function() {
      var thumbOptions = {
        slidesToShow: 5,
        swipeToSlide: true,
        infinite: true,
        asNavFor: selectors.productImageContainer,
        focusOnSelect: true,
        rows: 0,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 5
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 5
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 4
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 3
            }
          }
        ]
      };

      var mainOptions = {
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: true,
        arrows: true,
        dots: true,
        infinite: true,
        focusOnSelect: true,
        fade: true,
        adaptiveHeight: true,
        lazyLoad: 'progressive',
        rows: 0,
        prevArrow: selectors.productImageContainer + ' ~ .product__images__prev',
        nextArrow: selectors.productImageContainer + ' ~ .product__images__next',
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: true,
              fade: false,
              dots: true,
            }
          }
        ]
      };

      $activeProductImage = $(selectors.productActiveImage).first();
      if ($activeProductImage.length > 0) {
        var firstSlide = $activeProductImage.index() || 0;
        mainOptions.initialSlide = firstSlide;
      }
        
      if ($(selectors.productImageWrap, this.$container).is('[data-vertical]')) {
        thumbOptions = $.extend({}, thumbOptions, {
          vertical: true,
          verticalSwiping: true,
        });
      }

      if (this.productSingleObject.images.length > 1) {
        $(selectors.productThumbContainer).slick(thumbOptions);
      }

      $(selectors.productImageContainer).slick(mainOptions);

      this.settings.sliderActive = true;
    },

    _selectProductColor: function() {
      this.$container.addClass('loading');
    },

    _buildColourOptions: function() {
      var self = this;
      var colorSwatchEnabled = false;
      //get global colour information
      if (colorSwatchEnabled) {
        var $colorData = $(selectors.productColoursData);

        if ($colorData.length) {
           self.colorData = JSON.parse($colorData.html());

        }else {
          return;
        }
      }
      self.productColorOptions = {};

      var $productColorContainer = $(selectors.productColoursWrapper);

      tinybind.bind($productColorContainer, {
        data: self.productColorOptions,
        methods: {
          selectColor: this._selectProductColor.bind(this),
        }
      });

      var productGroupTag = $productColorContainer.attr('data-group');

      if (productGroupTag) {
        $.get('/collections/all/' + productGroupTag + '?view=json', function(data) {
            var productColorOptions = JSON.parse(data);
            self.productColorOptions.products = productColorOptions.products;

            _.each(self.productColorOptions.products, function(product, index) {
              var color = product.color;

              product.featured_image = product.featured_image.replace('_{width}x','');

              if (colorSwatchEnabled) {
                var colorData = _.find(self.colorData, {'title': color});
              }

              if (product.handle == self.productSingleObject.handle) {
                self.productColorOptions.products[index].url = '#';
                self.productColorOptions.selectedColor = color;
              }
            });
        });
      }
    },
    /**
     * Sets up product image lightbox with Photoswipe.js
     */
    initGallery: function() {
      var self = this;
      
      if (self.settings.zoomEnabled) {
        var pswpElement = document.querySelectorAll('.pswp')[0];
        var items = $('[data-pswp-items]').data('pswp-items');

        $(selectors.productImageWrap, this.$container).on('click', '.zoom-js', function(e){
          e.preventDefault();
          var thumbnail = $(this).find('img')[0];
          options = {
            index: $(this).data('index'),
            barsSize: {top:0,bottom:0},
            captionEl: false,
            fullscreenEl: false,
            shareEl: false,
            bgOpacity: 0.96,
            tapToClose: true,
            tapToToggleControls: false,
            history: false,
            getThumbBoundsFn: function(index) {
              var pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
              rect = thumbnail.getBoundingClientRect(),
              thumbInfo = theme.utils.getImgSizeInfo(thumbnail);
              return {x: rect.left + thumbInfo.left, y: rect.top + pageYScroll, w: thumbInfo.width};
            }
          };
          
          var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

          var realViewportWidth,
              useLargeImages = false,
              firstResize = true,
              imageSrcWillChange;
          
          // gettingData event fires each time PhotoSwipe retrieves image source & size
          gallery.listen('gettingData', function(index, item) {

            realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio;

            // Set image source & size based on real viewport width
            if( useLargeImages ) {
              item.src = item.originalImage.src;
              item.w = item.originalImage.w;
              item.h = item.originalImage.h;
              item.msrc = item.originalImage.msrc;
            } else {
              if (realViewportWidth > 1024) {
                item.w = 1600;
              } else if (realViewportWidth > 768) {
                item.w = 1024;
              } else if (realViewportWidth > 640) {
                item.w = 768;
              } else if (realViewportWidth > 480) {
                item.w = 640;
              } else {
                item.w = 480;
              }
              item.w = Math.min(item.w, item[index].originalWidth);
              item.h = Math.round(item.w / item[index].ratio);
              
              var itemSrcTemplate = decodeURI(item[index].src);
              item.src = itemSrcTemplate.replace('{width}', item.w);
              // item.msrc = itemSrcTemplate.replace('{width}', 180);

              var $imageElem = $(selectors.productImageContainer + ' [data-slick-index="' + index + '"]:not(.slick-cloned) img');
              item.msrc = $imageElem.prop('currentSrc') || $imageElem.attr('src') || item[index].msrc;
            }

            // It doesn't really matter what will you do here, 
            // as long as item.src, item.w and item.h have valid values.
            // 
            // Just avoid http requests in this listener, as it fires quite often

          });

          gallery.listen('close', function() {
            if (self.settings.sliderActive) {
              $(selectors.productImageContainer).slick('slickGoTo', this.getCurrentIndex());
            }
          });

          gallery.init();

        });
      }
    },

    /**
     * Handles change events from the variant inputs
     */
    initVariants: function() {
      var options = {
        $container: this.$container,
        enableHistoryState: this.$container.data('enable-history-state') || false,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        product: this.productSingleObject
      };

      this.variants = new slate.Variants(options);

      this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
      this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));
      this.$container.on('variantOptionChange' + this.namespace, this.updateProductOptions.bind(this));
      this.$container.on('variantSKUChange' + this.namespace, this.updateSKU.bind(this));
    },

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      var self = this,
          quantityAvailable,
          variant = evt.variant;

      if(variant) {
        $(selectors.priceWrapper, this.$container).removeClass('hide');
      }
      else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(selectors.priceWrapper, this.$container).addClass('hide');
        return;
      }
      if (variant.available) {
        quantityAvailable = Math.min(Math.max(variant.inventory_quantity, 0), self.$qtySelector.attr('data-max'));

        if (self.settings.qtySelectorType == 'select') {
          $('option', self.$qtySelector).remove();

          for (var i = quantityAvailable - 1; i >= 0; i--) {
            self.$qtySelector.prepend('<option ' + (i==0 ? 'selected' : '') + ' value="' + (i + 1) + '">' + (i + 1) + '</option>');
          }
        } else {
          quantityAvailable = quantityAvailable > 0 ? quantityAvailable : 999;
          self.$qtySelector.prop('max', quantityAvailable);
          self.$qtySelector.prop('min', 1);
        }

        $(selectors.addToCart, this.$container).prop('disabled', false);
        var buttonText = $(selectors.addToCartText, this.$container).attr('data-add-to-cart-text');
        $(selectors.addToCartText, this.$container).html(buttonText);
      } else {
        $(selectors.productQtyWrapper + ' input', this.$container).prop('max', 0);
        $(selectors.productQtyWrapper + ' input', this.$container).prop('min', 0);
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {
      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);
      var comparePrefixString = $comparePrice.data('prefix-string') || '';
      var compareSuffixString = $comparePrice.data('suffix-string') || '';

      $(selectors.productPrice, this.$container)
        .html(slate.Currency.formatMoney(variant.price, shop.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(comparePrefixString + slate.Currency.formatMoney(variant.compare_at_price, shop.moneyFormat) + compareSuffixString);
        $compareEls.removeClass('hide');
      } else {
        $comparePrice.html('');
        $compareEls.addClass('hide');
      }

      var $afterpayInstallments = $('#afterpay_instalments', this.$container);
      if ($afterpayInstallments.length) {
        $afterpayInstallments.html(slate.Currency.formatMoney(variantPrice/4, shop.moneyFormat));
      }
    },

    /**
     * Updates the DOM with specified options
     */
    updateProductOptions: function(evt) {
      var enabledOptions = [];
      var selectedVariant = evt.variant;
      for (var i = 0; i < this.productSingleObject.variants.length; i++) {
        var variant = this.productSingleObject.variants[i];
        if (variant.option1 == selectedVariant.option1 && variant.available) {
          enabledOptions = _.union(enabledOptions, [variant.option2, variant.option3]);
        }
      }

      if ($('[data-product-select] option[value="'+selectedVariant.id+'"]').attr('data-check')) {
        $(selectors.variantAvailableForm).addClass('hide');
        $(selectors.variantUnavailableForm).removeClass('hide');
      } else {
        $(selectors.variantUnavailableForm).addClass('hide');
        $(selectors.variantAvailableForm).removeClass('hide');
      }

      // $(selectors.singleOptionSelector + ':not([data-index="option1"])').attr('disabled', 'disabled');
      for (var i = 0; i < enabledOptions.length; i++) {
        $(selectors.singleOptionSelector + ':not([data-index="option1"])[value="' + enabledOptions[i] + '"]').removeAttr('disabled');
      }

      if (!selectedVariant.available) {
        var $selectedDisabledOptions = $(selectors.singleOptionSelector + ':not([data-index="option1"]):disabled:checked');
        if ($selectedDisabledOptions.length) {
          $selectedDisabledOptions.each(function(){
            var $newOption = $(this).siblings(selectors.singleOptionSelector + ':not([data-index="option1"]):not(:disabled):not(:checked)').eq(0);
            $(this).removeAttr('checked');
            $newOption.attr('checked', 'checked').trigger('click');
          });
        }
      } else {
        $(selectors.singleOptionValue).each(function(){
          var $this = $(this);
          $this.text(selectedVariant.options[$this.data('single-option-value')]);
        });
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var self = this;
      var variant = evt.variant;
      
      if (self.settings.sliderActive) {
        var imageIndex = $('[data-image-id="' + variant.featured_image.id + '"]:not(.slick-cloned)').closest('.slick-slide').data('slick-index');
        $(selectors.productImageContainer).slick('slickGoTo', imageIndex);
      } else {
        if (this.$featuredImage.length) {
          var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);
          this.$featuredImage.attr('src', sizedImgUrl);
        }
      }
    },

    /**
     * Updates the DOM with specified Variant SKU
     */
    updateSKU: function(evt) {
      var variant = evt.variant;

      // Update the sku
      $(selectors.productSku, this.$container).html(variant.sku);
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }
  });

  return ProductPage;
})();

theme.Quotes = (function() {

  var selectors = {
    slideshow: '[data-slideshow]'
  };

  function Quotes(container) {

    this.$container = $(container);
    this.$slideshows = $(selectors.slideshow, this.$container);

    $.each(this.$slideshows, function(index, slideshow) {
      theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
    });

  }

  return Quotes;
})();

theme.slideshows = theme.slideshows || {};

theme.SlideshowSection = (function() {
  function SlideshowSection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var slideshow = this.slideshow = '#Slideshow-' + sectionId;

    $('.slideshow__video', slideshow).each(function() {
      var $el = $(this);
      theme.SlideshowVideo.init($el);
      theme.SlideshowVideo.loadVideo($el.attr('id'));
    });

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
  }

  return SlideshowSection;
})();

theme.SlideshowSection.prototype = _.assignIn({}, theme.SlideshowSection.prototype, {
  onUnload: function() {
    delete theme.slideshows[this.slideshow];
  },

  onBlockSelect: function(evt) {
    var $slideshow = $(this.slideshow);

    // Ignore the cloned version
    var $slide = $('.slideshow__slide--' + evt.detail.blockId + ':not(.slick-cloned)');
    var slideIndex = $slide.data('slick-index');

    // Go to selected slide, pause autoplay
    $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
  },

  onBlockDeselect: function() {
    // Resume autoplay
    $(this.slideshow).slick('slickPlay');
  }
});

window.theme = window.theme || {};

theme.BrandValueSliders = (function() {
  var config = {
    mediaQuerySmall: theme.settings.mediaQuery.small,
    mediaQueryMediumUp: theme.settings.mediaQuery.mediumUp,
    slideCount: 0,
    anchorPosition: 'above', // above, below
    anchorElement: false, // '.site-header-lower'
    anchorViewport: 'small' // large, small
  };

  var cache = {
    anchorMarginBottom: 0,
    anchorMarginTop: 0,
    anchorOffset: 0
  };

  var defaults = {
    arrows: false,
    dots: false,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 3,
    swipeToSlide: true,
    slidesToScroll: 1,
    rows: 0,
  };

  function brandValueSliders(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var wrapper = this.wrapper = '.brand-values-wrap';
    var slider = this.slider = '#brand-values-' + sectionId;
    var $slider = $(slider, wrapper);
    var $contentContainer = $('#PageContent');
    var $anchorElement = $(config.anchorElement);

    var mobileOptions = $.extend({}, defaults, {
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true,
      autoplay: $slider.data('autoplay-mobile'),
      autoplaySpeed: $slider.data('speed')
    });

    var sliderActive = false;
    var desktopOptions = $.extend({}, defaults, {
      autoplay: $slider.data('autoplay'),
      autoplaySpeed: $slider.data('speed'),
      slidesToShow: $slider.data('slides-show-desktop')
    });

    config.slideCount = $slider.data('count');

    // Override slidesToShow/Scroll if there are not enough blocks
    if (config.slideCount < defaults.slidesToShow) {
      defaults.slidesToShow = config.slideCount;
      defaults.slidesToScroll = config.slideCount;
    }

    $slider.on('init', this.a11y.bind(this));

    if ($anchorElement.length) {
      cache.anchorMarginTop = parseInt($anchorElement.css("marginTop").replace('px', ''));
      cache.anchorMarginBottom = parseInt($anchorElement.css("marginBottom").replace('px', ''));
    }

    enquire.register(config.mediaQuerySmall, {
      deferSetup: true,
      match: function() {
        initSlider($slider, mobileOptions);

        if ($anchorElement.length) {
          $anchorElement.css({
            'margin-top': cache.anchorMarginTop + 'px',
            'margin-bottom': cache.anchorMarginBottom + 'px'
          });
          
          if (config.anchorViewport == 'small' || config.anchorViewport == 'all') {
            $container.css('position', 'fixed');
            switch (config.anchorPosition) {
              case 'above':
                cache.anchorOffset = $anchorElement.offset().top;
                var anchorAdjustment = {
                  'margin-top': (cache.anchorMarginTop + $container.outerHeight()) + 'px'
                };
                var sliderAdjustment = {
                  'top': cache.anchorOffset + 'px'
                };
                break;
              default:
                cache.anchorOffset = $anchorElement.offset().top + $anchorElement.innerHeight();
                var anchorAdjustment = {
                  'margin-bottom': (cache.anchorMarginBottom + $container.outerHeight()) + 'px'
                };
                var sliderAdjustment = {
                  'top': cache.anchorOffset + 'px'
                };
                break;
            }
          } else {
            var anchorAdjustment = {
              'margin-bottom': cache.anchorMarginBottom + 'px'
            };
            var sliderAdjustment = {
              'position': 'static',
              'top': '0px'
            };
          }

          $anchorElement.css(anchorAdjustment);
          $container.not('.brand-values--cloned').css(sliderAdjustment);
        }
      }
    });

    enquire.register(config.mediaQueryMediumUp, {
      deferSetup: true,
      match: function() {
        initSlider($slider, desktopOptions);
        if ($anchorElement.length) {
          $anchorElement.css({
            'margin-top': cache.anchorMarginTop + 'px',
            'margin-bottom': cache.anchorMarginBottom + 'px'
          });

          if (config.anchorViewport == 'large' || config.anchorViewport == 'all') {
            $container.css('position', 'fixed');
            switch (config.anchorPosition) {
              case 'above':
                cache.anchorOffset = $anchorElement.offset().top;
                var anchorAdjustment = {
                  'margin-top': (cache.anchorMarginTop + $container.outerHeight()) + 'px'
                };
                var sliderAdjustment = {
                  'position': 'fixed',
                  'top': cache.anchorOffset + 'px'
                };
                break;
              default:
                cache.anchorOffset = $anchorElement.offset().top + $anchorElement.innerHeight();
                var anchorAdjustment = {
                  'margin-bottom': (cache.anchorMarginBottom + $container.outerHeight()) + 'px'
                };
                var sliderAdjustment = {
                  'position': 'fixed',
                  'top': cache.anchorOffset + 'px'
                };
                break;
            }
          } else {
            var anchorAdjustment = {
              'margin-bottom': cache.anchorMarginBottom + 'px'
            };
            var sliderAdjustment = {
              'position': 'static',
              'top': '0px'
            };
          }

          $anchorElement.css(anchorAdjustment);
          $container.not('.brand-values--cloned').css(sliderAdjustment);
        }
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
        $('.brand-values-clone').empty();
      }

      // Clone brand values content to other site areas
      // #TODO: Attach this to the main slider init so it functions as a slider
      sliderObj.clone().addClass('brand-values--cloned').removeAttr('id').removeAttr('style').appendTo('.brand-values-clone');

      sliderObj.slick(args);
      sliderActive = true;

      if ($anchorElement.length) {
        if ($(window).width() < 750) {
          switch (config.anchorPosition) {
            case 'above':
              $anchorElement.css('margin-top', sliderObj.outerHeight() + 'px');
              break;
            default:
              $anchorElement.css('margin-bottom', sliderObj.outerHeight() + 'px');
              break;
          }
        }
      }
    }
  }

  brandValueSliders.prototype = _.assignIn({}, brandValueSliders.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $('.brand-values__slide--' + evt.detail.blockId + ':not(.slick-cloned)');
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return brandValueSliders;
})();

window.theme = window.theme || {};

theme.FeaturedCollection = (function() {
  var config = {
    mediaQuerySmall: theme.settings.mediaQuery.small,
    mediaQueryMediumUp: theme.settings.mediaQuery.mediumUp,
    slideCount: 0
  };

  var sliderOptions = {
    arrows: true,
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    infinite: true,
  };

  function featuredCollection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var wrapper = this.wrapper = '.featured-collection-wrap';
    var slider = this.slider = '#featured-collection-' + sectionId;
    var $slider = $(slider, wrapper);
    var sliderActive = false;

    var options = $.extend({}, sliderOptions, {
      prevArrow: slider + ' ~ .featured-collection__prev',
      nextArrow: slider + ' ~ .featured-collection__next',
      autoplay: $slider.data('autoplay'),
      autoplaySpeed: $slider.data('speed'),
      swipeToSlide: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1480,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            // dots: true,
            autoplay: $slider.data('autoplay-mobile'),
          }
        },
        {
          breakpoint: 512,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            // dots: true
          }
        }
      ]
    });

    var self = this;

    function appendSlickScrollbar(slick) {
      if (slick.$slides.filter('.slick-active').length != slick.$slides.length) {
        var currentMarkerOffset = slick.currentSlide * 100;
        var scrollbarMarkerWidth = 1 / slick.slideCount * 100;
        slick.$slider.append('<div class="slick-scrollbar"><div class="slick-scrollbar-mark" style="width: ' + scrollbarMarkerWidth + '%"></div></div>');
        $('.slick-scrollbar-mark', slick.$slider).css('transform', 'translateX(' + currentMarkerOffset + '%)');
      }
    }

    $slider.on('init', function(evt, slick){
      self.a11y.bind(this);

      // appendSlickScrollbar(slick);
    });

    $slider.on('reInit', function(evt, slick){
      // appendSlickScrollbar(slick);
    });

    $slider.on('beforeChange', function(evt, slick, currentSlide, nextSlide){
      var currentMarkerOffset = nextSlide * 100;
      $('.slick-scrollbar-mark', slick.$slider).css('transform', 'translateX(' + currentMarkerOffset + '%)');
    });
    
    initSlider($slider, options);

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;

      var markerRatio = $('.featured-collection .slick-list').width() / $('.featured-collection .slick-track').width();

      // $('input[type="number"]', sliderObj).not('.js-qty-select input[type="number"]').each( function(){
      //   var $el = $(this);
      //   theme.QuantitySelector.init($el);
      // });
    }
  }

  featuredCollection.prototype = _.assignIn({}, featuredCollection.prototype, {
    onUnload: function() {
      $(this.slider, this.wrapper).slick('unslick');
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return featuredCollection;
})();

window.theme = window.theme || {};
theme.slideshows = theme.slideshows || {};

theme.FeaturedCollections = (function() {
  var selectors = {
    collectionLink: '.featured_colections__header-item',
  };

  function FeaturedCollections(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var slideshow = this.slideshow = '#Slideshow-' + sectionId;
    var activeCollectionHandle = $('[data-block-id]', $container).first().data('related-collection');

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);

    $(selectors.collectionLink + '[data-related-collection=' + activeCollectionHandle + ']', $container).addClass('active');

    $(slideshow).on('beforeChange', function(event, slick, currentSlide, nextSlide){
      var nextCollectionHandle = $('[data-slick-index="' + nextSlide + '"]:not(.slick-cloned) [data-related-collection]', $container).data('related-collection');
      if (nextCollectionHandle != activeCollectionHandle) {
        activeCollectionHandle = nextCollectionHandle;

        $(selectors.collectionLink, $container).removeClass('active');
        $(selectors.collectionLink + '[data-related-collection="' + activeCollectionHandle + '"]', $container).addClass('active');
      }
    });

    $(selectors.collectionLink, $container).on('click', function(evt){
      evt.preventDefault();
      var $this = $(this);
      
      var relatedCollectionHandle = $this.data('related-collection');
      var $slide = $('.slick-slide[data-slick-index="' + $this.data('first-product') + '"]:not(.slick-cloned)', $container).first();
      var slideIndex = $slide.data('slick-index');
      $(slideshow).slick('slickGoTo', slideIndex);
    });
  }

  return FeaturedCollections;
})();

theme.FeaturedCollections.prototype = _.assignIn({}, theme.FeaturedCollections.prototype, {
  onUnload: function() {
    delete theme.slideshows[this.slideshow];
  },

  onBlockSelect: function(evt) {
    var $slideshow = $(this.slideshow);

    // Ignore the cloned version
    var $slide = $('[data-block-id="' + evt.detail.blockId + '"]:not(.slick-cloned)');
    var slideIndex = $slide.data('slick-index');

    // Go to selected slide, pause autoplay
    $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
  },

  onBlockDeselect: function() {
    // Resume autoplay
    $(this.slideshow).slick('slickPlay');
  }
});


window.theme = window.theme || {};

theme.FeaturedProduct = (function() {
  
  var selectors = {
    quantitySelector: 'input[type="number"]',
  };

  function FeaturedProduct(container) {
    var qtySelectorElem = container.querySelector(selectors.quantitySelector);

    if (!qtySelectorElem) { 
      return;
    }

    var quantitySelector = new theme.QuantitySelector(qtySelectorElem);
  }

  return FeaturedProduct;
})();

window.theme = window.theme || {};

theme.slideshows = theme.slideshows || {};

theme.FeaturedProducts = (function() {

  function FeaturedProducts(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var slideshowMasthead = this.slideshow = '#featured-products-masthead-' + sectionId;
    var slideshow = this.slideshow = '#featured-products-' + sectionId;

    theme.slideshows[slideshowMasthead] = new theme.Slideshow(slideshowMasthead);
    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);

    $('.featured-products__slide', slideshow).on('mouseenter', function(){
      $(slideshowMasthead).slick('slickGoTo', $(this).parents('.slick-slide').data('slick-index'));
    });

    $('.featured-products__slide', slideshow).on('mouseleave', function(){
      $(slideshowMasthead).slick('slickGoTo', $(slideshow).slick('slickCurrentSlide'));
    });
  }

  return FeaturedProducts;
})();

theme.FeaturedProducts.prototype = _.assignIn({}, theme.FeaturedProducts.prototype, {
  onUnload: function() {
    delete theme.slideshows[this.slideshow];
  },

  onBlockSelect: function(evt) {
    var $slideshow = $(this.slideshow);

    // Ignore the cloned version
    var $slide = $('[data-block-id="' + evt.detail.blockId + '"]:not(.slick-cloned)');
    var slideIndex = $slide.data('slick-index');

    // Go to selected slide, pause autoplay
    $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
  },

  onBlockDeselect: function() {
    // Resume autoplay
    $(this.slideshow).slick('slickPlay');
  }
});


window.theme = window.theme || {};
theme.slideshows = theme.slideshows || {};

theme.ImageRows = (function() {

  function ImageRows(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var slideshow = this.slideshow = '#Slideshow-' + sectionId;

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
  }

  return ImageRows;
})();

theme.ImageRows.prototype = _.assignIn({}, theme.ImageRows.prototype, {
  onUnload: function() {
    delete theme.slideshows[this.slideshow];
  },

  onBlockSelect: function(evt) {
    var $slideshow = $(this.slideshow);

    // Ignore the cloned version
    var $slide = $('[data-block-id="' + evt.detail.blockId + '"]:not(.slick-cloned)');
    var slideIndex = $slide.data('slick-index');

    // Go to selected slide, pause autoplay
    $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
  },

  onBlockDeselect: function() {
    // Resume autoplay
    $(this.slideshow).slick('slickPlay');
  }
});

window.theme = window.theme || {};

theme.ContentSliders = (function() {
  var config = {
    mediaQuerySmall: theme.settings.mediaQuery.small,
    mediaQueryMedium: theme.settings.mediaQuery.medium,
    mediaQueryLargeUp: theme.settings.mediaQuery.largeUp
  };

  function contentSliders(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var wrapper = this.wrapper = '.content-slider-wrap';
    var slider = this.slider = '#content-slider-' + sectionId;
    var $slider = $(slider, wrapper);
    var sliderActive = false;

    var options = {
      infinite: $slider.data('infinite'),
      prevArrow: slider + ' ~ .content-slider__prev',
      nextArrow: slider + ' ~ .content-slider__next',
      arrows: $slider.data('arrows'),
      dots: $slider.data('dots'),
      autoplay: $slider.data('autoplay'),
      autoplaySpeed: $slider.data('speed'),
      slidesToShow: $slider.data('slides-show-desktop'),
      slidesToScroll: $slider.data('slides-scroll-desktop'),
      rows: $slider.data('rows-desktop'),
      slidesPerRow: $slider.data('per-row-desktop')
    };

    var tabletOptions = $.extend({}, options, {
      slidesToShow: $slider.data('slides-show-tablet'),
      slidesToScroll: $slider.data('slides-scroll-tablet'),
      rows: $slider.data('rows-tablet'),
      slidesPerRow: $slider.data('per-row-tablet')
    });

    var mobileOptions = $.extend({}, options, {
      arrows: $slider.data('arrows-mobile'),
      dots: $slider.data('dots-mobile'),
      autoplay: $slider.data('autoplay-mobile'),
      slidesToShow: $slider.data('slides-show-mobile'),
      slidesToScroll: $slider.data('slides-scroll-mobile'),
      rows: $slider.data('rows-mobile'),
      slidesPerRow: $slider.data('per-row-mobile')
    });

    $slider.on('init', this.a11y.bind(this));

    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });

    enquire.register(config.mediaQueryMedium, {
      match: function() {
        initSlider($slider, tabletOptions);
      }
    });

    enquire.register(config.mediaQueryLargeUp, {
      match: function() {
        initSlider($slider, options);
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }

    $('.slideshow__video', wrapper).each(function() {
      var $el = $(this);
      theme.SlideshowVideo.init($el);
      theme.SlideshowVideo.loadVideo($el.attr('id'));
    });
  }

  contentSliders.prototype = _.assignIn({}, contentSliders.prototype, {
    onUnload: function() {
      $(this.slider, this.wrapper).slick('unslick');
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return contentSliders;
})();

window.theme = window.theme || {};
theme.slideshows = theme.slideshows || {};

theme.LatestBlogPosts = (function() {
  function LatestBlogPosts(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var slideshow = this.slideshow = '#Slideshow-' + sectionId;

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
  }

  return LatestBlogPosts;
})();

theme.LatestBlogPosts.prototype = _.assignIn({}, theme.LatestBlogPosts.prototype, {
  onUnload: function() {
    delete theme.slideshows[this.slideshow];
  },

  onBlockSelect: function(evt) {
    var $slideshow = $(this.slideshow);

    // Ignore the cloned version
    var $slide = $('.slideshow__slide--' + evt.detail.blockId + ':not(.slick-cloned)');
    var slideIndex = $slide.data('slick-index');

    // Go to selected slide, pause autoplay
    $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
  },

  onBlockDeselect: function() {
    // Resume autoplay
    $(this.slideshow).slick('slickPlay');
  }
});

window.theme = window.theme || {};
theme.slideshows = theme.slideshows || {};

theme.ImageGallerySliders = (function() {
  function ImageGallerySliders(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var slideshow = this.slideshow = '#Slideshow-' + sectionId;

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
    
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var galleryItems = [];

    $('.image-gallery-item__anchor:not(.slick-cloned .image-gallery-item__anchor)', slideshow).map(function(){
      var $this = $(this);
      var width = $this.data('width');

      galleryItems.push({ 
        src: $this.attr('href'), 
        w: width, 
        h: width / $this.data('aspect-ratio'), 
      });
    });

    $('.image-gallery-item__anchor').on('click', function(evt){
      evt.preventDefault();

      var thumbnail = $(this).find('img')[0];

      var options = {
        index: $(this).data('index'),
        barsSize: { top:0, bottom:0 },
        captionEl: false,
        fullscreenEl: false,
        shareEl: false,
        bgOpacity: 0.96,
        tapToClose: true,
        tapToToggleControls: false,
        history: false,
        getThumbBoundsFn: function(index) {
          var pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
          rect = thumbnail.getBoundingClientRect(),
          thumbInfo = theme.utils.getImgSizeInfo(thumbnail);
          return {x: rect.left + thumbInfo.left, y: rect.top + pageYScroll, w: thumbInfo.width};
        }
      };

      var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, galleryItems, options);
      gallery.init();
    });
  }

  return ImageGallerySliders;
})();

theme.ImageGallerySliders.prototype = _.assignIn({}, theme.ImageGallerySliders.prototype, {
  onUnload: function() {
    delete theme.slideshows[this.slideshow];
  },

  onBlockSelect: function(evt) {
    var $slideshow = $(this.slideshow);

    // Ignore the cloned version
    var $slide = $('.slideshow__slide--' + evt.detail.blockId + ':not(.slick-cloned)');
    var slideIndex = $slide.data('slick-index');

    // Go to selected slide, pause autoplay
    $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
  },

  onBlockDeselect: function() {
    // Resume autoplay
    $(this.slideshow).slick('slickPlay');
  }
});

window.theme = window.theme || {};

theme.DashboardDynamicWelcome = (function() {

  var selectors = {
    title: '[data-dynamic-welcome-title]',
    message: '[data-dynamic-welcome]',
    data: '#dynamic-welcome-data'
  };

  function DashboardDynamicWelcome(container) {

    this.$container = $(container);
    this.$title = $(selectors.title);
    this.$message = $(selectors.message);
    this.data = JSON.parse($(selectors.data).html());

    if (!this.$message.length) {
      return;
    }

    var currentDate = new Date();
    var currentHour = currentDate.getHours();

    var message = 'Hello there';
    var timePeriod;
    var icon;

    if (currentHour < 4) {
      timePeriod = 'early_morning';
    } else if (currentHour >= 4 && currentHour < 12) {
      timePeriod = 'morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      timePeriod = 'afternoon';
    } else if (currentHour >= 17 && currentHour < 18) {
      timePeriod = 'evening';
    } else {
      timePeriod = 'night';
    }

    message = this.data[timePeriod];
    icon = theme.utils.getTemplate('dynamic-welcome-icon-' + timePeriod);

    $(selectors.message).html(message);
    $(selectors.title).append(icon);

    this.$title.addClass('fade-in');
  
  }

  return DashboardDynamicWelcome;

})();
window.theme = window.theme || {};

theme.DashboardPlaceOrder = (function() {
  var selectors = {
    tabsGroup: '.tabs-group',
    tabContent: '[data-tab]',
    accountViewRight: '.account__view-right'
  };

  function DashboardPlaceOrder(container) {

    this.$container = $(container);

    this.$accountViewRight = $(selectors.accountViewRight);
    this.$accountViewRight.addClass('hidden');

    if (!this.$container.length) {
      return;
    }

    this.$tabsGroup = $(selectors.tabsGroup, this.$container);
    this.$tabs = $(selectors.tabContent, this.$container);

    var self = this;

    var activeTab = this.$tabs.length;

    if (window.location.href.indexOf('search') > -1) {
      activeTab = 1;
    }

    if (window.location.href.indexOf('cart') > -1) {
      activeTab = this.$tabs.length;
      this.$accountViewRight.removeClass('hidden');
    }

    if (window.location.href.indexOf('account') > -1) {
      activeTab = 1;
    }

    $.each(this.$tabsGroup, function(index, tabsGroup) {

      window.theme.tabsGroups[tabsGroup] = new theme.TabsGroup(tabsGroup, {
        breakpoint: 0,
        activeTab: activeTab
      });

      window.theme.tabsGroups[tabsGroup].$tabsGroup.on('tabChange', function(evt) {
        var title = $(self.$tabs[evt.tabIndex - 1]).data('tabTitle');
        if (title.toLowerCase() == 'my cart') {
          self.$accountViewRight.removeClass('hidden');
        } else {
          self.$accountViewRight.addClass('hidden');
        }
      });

      window.theme.tabsGroups[tabsGroup].$navContainer.addClass('swipeable').css('overflow-x', 'auto');

      var $cartTab = window.theme.tabsGroups[tabsGroup].$navContainer.children().filter(function() {
        return $(this).data("targetTitle") == 'My Cart';
      });

      var cartCountHtml = '<span rv-class-cart-count--even="cart.item_count_display | modulo 2 | eq 0" rv-class-cart-count--odd="cart.item_count_display | modulo 2 | eq 1" class="cart-count" rv-html="cart.item_count_display">{{ cart.item_count }}</span>';
      
      $cartTab.append(cartCountHtml);
      tinybind.bind($cartTab, {cart: CartJS.cart});

    });


  }

  return DashboardPlaceOrder;
})();
window.theme = window.theme || {};

theme.DashboardReports = (function() {

  var selectors = {
    dropdownButton: '[data-dropdown-button]',
    dropdownOptions: '[data-dropdown-options]'
  };

  function DashboardReports(container) {

    this.$container = $(container);
    this.data = {};

    this.ui = {
      active: {}
    };

    this._bindView();
    this._getReportsData();

  }

  DashboardReports.prototype = $.extend({}, DashboardReports.prototype, {

    _getReportsData: function() {
      var self = this;

      // TODO: Check SessionStorage

      $.ajax({
        url: '/account?view=dashboard-reports-json'
      }).done(function(data) {
        var dataJson = JSON.parse(data.replace(/<!--[\s\S]*?-->/g, ""));
        self.data.reports = dataJson;
        self.ui.loadComplete = true;

        if (!dataJson.reports.length) {
          return;
        }

        self.ui.active = {
          days: dataJson.reports[0].days,
          title: dataJson.reports[0].title
        };

        self._bindDropdown();
      });

    },

    _bindView: function() {
      var self = this;

      var $el = self.$container;
      tinybind.bind($el, {
        ui: self.ui,
        data: self.data,
        actions: {
          toggleDropdown: self._toggleDropdown.bind(self),
          openDropdown: self._openDropdown.bind(self),
          closeDropdown: self._closeDropdown.bind(self),
          changeActiveReport: self._changeActiveReport.bind(self)
        }
      });

    },

    _toggleDropdown: function() {
      var self = this;
      self.ui.showDropdown = !self.ui.showDropdown;
    },

    _openDropdown: function() {
      var self = this;
      self.ui.showDropdown = true;
    },

    _closeDropdown: function() {
      var self = this;
      self.ui.showDropdown = false;
    },

    _changeActiveReport: function() {
      var self = this;

      var $target = $(event.target);
      var reportDays = $target.attr('data-report-days');
      var reportTitle = $target.attr('data-report-title');

      self.ui.active = {
        days: parseInt(reportDays),
        title: reportTitle
      };

      self._closeDropdown();
    },

    _bindDropdown: function() {
      var self = this;

      var $button = $(selectors.dropdownButton, self.$container);
      var $options = $(selectors.dropdownOptions, self.$container);

      self.dropdown = new Popper($button[0], $options[0], {
        placement: 'bottom-end'
      });
    }

  });

  return DashboardReports;

})();
window.theme = window.theme || {};
window.theme.slideshows = window.theme.slideshows || {};

theme.ProductRelatedProducts = (function() {

  var selectors = {
    slideshow: '[data-slideshow]'
  };

  function ProductRelatedProducts(container) {

    this.$container = $(container);
    this.$slideshows = $(selectors.slideshow, this.$container);

    $.each(this.$slideshows, function(index, slideshow) {
      theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
    });

  }
  
  return ProductRelatedProducts;

})();
window.theme = window.theme || {};

theme.ConstantCart = (function() {

  var selectors = {
    cart: '.cart-drawer__inner',
    constantContainer: '.constant-cart',
    drawerContainer: '#CartDrawer',
    accountViewRight: '.account__view-right'
  };

  var options = {
    // breakpoint: 1200
    breakpoint: 1330
  };

  var breakpoints = {
    desktop: 'screen and (min-width: ' + options.breakpoint + 'px)',
    mobile: 'screen and (max-width: ' + (options.breakpoint - 1) + 'px)'
  };

  function ConstantCart(container) {

    this.$container = $(container);
    this.$constantContainer = $(selectors.constantContainer, this.$container);
    this.$drawerContainer = $(selectors.drawerContainer);
    this.$cart = $(selectors.cart);
    this.$accountViewRight = this.$container.closest(selectors.accountViewRight);
    this.$stickyElement = this.$accountViewRight.children().first();

    var self = this;

    this.$stickyElement.stickybits({stickyBitStickyOffset: 40});

    enquire.register(breakpoints.mobile, {
      match: function() {
        self._makeDrawer();
      }
    });

    enquire.register(breakpoints.desktop, {
      match: function() {
        self._makeConstant();
      }
    });

  }

  ConstantCart.prototype = $.extend({}, ConstantCart.prototype, {

    _makeConstant: function() {
      this.$cart.detach();
      this.$constantContainer.append(this.$cart);

      $('body').addClass('cart-is-constant');
      this.$accountViewRight.css('display', '');
    },

    _makeDrawer: function() {
      this.$cart.detach();
      this.$drawerContainer.append(this.$cart);

      $('body').removeClass('cart-is-constant');
      this.$accountViewRight.css('display', 'none');

    }

  });
  
  return ConstantCart;

})();
window.theme = window.theme || {};

theme.StickySubNav = (function() {

  var selectors = {
    subNav: '.sticky-sub-nav'
  }

  var options = {
    stickybits: {}
  }

  function StickySubNav(container) {

      this.$container = $(container);

      this.$subNav = $(selectors.subNav).insertBefore(this.$container.parent());
      this.$subNav.stickybits(options.stickybits);
  }

  return StickySubNav;
})();

window.theme = window.theme || {};

theme.StoreLocator = (function() {

  var selectors = {
    storesDataContainer: 'script#store-locations',
    filtersDataContainer: 'script#store-location-filters',
    mapSkinDataContainer: 'script#store-locatior-skin',
    mapContainer: '#Map-'
  };

  var defaults = {
    map: {
      zoom: 4,
      center: {
        lat: 25.2744,
        lng: 133.7751
      },
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
    },
    rawDataType: 'csv',
    googlePlacesFields: [
      'url',
    ],
    enableSearch: true,
    activeStoreZoomLevel: 17,
    showStoreInfoWindow: true,
    showSearchMarker: false,
  };

  function StoreLocator(container) {

    this.container = container;
    this.sectionId = container.dataset.sectionId;
    this.mapContainer = document.querySelector(selectors.mapContainer + this.sectionId);

    this.options = _.defaults(defaults, {});

    if (!this.container) {
      return;
    }

    this.data = {
      parsedData: {},
      stores: [],
      groups: [],
      filters: [],
      tags: [],
      markerClusters: [],
      activeFilters: [],
      activeStore: null,
      activeGroup: null,
      storesInFilter: [],
      storesInView: [],
    };

    this.methods = {
      focusStore: this._focusStore.bind(this),
      zoomToFitMarkers: this._zoomToFitMarkers.bind(this),
      selectGroup: this._focusGroup.bind(this),
      selectFilter: this._focusFilter.bind(this),
      clearFilter: this._clearFilters.bind(this),
      clearActiveStore: this._clearActiveStore.bind(this),
      findUser: this._findUser.bind(this),
    };

    this._prepareData();
    this._bindView();
    this._buildMap();

    if ("geolocation" in navigator) {
      this.data.geolocationEnabled = true;
    }

    this.data.is_ready = true;

  }

  StoreLocator.prototype = _.extend({}, StoreLocator.prototype, {

    _onMapLoadComplete: function() {

      var queryparams = theme.utils.getQueryParams();
      var queryparamChecks = [
        this._setActiveStoreFromQueryParam,
        this._setActiveGroupFromQueryParam
      ];

      this.map.setZoom(4);

      var i = queryparamChecks.length;
      while(i--) {
        if (queryparamChecks[i].call(queryparams)) {
          break;
        }
      }

      if (this._setActiveStoreFromQueryParam(queryparams)) {
        return;
      } else if (this._setActiveGroupFromQueryParam(queryparams)) {
        return;
      }

    },

    _setActiveGroupFromQueryParam: function(queryparams) {

      var handle,
          group;

      if (queryparams && queryparams.group) {
        handle = queryparams.group;
        group = _.find(this.data.groups, {'handle': handle});
      }

      if (!group) {
        return false;
      }

      return this._setActiveGroup(group);

    },

    _setActiveStoreFromQueryParam: function(queryparams) {

      var handle,
          store;

      if (queryparams && queryparams.store) {
        handle = queryparams.store;
        store = _.find(this.data.stores, {'handle': handle});
      }

      if (!store) {
        return false;
      }

      return this._setActiveStore(store);

    },

    _focusFilter: function() {

      var id,
          filter,
          filterAction;

      id = event.currentTarget.dataset.filterId;
      filter = _.find(this.data.filters, {'id': id});

      if (!filter) {
        console.error(new Error('No filter found!'));
        return;
      }

      if (filter.active) {

        filterAction = 'remove';

      } else {

        if (this.options.allowMultipleFilters) {
          filterAction = 'add';
        } else {
          filterAction = 'replace';
        }

      }

      this._setActiveFilter(filter, filterAction);
    },

    _setActiveFilter: function(filter, action, updateMap) {

      var self = this;

      // action = 'add', 'remove', 'replace', 'reset'

      if (!action) {
        console.error('An action must be defined');
        console.error('action = add, remove, replace, reset');
        return;
      }

      this._setActiveStore(false, false);

      switch(action) {

        case 'replace':

          _.each(this.data.activeFilters, function(filter) {
            filter.active = false;
          });

          this.data.activeFilters = [];

          filter.active = true;
          this.data.activeFilters.push(filter);
          break;

        case 'remove':

          filter.active = false;

          var i = this.data.activeFilters.length;
          while(i--) {
            if (this.data.activeFilters[i] == filter) {
              this.data.activeFilters.splice(i, 1);
              break;
            }
          }
          break;

        case 'add':

          filter.active = true;
          this.data.activeFilters.push(filter);
          break;

        case 'reset':

          _.each(this.data.activeFilters, function(filter) {
            filter.active = false;
          });

          this.data.activeFilters = [];
          break;

      }

      _.each(this.data.stores, function(store, i) {
        var storeInFilter = true;

        _.each(self.data.activeFilters, function(filter) {

          if (!store.tags || store.tags.indexOf(filter.tag) == -1) {
            storeInFilter = false;
          }

        });

        if (storeInFilter) {
          self._addStoreToFilter(store);
        } else {
          self._removeStoreFromFilter(store);
        }

      });

      if (self.data.activeFilters.length == 0) {
        this.data.storesAreFiltered = false;
      } else {
        this.data.storesAreFiltered = true;
      }

      this._getMarkersInView();

      this._toggleFiltersNoResultsMessage();

      _.each(this.data.markerClusters, function(markerCluster, i) {
        markerCluster.repaint();
      })

    },

    _toggleFiltersNoResultsMessage: function() {

      if (this.data.storesAreFiltered && this.data.storesInFilter.length == 0) {
        this.data.filterNoResults = true;
      } else {
        this.data.filterNoResults = false;
      }

    },

    _clearFilters: function() {
      this._setActiveFilter(false, 'reset');
    },

    _addStoreToFilter: function(store) {

      if (store.in_filter == true) {
        return;
      }

      store.in_filter = true;
      store.marker.setMap(this.map);
      store.markerCluster.addMarker(store.marker);
      // store.markerCluster.redraw();

      this.data.storesInFilter.push(store);

    },

    _removeStoreFromFilter: function(store) {

      if (store.in_filter == false) {
        return;
      }

      store.in_filter = false;
      store.markerCluster.removeMarker(store.marker);
      store.marker.setMap(null);
      // store.markerCluster.redraw();

      _.pull(this.data.storesInFilter, store);

    },

    _focusStore: function() {

      var id,
          store;

      id = event.currentTarget.dataset.storeId;
      store = _.find(this.data.stores, {'id': id});

      if (!store) {
        console.error(new Error('No store found!'));
        return;
      }

      // If a link is cliked, only follow the link if the store is active
      if (event.target && event.target.nodeName == 'A') {
        if (store.active) {
          return;
        } else {
          event.preventDefault();
        }
      }

      this._setActiveStore(store);

    },

    _clearActiveStore: function() {
      this._setActiveStore(false, false);
    },

    _setActiveStore: function(store, updateMap) {

      var self = this;

      var marker,
          markerPosition,
          activeStore,
          currentMapBounds,
          currentMapZoom,
          boundsContainsMarker;

      activeStore = this.data.activeStore;

      if (activeStore) {
        activeStore.active = false;

        if (activeStore.infoWindow) {
          activeStore.infoWindow.close();
        }

      }

      if (store == false) {
        this.data.activeStore = null;
        // this.map.setZoom(this.options.map.zoom);
        this.map.setZoom(this.options.map.zoom);
        $('.store-locator__stores-list').removeClass('has-active');
        return;
      } else {
        $('.store-locator__stores-list').addClass('has-active');
      }

      if (updateMap != false) {

        marker = store.marker;

        markerPosition = marker.getPosition();
        currentMapBounds = this.map.getBounds();
        boundsContainsMarker = currentMapBounds ? currentMapBounds.contains(markerPosition) : false;
        currentMapZoom = this.map.getZoom();

        if (!boundsContainsMarker || currentMapZoom < this.options.activeStoreZoomLevel) {
          this.map.panTo(markerPosition);
          this.map.setZoom(this.options.activeStoreZoomLevel);
        }

      }

      if (store.group) {
        this._setActiveGroup(store.group, false);
      }

      this.data.activeStore = store;
      store.active = true;

      var awaitFetchStoreDetails = false;

      if (awaitFetchStoreDetails && store.place_id && !store.place && !store.is_loading) {
        this._fetchStoreDetails(store, function() {
          self._openStoreInfoWindow(store);
        });
      } else {
        self._openStoreInfoWindow(store);
      }

      return store;

    },

    _fetchStoreDetails: function(store, callback) {

      var request;

      store.is_loading = true;

      request = {
        placeId: store.place_id,
        fields: this.options.googlePlacesFields
      };

      function formatOpeningHours(periods) {
        // Formats opening hours provided by Google Places API

        var days,
            dayNames,
            dayIndex,
            dayTitle,
            daysString,
            openAmPm,
            openHours,
            openMinutes,
            openTime,
            closeAmPm,
            closeHours,
            closeMinutes,
            closeTime,
            timesString;

        days = [];
        dayNames = ['mon', 'tues', 'wed', 'thurs', 'fri', 'sat', 'sun'];

        _.each(periods, function(period) {

          dayIndex = period.open.day;
          dayTitle = dayNames[dayIndex];

          openAmPm = (period.open.hours < 12 ? 'am' : 'pm');
          openHours = (period.open.hours < 12 ? period.open.hours : period.open.hours - 12);
          openMinutes = (period.open.minutes ? ':' + period.open.minutes : '');
          openTime = openHours + openMinutes + openAmPm;

          closeAmPm = (period.close.hours < 12 ? 'am' : 'pm');
          closeHours = (period.close.hours < 12 ? period.close.hours : period.close.hours - 12);
          closeMinutes = (period.close.minutes ? ':' + period.close.minutes : '');
          closeTime = closeHours + closeMinutes + closeAmPm;

          timesString = openTime + ' - ' + closeTime;

          daysString = dayTitle;

          function TimePeriod(options) {
            _.extend(this, options);
          }

          days.push(new TimePeriod({
            startDay: dayTitle,
            endDay: dayTitle,
            daysString: daysString,
            timesString: timesString,
            open: openTime,
            close: closeTime,
          }));

        });

        _.each(days, function(day, i) {
          var nextDay;

          nextDay = days[i + 1];

          if (nextDay && day.timesString == nextDay.timesString) {
            nextDay.startDay = day.startDay;
            nextDay.daysString = nextDay.startDay + ' - ' + nextDay.endDay;
            day.toDelete = true;
          }

        });

        _.remove(days, {'toDelete': true});

        return days;

      }

      this.placesService.getDetails(request, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

          store.place = place;

          // store.open_now = place.opening_hours.open_now;
          // store.opening_hours = (place.opening_hours.periods ? formatOpeningHours(place.opening_hours.periods) : []);
          // store.int_phone = place.international_phone_number;
          // store.phone = (place.formatted_phone_number ? place.formatted_phone_number.replace(/\-/g, ' ') : false);
          // store.permanently_closed = place.permanently_closed;
          store.google_url = place.url;

          store.is_loading = false;

          if (callback && typeof callback == 'function') {
            callback();
          }

        } else {
          console.error(new Error('Error receiving data from Places service'));

          if (callback && typeof callback == 'function') {
            callback();
          }
        }

      });

    },

    _openStoreInfoWindow: function(store) {

      var self = this;

      var marker;

      if (!self.options.showStoreInfoWindow) {
        return;
      }

      marker = store.marker;

      if (!store.infoWindow) {
        store.infoWindowContent = document.createElement('div');
        store.infoWindowContent.innerHTML = theme.utils.getTemplate('store-location-info-popup');

        tinybind.bind(store.infoWindowContent, {
          store: store
        });

        store.infoWindow = new google.maps.InfoWindow({
          content: store.infoWindowContent,
        });
      }

      store.infoWindow.open(self.map, store.marker);

    },

    _focusGroup: function() {

      var id,
          group;

      id = event.currentTarget.value;

      if (id == '' || id =='none') {
        this._setActiveGroup(false);
        return;
      }

      group = _.find(this.data.groups, {'id': id});

      if (!group) {
        console.error(new Error('No group found!'));
        return;
      }

      this._setActiveGroup(group);

    },

    _setActiveGroup: function(group, updateMap) {

      var self = this;

      var center,
          address,
          markerPosition,
          activeGroup;

      activeGroup = this.data.activeGroup;
      if (activeGroup) {
        activeGroup.active = false;
      }

      if (group == false) {
        this.data.activeGroup = null;
        this._zoomToFitMarkers();
        this._setActiveStore(false, false);
        return;
      }

      this.data.activeGroup = group;

      group.active = true;

      if (updateMap == false) {
        return;
      }

      this._setActiveStore(false, false);

      if (group.markers.length > 1) {

        bounds = new google.maps.LatLngBounds();

        _.each(group.markers, function(marker, i) {
          bounds.extend(marker.getPosition());
        });

        self.map.fitBounds(bounds);

      } else {

        markerPosition = group.markers[0].getPosition();

        this.map.panTo(markerPosition);
        this.map.setZoom(14);

      }


      //  IF LOOKUP UP A REGION FROM MAPS API

      // if (region.geo) {
      //   console.info(this.data);
      //   this.map.fitBounds(region.geo.bounds);
      //   return;
      // }

      // this.geocoder.geocode({
      //   'address': region.title,
      //   'bounds': bounds
      // }, function(results, status) {

      //   if (status == 'OK') {
      //     center = results[0].geometry;
      //     region.geo = center;

      //     self.map.fitBounds(region.geo.bounds);
      //   } else {
      //     console.error(new Error('Geocode error: ' + status));
      //   }

      // });

      return group;

    },

    _prepareData: function() {

      var self = this;

      this._getData(processData);

      function processData() {
        self._prepareStoresData();
        self._prepareStoresTagsData();
        self._prepareGroupsData();
        self._prepareFiltersData();
      }

    },

    _getData: function(callback) {

      var dataContainer,
          rawData,
          parsedData,
          parseOptions,
          rawDataType;

      dataContainer = document.querySelector(selectors.storesDataContainer);

      rawDataType = this.options.rawDataType;

      if (!dataContainer) {
        console.error(new Error('Missing data container'));
        return;
      }

      rawData = dataContainer.innerHTML;

      switch(rawDataType) {

        case 'json':

          this.data.parsedData.data = JSON.parse(rawData);
          callback();
          return;

        case 'csv':

          parseOptions = {
            header: true,
            dynamicTyping: true
          };

          this.data.parsedData = Papa.parse(rawData, parseOptions);

          if (this.data.parsedData.errors && this.data.parsedData.errors.length > 0) {
            console.error(new Error('There was an error parsing data'));
            console.error(data.parsedData.errors);
            return;
          }

          callback();
          return;

        default:

          this.data.parsedData.data = rawData;
          callback();
          return;

      }

    },

    _prepareStoresData: function() {

      var self = this;

      var locationMarkerSVG,
          googleMapsSearchURLPrefix;

      locationMarkerSVG = theme.utils.getTemplate('store-location-marker-icon');
      googleMapsSearchURLPrefix = 'https://www.google.com/maps/search/';

      function Store(data) {

        _.extend(this, data);

        if (!this.title) {
          console.error(new Error('A title is required'));
          return
        }

        this.id = theme.utils.handleize(this.title);
        this.icon = locationMarkerSVG;
        this.google_url = googleMapsSearchURLPrefix + theme.utils.handleize(this.title).replace(/\-/g, '+')

        if (this.street && typeof this.street == 'string') {
          this.google_url = this.google_url + '+' + theme.utils.handleize(this.street).replace(/\-/g, '+');
        }

        if (this.opening_hours) {
          this.opening_hours = _.map(this.opening_hours.split(/,/), function(period) {
            return _.map(period.replace(/:/, '#').split(/#/), _.trim);
          });
        }
      }

      _.each(self.data.parsedData.data, function(value) {

        var store,
            locationData,
            existingArea;

        // Build store data
        store = new Store(value);
        self.data.stores.push(store);

      });

      // Sort stores by title
      self.data.stores = _.orderBy(self.data.stores, ['title'], ['city'], ['street']);

    },

    _prepareStoresTagsData: function() {

      var self = this;

      function Tag(data) {
        _.extend(this, data);
        this.id = theme.utils.handleize(this.title);
      }

      _.each(this.data.stores, function(store, i) {
        var existingTag,
            tagString,
            tags;

        if (store.tags && typeof store.tags == 'string') {

          tags = store.tags.split(',');

          store.tags = [];

          _.each(tags, function(tagString) {

            tagString = theme.utils.handleize(tagString);

            existingTag = _.find(self.data.tags, {'title': tagString });

            if (!existingTag) {

              tag = new Tag({ title: tagString });
              self.data.tags.push(tag);


            } else {
              tag = existingTag;
            }

            store.tags.push(tag);

          });

        }

      });

    },

    _prepareGroupsData: function() {

      var self = this;

      function Group(data) {
        _.extend(this, data);
        this.id = theme.utils.handleize(this.title);
      }

      _.each(this.data.stores, function(store, i) {
        var locationData,
            existingGroup;

        if (typeof store.group === 'undefined') {
          store.group = 'ungrouped';
        }

        if (store.group && typeof store.group == 'string') {

          existingGroup = _.find(self.data.groups, {'title': store.group });

          if (!existingGroup) {
            locationData = {
              title: store.group
            };

            group = new Group(locationData);
            self.data.groups.push(group);
            group.stores = [];

          } else {
            group = existingGroup;
          }

          store.group = group;

          group.stores.push(store);

        }

      });

    },

    _prepareFiltersData: function() {

      var self = this;

      var dataContainer,
          rawData,
          jsonData;

      dataContainer = document.querySelector(selectors.filtersDataContainer);

      if (!dataContainer) {
        console.error(new Error('Missing data container'));
        return;
      }

      rawData = dataContainer.innerHTML;
      jsonData = JSON.parse(rawData);

      function Filter(data) {
        _.extend(this, data);
        this.id = theme.utils.handleize(this.title);
      }

      _.each(jsonData, function(value) {
        var filter,
            tag;

        value.tag = _.find(self.data.tags, {'title': value.tag });

        if (value.tag) {
          value.tag.icon = value.icon;
        }

        filter = new Filter(value);
        self.data.filters.push(filter);

      });

    },

    _bindView: function() {

      tinybind.bind(this.container, {
        data: this.data,
        methods: this.methods
      });

    },

    _getMapStyles: function() {
      dataContainer = document.querySelector(selectors.mapSkinDataContainer);

      if (!dataContainer || !dataContainer.innerHTML) {
        return;
      }

      rawData = dataContainer.innerHTML;
      return JSON.parse(rawData);
    },

    _buildMap: function() {

      var self = this;

      var googleMapsAPIURL = 'https://maps.googleapis.com/maps/api/js?key=',
          googleMapsAPIKEY = shop.keys.googleMaps || '',
          googleMapsAdditionalLibraries  = '&libraries=places',
          options = this.options.map,
          mapSkin = this._getMapStyles();

      if(mapSkin) {
        options.styles = mapSkin;
      }

      if (!googleMapsAPIKEY) {
        // TODO : uncomment when will be APIKEY
        //return console.error(new Error('Google Maps API key is required. You can set this up as as Store metafield: '))
      }

      function initMap() {
        self.geocoder = new google.maps.Geocoder();
        self.map = new google.maps.Map(self.mapContainer, options);
        self.placesService = new google.maps.places.PlacesService(self.map);

        self._addMapMarkers();

        google.maps.event.addListenerOnce(self.map, 'idle', function() {
          self._onMapLoadComplete();
        });

        if (self.options.enableSearch) {
          self._prepareSearch();
        }
      }

      loadJS(googleMapsAPIURL + googleMapsAPIKEY + googleMapsAdditionalLibraries, initMap);

    },

    _addMapMarkers: function() {

      var self = this;

      _.each(this.data.stores, function(store, i) {
        var position,
            icon;

        position = {
          'lat': store.lat,
          'lng': store.long
        };
        icon = store.icon;


        store.marker = new google.maps.Marker({
          position: position,
          map: self.map,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(icon),
            size: new google.maps.Size(28, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(14, 40),
            scaledSize: new google.maps.Size(28, 40)
          },
          optimized: false
        });

        if (store.group) {
          store.group.markers = store.group.markers || [];
          store.group.markers.push(store.marker);
        }

        store.marker.addListener('click', function() {
          self._setActiveStore(store);
        });
      });

      this._clusterMarkers();
      this._zoomToFitMarkers();
      this._bindMapListners();

    },

    _clusterMarkers: function() {
      var self = this;

      var clusterMarkerSVG = theme.utils.getTemplate('store-location-cluster-marker-icon');

      _.each(this.data.groups, function(group, i) {

        var clusterStyles = [
          {
            width: 22,
            height: 28,
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(clusterMarkerSVG),
            textSize: 1,
            iconAnchor: [50, 100],
            textColor: 'transparent'
          }
        ];

        group.markerCluster = new MarkerClusterer(self.map, group.markers, {
          gridSize: 30,
          styles: clusterStyles,
          zoomOnClick: true,
          maxZoom: (self.options.activeStoreZoomLevel - 1),
          minimumClusterSize: 3,
        });

        self.data.markerClusters.push(group.markerCluster);

        _.each(group.stores, function(store) {
          store.markerCluster = group.markerCluster;
        });

      });

    },

    _zoomToFitMarkers: function() {

      var bounds = new google.maps.LatLngBounds();

      _.each(this.data.stores, function(store, i) {
        bounds.extend(store.marker.getPosition());
      });

      this.map.fitBounds(bounds);

    },

    _bindMapListners: function() {

      var self = this;

      this.map.addListener('bounds_changed', _.debounce(this._getMarkersInView.bind(self), 50));

    },

    _unbindMapListners: function() {

      var self = this;

      google.maps.event.clearListeners(this.map, 'bounds_changed');

    },

    _getMarkersInView: function() {

      var self = this;

      this.data.storesInView = [];
      this.data.storesInActiveGroup = [];

      // this.data.activeGroupTitle = 'none';

      var bounds = this.map.getBounds();

      _.each(this.data.stores, function(store, i) {
        var markerPosition,
            boundsContainsMarker;

        markerPosition = store.marker.getPosition();
        boundsContainsMarker =  bounds.contains(markerPosition);

        if (boundsContainsMarker && (!self.data.storesAreFiltered || self.data.storesAreFiltered && store.in_filter)) {
          store.in_view = true;
          self.data.storesInView.push(store);
        } else {
          store.in_view = false;
        }

        if (store.group == self.data.activeGroup) {
          store.in_active_group = true;
          self.data.storesInActiveGroup.push(store);
        } else {
           store.in_active_group = false;
        }

      });

      if (this.data.storesInView && this.data.storesInView.length == 1) {
        var store = this.data.storesInView[0];

        if (store != self.data.activeStore) {
          this._setActiveStore(store, false);
        }

      }

    },

    _findUser: function() {

      var self = this;

      this.data.geolocationLoading = true;

      function success(position) {
        var pos;

        pos = {
          lat: position.coords.latitude,
          long: position.coords.longitude
        };

        userLocation = new google.maps.LatLng(pos.lat, pos.long);

        self._updateUserMarker(userLocation);

        self._findClosestStore(userLocation);
        self.data.geolocationLoading = false;
      }

      function error() {

        self.data.geolocationLoading = false;
        self.data.geolocationEnabled = false;

        iziToast.error({
          title: 'We couldn\'t find your location',
          position: 'bottomCenter',
          theme: 'light',
        });

      }

      navigator.geolocation.getCurrentPosition(success, error);

    },

    _findClosestStore: function(latLng) {

      var self = this;

      var closestStore,
          bounds,
          userLocation,
          currentMapZoom;

      bounds = new google.maps.LatLngBounds();

      closestStore = getClosestStore(latLng);

      self._setActiveStore(closestStore, false);

      bounds.extend(closestStore.marker.getPosition());
      bounds.extend(latLng);

      self.map.fitBounds(bounds);

      currentMapZoom = this.map.getZoom();

      if (currentMapZoom > this.options.activeStoreZoomLevel) {
        self.map.setZoom(this.options.activeStoreZoomLevel);
      }

      function getClosestStore(latLng) {

        // https://stackoverflow.com/questions/4057665/google-maps-api-v3-find-nearest-markers
        var lat = latLng.lat();
        var long = latLng.lng();
        var R = 6371; // radius of earth in km
        var distances = [];
        var closest = -1;

        var closestStore = null;

        function rad(x) {return x*Math.PI/180;}

        _.each(self.data.stores, function(store, i) {

            var mlat = store.lat;
            var mlng = store.long;

            var dLat  = rad(mlat - lat);
            var dLong = rad(mlng - long);
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            distances[i] = d;

            if ( closest == -1 || d < distances[closest] ) {
                closest = i;
                closestStore = store;
            }

        });

        return closestStore;

      }

    },

    _updateUserMarker: function(latLng) {

      var self = this;

      var pos,
          icon,
          user,
          locationMarkerSVG;

      if (!latLng) {
        console.error(new Error('latLng must be defined'));
        return;
      }

      function User(data) {
        _.extend(this, data);
      }

      if (!this.data.user) {

        locationMarkerSVG = theme.utils.getTemplate('user-location-marker-icon');
        this.data.user = new User({
          icon: locationMarkerSVG
        });

      }

      user = this.data.user;

      user.latLng = latLng;

      if (!user.marker) {
        icon = user.icon;

        user.marker = new google.maps.Marker({
          position: user.latLng,
          map: self.map,

          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(icon),
            size: new google.maps.Size(24, 24),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12, 12),
            scaledSize: new google.maps.Size(24, 24)
          },

          optimized: false

        });

      } else {

        user.marker.setPosition(user.latLng);

      }

    },

    _prepareSearch: function() {

      this.data.searchEnabled = true;

      var self = this;

      var searchField;

      // If the search box breaks it is because we are
      // using TinyBind but searching for the input field
      // with an ID. Perhaps use a tinybind binder to
      // reference the input field.
      searchField = document.getElementById('store-locator-search')

      var country = '';

      if(/\.(com)\/?$/i.test(document.domain)) {
        country = 'us';
      } else {
        country = 'au';
      }

      this.autocomplete = new google.maps.places.Autocomplete(searchField);
      this.autocomplete.setComponentRestrictions({
        country: [country],
      });
      // #todo: Autocomplete.setFields()

      this.autocomplete.addListener('place_changed', function() {

        var place;

        place = self.autocomplete.getPlace();

        if (!place.geometry) {

          iziToast.error({
            title: 'We couldn\'t find this location',
            position: 'bottomCenter',
            theme: 'light',
          });

          return;
        }

        self._findClosestStore(place.geometry.location);
        self._updateSearchMarker(place.geometry.location);

      });
    },

    _updateSearchMarker: function(latLng) {

      if (!this.options.showSearchMarker) {
        return;
      }

      var self = this;

      var pos,
          icon,
          locationMarkerSVG;

      if (!latLng) {
        console.error(new Error('latLng must be defined'));
        return;
      }

      function Search(data) {
        _.extend(this, data);
      }

      if (!this.data.search) {

        locationMarkerSVG = theme.utils.getTemplate('search-location-marker-icon');
        this.data.search = new Search({
          icon: locationMarkerSVG
        });

      }

      search = this.data.search;
      search.latLng = latLng;

      if (!search.marker) {

        icon = search.icon;

        search.marker = new google.maps.Marker({
          position: search.latLng,
          map: self.map,

          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(icon),
            size: new google.maps.Size(24, 24),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12, 12),
            scaledSize: new google.maps.Size(24, 24)
          },

          optimized: false

        });

      } else {

        search.marker.setPosition(search.latLng);

      }

    },


  });

  return StoreLocator;

})();

window.theme = window.theme || {};
window.theme.slideshows = window.theme.slideshows || {};

theme.RelatedItems = (function() {

  var selectors = {
    slideshow: '[data-slideshow]'
  };

  function RelatedItems(container) {

    this.$container = $(container);
    this.$slideshows = $(selectors.slideshow, this.$container);

    $.each(this.$slideshows, function(index, slideshow) {
      theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
    });

  }
  
  return RelatedItems;

})();
/**
 * Free Gift Product
 * ------------------------------------------------------------------------------
 */

theme.GiftProduct = (function() {

  var selectors = {
    dataJsonContainer: '[data-free-gift-json]'
  };

  function GiftProduct(container) {
    this.container = container;
    this.namespace = '.giftProduct';

    if (!this.container) {
      return;
    }

    this.data = this._getData();

    if (!this.data || !this.data.variantId) {
      return;
    }

    this._bindCartEventListener();

  }

  GiftProduct.prototype = $.extend({}, GiftProduct.prototype, {

    _addGiftProductToCart: function(event, cart) {
      if (this._cartIsEligible(cart) && !this._giftItemIsInCart(cart)) {
        CartJS.addItem(this.data.variantId, 1, {
          '_is_free_gift': 'true',
          '_disable-line-item-edit': 'true',
          '_secret': this.data.secret
        });
      }
    },

    _bindCartEventListener: function() {
      $(document).on('cart.requestComplete' + this.namespace, this._addGiftProductToCart.bind(this));
    },

    _cartIsEligible: function(cart) {
      var i = cart.items.length, item;
      while(i--) {
        item = cart.items[i];
        if (item.properties && item.properties['_cart_is_free_gift_eligible']) {
          return true;
        }
      }
      return false;
    },

    _getData: function() {
      var dataJsonContainer = this.container.querySelector(selectors.dataJsonContainer);
      if (!dataJsonContainer) {
        return
      }
      return JSON.parse(dataJsonContainer.innerHTML);
    },

    _giftItemIsInCart: function(cart) {
      if (this._getGiftItemsInCart(cart).indexOf(this.data.variantId) > -1) {
        return true
      }
      return false;
    },

    _getGiftItemsInCart: function(cart) {
      return cart.items.map(function(item) {
        if (item.properties && item.properties['_is_free_gift']) {
          return item.id
        }
        return;
      });
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      $(document).off(this.namespace);
    }
  });

  return GiftProduct;
})();

window.theme = window.theme || {};

theme.Instagram = (function() {

  var config = {
    apiUrl: 'https://api.instagram.com/v1/users/self/media/recent/?access_token=',
  };

  var selectors = {
    mediaContainer: '.instagram-feature-media',
  };

  function Instagram(container) {
    this.$container = $(container);
    
    this.loadContent({
      $container: this.$container,
      accessToken: this.$container.data('access-token'),
      limit: this.$container.data('limit'),
    });

    $('esf').on('galleryPostsLoaded.ElfsightShoppableFeed', function(){
      if ($(window).width() < 768) {
        $(this).removeClass('elfsight-sf');
        $('.elfsight-sf-feed', this).slick({
          arrows: false,
          centerMode: true,
        });
      }
    });

  }

  Instagram.prototype = _.assignIn({}, Instagram.prototype, {
    loadContent: function(settings){
      if(settings.accessToken) {
        var url = config.apiUrl + settings.accessToken;

        $.ajax({
          type: 'GET',
          url: url,
          dataType: 'jsonp',
          success: function(data) {
            if(data.meta.code === 200 && data.data.length) {
              data = data.data;
              var count = 0;
              var $mediaContainer = $(selectors.mediaContainer, settings.$container);
              $mediaContainer.empty();

              for(var i = 0; i < data.length; i++) {
                var media = data[i], item;

                if(!media.images.low_resolution.url.includes('null')) {
                  item = '<img class="instagram-feed__img" src="' + media.images.low_resolution.url + '" data-filter="' + media.filter + '" />';
                  item = '<a href="' + media.link + '" target="_blank">' + item + '</a>';
                }

                // if(media.videos) {
                //   var src;

                //   if(media.videos.standard_resolution) {
                //     src = media.videos.standard_resolution.url;
                //   } else if(media.videos.low_resolution) {
                //     src = media.videos.low_resolution.url;
                //   } else if(media.videos.low_bandwidth) {
                //     src = media.videos.low_bandwidth.url;
                //   }

                //   item = '<video poster="' + media.images.low_resolution.url + '" controls>';
                //   item += '<source src="' + src + '" type="video/mp4;"></source>';
                //   item += '</video>';
                // }
                if(item) {
                  item = '<div class="instagram-feed__item">' + item + '</div>';
                }
                if(item !== '') {
                  $mediaContainer.append(item);
                  count++;
                }
                if(count == settings.limit) {
                  break;
                }          
              }

              if ('ScrollBooster' in window) {
                var viewport = document.querySelector('.instagram-feature');
                var content = viewport.querySelector('.instagram-feature-media');

                var sb = new ScrollBooster({
                  viewport: viewport,
                  content: content,
                  mode: 'x',
                  onUpdate: function(data) {
                    content.style.transform = 'translateX(' + -data.position.x + 'px)';
                  },
                  onClick: function(data, event) {
                    if (Math.abs(data.dragOffsetPosition.x) > 5) {
                      event.preventDefault();
                    }
                  },
                });
              }
            }
          },
          error: function() {

          }
        });
      }
    }
  });

  return Instagram;
})();

theme.current = theme.current || {};
theme.current.search = theme.current.search || {};

theme.InstantSearch = (function() {

  var options = {
    isOpenClass: 'instant-search-is-open',
    namespace: 'instantSearch',
    debugMode: false
  }

  var selectors = {
    header: '.site-header',
    searchInputs: 'header input[type="search"]',
    searchToggle: '.site-header__search-toggle--desktop',
    searchContainer: '.instant-search',
    searchContainerActive: 'active',
    searchClose: '.site-header__search-close',
    headerUpper: '.site-header__main',
    searchOpenClass: 'js-search--is-open',
    closeButtons: 'header input[type="search"] ~ .search__close'
  }

  function InstantSearch(container) {

    this.container = container;

    this.$container = $(container);
    this.$searchInputs = $(selectors.searchInputs);
    this.$searchToggle = $(selectors.searchToggle);
    this.$closeButtons = $(selectors.closeButtons);
    this.$searchClose = $(selectors.searchClose);

    this.options = options;

    var searchOptions = {
      provider: theme.settings.search.provider,
      clearResultsBetweenSearches: false,
      dataTypes: [
        'articles',
        'articles_returned_count',
        'articles_total_count',
        'collections',
        'collections_returned_count',
        'collections_total_count',
        'products',
        'products_returned_count',
        'products_total_count',
        'query',
      ],
      searchCount: {
        'products': 4,
        'articles': 2,
        'collections': 3
      }
    }

    this.search = new theme.Search(this.$searchInputs, searchOptions);

    this.data = {
      active: false
    }

    this.methods = {
      mouseoverContainer: this._mouseoverContainer.bind(this),
      mouseleaveContainer: this._mouseleaveContainer.bind(this),
    }

    this._bind();

  }

  InstantSearch.prototype = _.extend(InstantSearch.prototype, {

    _bind: function() {

      var self = this;

      tinybind.bind(this.container, {
        methods: this.methods,
        search: theme.current.search,
        data: this.data,
      })

      //// Listen to search service events ////

      this.$searchInputs.on('searchComplete.search', function() {
        self.data.loading = false;
        self.show();
      });

      this.$searchInputs.on('searchStart.search', function() {
        self.data.loading = true;
      });

      //// Add event listeners to external elements ////

      this.$searchInputs.on('click.' + this.options.namespace, function() {
        if (this.value) {
          self.search.search(this.value);
          self.show();
        }
      });

      this.$searchToggle.on('click', function() {
        self.show();
        if (this.value) {
          self.search.search(this.value);
        }
      });

      this.$searchInputs.on('focus.' + this.options.namespace, function() {
        if (this.value) {
          self.search.search(this.value);
          self.show();
        }
      });

      this.$searchInputs.on('keyup.' + this.options.namespace, _.debounce(function() {
        if (this.value) {
          self.search.search(this.value);
          self.show();
        } else {
          // self.hide();
        }
      }, 150));

      this.$closeButtons.on('click.' + this.options.namespace, function() {
        self.$searchInputs.blur();
        // self.search.search(this.$searchInputs.value);
        self.search.clearResults();
        self.hide();
      });
      this.$searchClose.on('click', function() {
        $(selectors.headerUpper).removeClass(selectors.searchOpenClass);
        self.$searchInputs.blur();
        // self.search.search(self.$searchInputs.value);
        self.search.clearResults();
        self.hide();
        // $(selectors.searchContainer).removeClass(selectors.searchContainerActive);
      });
      $(document).click( function(e){
        if ( $(e.target).closest(selectors.searchContainer).length ) {
          return;
        } else if($(e.target).closest('.site-header__search').length || $(e.target).closest('.site-header__search-toggle--mobile').length ) {
          return;
        } else {
          $(selectors.headerUpper).removeClass(selectors.searchOpenClass);
          self.$searchInputs.blur();
          self.search.clearResults();
          self.hide();
        }
      });

    },

    _mouseoverContainer: function() {
      this.data.mouseIsOverElement = true;
    },

    _mouseleaveContainer: function() {
      this.$searchInputs.blur();
      this.hide();
      this.data.mouseIsOverElement = false;
    },

    show: function() {

      if (this.data.active) {
        return;
      }

      var siteHeader = document.querySelector('header.header');
      var siteHeaderSearch = document.querySelector('.search-header.search');
      var siteHeaderBoundingClientRect = siteHeader.getBoundingClientRect();
      var siteHeaderSearchBoundingClientRect = siteHeaderSearch.getBoundingClientRect();
      this.container.style.top = siteHeaderBoundingClientRect.height + siteHeaderBoundingClientRect.top + siteHeaderSearchBoundingClientRect.height - 5 + 'px';
      this.container.style.maxHeight = 'calc(100% - ' + (siteHeaderBoundingClientRect.height + siteHeaderBoundingClientRect.top + siteHeaderSearchBoundingClientRect.height + 5) + 'px' + ')';

      document.documentElement.classList.add(this.options.isOpenClass);
      theme.utils.lockPageScroll(this.container);
      this.data.active = true;

    },

    hide: function() {

      if (!this.data.active || this.options.debugMode) {
        return;
      }

      document.documentElement.classList.remove(this.options.isOpenClass);
      // this.$searchInputs.blur();
      this.$searchInputs.val('');
      theme.utils.unlockPageScroll();
      this.data.active = false;

    }

  });

  return InstantSearch;
})();
window.theme = window.theme || {};
window.theme.slideshows = window.theme.slideshows || {};

theme.ProductRecommendations = (function() {


    function ProductRecommendations(container) {

        var $container = this.$container = $(container);
        var sectionId = $container.attr('data-section-id');
        var slideshow = '#Slideshow-product-recommendations';

        var init_slick = function () {

            $(slideshow).slick({
                mobileFirst: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                dots:true,
                responsive: [
                    {
                        breakpoint: 600,
                        settings: "unslick",
                    }
                    // You can unslick at a given breakpoint now by adding:
                    // settings: "unslick"
                    // instead of a settings object
                ]
            });



        };

        var loadProductRecommendationsIntoSection = function () {
            var productRecommendationsSection = document.querySelector(".product-recommendations");
            if (productRecommendationsSection === null) {
                return;
            }
            var productId = productRecommendationsSection.dataset.productId;
            var baseUrl = productRecommendationsSection.dataset.baseUrl;
            var limit = productRecommendationsSection.dataset.limit;
            var requestUrl = baseUrl + "?section_id=product-recommendations&product_id=" + productId + "&limit=" + limit;
            var request = new XMLHttpRequest();
            request.open("GET", requestUrl);
            request.onload = function () {
                if (request.status >= 200 && request.status < 300) {
                    var container = document.createElement("div");
                    container.innerHTML = request.response;
                    productRecommendationsSection.parentElement.innerHTML = container.querySelector(".product-recommendations").innerHTML;
                }
                init_slick();
                theme.wishlist.update();
                // theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
            };
            request.send();
        };

        document.addEventListener("shopify:section:load", function (event) {
            if (event.detail.sectionId === "product-recommendations") {
                loadProductRecommendationsIntoSection();
                theme.wishlist.update();
                // theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
            }
        });
        loadProductRecommendationsIntoSection();
        init_slick();


    }


    return ProductRecommendations;

})();
window.theme = window.theme || {};

theme.Faq = (function(container) {

  var selectors = {
    container: '.faq-search-input-wrapper',
    searchInput:'.faq-search',
    answersContainer: '.faq-container',
    searchContainer: '.faq-search-wrapper',
    searchButton: '.search-button',
    searchClose: '.search-button.close',
    tabHandles: '.tabs-menu a',
    tabContainer: '.tabs-menu',
    faqAccordionWrap: '.faq-category-wrap',
    faqAccordion: '.faq-category__title',
    stickyNavigation: '.js-faq-sticky__element'
  };

  function Faq() {

    if ($(selectors.stickyNavigation).length) {
      initStickyNav();
    }

    if ($(selectors.container).length) {
      initSearch();
    }

    if ($(selectors.tabContainer).length) {
      initTabs();
    }


    if ($(selectors.faqAccordion).length > 0) {
      $(selectors.faqAccordion).on('click', function() {
        var $this = $(this);

        if ($(window).width() < 900) {
          if ($this.closest(selectors.faqAccordionWrap).hasClass('active')) {
            $this.closest(selectors.faqAccordionWrap).removeClass('active');
          } else {
            $(selectors.faqAccordionWrap).removeClass('active');
            $this.closest(selectors.faqAccordionWrap).addClass('active');
          }
        }
      })
    }

    function initTabs(){
      //show all groups if all tabs is active
      if ($('.all-tabs').length) {
        showAllFaq($('.all-tabs'));
      }

      $('.tabs-menu a').click(function(e) {
        e.preventDefault();
      });

      //this is in tabs already
      function showAllFaq(_this){
        _this.parent().addClass("current");
        _this.parent().siblings().removeClass("current");
        $(".tab-content").addClass("js-d-flex");
      }

    }

    function initStickyNav(){
      $($(selectors.stickyNavigation)).each( function(){
        var elementOptions = $(this).data() ? $(this).data() : 0;

        $(this).stickybits({
          stickyBitStickyOffset: elementOptions.offsetDesktop,
          useStickyClasses: true,
        });

      });
    }

    function initSearch(){

      var list = theme.faqContent;

      if (!list) {
        return;
      }

      var options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          "category",
          "question",
          "answer"
        ]
      };

      var fuse = new Fuse(list, options);

      $(selectors.searchInput).on('keyup', function(){
        var search_value = $(this).val();

        if (search_value != '') {
          search(search_value);
        }
        else {
          closeSearch();
        }
      
      });

      $(selectors.container).on('click', selectors.searchClose, function(){
        closeSearch();
      });

      function closeSearch(){
        $(selectors.searchContainer).removeClass('active');
        $(selectors.answersContainer).removeClass('hidden');
        $(selectors.searchButton).removeClass('close');
        $(selectors.searchInput).val('');
      }

      function openSearch(){
        $(selectors.searchContainer).addClass('active');
        $(selectors.answersContainer).addClass('hidden');
        $(selectors.searchButton).addClass('close');
      }

      function search(search_value) {
        var result = fuse.search(search_value),
            searchResults = '';

        if (result.length >= 1) {
           openSearch();
        } else {
          $(selectors.searchContainer).html('<p>No results found</p>');
        }

        $(selectors.searchContainer).html('');

        for (var i = 0; i < result.length; i++) {
          var answerTemplate = theme.utils.getTemplate('faq-item');

          answerTemplate = answerTemplate.replace('{question}',result[i].question);
          answerTemplate = answerTemplate.replace('{answer}', result[i].answer);

          var answerElement = theme.utils.createElementFromHTML(answerTemplate);
          //searchResults = searchResults + answerTemplate;
          $(selectors.searchContainer).append(answerElement);

          new theme.SimpleAccordion(answerElement);
        }
      }

    }

  }
  
  return Faq;

})();

window.theme = window.theme || {};
theme.About = (function() {

$('.button__play').on('click',function () {
    var $this = $(this);
    var $videoContent = $this.closest('.content-video').find('iframe');
    var src = $videoContent.attr('src');
    $videoContent.attr('src', src + '&autoplay=1');
    var $imageVideo = $this.closest('.video__image');
    $imageVideo.hide();
})

})();
window.theme = window.theme || {};

theme.FooterCart = function () {

    var selectors = {
      clickButton: '.footer-popup'
    };

    function FooterCart(container) {

     this.$container = $(container);
     this.buttons = $(selectors.clickButton,this.$container);
     this.initClick();

    }

    FooterCart.prototype = $.extend({}, FooterCart.prototype, {

        openPopup: function(attr) {
            new theme.Modal(attr, {
                positionX: 50,
                positionY: 50,
                featherlightOptions: {
                    variant: 'cart-modal',
                }
            });
        },

        initClick: function() {
            if (!this.buttons.length) {
                return;
            }
            var self = this;
            this.buttons.on('click',function () {
             self.openPopup($("[data-popup='"+ $(this).attr("href") + "']"));
            });
        }
    });

    return FooterCart;

}();

window.theme = window.theme || {};

theme.BlogLibrary = (function () {
  const $library = document.querySelector('#library-data');
  const $libraryMenu = document.querySelector('.js-library-menu');

  // check if container exist block
  if (!$libraryMenu && !$library) return;
  // check if textContent not empty
  if (!$library.textContent) return;

  const data = JSON.parse($library.textContent);
  const tags = {};
  let finalList = '';

  data.forEach(parent => {
    const newData = parent.split('##');
    const currKey = newData.find(key => key.includes('parent:'));
    const values = [];

    newData.forEach(el => {
      if (!el.includes('parent:') && el.trim())
        values.push(el);
    });

    if (!tags[currKey]) {
      tags[currKey] = values;
    } else {
      tags[currKey] = [...tags[currKey], ...values].filter(onlyUnique)
    }
  });

  for (let key in tags) {
    finalList += displayList(key, tags[key]);
  }
  $libraryMenu.innerHTML = finalList;

  // Helpers Function

  // check on unique words
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  // Display List from obj key and value
  function displayList(key, value) {
    const titleHandle = theme.utils.handleize(key);
    const title = key.replace('parent:', '');
    const tags = value;
    const baseUrl = document.location.href;
    let blogUrl = baseUrl;

    if (blogUrl.includes('/tagged/')) {
      blogUrl = blogUrl.split('/tagged/')[0];
    }

    let categoryUrl = `${blogUrl}/tagged/${titleHandle}`;
    let categoryActiveClass = '';

    if (baseUrl.includes(titleHandle)) {
      categoryActiveClass = 'active';
      categoryUrl = blogUrl;
    } else {
      categoryActiveClass = '';
    }


    return `
    <ul class="library-menu__list library-menu__list--${titleHandle}">
      <li class="library-menu__li library-menu__li--title ${categoryActiveClass}">
        <a href="${categoryUrl}">${title}</a>
      </li>
      ${tags.map(val => {
      const tag = theme.utils.handleize(val);
      let activeClass = '';
      let tagUrl = `${blogUrl}/tagged/${titleHandle}+${tag}`;

      if (baseUrl.includes(titleHandle) && baseUrl.includes(tag)) {
        activeClass = 'active';
        tagUrl = blogUrl;
      } else {
        activeClass = '';
      }

      return `
            <li class="library-menu__li ${activeClass}">
              <a href="${tagUrl}" class="library-menu__link ${activeClass}">${val}</a>
            </li>
          `
    }).join('')}
    </ul>
    `;
  }
})();

window.theme = window.theme || {};

theme.Nutrition = (function () {
  const markData = {
    $inputWrapper: document.querySelector('.js-mark-search'),
    $input: document.querySelector('.js-mark-input'),
    classSubmitBtn: 'js-mark-submit',
    classClearBtn: 'js-mark-clear',
    $content: document.querySelector('.js-mark-content'),
    offsetTop: 100,
    currentIndex: 0,
    currentClass: 'current',
    results: null
  };

  const glossary = {
    $script: document.querySelector('#glossary-data'),
    data: null,
    filterData: {},
    content: ''
  };


  const sticky = {
    $elem: $('.js-intro-sticky'),
    $elemScroll: '#fixedOnScroll',
    options: {
      stickyBitStickyOffset: 74,
      useStickyClasses: true,
    }
  };

  var stickything;

  initContent();

  function initContent() {
    if (glossary.$script && glossary.$script.textContent) {
      let parsedData = JSON.parse(glossary.$script.textContent);

      dataFilling(parsedData);
      createStringFromData(glossary.filterData);

      markData.$content.innerHTML = glossary.content;

      initSearch();

      if (sticky.$elem) {
        // initStickyIntro();
        desktopSticky();

        window.addEventListener(
            'resize',
            debounce(desktopSticky, 250)
        );
      }
    }
  }

  // push data to filterData
  function dataFilling(arr) {
    arr.filter(obj => {
      if (!glossary.filterData[obj.letter] && obj.letter) {
        glossary.filterData[obj.letter] = [obj]
      } else if (glossary.filterData[obj.letter]) {
        glossary.filterData[obj.letter] = [...glossary.filterData[obj.letter], obj]
      }
    });
  }

  function createStringFromData(data) {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        glossary.content += displayGlossary(key, data[key])
      }
    }
  }

  // init sticky intro
  function initStickyIntro() {
    if ($(window).width() <= 599) {

     if ($(sticky.$elem).hasClass('nutrition-intro--not-sticky')) {
       $(sticky.$elem).removeClass('nutrition-intro--not-sticky');
     }

    if (!$(sticky.$elem).parent().hasClass('js-stickybit-parent')) {
         $(sticky.$elem).stickybits(sticky.options);
      }
    } else {
      $(sticky.$elem).addClass('nutrition-intro--not-sticky');
    }
  }

  function desktopSticky() {
    if (stickything) {
      stickything.cleanup();
    }

    let headerHeight = $('.header').height();
    let elementHeight = $(sticky.$elemScroll).height();
    stickything = $(sticky.$elemScroll).stickybits({
      stickyBitStickyOffset: headerHeight+10,
      useStickyClasses: true,
    })
    $(sticky.$elemScroll).next().css({
      'min-height' : elementHeight
    })
  }

  // Search
  function initSearch() {
    const markInstance = new Mark(markData.$content);

    // Listen to input and option changes
    markData.$inputWrapper.addEventListener('click', (event) => {
      let target = event.target;

      if (target.classList.contains(markData.classSubmitBtn) && markData.$input.value) {
        performMark(markInstance, markData.$input);
        markData.$inputWrapper.classList.add('open');
      } else if (target.classList.contains(markData.classClearBtn) && markData.$input.value) {
        clearInputValue(markInstance, markData.$input);
        markData.$inputWrapper.classList.remove('open')
      }
    });

    // on press key enter
    window.addEventListener('keyup', function (event) {
      if (event.key === 'Enter' && markData.$input.value.length) {
        performMark(markInstance, markData.$input);
        markData.$inputWrapper.classList.add('open')
      }
    });
  }

  function performMark(instance, input) {
    let value = input.value;
    const options = {
      separateWordSearch: true,
      done: function () {
        markData.results = markData.$content.querySelectorAll('mark');
        markData.currentIndex = 0;
        jumpTo();
      }
    };
    instance.unmark({
      done: function () {
        instance.mark(value, options);
      }
    });
  }

  function clearInputValue(instance, input) {
    instance.unmark();
    input.value = '';
    input.focus();
  }


  // Helpers Function

  // Jumps to the element matching the currentIndex
  function jumpTo() {
    if (markData.results.length) {
      let position;
      let $current = markData.results[markData.currentIndex];

      markData.results.forEach(res => res.classList.remove(markData.currentClass));
      if ($current) {
        $current.classList.add(markData.currentClass);
        position = getOffset($current).top - markData.offsetTop;
        window.scrollTo(0, position);
      }
    }
  }

  // display Glossary section
  function displayGlossary(key, value) {
    return `
      <section id="alphabet-${key}" class="nutrition__section">
        <h2 class="nutrition__title">${key}</h2>
        ${value.map(displayArticle).join('')}
      </section>
    `
  }

  // display single article
  function displayArticle(article) {
    return `
        <article class="nutrition__item nutrition-item">
            <h4 class="nutrition-item__title">${article.title}</h4>
            <p class="nutrition-item__content">${article.content}</p>
        </article>
    `;
  }

  // get element offset
  function getOffset(element) {
    if (!element.getClientRects().length) {
      return {top: 0, left: 0};
    }

    let rect = element.getBoundingClientRect();
    let win = element.ownerDocument.defaultView;
    return ({
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset
    });
  }

  // debounce
  function debounce(fn, ms = 0) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  }

})();

window.theme = window.theme || {};

theme.Sponsorship = (function () {

  var form = document.querySelector( '#contact_form' );
  var btn = form.querySelector( 'button[type="submit"]' );
  var inputs = form.querySelectorAll( '.js-input-file' );
  // var clearUpload = form.querySelector( '#clearUpload' );
  var file = $('#FileUpload'),
      removeBtn = $('#clearUpload');

  removeBtn.on('click', function () {
      let uploadLabel = $('[for="'+removeBtn.attr('data-clear')+'"]');
      file.val('');
      uploadLabel.find('.upload-wrapper__btn').text(uploadLabel.attr('data-init-text'));
      removeBtn.removeClass('show');
  });
  file.on('change', function() {
    console.log('change');
    if (file.val()) {
      removeBtn.addClass('show');
    } else {
      removeBtn.removeClass('show');
    }
  });

  if (inputs.length) {
    Array.prototype.forEach.call( inputs, function( input ) {
      var label	 = input.nextElementSibling,
          labelVal = label.innerHTML;

      input.addEventListener( 'change', function( event ) {
        let fileName = '';
        if( this.files && this.files.length > 1 ) {
          fileName = ( this.dataset.multipleCaption || '' ).replace( '{count}', this.files.length );
        } else {
          fileName = event.target.value.split( '\\' ).pop();
        }

        if( fileName ) {
          label.querySelector( 'span' ).innerHTML = fileName;
        } else {
          label.innerHTML = labelVal;
        }
      });
    });
  }

  if (btn) {
    btn.addEventListener('click', function (event) {
      let cbxs = form.querySelectorAll('input[name="contact[event_type]"]');
      const confirmEmail = form.querySelector('#confirm_mail');
      const email = form.querySelector('#email');

      if (cbxs.length) {
        let isValid = false;

        cbxs.forEach(cbx => {
          if (cbx.checked) isValid = true;
        });

        if (!isValid) {
          event.preventDefault();
          alert ("Choose Type of Event!");
        }
      }

      if (confirmEmail.value) {
        if(confirmEmail.value !== email.value) {
          event.preventDefault();
          alert ("Confirmed Email should be same as an email!");
        }
      }
    });
  }

  $('.js-masked-phone').mask('+ 00 0 0000 0000', {placeholder: "+ 00 0 0000 0000"});
  $('.js-masked-day').mask("00/00/0000", {placeholder: "__/__/____"});
})();


/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if ($newAddressForm.length) {

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
        hideElement: 'AddressProvinceContainerNew'
      });
    }

  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  $('.js-address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
      setTimeout(function () {
        window.location.href = '/account/addresses';
      }, 5000)
    }
  });

  const $buttonsToggleForm = [...document.querySelectorAll('[data-address-form]')];
  const $addressForms = [...document.querySelectorAll('[data-address-form-id]')];

  if ($buttonsToggleForm.length) {
    $buttonsToggleForm.forEach(function (btn) {
      const id =  btn.dataset.addressForm;

      btn.addEventListener('click', function (event) {
        event.preventDefault();

        $addressForms.forEach(closeForm);
        if (id) {
          openForm(id);
        }
      })
    });
  }

  // Open hidden Form by ID
  function openForm(id) {
    const $currentForm = document.querySelector(`[data-address-form-id="${id}"]`);

    $currentForm.classList.add('active');
    $currentForm.style.height = "auto";
    const height = $currentForm.clientHeight + "px";

    setTimeout(() => {
      $currentForm.style.height = height
    }, 0);
  }

  // Close Form by elem
  function closeForm(el) {
    if (el.classList.contains('active')) {
      el.style.height = "0px";
      el.addEventListener('transitionend', () => {
        el.classList.remove('active')
      }, {once: true});
    }
  }

})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {

  var config = {
    recoverPasswordForm: '#RecoverPassword',
    newCustomerForm: '#NewCustomer',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink',
    HideNewCustomerLink: '#HideNewCustomerLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();
  newCustomerSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  $(config.newCustomerForm).on('click', onShowHideNewCustomerForm);
  $(config.HideNewCustomerLink).on('click', onShowHideNewCustomerForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();

    if (!$('#RecoverEmail').val()) {
      var enteredEmail = $('#CustomerEmail').val();
      $('#RecoverEmail').val(enteredEmail);
    }

    toggleRecoverPasswordForm();
  }

  function onShowHideNewCustomerForm(evt) {
    evt.preventDefault();

    if (!$('#CreateEmail').val()) {
      var enteredEmail = $('#CustomerEmail').val();
      $('#CreateEmail').val(enteredEmail);
    }

    toggleNewCustomerForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }

    if (hash === '#create') {
      toggleNewCustomerForm();
    }

  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  function toggleNewCustomerForm() {
    $('#NewCustomerForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    // $('#ResetSuccess').removeClass('hide');
    // $('#CustomerLoginForm').toggleClass('hide');

    iziToast.success({
      message: theme.strings.recoverPasswordEmailSent,
      position: 'bottomCenter',
      theme: 'light',
      closeOnClick: true,
      timeout: false,
    });

  }

  function newCustomerSuccess() {
    var $formState = $('.new-customer-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#NewCustomerSuccess').removeClass('hide');
  }
})();

window.theme = window.theme || {};

theme.RegisterPage = (function() {
  var selectors = {
    registerPage: '.register-page',
  };

  if (!$(selectors.registerPage).length) {
    return;
  }

  var validateABN = function(abn) {
    var isValid = true;
    abn = abn.replace(/[^0-9]/g, '');
    isValid &= abn && /^\d{11}$/.test(abn);

    if(isValid){
      var weightedSum = 0;
      var weight = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
      for (var i = 0; i < weight.length; i++) {
        weightedSum += (parseInt(abn[i]) - ((i === 0) ? 1 : 0)) * weight[i]; 
      }
      isValid &= ((weightedSum % 89) === 0);
    }

    return isValid;
  };

  var abnField = document.getElementById('CustomerFormABN');
  if (abnField !== undefined && abnField !== null) {
    abnField.addEventListener('input', function (event) {
      if (abnField.validity.typeMismatch || validateABN(abnField.value) != true) {
        abnField.setCustomValidity('Please enter a valid ABN.');
      } else {
        abnField.setCustomValidity('');
      }
    });
  }

  if ($('#CustomerFormCustomerType').length) {
    updateRegisterFormFields($('#CustomerFormCustomerType').val());

    $('#CustomerFormCustomerType').on('change', function(){
      updateRegisterFormFields($(this).val());
    });
  }

  $('.form-element--product-interest label:last-child input').on('change', function() {
    $('.form-element--product-interest label input').not(this).prop('checked', this.checked);
  });

  $('.form-element--product-interest label:not(:last-child) input').on('change', function() {
    $('.form-element--product-interest label:last-child input').prop('checked', false);
  });
  
  function updateRegisterFormFields(selector) {
    var activeGroup = theme.utils.handleize(selector);
    var activeSelector = '.form-element--' + activeGroup;
    
    $('.form-element--toggles').not(activeSelector).hide();
    $('.form-element--toggles').not(activeSelector).removeClass('form-element--visible');
    $('.form-element--toggles').not(activeSelector).prop('disabled', true);
    
    $(activeSelector).show();
    $(activeSelector).addClass('form-element--visible');
    $(activeSelector).prop('disabled', false);
    
    $('input[name="tags"]').val(activeGroup);
  };

})();

window.theme = window.theme || {};

theme.Password = (function() {
  var selectors = {
    passwordPage: '.password-page',
    loginModal: '#LoginModal',
    focusOnOpen: '#Password'
  };

  if (!$(selectors.passwordPage).length) {
    return;
  }

  initModal();

  function initModal() {

    var $loginModal = $(selectors.loginModal);

    if (!$loginModal.length) {
      return;
    }

    var passwordModal = new theme.Modals(selectors.loginModal, 'login-modal', {
      focusOnOpen: selectors.focusOnOpen
    });

    // Open modal if errors exist
    if ($loginModal.find('.errors').length) {
      passwordModal.open();
    }

  }
})();

window.theme = window.theme || {};

theme.Blog = (function() {

  var selectors = {
    filter: '.js-blog-filter'
  };

  function Blog(container) {
    
    var $selectList = $(selectors.filter);

    $selectList.each(function(){
      var self = this;
      var selected = $('option:selected', self);
    });

    $(selectors.filter).on('change', function(){

      var selectedOptions = $('option:selected', selectors.filter).map(function(){
        return this.value.toString();
      });

      window.location.href = window.location.pathname.replace(/\/tagged\/.*/, '') + '/tagged/'+ _.uniq(selectedOptions).join('+');

    });

  }

  return Blog;

})();


$(document).ready(function() {

  // Object-fit polyfill initialise
  objectFitImages();

  // Hacky IE Lazysizes fix until we find a better solution or drop IE
  if (isMSIE) {
    var lazyImageChecker = window.setInterval(function(){
      if(!$('img.lazyload').length) { window.clearInterval(lazyImageChecker); }
      $('img.lazyloading').each(function(){
        var imageSrc = $(this).attr('data-src');
        $(this).removeClass('lazyloading');
        $(this).get(0).src = imageSrc;
      });
    }, 3000);
  }

  var sections = new slate.Sections();
  sections.register('cart-upsell-products', theme.CartUpsell);
  sections.register('cart-template', theme.Cart);
  sections.register('product-page', theme.ProductPage);
  sections.register('collection-template', theme.Filters);
  sections.register('sticky-sub-nav', theme.StickySubNav);
  sections.register('product-template', theme.ProductPage);
  sections.register('header-section', theme.HeaderSection);
  sections.register('footer-section', theme.FooterSection);
  sections.register('map', theme.Maps);
  sections.register('store-locator', theme.StoreLocator);
  sections.register('gift-product', theme.GiftProduct);
  sections.register('instant-search', theme.InstantSearch);
  sections.register('slideshow-section', theme.SlideshowSection);
  sections.register('featured-collections', theme.FeaturedCollections);
  sections.register('latest-blog-posts', theme.LatestBlogPosts);
  sections.register('home-related-product', theme.LatestBlogPosts);
  sections.register('instagram-feature', theme.Instagram);
  sections.register('product-recommendations', theme.ProductRecommendations);
  sections.register('faq', theme.Faq);
  sections.register('about-us', theme.About);
  sections.register('related-items', theme.RelatedItems);
  sections.register('cart-footer-modal', theme.FooterCart);
  sections.register('blog-library', theme.BlogLibrary);
  sections.register('nutrition', theme.Nutrition);
  sections.register('sponsorship', theme.Sponsorship);
  // sections.register('featured-product', theme.FeaturedProduct);
  // sections.register('featured-products', theme.FeaturedProducts);
  // sections.register('image-row', theme.ImageRows);
  // sections.register('content-slider', theme.ContentSliders);
  // sections.register('image-gallery-slider', theme.ImageGallerySliders);
  // sections.register('featured-collection', theme.FeaturedCollection);
  // sections.register('brand-values', theme.BrandValueSliders);
  // sections.register('quotes', theme.Quotes);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  $('a[href="#"]').on('click', function(evt) {
    evt.preventDefault();
  });

  // Theme-specific selectors to make tables scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper'
  });

  // Theme-specific selectors to make iframes responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="youtube-nocookie.com/embed"],' +
    '.rte iframe[src*="youtu.be"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

  // Setup progress bar plugin
  if ('NProgress' in window) {
    NProgress.configure({ showSpinner: false });
  }

  // Setup Zendesk links
  $('a[href="#livechat"]').on('click', function() {
    if ('$zopim' in window) {
      $zopim.livechat.window.show();
    }
  });

  // Show/record recently viewed products
  if (theme.RecentlyViewed) {
    theme.RecentlyViewed.showRecentlyViewed();
    theme.RecentlyViewed.recordRecentlyViewed();
  }


  // Transition helpers
  $('[data-prepare-transition="hover"]').on('mouseenter', function(){
    var activeClass = $(this).data('data-prepare-transition-class') || 'hover';
    $(this).prepareTransition().addClass(activeClass);
  });

  $('[data-prepare-transition="hover"]').on('mouseleave', function(){
    var activeClass = $(this).data('data-prepare-transition-class') || 'hover';
    $(this).prepareTransition().removeClass(activeClass);
  });


  // Update 'last viewed of type' text to match last viewed object, e.g. breadcrumbs

  $('[data-last-viewed]').each(function(){
    var $this = $(this);
    var type = $this.data('last-viewed');
    var typeVar = 'lastViewed' + type.charAt(0).toUpperCase() + type.slice(1);
    var lastViewed = sessionStorage[typeVar];

    if (lastViewed !== undefined) {
      type += 's';
      var relatedObjects = $this.data('related-' + type);
      if (relatedObjects[lastViewed] !== undefined) {
        $this.text(relatedObjects[lastViewed].title);
      }
    }
  });


  document.querySelectorAll('[data-viewport-container]').forEach(function(elem){
    if (elem.scrollWidth > elem.clientWidth) {
      elem.classList.add('force-visibility');
    }
  });


  // Show password buttons
  $('.form-vertical__password-toggle').on('click', function(){
    var $input = $($(this).siblings('input'));

    $(this).toggleClass('active');

    if ($input.attr('type') == 'password') {
      $input.attr('type', 'text');
    } else {
      $input.attr('type', 'password');
    }
  });


  // theme.Translate = theme.Translate || {};
  // theme.Translate.updateSelectElements = function(elem){
  //   var countryCode = $('option:selected', elem).data('country-code');
  //   $(elem).parent().attr('data-lang', countryCode);
  // };

  // if ($.cookie('googtrans')) {
  //   $('.translate-select option[data-google-code="' + $.cookie('googtrans') + '"]').attr('selected', 'selected');
  //   $('.translate-select').trigger('change');
  // }


  // Init CSS Custom Property polyfill
  cssVars();


  if (window.location.hostname == 'localhost') {
    document.documentElement.classList.add('localhost');
  }

  try {
    var colorPrimary = getComputedStyle(document.body).getPropertyValue('--color-primary').trim();
    $('meta[name=theme-color]').attr('content', colorPrimary);
  } catch (err) {
    console.error(err);
  }

  // Submit customer forms with Accentuate
  var asyncForms = document.querySelectorAll('[data-async-submit]');

  for (var i = asyncForms.length - 1; i >= 0; i--) {
    var asyncForm = asyncForms[i];
    $(asyncForm).on('submit.asyncSubmit', function() {
      event.preventDefault();
      asyncSubmitForm(asyncForm);
    });
  }

  function asyncSubmitForm(form) {

    var submitButton = form.querySelector('[type="submit"]');
    form.classList.add('loading');
    submitButton.classList.add('loading');

    var $form = $(form);
    loadJS('https://app.accentuate.io/dist/proxy.js', function() {

      $form.off('submit.asyncSubmit');

      Accentuate($form, function() {
        setTimeout(function() {
          window.location.reload();
        }, 500);
      });

      $form.submit();

    });

  }


    if (window.location.href.includes('&form_type=customer')){
      document.getElementById("itscustomer").style.display = "block";
      document.getElementById("newsletterfield").style.display = "none";
    }

});
