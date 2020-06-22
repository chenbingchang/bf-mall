<template>
  <div class="carousel-img">
    <ul
      class="carousel-img__main"
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
    <ul class="carousel-img__tip">
      <li class="carousel-img__order"></li>
    </ul>
  </div>
</template>

<script>
/**
 * 图片轮播，采用transform进行图片的切换，避免回流
 */
export default {
  name: 'CarouselImg',
  props: {
    // 图片列表
    imgList: {
      type: Array,
      require: true,
    },
  },
  data () {
    return {
      order: 1, // 轮到的图片，从0开始，即：下标
      timer: null, // 定时器
      rate: 3000, // 时间间隔
      translateX: 'translateX(-100%)',
    }
  },
  computed: {
    /**
     * 在第一张和最后一张需要重复一次
     */
    realImgList () {
      const result = this.imgList.slice(0)

      if (this.imgList.length > 1) {
        const first = this.imgList[0]
        const last = this.imgList[this.imgList.length - 1]

        result.push(first)
        result.unshift(last)
      }

      return result
    },
  },
  methods: {
    start () {
      clearInterval(this.timer)
      this.timer = setInterval(this.switch, this.rate)
    },
    switch () {
      if (this.order === 0) {
        // 第一张
        ++this.order
      } else if (this.order === this.realImgList.length - 1) {
        // 最后一张

      } else {
        // 中间
        ++this.order
      }

      this.translateX = `translateX(${(-this.order + 1) * 100}%)`
    },
  },
  created () {

  },
  mounted () {

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
      transition: transform 0.4s linear;
    }

    &__img-wrap {
      flex: 0 0 auto;
      width: 100%;
    }

    &__img {
      width: 100%;
      height: 100%;
    }

    &__tip {
      position: absolute;
      left: 0;
      right: 0;
      bottom: px2rem(30);
    }

    &__order {

    }
  }
</style>
