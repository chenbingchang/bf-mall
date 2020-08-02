<template>
  <div class="carousel-img">
    <ul
      class="carousel-img__main"
      :class="{'is-transition': isTransition}"
      :style="{ transform: translateX }"
    >
      <li
        class="carousel-img__img-wrap"
        v-for="(item, index) in realImgList"
        :key="index"
      >
        <img
          class="carousel-img__img"
          :src="item"
          alt=""
        >
      </li>
    </ul>
    <div class="carousel-img__tip-wrap">
      <ul class="carousel-img__tip">
        <li
          class="carousel-img__order is-active"
          :class="{'is-transition': isTransitionPoint}"
          :style="{transform: `translateX(${activePoint * 100}%)`}"
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
  },
  data () {
    return {
      canCarousel: false, // 是否可以轮播，大于等于2张图片才能轮播
      order: 0, // 轮到的图片，从0开始，即：下标
      timer: null, // 定时器
      rate: 3000, // 时间间隔
      translateX: 'translateX(0%)', // 轮播容器便宜量
      realImgList: [], // 真正轮播的列表
      isTransition: true, // 是否有过渡效果
      activePoint: 0, // 激活的小圆点，指示目前是第几个轮播图按下标
      isTransitionPoint: true, // 激活的提升点否有过渡效果
    }
  },
  computed: {
    /**
     * 在第一张和最后一张需要重复一次
     */

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

        // 在第一张和最后一张需要重复一次
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
      clearInterval(this.timer)
      this.timer = setInterval(this.switch, this.rate)
    },
    /**
     * 停止轮播
     */
    end () {
      clearInterval(this.timer)
    },
    /**
     * 轮播
     */
    switch () {
      this.isTransition = true
      this.isTransitionPoint = true
      ++this.order
      this.translateX = `translateX(${(-this.order) * 100}%)`

      // 计算激活的图片的下标
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
        this.$nextTick(this.checkFirstAndLast)
      }
    },
    /**
     * 判断是第一个或者最后一个
     * 在过渡效果结束后，跳回到开始或者结尾
     * 定时的时间要根据过渡效果的时间来定
     */
    checkFirstAndLast () {
      if (this.order === 0) {
        setTimeout(this.gotoLast, 401)
      } else if (this.order === this.realImgList.length - 1) {
        setTimeout(this.gotoFirst, 401)
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
      this.translateX = `translateX(${(-this.order) * 100}%)`
    },
  },
  created () {
    this.init()
  },
  mounted () {
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
      transform: translateX(-100%);

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
