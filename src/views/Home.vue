<template>
  <div class="home index__main">
    <div class="home__search">
      <div class="home__logo-wrap">
        <img
          class="home__logo"
          src="@assets/imgs/logo.png"
          alt="logo"
        >
      </div>
      <div class="home__key-wrap">
        <i class="iconfont icon-search"></i>
        <span>搜索商品名称</span>
      </div>
      <div class="home__login-wrap">
        <i class="home__login iconfont icon-user"></i>
      </div>
    </div>
    <BfScrollbar
      class="home__scroll"
      :canClick="false"
      :canDrag="false"
      :isRem="true"
      :remFontSize="100"
      barClass="common-scroll-bar"
      thumbClass="common-scroll-thumb"
    >
      <CarouselImg
        class="home__wheel"
        :imgList="hotImgList"
      ></CarouselImg>
      <!-- <div class="">
      </div> -->
      <div class="home__goods">
        <div style="height: 300px; margin-bottom: 30px; background-color: gold;"></div>
        <div style="height: 300px; margin-bottom: 30px; background-color: gold;"></div>
        <div style="height: 300px; margin-bottom: 30px; background-color: gold;"></div>
        <div style="height: 300px; margin-bottom: 30px; background-color: gold;"></div>
        <div style="height: 300px; margin-bottom: 30px; background-color: gold;"></div>
        <div style="height: 300px; margin-bottom: 30px; background-color: gold;"></div>
      </div>
    </BfScrollbar>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data () {
    return {
      hotImgList: [
        'https://img.wbp5.com/upload/images/fxchat/2020/06/19/084634716.jpg',
        'https://img.wbp5.com/upload/images/fxchat/2020/06/19/084655325.jpg',
        'https://img.wbp5.com/upload/images/fxchat/2020/06/19/084714794.jpg',
        'https://img.wbp5.com/upload/images/fxchat/2020/06/17/140556823.jpg',
        'https://img.wbp5.com/upload/images/fxchat/2020/06/11/162848609.jpg',
      ],
    }
  },
  components: {
    BfScrollbar: () => import(/* webpackChunkName: "BfScrollbar" */ '@components/common/BfScrollbar'),
    CarouselImg: () => import(/* webpackChunkName: "CarouselImg" */ '@components/home/CarouselImg'),
  },
  methods: {

  },
}
</script>

<style lang="scss">
  .home {
    display: flex;
    flex-direction: column;

    &__search {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      height: px2rem(42);
      background-color: $bg-color;
    }

    &__scroll {
      flex: 1 0 auto;
      height: 0;
    }

    &__logo-wrap,
    &__login-wrap {
      flex: 0 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      width: px2rem(50);
      height: px2rem(30);

    }

    &__logo {
      width: px2rem(24);
      height: px2rem(24);
    }

    &__key-wrap {
      flex: 1 0 auto;
      display: flex;
      align-items: center;
      width: 0;
      height: px2rem(32);
      border: 1px solid $bor-color;
      border-radius: px2rem(2);
      background-color: #fff;
      font-size: px2rem(15);
      line-height: 1;
      color: rgba(0, 0, 0, 0.3);

      .iconfont {
        margin: 0 px2rem(7);
        font-size: px2rem(16);
        line-height: 1;
      }
    }

    &__login {
      font-size: px2rem(20);
      /* 采坑笔记：
      line-height: normal;即默认的属性是根据浏览器类型及font-family决定的，
      一般会比1大一点点 */
      line-height: 1;
      color: $ft-color;
    }

    &__wheel.carousel-img {
      height: px2rem(180);
      // background-color: gold;
    }
  }
</style>
