<template>
  <div
    class="bf-scrollbar"
    :class="{'is-mobile': isMobile, 'is-pc': !isMobile, 'is-scrolling': isScrolling}"
  >
    <!-- 内容 -->
    <div
      class="bf-scrollbar__wrap"
      :class="[wrapClass, {
        'is-webkit': osInfo && osInfo.isWebkit
      }]"
      ref="wrap"
      @scroll="handleScroll"
    >
      <div
        class="bf-scrollbar__view"
        :class="viewClass"
        ref="view"
      >
        <!-- 滚动的内容，根据实际进行修改 -->
        <slot></slot>
      </div>
    </div>
    <!-- 垂直滚动条 -->
    <div
      class="bf-scrollbar__bar is-vertical"
      :class="barClass"
      ref="verticalBar"
      @click="verticalBarClick($event)"
      @mousedown="startVerticalDrag($event)"
    >
      <div
        class="bf-scrollbar__thumb"
        :class="thumbClass"
        ref="verticalThumb"
      ></div>
    </div>
    <!-- 水平滚动条 -->
    <div
      class="bf-scrollbar__bar is-horizontal"
      :class="barClass"
      ref="horizontalBar"
      @click="horizontalBarClick($event)"
      @mousedown="startHorizontalDrag($event)"
    >
      <div
        class="bf-scrollbar__thumb"
        :class="thumbClass"
        ref="horizontalThumb"
      ></div>
    </div>
  </div>
</template>

<script>
import { monitorElementResize } from '@common/js/common'

/*
  scrollbar/scrollbar-wrap/scrollbar-view可以自定义添加类名、样式
  调用组件时，直接传入需要滚动条的内容即可
  通过margin隐藏原生的滚动条
  滑轮滚动：自定义滚动条跟着原生滚动条滚动
  左键单击：计算点击位置距离视窗顶部的距离，计算出距离/视窗的高度*原生滚动条的scrollHeight，设置原生滚动条scrollTop，导致原生滚动条滚动（回到滑轮滚动）
  拖动：和拖拽定位原生移动一个道理
  thumb小于固定宽度：scrollTop占最大scrollTop的百分比，转换成thumb可滚动距离（wrap.clientHeight - thumb的高度）的多少
  监听内容大小动态改变自定义滚动条大小
  方向键滚动：由于原生的滚动条只是隐藏了，所以直接可以使用

  参考：1、https://blog.crimx.com/2017/07/15/element-onresize/
  2、https://juejin.im/entry/5a9a7fcdf265da23866f5885
    */
