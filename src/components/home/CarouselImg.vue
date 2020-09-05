<template>
  <div
    class="carousel-img"
    @touchstart="handleTouchstart($event)"
    @touchmove="handleTouchmove($event)"
    @touchend="handleTouchend($event)"
  >
    <ul
      class="carousel-img__main"
      :class="{ 'is-transition': isTransition }"
      :style="{ transform: translateX }"
      ref="main"
    >
      <li
        class="carousel-img__img-wrap"
        v-for="(item, index) in realImgList"
        :key="index"
      >
        <img
          class="carousel-img__img"
          :src="item"
          alt
        />
      </li>
    </ul>
    <div class="carousel-img__tip-wrap">
      <ul class="carousel-img__tip">
        <li
          class="carousel-img__order is-active"
          :class="{ 'is-transition': isTransitionPoint }"
          :style="{ transform: translateXPoint }"
        ></li>
        <li
          v-for="item in imgList"
          :key="item"
          class="carousel-img__order"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script>
/**
 * 图片轮播，采用transform进行图片的切换，避免回流
 * 在头和尾都多接一张前后的图片
 */
export default {
  name: 'CarouselImg',
  props: {
    // 图片列表
    imgList: {
      type: Array,
      require: true,
      default () {
        return []
      },
    },
    // 图片轮播的方向。1：从左向右；-1：从右向左；
    step: {
      type: Number,
      require: false,
      default: 1,
    },
  },
  data () {
    return {
      canCarousel: false, // 是否可以轮播，大于等于2张图片才能轮播
      order: 0, // 轮到的图片，从0开始，即：下标
      timer: null, // 定时器
      rate: 3000, // 时间间隔
      translateX: 'translateX(0%)', // 轮播容器偏移量
      realImgList: [], // 真正轮播的列表
      isTransition: true, // 是否有过渡效果
      transitionTime: 400, // 过渡效果的时长，单位毫秒
      checkTimer: null, // 图片轮播到第一或者最后一个，需要重置的定时器id
      activePoint: 0, // 激活的小圆点，指示目前是第几个轮播图按下标
      isTransitionPoint: true, // 激活的提升点否有过渡效果
      startX: 0, // 开始移动时在屏幕中的位置
      width: 0, // 一个图片的宽度，在触摸滑动时需要计算滑动距离
      restartTimer: null, // 重启的定时器
    }
  },
  computed: {
    translateXPoint () {
      return `translateX(${this.activePoint * 100}%)`
    },
  },
  methods: {
    /**
     * 初始化数据
     */
    init () {
      this.realImgList = this.imgList.slice(0)

      if (this.imgList.length > 1) {
        const first = this.imgList[0]
        const last = this.imgList[this.imgList.length - 1]

        // 重要：第一张和最后一张需要重复一次，拼接成无限循环的效果
        this.realImgList.push(first)
        this.realImgList.unshift(last)
        this.order = 1
        this.translateX = 'translateX(-100%)'
        this.canCarousel = true
      } else if (this.imgList.length === 1) {
        this.canCarousel = false
      } else {
        this.canCarousel = false
      }
    },
    /**
     * 开始轮播
     */
    start () {
      this.timer = clearInterval(this.timer)
      this.timer = setInterval(this.switch, this.rate)
    },
    /**
     * 停止轮播
     */
    end () {
      this.timer = clearInterval(this.timer)
      this.restartTimer = clearTimeout(this.restartTimer)
    },
    /**
     * 轮播
     * @param {number} index 跳到指定下标的图片(realImgList)
     */
    switch (index = null) {
      this.isTransition = true
      this.isTransitionPoint = true
      if (index !== null && typeof index === 'number') {
        if (index < 0) {
          index = 0
        } else if (index > this.realImgList.length - 1) {
          index = this.realImgList.length - 1
        }

        this.order = index
      } else {
        this.order += this.step
      }
      // 这里用模板字符串，谷歌调试工具会很奇怪，所以先用字符串拼接
      this.translateX = 'translateX(' + -this.order * 100 + '%)'

      // 计算激活的小圆点的下标
      if (this.order === 0) {
        this.activePoint = this.realImgList.length - 3
        this.isTransitionPoint = false
      } else if (this.order === this.realImgList.length - 1) {
        this.activePoint = 0
        this.isTransitionPoint = false
      } else {
        this.activePoint = this.order - 1
      }

      // 第一张和最后一张要进行跳转
      if (this.order === 0 || this.order === this.realImgList.length - 1) {
        if (this.timer) {
          // 定时还存在
          this.$nextTick(this.checkFirstAndLast)
        } else {
          // 定时已经被清除，则代表是由于用户手动滑动图片，需要重启轮播
          this.checkFirstAndLast()
          // 重启轮播
          this.restartTimer = setTimeout(this.start, this.transitionTime)
        }
      } else if (!this.timer) {
        // 如果用户手动滑动图片，并且不是第一张和最后一张，会漏掉，这里补上重启轮播
        this.restartTimer = setTimeout(this.start, this.transitionTime)
      }
    },
    /**
     * 判断是第一个或者最后一个
     * 在过渡效果结束后，跳回到开始或者结尾
     * 定时的时间要根据过渡效果的时间来定
     */
    checkFirstAndLast () {
      if (this.order === 0) {
        this.checkTimer = setTimeout(this.gotoLast, this.transitionTime)
      } else if (this.order === this.realImgList.length - 1) {
        this.checkTimer = setTimeout(this.gotoFirst, this.transitionTime)
      }
    },
    /**
     * 回到第一个
     */
    gotoFirst () {
      // 暂停过渡
      this.isTransition = false
      this.order = 1
      this.translateX = 'translateX(-100%)'
    },
    /**
     * 回到最后一个
     */
    gotoLast () {
      // 暂停过渡
      this.isTransition = false
      this.order = this.realImgList.length - 2
      this.translateX = `translateX(${-this.order * 100}%)`
    },
    /**
     * 触摸开始，把当前在过渡的效果取消，同时如果是第一或者最后一个则也就切换到相应的图片
     * @param{Event} e 事件
     */
    handleTouchstart (e) {
      window.addEventListener('touchmove', this.stopWindowTouchMove, {
        passive: false,
      })
      // 停止过渡
      this.isTransition = false
      this.isTransitionPoint = false
      // 清除checkTimer定时是因为避免临界图片在过渡效果中时触发事件
      this.checkTimer = clearTimeout(this.checkTimer)
      // 停止图片轮播
      this.end()
      // 记录当前的x位置
      this.startX = e.targetTouches[0].clientX
      this.$nextTick(function () {
        // 处理临界图片的切换
        if (this.order === 0) {
          // 第一个，回到最后
          this.gotoLast()
        } else if (this.order === this.realImgList.length - 1) {
          // 最后一个，回到第一个
          this.gotoFirst()
        }
      })
    },
    /**
     * 手指移动事件
     * @param{Event} e 事件
     */
    handleTouchmove (e) {
      const offsetX = e.targetTouches[0].clientX - this.startX
      // 保留4位小数
      const percent = parseFloat(((offsetX / this.width) * 100).toFixed(4))

      // if (percent > 0) {
      //   // 往右划
      //   const currentX = -this.order * 100
      //   const nextX = currentX + percent

      //   this.translateX = `translateX(${nextX}%)`
      // } else {
      //   // 往左划
      //   const currentX = -this.order * 100
      //   const nextX = currentX + percent

      //   this.translateX = `translateX(${nextX}%)`
      // }

      // 往右划、往左划的逻辑一样
      const currentX = -this.order * 100
      const nextX = currentX + percent

      this.translateX = `translateX(${nextX}%)`
    },

    /**
     * 触摸结束事件
     * @param{Event} e 事件
     */
    handleTouchend (e) {
      window.removeEventListener('touchmove', this.stopWindowTouchMove)
      const currentX = parseFloat(this.translateX.match(/[-+]?\d+[.]?\d+/g)[0])
      const originX = this.order * -100

      if (originX > currentX && Math.abs(currentX) - Math.abs(originX) >= 30) {
        // 下一个
        this.switch(this.order + 1)
      } else if (
        originX < currentX &&
        Math.abs(originX) - Math.abs(currentX) >= 30
      ) {
        // 上一个
        this.switch(this.order - 1)
      } else {
        // 恢复原本的样子
        this.switch(this.order)
      }
    },
    /**
     * 有些手机浏览器（比如：uc浏览器）在touchmove元素时会传到window中
     * 导致会触发浏览器的自带的事件，比如前进后退功能
     * 所以在拖动轮播图时，停止window的touchmove事件，结束后再恢复
     * @param {Event} e 事件
     */
    stopWindowTouchMove (e) {
      // e.stopPropagation()
      e.preventDefault()
    },
  },
  created () {
    this.init()
  },
  mounted () {
    // 获取容器的宽度
    this.width = parseFloat(window.getComputedStyle(this.$refs.main).width)

    if (this.canCarousel) {
      this.start()
    } else {
      this.end()
    }
  },
}
</script>

<style lang="scss">
.carousel-img {
  position: relative;
  height: 100%;
  overflow: hidden;

  &__main {
    display: flex;
    height: 100%;
    transform: translateX(0%);

    &.is-transition {
      transition: transform 0.4s linear;
    }
  }

  &__img-wrap {
    flex: 0 0 auto;
    width: 100%;
  }

  &__img {
    width: 100%;
    height: 100%;
  }

  &__tip-wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: px2rem(30);
    display: flex;
    justify-content: center;
  }

  &__tip {
    position: relative;
    display: flex;
    border-radius: px2rem(1.5);
    overflow: hidden;
  }

  &__order {
    width: px2rem(18);
    height: px2rem(3);
    background: #fff;
    opacity: 0.2;

    &.is-active {
      position: absolute;
      left: 0;
      top: 0;
      border-radius: px2rem(1.5);
      background: #fff;
      transform: translateX(0%);
      opacity: 1;

      &.is-transition {
        transition: transform 0.4s linear;
      }
    }
  }
}
</style>
