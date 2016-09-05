// must be loaded at the end of the body element
(function(){
  var addEvent = function(element, events, func){
      events = events.split(' ');
      for (var i = 0; i < events.length; i++) {
        if(element.addEventListener){
          element.addEventListener(events[i], func, false);
        }
        else{
          element.attachEvent('on'+events[i], func);
        }
      }
    },
    triggerEvent = function(element, eventName) {
      var evt = document.createEvent('HTMLEvents');
      evt.initEvent(eventName, true, true);
      element.dispatchEvent(evt);
    },
    eventPreventDefault = function(event){
      event = event || window.event;
      if (!event) {
        return;
      }
      if(event.preventDefault){
        event.preventDefault();
      }
      else{
        event.returnValue = false;
      }
    },
    eventStop = function(event) {
      event = event || window.event;
      if (!event) {
        return;
      }
      if(event.stopPropagation){
        event.stopPropagation();
      }
      else{
        event.cancelBubble = true;
      }
    },
    elementMatches = function(element, selector) {
      var methods = ['matches', 'matchesSelector', 'msMatchesSelector', 'mozMatchesSelector', 'webkitMatchesSelector'];
      for (var i = 0; i < methods.length; i++) {
        if (methods[i] in element) {
          return element[methods[i]](selector);
        }
      }
      return false;
    },
    addClass = function(element, className) {
      var elements = ('length' in element && !('className' in element))
        ? element
        : [element];
      for (var i = 0; i < elements.length; i++) {
        if (!hasClass(elements[i], className)) {
          elements[i].className += ' ' + className;
        }
      }
    },
    removeClass = function(element, className) {
      var elements = ('length' in element && !('className' in element))
        ? element
        : [element];
      for (var i = 0; i < elements.length; i++) {
        if (hasClass(elements[i], className)) {
          elements[i].className = elements[i].className.replace(new RegExp('(?:^|\\s+)' + className + '(?:$|\\s+)'), ' ');
        }
      }
    },
    hasClass = function(element, className) {
      return !!element.className.match('(?:^|\\s)' + className + '(?:$|\\s)');
    },
    toggleClass = function(element, className) {
      return hasClass(element, className)
        ? removeClass(element, className)
        : addClass(element, className);
    },
    getZoomLevel = function() {
      if (document.documentElement.clientWidth && window.innerWidth){
        return document.documentElement.clientWidth / window.innerWidth;
      }
      return 1;
    },
    each = function(array, callback) {
      if (!array || !array.length) {
        return;
      }
      for (var i = 0; i < array.length; i++) {
        callback(array[i], i);
      }
    },
    navMain = document.getElementById('main-navigation'),
    navMainLis, i, element, navMainTouched, touchUsed;

  // Main navigation search
  (function(elements){
    for (var i = 0; i < elements.length; i++) {
      addEvent(elements[i].getElementsByTagName('input')[0], 'focus', function(){
        addClass(this.parentNode, 'focus');
      });
      addEvent(elements[i].getElementsByTagName('button')[0], 'focus', function(){
        addClass(this.parentNode, 'focus');
      });
      addEvent(elements[i].getElementsByTagName('input')[0], 'blur', function(){
        removeClass(this.parentNode, 'focus');
      });
      addEvent(elements[i].getElementsByTagName('button')[0], 'blur', function(){
        removeClass(this.parentNode, 'focus');
      });
    }
  })(document.querySelectorAll && document.querySelectorAll('.main-navigation-search'));

  // Dropdown fix for all touch devices
  if(window.Modernizr && Modernizr.touch){
    if(navMain && navMain.getElementsByTagName('ul').length){
      // devices supporting touch events may not mean touch input is used
      // e.g. touch enabled laptops running Windows 8
      addEvent(navMain, 'touchstart', function(event) {
        touchUsed = true;
      });
      navMainLis = navMain.getElementsByTagName('ul')[0].childNodes;
      for(i = 0; i < navMainLis.length; i++){
        if(navMainLis[i].nodeName && navMainLis[i].nodeName.toLowerCase() === 'li' && navMainLis[i].querySelector('ul,.mega-dropdown')){
          element = navMainLis[i].getElementsByTagName('a');
          if(element && (element = element[0])){
            addEvent(element, 'click', function(event){
              if(navMainTouched !== this && touchUsed){
                navMainTouched = this;
                eventPreventDefault(event);
              }
            });
          }
        }
      }
    }
  }

  // Fixed elements
  (function(header, tagline) {

    if (!header) {
      return;
    }

    var nav = header.querySelector('.header-navigation-inner');
    var bar = header.querySelector('.header-bar');
    var originalHeight;
    var originalNavHeight;
    var originalBarHeight;
    var minNavHeight;
    var minBarHeight;

    var resetStyles = function() {
      removeClass(header, 'is-fixed');
      header.parentNode.style.paddingTop = '';
      if (nav) {
        nav.style.height = '';
      }
      if (bar) {
        bar.style.overflow = '';
        bar.style.height = '';
      }
      if (tagline) {
        tagline.parentNode.style.overflow = '';
        tagline.style.transform = tagline.style.WebkitTransform = '';
        tagline.style.opacity = '';
      }
    };

    var updateOriginalValues = function() {
      resetStyles();
      originalHeight = header.offsetHeight;
      originalNavHeight = nav && nav.offsetHeight;
      originalBarHeight = bar && bar.offsetHeight;
      if (nav) {
        nav.style.height = 0;
      }
      if (bar) {
        bar.style.height = 0;
      }
      minNavHeight = nav && nav.offsetHeight;
      minBarHeight = bar && bar.offsetHeight;
      if (nav) {
        nav.style.height = '';
      }
      if (bar) {
        bar.style.height = '';
      }
    };

    updateOriginalValues();

    var scroll = function() {

      if (getZoomLevel() > 1.01 || (window.matchMedia && window.matchMedia("(max-width: 900px)").matches)) {
        resetStyles();
        return;
      }

      var taglineHeight = tagline && tagline.offsetHeight;
      var documentHeight = window.innerHeight || document.documentElement.clientHeight;
      var offset = window.pageYOffset || document.documentElement.scrollTop || 0;

      // Only allow scroll positions inside the possible range
      offset = Math.min(
        document.documentElement.scrollHeight - documentHeight,
        offset
      );
      offset = Math.max(0, offset);

      addClass(header, 'is-fixed');
      header.parentNode.style.paddingTop = originalHeight + 'px';

      if (nav) {
        nav.style.height = Math.max(minNavHeight, originalNavHeight - offset) + 'px';
        offset -= originalNavHeight - Math.max(minNavHeight, originalNavHeight - offset);
      }

      if (bar) {
        if (offset > 0) {
          bar.style.overflow = 'hidden';
        }
        else {
          bar.style.overflow = '';
        }
        bar.style.height = Math.max(minBarHeight, originalBarHeight - offset) + 'px';
        offset -= originalBarHeight - Math.max(minBarHeight, originalBarHeight - offset);
      }

      if (tagline) {
        if (
          offset > 0
          && offset < taglineHeight
          && taglineHeight + originalHeight < documentHeight
        ) {
          tagline.parentNode.style.overflow = 'hidden';
          tagline.style.transform = tagline.style.WebkitTransform =
            'translate3d(0,'
            + Math.round(Math.min(offset, taglineHeight) / 2) + 'px,0)';
          tagline.style.opacity = (taglineHeight - (offset / 1.5)) / taglineHeight;
        }
        else {
          tagline.parentNode.style.overflow = '';
          tagline.style.transform = tagline.style.WebkitTransform = 'translate3d(0,0,0)';
          tagline.style.opacity = '';
        }
      }

    };

    addEvent(window, 'resize load', updateOriginalValues);
    addEvent(window, 'scroll resize load', scroll);
    scroll();

  })(
    document.querySelector && document.querySelector('.page-header'),
    document.querySelector && document.querySelector('.tagline-inner')
  );

  // Mobile navigation
  (function(nav, page) {
    if (!nav) {
      return;
    }
    document.body.insertBefore(nav, document.body.firstChild);
    var navLink;
    var isOpened;
    var open, close;
    var updateHeight = function() {
      if (!isOpened) {
        return;
      }
      if (!nav.offsetHeight) {
        // Close the nav if it is not visible anymore
        return close();
      }
      nav.style.minHeight = 0;
      page.style.height = Math.max((window.innerHeight || document.documentElement.clientHeight), nav.offsetHeight) + 'px';
      page.style.position = 'relative';
      page.style.overflow = 'hidden';
      nav.style.minHeight = '';
    };
    open = function() {
      isOpened = true;
      addClass(nav, 'is-active');
      updateHeight();
    };
    close = function() {
      isOpened = false;
      removeClass(nav, 'is-active');
      page.style.height = '';
      page.style.position = '';
      page.style.overflow = '';
    };
    addEvent(window, 'resize', updateHeight);
    addClass(nav, 'is-enabled');
    navLink = document.createElement('a');
    navLink.innerHTML = 'navigation';
    navLink.href = '';
    addClass(navLink, 'main-navigation-mobile-open');
    addEvent(navLink, 'click', function(event) {
      eventPreventDefault(event);
      if (hasClass(nav, 'is-active')) {
        close();
      }
      else {
        open();
      }
    });
    if (document.querySelector && document.querySelector('.page')) {
      document.querySelector('.page').insertBefore(
        navLink,
        document.querySelector('.page').firstChild
      );
    }
    else {
      nav.parentNode.insertBefore(navLink, nav);
    }
    closeButton = document.createElement('button');
    closeButton.innerHTML = 'close';
    addClass(closeButton, 'main-navigation-mobile-close');
    addEvent(closeButton, 'click', function(event) {
      if (isOpened) {
        close();
      }
      eventPreventDefault(event);
    });
    nav.appendChild(closeButton);
    var uls = nav.querySelectorAll('ul ul');
    var button;
    var buttonOnClick = function(event) {
      toggleClass(this.parentNode, 'is-expanded');
      toggleClass(this.parentNode, 'is-collapsed');
      updateHeight();
    };
    for (var i = 0; i < uls.length; i++) {
      button = document.createElement('button');
      button.innerHTML = 'expand';
      button.className = 'main-navigation-mobile-expand';
      addEvent(button, 'click', buttonOnClick);
      uls[i].parentNode.insertBefore(button, uls[i]);
      if (hasClass(uls[i].parentNode, 'active') || hasClass(uls[i].parentNode, 'trail')) {
        addClass(uls[i].parentNode, 'is-expanded');
      }
      else {
        addClass(uls[i].parentNode, 'is-collapsed');
      }
    }
  })(
    document.querySelector && document.querySelector('.main-navigation-mobile'),
    document.querySelector && document.querySelector('.page')
  );

  // Animations
  (function() {

    if (!window.Modernizr || !Modernizr.csstransitions) {
      return;
    }

    var getCounterValue = function(data, multiplier) {
      var value = data.number * multiplier;
      return data.prefix
        + value.toFixed(data.precision).split('.').join(data.separator)
        + data.suffix;
    };

    var initCounterAnimation = function(element) {
      if (!element.counterAnimationData) {
        var value = element.innerHTML;
        var matches = /^(.*?)(-?[0-9,.]*\d)(.*)$/.exec(value);
        if (!matches || !matches.length) {
          return;
        }
        var separator = matches[2].indexOf(',') > 0 ? ',' : '.';
        matches[2] = matches[2].split(',').join('.');
        if (isNaN(matches[2] * 1)) {
          return;
        }
        element.counterAnimationData = {
          original: value,
          prefix: matches[1],
          suffix: matches[3],
          number: matches[2] * 1,
          precision: Math.max(
            0,
            matches[2].length - matches[2].split('.')[0].length - 1
          ),
          separator: separator,
          duration: (element.getAttribute('data-animation-duration') || 1000) * 1
        };
      }
      element.innerHTML = getCounterValue(element.counterAnimationData, 0);
    };

    var counterAnimations = [];

    var runCounterAnimation = function() {
      var animations = [];
      var animation;
      var multiplier;
      for (var i = 0; i < counterAnimations.length; i++) {
        animation = counterAnimations[i];
        multiplier = Math.min(1, (
          new Date().getTime() - animation.start
        ) / animation.data.duration);
        if (multiplier < 1) {
          animation.element.innerHTML = getCounterValue(
            animation.data,
            multiplier
          );
          animations.push(animation);
        }
        else {
          animation.element.innerHTML = animation.data.original;
        }
      }
      counterAnimations = animations;
      if (window.requestAnimationFrame && counterAnimations.length) {
        window.requestAnimationFrame(runCounterAnimation);
      }
    };

    var startCounterAnimation = function(element) {
      if (window.requestAnimationFrame && !counterAnimations.length) {
        window.requestAnimationFrame(runCounterAnimation);
      }
      counterAnimations.push({
        element: element,
        data: element.counterAnimationData,
        start: new Date().getTime()
      });
    };

    var isHiddenInSlider = function (element) {
      if (!element.slider) {
        return false;
      }
      return !window.jQuery(element.element).closest('.rsts-slide').is(element.slider.getSlides()[element.slider.slideIndex].element);
    };

    var isInView = function(element) {
      return (
        (element.element.offsetWidth || element.element.offsetHeight)
        && (
          element.element.getBoundingClientRect().top < (window.innerHeight || document.documentElement.clientHeight) * 0.8
          || element.element.getBoundingClientRect().bottom <= (window.innerHeight || document.documentElement.clientHeight)
        )
        && !isHiddenInSlider(element)
      );
    };

    var isNotInView = function(element) {
      return (
        (!element.element.offsetWidth && !element.element.offsetHeight)
        || element.element.getBoundingClientRect().top > (window.innerHeight || document.documentElement.clientHeight) * 1.2
        || isHiddenInSlider(element)
      );
    };

    var elements = [];

    var update = function() {
      var rect;
      each(elements, function(element) {
        if (isInView(element)) {
          if (element.element.counterAnimationData && !hasClass(element.element, 'in-view')) {
            if (!hasClass(element.element, 'has-shown') || element.doesRepeat) {
              startCounterAnimation(element.element);
            }
          }
          addClass(element.element, 'in-view');
          addClass(element.element, 'has-shown');
          removeClass(element.element, 'not-in-view');
        }
        else if(isNotInView(element)) {
          if (element.element.counterAnimationData && !hasClass(element.element, 'not-in-view') && element.doesRepeat) {
            initCounterAnimation(element.element);
          }
          if (element.doesRepeat) {
            addClass(element.element, 'not-in-view');
            removeClass(element.element, 'in-view');
          }
        }
      });
    };

    var updateElements = function(wrapper) {
      wrapper = wrapper || document;
      var newElements = wrapper.querySelectorAll && wrapper.querySelectorAll('.is-animated');
      if (!newElements) {
        return;
      }
      each(newElements, function(element) {
        if (
          !elementMatches(element, '.not-animated *, .not-animated')
          && elements.map(function(element) {
            return element.element;
          }).indexOf(element) === -1
        ) {
          elements.push({
            element: element,
            doesRepeat: elementMatches(element, '.does-repeat *, .does-repeat'),
            slider: window.jQuery && window.jQuery(element).closest('.rsts-main').data('rstSlider')
          });
          if (hasClass(element, '-counter')) {
            initCounterAnimation(element);
          }
          addClass(element, 'not-in-view');
        }
      });
    };

    updateElements();

    addEvent(window, 'scroll resize load', update);
    if (window.jQuery) {
      window.jQuery('.rsts-main, .mod_rocksolid_slider').on('rsts-slidestop', function() {
        updateElements(this);
        update();
      });
    }
    setTimeout(update, 0);

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(runCounterAnimation);
    }
    else {
      setInterval(runCounterAnimation, 16);
    }

  })();

  // Background videos
  (function(elements) {
    if (!elements || !elements.length || !navigator.userAgent.match(/(iPhone|iPod)/)) {
      return;
    }
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].poster) {
        elements[i].parentNode.style.backgroundImage = 'url("' + elements[i].poster + '")';
      }
      elements[i].parentNode.removeChild(elements[i]);
    }
  })(document.querySelectorAll && document.querySelectorAll('.centered-wrapper-background > video'));

  // Moving backgrounds
  (function(elements) {
    if (!elements || !elements.length || navigator.userAgent.match(/(iPad|iPhone|iPod)/)) {
      return;
    }
    addEvent(window, 'mousemove', function(event) {
      var percentage;
      for (var i = 0; i < elements.length; i++) {
        percentage = event.clientX / (
          window.innerWidth ||
          document.documentElement.clientWidth
        );
        if (hasClass(elements[i].parentNode, '-background-mousemove')) {
          percentage = 1 - percentage;
        }
        percentage = Math.max(0, Math.min(1, percentage));
        elements[i].style.transform =
          elements[i].style.webkitTransform =
          'translate3d(' + (percentage * -10) + '%, 0, 0)';
      }
    });
  })(document.querySelectorAll && document.querySelectorAll('.-background-mousemove-inverted > .centered-wrapper-background, .-background-mousemove > .centered-wrapper-background'));

  // Parallax backgrounds
  (function(elements) {

    if (!elements || !elements.length || navigator.userAgent.match(/(iPad|iPhone|iPod)/)) {
      return;
    }

    if (!('transform' in elements[0].style) && !('webkitTransform' in elements[0].style)) {
      return;
    }

    var imageCache = [];

    var update = function(event) {

      var windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Get all dimensions from the browser before applying styles for better performance
      var parentRects = [];
      for (var i = 0; i < elements.length; i++) {
        parentRects[i] = elements[i].parentNode.getBoundingClientRect();
        if (!('width' in parentRects[i]) || !('height' in parentRects[i])) {
          return;
        }
      }

      var position, height;
      for (i = 0; i < elements.length; i++) {
        // Skip invisible elements
        if (parentRects[i].bottom < 0 || parentRects[i].top > windowHeight) {
          continue;
        }
        height = 0;
        if (imageCache[i].width && imageCache[i].height) {
          height = imageCache[i].height / imageCache[i].width * parentRects[i].width;
        }
        height = Math.round(Math.max(
          height,
          Math.min(parentRects[i].height, windowHeight) * 1.1
        ));
        elements[i].style.bottom = 'auto';
        elements[i].style.height = height + 'px';
        if (height < windowHeight || (windowHeight < parentRects[i].height && height < parentRects[i].height)) {
          position = parentRects[i].top / (windowHeight - parentRects[i].height)
            * -(height - parentRects[i].height);
        }
        else {
          position = (windowHeight - parentRects[i].top) / (windowHeight + parentRects[i].height)
            * -(height - parentRects[i].height);
        }
        elements[i].style.transform =
        elements[i].style.webkitTransform =
          'translate3d(0, ' + Math.round(position) + 'px, 0)';
      }

    };
    addEvent(window, 'scroll resize', update);

    for (var i = 0; i < elements.length; i++) {
      imageCache[i] = new Image();
      addEvent(imageCache[i], 'load', update);
      imageCache[i].src = elements[i].getAttribute
        && elements[i].getAttribute('data-image-url');
    }

  })(document.querySelectorAll && document.querySelectorAll('.-background-parallax > .centered-wrapper-background'));

  // Header login
  (function(elements) {
    if (!elements || !elements.length) {
      return;
    }
    var click = function(event) {
      eventPreventDefault(event);
      toggleClass(this.parentNode, 'is-active');
      var input = this.parentNode.querySelector('input[type=text]');
      if (input && hasClass(this.parentNode, 'is-active')) {
        input.focus();
      }
      else {
        this.blur();
      }
    };
    var headline;
    var button;
    for (var i = 0; i < elements.length; i++) {
      headline = elements[i].querySelector('h1, h2, h3, h4, h5, h6');
      if (headline) {
        headline.setAttribute('tabindex', '0');
        addEvent(headline, 'click', click);
        if (
          hasClass(elements[i], 'logout')
          && (button = elements[i].querySelector('input[type=submit]'))
        ) {
          headline.innerHTML = button.value;
        }
      }
      if (elements[i].querySelector('.error')) {
        addClass(elements[i], 'is-active');
      }
    }
  })(document.querySelectorAll && document.querySelectorAll('.header-login'));

  // Header Dropdown touch support
  (function(elements) {
    if (!elements || !elements.length) {
      return;
    }
    var headline;
    for (var i = 0; i < elements.length; i++) {
      headline = elements[i].querySelector('h1, h2, h3, h4, h5, h6');
      if (headline) {
        headline.setAttribute('tabindex', '0');
        addEvent(headline, 'click', function() {});
      }
    }
  })(document.querySelectorAll && document.querySelectorAll('.header-dropdown'));

  // Rotating boxes touch support
  (function(elements) {
    if (!elements || !elements.length) {
      return;
    }
    for (var i = 0; i < elements.length; i++) {
      addEvent(elements[i], 'touchend', function(event) {
        if (event.target && hasClass(event.target, 'rotating-boxes-item-link')) {
          return;
        }
        eventPreventDefault(event);
        // Remove the hover state from the element on iOS
        if (hasClass(this, 'hover')) {
          var parent = this.parentNode;
          var next = this.nextSibling;
          parent.removeChild(this);
          if (next) {
            parent.insertBefore(this, next);
          }
          else {
            parent.appendChild(this);
          }
          this.offsetWidth;
        }
        toggleClass(this, 'hover');
      });
    }
  })(document.querySelectorAll && document.querySelectorAll('.rotating-boxes-item'));

  // Tabs
  (function(navigations) {

    if (!navigations || !navigations.length) {
      return;
    }

    var documentHref = document.location.href.split('#');

    each(navigations, function(navigation) {

      var links = navigation.querySelectorAll('a');
      var targets = [];
      var clickFirst;

      each(links, function(link, i) {

        var href = link.href.split('#');
        if (
          href[0] &&
          documentHref[0].substr(- href[0].length) !== href[0]
        ) {
          return;
        }
        var target = document.querySelector('#' + href[1]);
        if (!target) {
          return;
        }

        targets.push(target);

        var onclick = function(event) {
          eventPreventDefault(event);
          eventStop(event);
          each(targets, function(target) {
            target.style.display = 'none';
          });
          removeClass(links, 'is-active');
          addClass(link, 'is-active');
          target.style.display = '';
          link.blur();
          triggerEvent(window, 'resize');
        };
        addEvent(link, 'click', onclick);

        // First element
        if (!clickFirst) {
          clickFirst = onclick;
        }

      });

      clickFirst();

    });

  })(document.querySelectorAll && document.querySelectorAll('.tab-navigation'));

})();
