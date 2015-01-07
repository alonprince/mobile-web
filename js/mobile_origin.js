(function() {
  var $, $browser, Count;

  Count = (function() {
    function Count(option) {
      option = option || {};
      this.init(option);
    }

    Count.prototype.init = function(option) {
      var max, min, num;
      option = option || {};
      num = parseInt(option.num || 0, 10);
      this.num = num;
      max = parseInt(option.max || 4, 10);
      this.max = max;
      min = parseInt(option.min || 0, 10);
      return this.min = min;
    };

    Count.prototype.next = function() {
      this.num++;
      if (this.num > this.max) {
        this.num = this.max;
      }
      return this;
    };

    Count.prototype.prev = function() {
      this.num--;
      if (this.num < this.min) {
        this.num = this.min;
      }
      return this;
    };

    Count.prototype.getNum = function() {
      return this.num;
    };

    Count.prototype.reachLimit = function() {
      return this.num === this.min || this.num === this.max;
    };

    return Count;

  })();

  $ = (function() {
    var addClass;

    function $(selector) {
      var newObj;
      if (!selector) {
        console.log('参数不足');
        return;
      }
      if (Array.prototype.toString.call(selector).indexOf('String') !== -1) {
        this.elem = document.querySelectorAll(selector);
        this.length = this.elem.length;
      } else if (selector === Object(selector)) {
        newObj = {};
        newObj.elem = [selector];
        newObj.length = 1;
        newObj.__proto__ = $.prototype;
        return newObj;
      }
    }

    addClass = function(obj, className) {
      var aClass, i, _i, _len, _results;
      aClass = className.split(' ');
      if (aClass.length === 1) {
        return obj.classList.add(className);
      } else if (aClass.length > 1) {
        _results = [];
        for (_i = 0, _len = aClass.length; _i < _len; _i++) {
          i = aClass[_i];
          _results.push(obj.classList.add(i));
        }
        return _results;
      }
    };

    $.prototype.saveClass = function() {
      var i, _i, _len, _ref;
      _ref = this.elem;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        i.dataset.originClass = i.classList;
      }
      return this;
    };

    $.prototype.initClass = function() {
      var i, _i, _len, _ref;
      _ref = this.elem;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        i.className = i.dataset.originClass || '';
      }
      return this;
    };

    $.prototype.initPage = function() {
      this.saveClass();
      return this.elem[0].classList.add('current');
    };

    $.prototype.on = function(eventName, fn) {
      var i, _i, _len, _ref;
      _ref = this.elem;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (i.addEventListener) {
          i.addEventListener(eventName, fn, false);
        } else {
          i.attachEvent('on' + eventName, fn);
        }
      }
      return this;
    };

    $.prototype.off = function(eventName, fn) {
      var i, _i, _len, _ref;
      _ref = this.elem;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (i.removeEventListener) {
          i.removeEventListener(eventName, fn, false);
        } else {
          i.detachEvent('on' + eventName, fn);
        }
      }
      return this;
    };

    $.prototype.applyAnimate = function(index, up, prevClassName, cuClassName) {
      this.initClass();
      if (up && index > -1) {
        addClass(this.elem[index], "" + cuClassName + " current reverse");
        addClass(this.elem[index + 1], "" + prevClassName + " current reverse");
      } else if (index < this.length) {
        addClass(this.elem[index], "" + cuClassName + " current");
        addClass(this.elem[index - 1], "" + prevClassName + " current");
      }
      return this;
    };

    return $;

  })();

  $browser = (function() {
    function $browser() {
      this.ua = window.navigator.userAgent;
      if (this.ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/)) {
        this.browser = 'webkit';
        this.animationEnd = 'webkitAnimationEnd';
      } else if (this.ua.match(/MSIE\s([\d.]+)/) || this.ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/)) {
        this.browser = 'ie';
        this.animationEnd = 'MSAnimationEnd';
      } else {
        this.browser = 'other';
        this.animationEnd = 'animationend';
      }
      if (this.ua.match(/(Android);?[\s\/]+([\d.]+)?/)) {
        this.os = 'android';
      } else if (this.ua.match(/(iPhone\sOS)\s([\d_]+)/)) {
        this.os = 'ios';
      } else if (this.ua.match(/Windows Phone ([\d.]+)/)) {
        this.os = 'wp';
      }
    }

    return $browser;

  })();

  document.onreadystatechange = function() {
    var $div, $downBtn, $navBox, $wrap, CLICK, addAnimateEndEvent, browserSupport, getIndex, isAnimation, myCount, startY, switchPage;
    if (document.readyState === 'complete') {
      isAnimation = false;
      $wrap = new $('.wrap');
      $div = new $('.item');
      $navBox = new $('#navBox');
      $downBtn = new $('#downBtn');
      $div.initPage();
      browserSupport = new $browser;
      myCount = new Count({
        num: 0,
        max: 6,
        min: 0
      });
      CLICK = browserSupport.os === 'wp' ? 'click' : 'tap';
      switchPage = function($obj, up, prevClassName, cuClassName) {
        var num;
        if (isAnimation) {
          return false;
        }
        num = up ? myCount.prev().getNum() : myCount.next().getNum();
        return $obj.applyAnimate(num, up, prevClassName, cuClassName);
      };
      addAnimateEndEvent = function() {
        return $div.on(browserSupport.animationEnd, function() {
          if (getIndex(this) === myCount.getNum()) {
            return false;
          }
          return this.classList.remove('current');
        });
      };
      getIndex = function(obj) {
        return Array.prototype.indexOf.call(obj.parentNode.children, obj);
      };
      $navBox.on(CLICK, function() {
        addAnimateEndEvent();
        return switchPage($div, true, 'pushBottom', 'fromTop');
      });
      startY = 0;
      return $wrap.on('touchstart', function(e) {
        var targetTouch;
        targetTouch = e.targetTouches;
        if (targetTouch.length > 1) {
          return;
        }
        startY = targetTouch[0].clientY;
        addAnimateEndEvent();
        $wrap.on('touchmove', function(event) {
          var distance, moveTouch, moveY;
          if (isAnimation) {
            return;
          }
          moveTouch = event.targetTouches;
          moveY = moveTouch[0].clientY;
          distance = moveY - startY;
          if (distance < 0) {
            switchPage($div, false, 'pushTop', 'fromBottom');
            return isAnimation = true;
          } else {
            switchPage($div, true, 'pushBottom', 'fromTop');
            return isAnimation = true;
          }
        });
        $wrap.on('touchend', function() {
          isAnimation = false;
          $wrap.off('touchmove');
          $wrap.off('touchend');
          return $div.off(browserSupport.animationEnd);
        });
        if (myCount.getNum() !== myCount.max) {
          return e.preventDefault();
        }
      });
    }
  };

  window.onload = function() {
    return console.log(333);
  };

}).call(this);
