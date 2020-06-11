<template>
  <div class="bf-bf-scrollbar">
    <!-- 内容 -->
    <div
      class="bf-bf-scrollbar__wrap"
      ref="wrap"
    >
      <div
        class="bf-bf-scrollbar__view"
        ref="view"
      >
        <!-- 滚动的内容，根据实际进行修改 -->
        <slot></slot>
      </div>
    </div>
    <!-- 垂直滚动条 -->
    <div
      class="bf-bf-scrollbar__bar is-vertical"
      ref="verticalBar"
    >
      <div
        class="bf-bf-scrollbar__thumb"
        ref="verticalThumb"
      ></div>
    </div>
    <!-- 水平滚动条 -->
    <div
      class="bf-bf-scrollbar__bar is-horizontal"
      ref="horizontalBar"
    >
      <div
        class="bf-bf-scrollbar__thumb"
        ref="horizontalThumb"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BfScrollbar',
  data () {
    return {
      nativeScrollBarWidth: 0, // 原生滚动条的宽度
      hasVerticalScroll: false, // 是否有垂直滚动条
      hasHorizontalScroll: false, // 是否有水平滚动条
      MIN_THUMB_WIDTH: 30, // thumb最小的宽度，单位px，避免过短不便于拖动
      verticalThumbHeight: null, // 垂直滚动条的原来高度，单位px，当小于minThumbWidth才会记录
      horizontalThumbWidth: null, // 水平滚动条原来的宽度，单位px，当小于minThumbWidth才会记录
      startX: 0, // 拖动开始的X
      startY: 0, // 拖动开始的Y
    }
  },
  methods: {
    /**
     * 初始化数据
     */
    initData () {

    },
    /**
     * 获取原生滚动条的宽度
     */
    getNativeScrollBarWidth () {
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

      return scrollBarWidth
    },
    /**
     * 初始化事件
     */
    initEvent () {

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
      const isTablet =
            /(?:iPad|PlayBook)/.test(ua) ||
            (isAndroid && !/(?:Mobile)/.test(ua)) ||
            (isFireFox && /(?:Tablet)/.test(ua))
      const isPhone = /(?:iPhone)/.test(ua) && !isTablet
      const isPc = !isPhone && !isAndroid && !isSymbian

      return {
        isTablet: isTablet, // 平板
        isPhone: isPhone, // 苹果手机
        isAndroid: isAndroid, // 安卓
        isPc: isPc, // pc
      }
    },
  },
  mounted () {
    this.initData()
    this.initEvent()
  },
}
</script>

<style lang="scss">
.bf-scrollbar {
  position: relative;
  overflow: hidden;

  &:hover &__bar {
    opacity: 1;
  }

  &__wrap {
    /* 为了监听宽高 */
    position: relative;
    /* 视窗的高度，根据实际进行设置 */
    height: 250px;
    overflow: scroll;
  }

  &__view {
    position: relative;
  }

  &__bar {
    position: absolute;
    z-index: 1;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.12s ease-out;
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
