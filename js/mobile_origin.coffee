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

# 选择器
class $
    constructor: (selector) ->
        if !selector
            console.log '参数不足'
            return
        if Array.prototype.toString.call(selector).indexOf('String') isnt -1
            # 如果是字符串，就是充当选择器
            @elem = document.querySelectorAll selector
            @length = @elem.length
        else if selector is Object selector
            newObj = {}
            newObj.elem = [selector]
            newObj.length = 1
            newObj.__proto__ = $.prototype
            return newObj
    
    addClass = (obj, className) ->
        # 添加class
        # 判断是多个字符串还是单个className
        aClass = className.split ' '
        # 如果单个
        if aClass.length is 1
            obj.classList.add className
        else if aClass.length > 1
            # 如果多个
            for i in aClass
                obj.classList.add i

    saveClass: ->
        # 把原有class存起来
        for i in @elem
            i.dataset.originClass = i.classList
        return this
    initClass: ->
        # 初始化class
        for i in @elem
            i.className = i.dataset.originClass or ''
        return this
    initPage: ->
        # 初始化页面
        @saveClass()
        @elem[0].classList.add 'current'
    on: (eventName, fn) ->
        # 绑定事件
        for i in @elem
            if i.addEventListener then i.addEventListener(eventName, fn, false) else i.attachEvent('on' + eventName, fn)
        return this
    off: (eventName, fn) ->
        # 接触事件绑定
        for i in @elem
            if i.removeEventListener then i.removeEventListener(eventName, fn, false) else i.detachEvent('on' + eventName, fn)
        return this  
    applyAnimate: (index, up, prevClassName, cuClassName) ->
        # 应用动画
        # 初始化className
        @initClass()
        # 给特定的元素加上class
        if up and index > -1
            addClass @elem[index], "#{cuClassName} current reverse"
            addClass @elem[index + 1], "#{prevClassName} current reverse"
        else if index < @length
            addClass @elem[index], "#{cuClassName} current"
            addClass @elem[index - 1], "#{prevClassName} current"
        return this

# 浏览器信息
class $browser
    constructor: ->
        @ua = window.navigator.userAgent
        # 判断浏览器
        if @ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/)
            @browser = 'webkit'
            @animationEnd = 'webkitAnimationEnd'
        else if @ua.match(/MSIE\s([\d.]+)/) || @ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/)
            @browser = 'ie'
            @animationEnd = 'MSAnimationEnd'
        else
            @browser = 'other'
            @animationEnd = 'animationend'
        # 判断系统
        if @ua.match(/(Android);?[\s\/]+([\d.]+)?/)
            @os = 'android'
        else if @ua.match(/(iPhone\sOS)\s([\d_]+)/)
            @os = 'ios'
        else if @ua.match(/Windows Phone ([\d.]+)/)
            @os = 'wp'




        
    
        



document.onreadystatechange = ->
    if document.readyState is 'complete'
        # 是否运动
        isAnimation = false
        # 声明变量
        $wrap = new $ '.wrap'
        $div = new $ '.item'
        $navBox = new $ '#navBox'
        $downBtn = new $ '#downBtn'
        # 初始化页面
        $div.initPage()
        browserSupport = new $browser
        # 计数对象
        myCount = new Count
            num: 0
            max: 6
            min: 0

        CLICK = if browserSupport.os is 'wp' then 'click' else 'tap'

        # 切换页面的动画
        switchPage = ($obj, up, prevClassName, cuClassName) ->
            if isAnimation
                return false
            num = if up then myCount.prev().getNum() else myCount.next().getNum()
            $obj.applyAnimate(num, up, prevClassName, cuClassName)

        # 添加动画结束监视
        addAnimateEndEvent = ->
            $div.on browserSupport.animationEnd, ->
                    return false if getIndex(this) is myCount.getNum()
                    this.classList.remove 'current'
        # 获得当前元素在平级元素中的位置
        getIndex = (obj) ->
            Array.prototype.indexOf.call obj.parentNode.children, obj
            
        # 点按钮往下跑
        $navBox.on CLICK, ->
            addAnimateEndEvent()
            # switchPage($div, false, 'pushTop', 'fromBottom')
            switchPage($div, true, 'pushBottom', 'fromTop')
        
        # $navBox.elem[0].style.display = 'none'
        startY = 0

        # 手指滑动
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
                $div.off browserSupport.animationEnd
            
            if myCount.getNum() isnt myCount.max
                e.preventDefault()
            



window.onload = ->
    console.log 333