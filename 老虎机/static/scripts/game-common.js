var requestAnimationFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
  }
})()

Function.prototype.bind = Function.prototype.bind || function (oThis) {
  var aArgs = Array.prototype.slice.call(arguments, 1),
    // 由于bind是原型方法,fToBind指调用bind的函数对象
    fToBind = this,
    F = function () {},
    fBound = function () {
      // fBound若作为构造函数，则this就是fBound构造出来的对象
      // 构造函数中有return，若return的是标量，则忽略，return的是对象，则覆盖构造的实例
      return fToBind.apply(this instanceof F ? this : oThis || this, aArgs.concat(Array.prototype.slice.call(arguments)))
  }

  F.prototype = fToBind.prototype
  fBound.prototype = new F()

  return fBound
}

var initRule = function (rules) {
  var lists = rules.map(function (item) {
    return '<li>' + item + '</li>'
  })
  $('.modal-rule').html(lists.join(''))
}

var initWinners = function (winners, $ele, render) {
  var itemList = '',winners = winners || []
  $ele = $ele || $('.winner-list')
  if (!winners || winners.length === 0) return
  if (render) {
    itemList = render()
  } else {
    for (var i = 0,len = winners.length; i < len;i++) {
      itemList += '<li class="swiper-slide"><img /> <p>恭喜 ' + winners[i].title + ' 抽到了熊本熊保温杯</p></li>'
    }
  }

  $ele.html(itemList)
// callback&&callback()
}

var Trundle = (function ($) {
  function Trundle (options) {
    this.$ele = options.$ele
    this.direction = options.direction || 'X'
    this.limit = options.limit || 5
    this.step = options.step || 0
    this.time = options.time || 3000
    this.isHoverStop = options.isHoverStop || true
    this.init()
  }

  Trundle.prototype.init = function () {
    // var childs = this.$ele.children(),firstChild = null
    // if (childs && childs.length) firstChild = $(childs[0])
    // this.swiperDirCss = this.direction === 'X' ? 'marginLeft' : 'marginTop'
    // this.stepDist = this.direction === 'X' ? firstChild.outerWidth(true) : firstChild.outerHeight(true)
    // if (childs.length <= this.limit) return
    // if (this.time > 0) {
    //   this.start()
    //   this.bind()
    // }
    var childs = this.$ele.children(),firstChild = null
    if (!childs && childs.length === 0) return
    // if (childs && childs.length) 
    firstChild = $(childs[0])
    this.swiperDirCss = this.direction === 'X' ? 'marginLeft' : 'marginTop'
    this.stepDist = this.direction === 'X' ? firstChild.outerWidth(true) : firstChild.outerHeight(true)
    if (childs.length <= this.limit) return
    if (this.time > 0) {
      this.start()
      this.bind()
    }
  }
  Trundle.prototype.bind = function () {
    var that = this
    if (this.isHoverStop) {
      this.$ele.hover(function () {
        that.stop()
      }, function () {
        that.start()
      })
    }
  }
  Trundle.prototype.stop = function () {
    clearInterval(this.interval)
  }
  Trundle.prototype.start = function () {
    if (!this.time) return
    this.interval = setInterval(function () {
      this.swiper()
    }.bind(this), this.time)
  }
  Trundle.prototype.swiper = function () {
    var that = this
    if (this.$ele.children().length <= this.limit) return
    var lastChild = this.$ele.find('li:last')
    var resultAnimate = {}
    resultAnimate[that.swiperDirCss] = '0px'
    this.$ele.prepend(lastChild).css(that.swiperDirCss, '-' + this.stepDist + 'px')
    this.$ele.animate(resultAnimate)
  }
  return Trundle
}($))

$(function () {
  $('.pop-close').click(function (e) {
    $(this).parents('.pop-modal').removeClass('show')
  })
})