export default {
  name: 'BfScrollbar',
  props: {
    // 能否通过左键单击轨道来滚动滚动条
    canClick: {
      type: Boolean,
      require: false,
      default: true,
    },
    // 能否通过拖拽thumb来滚动滚动条
    canDrag: {
      type: Boolean,
      require: false,
      default: true,
    },
    /**
     * 是否移动端。移动端的thumb只在滚动时出现，PC端只在hover时出现
     */
    isMobile: {
      type: Boolean,
      require: false,
      default: true,
    },
    /**
     * 是否使用rem代替px作为高度的单位，如果需要则必须传入remFontSize
     * 加入这个是因为移动端的适配
     */
    isRem: {
      type: Boolean,
      require: false,
      default: false,
    },
    /**
     * 如果高度需要用rem，那么需要传入基础font-size的大小，单位px
     */
    remFontSize: {
      type: Number,
      require: false,
      default: 100,
    },
    /**
     * thumb最小的高度或宽度，（单位px，如果isRem为true，则会自动换成rem），避免过短不便于拖动
     */
    minThumbWidth: {
      type: Number,
      require: false,
      default: 30,
    },
    /**
     * ref:wrap的类名，下面的类似，或者直接拿原生的类名直接覆盖
     */
    wrapClass: {
      type: String,
      require: false,
      default: '',
    },
    viewClass: {
      type: String,
      require: false,
      default: '',
    },
    barClass: {
      type: String,
      require: false,
      default: '',
    },
    thumbClass: {
      type: String,
      require: false,
      default: '',
    },
  },
  data () {
    return {
      osInfo: null, // 系统信息
      wrap: null, // ref:wrap的引用
      view: null, // ref:view的引用
      verticalBar: null, // ref:verticalBar的引用
      verticalThumb: null, // ref:verticalThumb的引用
      horizontalBar: null, // ref:horizontalBar的引用
      horizontalThumb: null, // ref:horizontalThumb的引用
      nativeScrollBarWidth: 0, // 原生滚动条的宽度
      hasVerticalScroll: false, // 是否有垂直滚动条
      hasHorizontalScroll: false, // 是否有水平滚动条
      verticalThumbHeight: null, // 垂直滚动条的原来高度，单位px，当小于minThumbWidth才会记录
      horizontalThumbWidth: null, // 水平滚动条原来的宽度，单位px，当小于minThumbWidth才会记录
      startX: 0, // 拖动开始的X
      startY: 0, // 拖动开始的Y
      isScrolling: false, // 滚动条是否滚动中，只有移动滚动条时才显示thumb
      showThumbTimer: null, // 移动端，显示thumb的定时器
      showThumbRate: 500, // 移动端，显示thumb的定时器的时间间隔
    }
  },
  methods: {
    /**
     * 初始化数据
     */
    initData () {
      this.wrap = this.$refs.wrap
      this.view = this.$refs.view
      this.verticalBar = this.$refs.verticalBar
      this.verticalThumb = this.$refs.verticalThumb
      this.horizontalBar = this.$refs.horizontalBar
      this.horizontalThumb = this.$refs.horizontalThumb
      this.os()
      this.getNativeScrollBarWidth()
      this.updateThumb()
    },
    /**
     * 获取原生滚动条的宽度
     * 在-webkit内核时可以通过设置滚动条宽度为0来隐藏原生滚动条，否则只能通过负值的margin来隐藏原生滚动条
     */
    getNativeScrollBarWidth () {
      if (this.osInfo && this.osInfo.isWebkit) {
        // webkit内核
        return
      }

      const outer = document.createElement('div')

      outer.style.width = '100px'
      outer.style.visibility = 'hidden'
      outer.style.position = 'absolute'
      outer.style.top = '-9999px'
      outer.style.overflow = 'scroll' // 必须显示滚动条，否则无法计算滚动条宽度
      document.body.appendChild(outer)

      /*
      clientHeight: content + padding  的高度
      offsetHeight: content + padding + border + 滚动条的高度
      */
      const scrollBarWidth = outer.offsetWidth - outer.clientWidth
      outer.parentNode.removeChild(outer) // 完成后移除该元素

      this.nativeScrollBarWidth = scrollBarWidth
      const margin = this.checkIsRem(-scrollBarWidth)
      // 设置负值的margin来隐藏原生滚动条
      this.wrap.style.marginRight = margin
      this.wrap.style.marginBottom = margin
    },
    /**
     * 计算thumb的高度
     */
    updateThumb () {
      // console.log('updateThumb')
      // 判断是否有垂直滚动条
      if (this.wrap.scrollHeight > this.wrap.clientHeight) {
        this.hasVerticalScroll = true
        // 垂直滚动条的高度
        const percent = this.wrap.clientHeight / this.wrap.scrollHeight
        const height =
            parseFloat(getComputedStyle(this.verticalBar).height) * percent

        // 判断是否小于最小thumb宽度
        if (height < this.minThumbWidth) {
          this.verticalThumbHeight = height
          this.verticalThumb.style.height = this.checkIsRem(this.minThumbWidth) // 滚动的时候就要进行相应的转换，否则滚动条到底部的时候显示会有问题
        } else {
          this.verticalThumbHeight = null
          this.verticalThumb.style.height = `${percent * 100}%`
        }
      } else {
        this.hasVerticalScroll = false
        this.verticalThumb.style.height = '0'
      }

      // 判断是否有水平滚动条
      if (this.wrap.scrollWidth > this.wrap.clientWidth) {
        this.hasHorizontalScroll = true
        // 水平滚动条的宽度
        const percent = this.wrap.clientWidth / this.wrap.scrollWidth
        const width =
            parseFloat(getComputedStyle(this.horizontalBar).width) * percent

        // 判断是否小于最小thumb宽度
        if (width < this.minThumbWidth) {
          this.horizontalThumbWidth = width
          this.horizontalThumb.style.width = this.checkIsRem(this.minThumbWidth)
        } else {
          this.horizontalThumbWidth = null
          this.horizontalThumb.style.width = `${percent * 100}%`
        }
      } else {
        this.hasHorizontalScroll = false
        this.horizontalThumb.style.width = '0'
      }

      // 初始化滚动条位置，主要是wrap和view大小改变时可以避免滚动条位置不对（超出最大滚动位置）
      this.handleScroll()
    },
    /**
     * 判断是否是rem，如果是则大小需要换算
     * @param {number} size 大小，单位px
     * @returns 返回最终的大小，如果是rem则返回以remFontSize为基础的rem，如果不是则以px为单位返回
     */
    checkIsRem (size) {
      if (this.isRem) {
        return `${size / this.remFontSize}rem`
      } else {
        return `${size}px`
      }
    },
    /**
     * 原生滚动条滚动，自定义滚动条也跟随滚动(通过translate来滚动)
     */
    handleScroll () {
      if (this.isMobile) {
        this.isScrolling = true
        clearTimeout(this.showThumbTimer)
        this.showThumbTimer = setTimeout(() => {
          this.isScrolling = false
        }, this.showThumbRate)
      }

      if (this.hasVerticalScroll) {
        // 判断滚动条的高度是否设置了最小宽度，verticalThumbHeight不为null则设置了
        if (this.verticalThumbHeight) {
          // 滚动距离占最大滚动距离百分比
          const percent =
              this.wrap.scrollTop / (this.wrap.scrollHeight - this.wrap.clientHeight)
          // 换算成可视窗最大滚动距离的百分比
          const resultPercent =
              (percent * (this.wrap.clientHeight - this.verticalThumb.offsetHeight)) /
              this.verticalThumb.offsetHeight

          this.verticalThumb.style.transform = `translateY(${resultPercent *
              100}%)`
        } else {
          this.verticalThumb.style.transform = `translateY(${(this.wrap.scrollTop /
              this.wrap.clientHeight) *
              100}%)`
        }
      }

      if (this.hasHorizontalScroll) {
        // 判断滚动条的高度是否设置了最小宽度，horizontalThumbWidth不为null则设置了
        if (this.horizontalThumbWidth) {
          const percent =
              this.wrap.scrollLeft / (this.wrap.scrollWidth - this.wrap.clientWidth)
          const resultPercent =
              (percent * (this.wrap.clientWidth - this.horizontalThumb.offsetWidth)) /
              this.horizontalThumb.offsetWidth

          this.horizontalThumb.style.transform = `translateX(${resultPercent *
              100}%)`
        } else {
          this.horizontalThumb.style.transform = `translateX(${(this.wrap.scrollLeft /
              this.wrap.clientWidth) *
              100}%)`
        }
      }
    },
    /**
     * 垂直滚动条点击
     * @param {Event} e 事件
     */
    verticalBarClick (e) {
      // 没有点击事件
      if (!this.canClick) {
        return
      }
      // 点击bar才滚动，点击thumb不滚动
      if (e.target !== this.verticalBar) {
        return
      }

      // 获取点击位置与滚动框顶部之间的距离，优化：直接使用e.offsetY 鼠标指针相对于目标节点内边位置的Y坐标。旧的是(e.target.getBoundingClientRect().top - e.clientY)计算得出
      const offset = e.offsetY
      // 让点击位置处于滚动条中间
      const halfThumb = this.verticalThumb.offsetHeight / 2
      // 滚动条移动距离占整个视窗的比例
      const moveRate = (offset - halfThumb) / this.wrap.clientHeight
      let scrollTop = moveRate * this.wrap.scrollHeight

      // wrap.scrollHeight - wrap.clientHeigh是最大滚动高度
      if (scrollTop > this.wrap.scrollHeight - this.wrap.clientHeight) {
        scrollTop = this.wrap.scrollHeight - this.wrap.clientHeight
      }
      this.wrap.scrollTop = scrollTop
    },
    /**
     * 水平滚动条点击
     * @param {Event} e 事件
     */
    horizontalBarClick (e) {
      // 没有点击事件
      if (!this.canClick) {
        return
      }
      // 点击bar才滚动，点击thumb不滚动
      if (e.target !== this.horizontalBar) {
        return
      }

      // 获取点击位置与滚动框顶部之间的距离，优化：直接使用e.offsetY 鼠标指针相对于目标节点内边位置的Y坐标。旧的是(e.target.getBoundingClientRect().top - e.clientY)计算得出
      const offset = e.offsetX
      // 让点击位置处于滚动条中间
      const halfThumb = this.horizontalThumb.offsetWidth / 2
      // 滚动条移动距离占整个视窗的比例
      const moveRate = (offset - halfThumb) / this.wrap.clientWidth
      let scrollLeft = moveRate * this.wrap.scrollWidth

      // wrap.scrollWidth - wrap.clientWidth是最大滚动宽度
      if (scrollLeft > this.wrap.scrollWidth - this.wrap.clientWidth) {
        scrollLeft = this.wrap.scrollWidth - this.wrap.clientWidth
      }
      this.wrap.scrollLeft = scrollLeft
    },
    /**
     * 开始拖动垂直滚动条
     * @param {Event} e 事件
     */
    startVerticalDrag (e) {
      // 不能拖拽
      if (!this.canDrag) {
        return
      }

      this.startX = e.clientX // e.clientX是鼠标在屏幕中x轴的位置
      this.startY = e.clientY // e.clientX是鼠标在屏幕中y轴的位置
      document.onselectstart = function () {
        return false
      } // 拖动时阻止选中，否则拖动过程中有选中文本导致文本变蓝影响体验
      document.addEventListener('mousemove', this.verticalMoving)
      document.addEventListener('mouseup', this.endVerticalDrag)
    },
    /**
     * 结束拖动垂直滚动条
     * @param {Event} e 事件
     */
    endVerticalDrag (e) {
      // console.log('移除mousemove事件')
      document.onselectstart = null // 恢复选中
      document.removeEventListener('mousemove', this.verticalMoving)
      document.removeEventListener('mouseup', this.endVerticalDrag)
    },
    /**
     * 拖动垂直滚动条中...
     * @param {Event} e 事件
     */
    verticalMoving (e) {
      const moveY = e.clientY - this.startY
      const thumbPositionPercentage = moveY / this.wrap.clientHeight
      const setpScrollTop = thumbPositionPercentage * this.wrap.scrollHeight
      let nextScrollTop = this.wrap.scrollTop + setpScrollTop

      if (nextScrollTop > this.wrap.scrollHeight - this.wrap.clientHeight) {
        nextScrollTop = this.wrap.scrollHeight - this.wrap.clientHeight
      } else if (nextScrollTop < 0) {
        nextScrollTop = 0
      }

      // console.log(nextScrollTop);
      this.wrap.scrollTop = nextScrollTop
      this.startY = e.clientY
    },
    /**
     * 开始拖动水平滚动条
     * @param {Event} e 事件
     */
    startHorizontalDrag (e) {
      // 不能拖拽
      if (!this.canDrag) {
        return
      }

      this.startX = e.clientX
      this.startY = e.clientY
      document.onselectstart = function () {
        return false
      } // 拖动时阻止选中，否则拖动过程中有选中文本导致文本变蓝影响体验
      document.addEventListener('mousemove', this.horizontalMoving)
      document.addEventListener('mouseup', this.endHorizontalDrag)
    },
    /**
     * 结束拖动水平滚动条
     * @param {Event} e 事件
     */
    endHorizontalDrag (e) {
      // console.log("移除mousemove事件");
      document.onselectstart = null // 恢复选中
      document.removeEventListener('mousemove', this.horizontalMoving)
      document.removeEventListener('mouseup', this.endHorizontalDrag)
    },
    /**
     * 拖动水平滚动条中...
     * @param {Event} e 事件
     */
    horizontalMoving (e) {
      const moveX = e.clientX - this.startX
      const thumbPositionPercentage = moveX / this.wrap.clientWidth
      const setpScrollLeft = thumbPositionPercentage * this.wrap.scrollWidth
      let nextScrollLeft = this.wrap.scrollLeft + setpScrollLeft

      if (nextScrollLeft > this.wrap.scrollWidth - this.wrap.clientWidth) {
        nextScrollLeft = this.wrap.scrollWidth - this.wrap.clientWidth
      } else if (nextScrollLeft < 0) {
        nextScrollLeft = 0
      }

      // console.log(nextScrollLeft);
      this.wrap.scrollLeft = nextScrollLeft
      this.startX = e.clientX
    },
    /**
     * 判断浏览器类型
     */
    os () {
      // SymbianOS 塞班手机系统
      const ua = navigator.userAgent
      const isWindowsPhone = /(?:Windows Phone)/.test(ua)
      const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
      const isAndroid = /(?:Android)/.test(ua)
      const isFireFox = /(?:Firefox)/.test(ua)
      // const isChrome = /(?:Chrome|CriOS)/.test(ua)
      const isWebkit = /(?:AppleWebKit)/.test(ua)
      const isTablet =
            /(?:iPad|PlayBook)/.test(ua) ||
            (isAndroid && !/(?:Mobile)/.test(ua)) ||
            (isFireFox && /(?:Tablet)/.test(ua))
      const isPhone = /(?:iPhone)/.test(ua) && !isTablet
      const isPc = !isPhone && !isAndroid && !isSymbian

      this.osInfo = {
        isTablet: isTablet, // 平板
        isPhone: isPhone, // 苹果手机
        isAndroid: isAndroid, // 安卓
        isPc: isPc, // pc
        isWebkit: isWebkit, // 是否是-webkit内核
      }
    },
  },
  mounted () {
    this.initData()
    // wrap和view改变都要重新计算thumb的高度，以及滚动条的位置
    monitorElementResize(this.wrap, this.updateThumb)
    monitorElementResize(this.view, this.updateThumb)
  },
}
</script>

