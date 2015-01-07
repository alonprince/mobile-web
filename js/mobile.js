(function() {
  $(function() {
    var $div, $downBtn, $navBox, $wrap, Count, addAnimateEndEvent, animationEventName, browserSupport, isAnimation, myCount, switchPage;
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
    $.fn.saveClassName = function() {
      var $this;
      $this = $(this);
      $(this).forEach(function(obj) {
        var $obj;
        $obj = $(obj);
        return $obj.data('originClass', $obj.attr('class'));
      });
      return $this;
    };
    $.fn.initClassName = function() {
      var $this;
      $this = $(this);
      return $this.attr('class', $this.data('originClass'));
    };
    $.fn.setCurrentDiv = function(index, className) {
      var $this;
      if (arguments.length === 2) {
        $this = $(this);
        $this.eq(index).addClass(className);
      } else {
        $this = $(this[0]);
        $this.addClass(className);
      }
      return $this;
    };
    $.fn.applyAnimate = function(index, up, prevClassName, cuClassName) {
      var $this, len;
      $this = $(this);
      len = $this.length;
      $this.initClassName();
      if (up && index > -1 && index < len - 1) {
        $this.eq(index).addClass(cuClassName + ' current reverse');
        $this.eq(index + 1).addClass(prevClassName + ' current reverse');
      } else if (index > 0 && index < len) {
        $this.eq(index).addClass(cuClassName + ' current');
        $this.eq(index - 1).addClass(prevClassName + ' current');
      }
      return $this;
    };
    browserSupport = $.browser;
    if (browserSupport.webkit === false) {
      if (browserSupport.ie === true) {
        animationEventName = 'MSAnimationEnd';
      }
    } else if (browserSupport.webkit === true) {
      animationEventName = 'webkitAnimationEnd';
    } else {
      animationEventName = 'animationend';
    }
    myCount = new Count({
      num: 0,
      max: 6,
      min: 0
    });
    $div = $('.divBox > div');
    $wrap = $('.wrap');
    $navBox = $('#navBox');
    $downBtn = $('#downBtn');
    isAnimation = false;
    switchPage = function($obj, up, prevClassName, cuClassName) {
      var num;
      if (isAnimation) {
        return false;
      }
      num = up ? myCount.prev().getNum() : myCount.next().getNum();
      return $obj.applyAnimate(num, up, prevClassName, cuClassName);
    };
    addAnimateEndEvent = function() {
      return $div.eq(myCount.getNum()).on(animationEventName, function() {
        var $this;
        $this = $(this);
        if ($this.index() === myCount.getNum()) {
          return false;
        }
        return $this.removeClass('current');
      });
    };
    $div.saveClassName().setCurrentDiv(myCount.getNum(), 'current');
    $navBox.on('tap', function() {
      addAnimateEndEvent();
      return switchPage($div, false, 'pushTop', 'fromBottom');
    });
    $wrap.on('touchstart', function(e) {
      var startY, targetTouch;
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
        return $div.off(animationEventName);
      });
      if (myCount.getNum() !== myCount.max) {
        return e.preventDefault();
      }
    });
    (function() {
      if ($.os.ios) {
        return $downBtn.attr('href', 'itms-services://?action=download-manifest&url=https://www.taskwedo.com/app/WeDo/WeDo.plist');
      } else if ($.os.android) {
        return $downBtn.attr('href', 'https://www.taskwedo.com/app/WeDo/WEDO2.0.apk');
      } else {
        return $downBtn.attr('href', 'javascript:alert("暂只支持安卓和IOS系统");');
      }
    })();
    return $wrap.on('tap', function(e) {
      if ($(this).find('.fromBottom').index() === 6) {
        return window.location.href = 'itms-services://?action=download-manifest&url=https://www.taskwedo.com/app/WeDo/WeDo.plist';
      }
    });
  });

}).call(this);
