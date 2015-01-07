$ ->
    # 声明Count对象
    class Count
        constructor: (option)->
            option = option || {}
            @init(option)

        init: (option) ->
            option = option || {}
            num = parseInt option.num || 0, 10
            @num = num
            max = parseInt option.max || 4, 10
            @max = max
            min = parseInt option.min || 0, 10
            @min = min
        next: ->
            @num++
            @num = @max if @num > @max
            return this
        prev: ->
            @num--
            @num = @min if @num < @min
            return this
        getNum: ->
            return @num
        reachLimit: ->
            return @num is @min or @num is @max

    # 为jq对象添加方法
    # 保存初始的className
    $.fn.saveClassName = ->
        $this = $ this
        $(this).forEach (obj) ->
            $obj = $(obj)
            $obj.data 'originClass', $obj.attr('class')
        return $this
    # 初始化className
    $.fn.initClassName = ->
        $this = $(this)
        $this.attr 'class', $this.data('originClass')

    # 给当前选中项加上class
    $.fn.setCurrentDiv = (index, className) ->
        if arguments.length is 2
            $this = $(this)
            $this.eq(index)
                .addClass className
        else
            $this = $(this[0])
            $this.addClass className
        return $this
    # 加上animate
    $.fn.applyAnimate = (index, up, prevClassName, cuClassName) ->
        $this = $(this)
        len = $this.length
        $this.initClassName()
        # 往上滑
        if up and index > -1 and index < len - 1
            $this.eq(index)
                .addClass cuClassName + ' current reverse'
            $this.eq(index + 1)
                .addClass prevClassName + ' current reverse'
        else if index > 0 and index < len
            # 往下滑
            $this.eq(index)
                .addClass cuClassName + ' current'
            $this.eq(index - 1)
                .addClass prevClassName + ' current'   
            
        return $this

    # 浏览器判断后得出支持的动画事件名字
    # animationEvent = 
    #     'webkit' : 'webkitAnimationEnd'
    #     'opera' : 'oAnimationEnd'
    #     'ie' : 'MSAnimationEnd'
    #     'default' : 'animationend'

    browserSupport = $.browser

    # 根据浏览器判断动画结束事件
    if browserSupport.webkit is false
        if browserSupport.ie is true
            # 判断这个是ie
            animationEventName = 'MSAnimationEnd'
    else if browserSupport.webkit is true
        # webkit内核
        animationEventName = 'webkitAnimationEnd'
    else
        # 默认，包括ff
        animationEventName = 'animationend'

    # 新建Count实例
    myCount = new Count 
        num: 0
        max: 6
        min: 0



    # 主要程序开始
    # 声明变量
    $div = $('.divBox > div')
    $wrap = $('.wrap')
    $navBox = $('#navBox')
    $downBtn = $('#downBtn')
    isAnimation = false


    # 切换页面的动画
    switchPage = ($obj, up, prevClassName, cuClassName) ->
        if isAnimation
            return false
        num = if up then myCount.prev().getNum() else myCount.next().getNum()
        $obj.applyAnimate(num, up, prevClassName, cuClassName)

    # 添加动画结束监视
    addAnimateEndEvent = ->
        $div.eq myCount.getNum()
            .on animationEventName, ->
                $this = $ this
                return false if $this.index() is myCount.getNum()
                $this.removeClass 'current'




    # 取到了动画结束的事件名字
    # 添加监视动画结束的函数

    # 初始化页面
    $div.saveClassName().setCurrentDiv myCount.getNum(), 'current'

    # 点击下滑的按钮
    $navBox.on 'tap', ->
        addAnimateEndEvent()
        switchPage($div, false, 'pushTop', 'fromBottom')
        # switchPage($div, true, 'pushBottom', 'fromTop')

    # $wrap.swipeUp (event) ->
    #     addAnimateEndEvent()
    #     switchPage($div, false, 'pushTop', 'fromBottom')
    #     event.preventDefault()
    #     event.stopPropagation()
    #     return false 
    
    # 上滑
    # $wrap.swipeDown () ->
    #     addAnimateEndEvent()
    #     switchPage($div, true, 'pushBottom', 'fromTop')


    $wrap.on 'touchstart', (e) ->
        targetTouch = e.targetTouches
        # 如果是多指滑动
        return if targetTouch.length > 1
        # 取手指下去的时候的y坐标
        startY = targetTouch[0].clientY
        addAnimateEndEvent()
        $wrap.on 'touchmove', (event) ->
            return if isAnimation
            moveTouch = event.targetTouches
            # 取手指滑动的时候的y坐标
            moveY = moveTouch[0].clientY
            distance = moveY - startY
            if distance < 0
                # 上滑
                switchPage($div, false, 'pushTop', 'fromBottom')
                isAnimation = true
            else 
                switchPage($div, true, 'pushBottom', 'fromTop')
                isAnimation = true

        $wrap.on 'touchend', ->
            isAnimation = false
            $wrap.off 'touchmove'
            $wrap.off 'touchend'
            $div.off animationEventName
        
        if myCount.getNum() isnt myCount.max
            e.preventDefault()


    do ->
        if $.os.ios
            $downBtn.attr 'href', 'itms-services://?action=download-manifest&url=https://www.taskwedo.com/app/WeDo/WeDo.plist'
        else if $.os.android
            $downBtn.attr 'href', 'https://www.taskwedo.com/app/WeDo/WEDO2.0.apk'
        else
            $downBtn.attr 'href', 'javascript:alert("暂只支持安卓和IOS系统");'

    $wrap.on 'tap', (e) ->
        if $(this).find('.fromBottom').index() is 6
            window.location.href = 'itms-services://?action=download-manifest&url=https://www.taskwedo.com/app/WeDo/WeDo.plist'