<style lang="scss">
// .bf-scrollbar必须设置高度
.bf-scrollbar {
  position: relative;
  overflow: hidden;

  &.is-pc &__bar {
    opacity: 0;
    visibility: hidden;
  }

  &.is-pc:hover &__bar {
    opacity: 1;
    visibility: visible;
  }

  &.is-mobile &__bar {
    opacity: 0;
    visibility: hidden;
  }

  &.is-mobile.is-scrolling &__bar {
    opacity: 1;
    visibility: visible;
  }

  &__wrap {
    /* 为了监听宽高 */
    position: relative;
    /* 视窗的高度，设置和父级元素一样 */
    height: 100%;
    overflow: scroll;

    /* -webkit内核设置滚动条宽度为0，且背景透明来隐藏元素滚动条 */
    &.is-webkit {
      &::-webkit-scrollbar {
        width: 0;
        background-color: transparent;
      }
    }
  }

  &__view {
    position: relative;
  }

  &__bar {
    position: absolute;
    z-index: 1;
    border-radius: 4px;
    // transition: opacity 0.12s ease-out;
    transition: all 0.3s linear;
    cursor: pointer;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;

    &.is-vertical {
      top: 0;
      right: 2px;
      width: 6px;
      height: 100%;
    }

    &.is-horizontal {
      left: 0;
      bottom: 2px;
      width: 100%;
      height: 6px;
    }
  }

  &__bar.is-vertical &__thumb{
    width: 100%;
    height: 0;
  }
  &__bar.is-horizontal &__thumb{
    width: 0;
    height: 100%;
  }

  &__thumb {
    position: relative;
    display: block;
    border-radius: inherit;
    background-color: rgba(135, 141, 153, 0.3);
    /* transition: all 0.3s; */
    cursor: pointer;
  }
}

</style>
