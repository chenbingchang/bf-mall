<template>
  <div class="home">
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
    <div class="home__wheel">

    </div>
    <ul class="home__goods">
      <li>1111</li>
      <li>1111</li>
      <li>1111</li>
      <li>1111</li>
      <li>1111</li>
      <li>1111</li>
      <li>1111</li>
      <li>2222</li>
      <li>2222</li>
      <li>2222</li>
      <li>2222</li>
      <li>2222</li>
      <li>2222</li>
      <li>2222</li>
      <li>2222</li>
      <li>3333</li>
      <li>3333</li>
      <li>3333</li>
      <li>3333</li>
      <li>3333</li>
      <li>3333</li>
      <li>3333</li>
      <li>3333</li>
      <li>4444</li>
      <li>4444</li>
      <li>4444</li>
      <li>4444</li>
      <li>4444</li>
      <li>4444</li>
      <li>4444</li>
      <li>4444</li>
      <li>4444</li>
      <li>4444</li>
      <li>4444</li>
      <li>5555</li>
      <li>5555</li>
      <li>5555</li>
      <li>5555</li>
      <li>5555</li>
      <li>end</li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
}
</script>

<style lang="scss">
  .home {
    @include marginBottomMenu();
    overflow: auto;

    /* 需要使用自己写的js滚动条 */
    /* &::-webkit-scrollbar {
      width: px2rem(0);
      background-color: transparent;
      z-index: 999;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
    &::-webkit-scrollbar-track {
      background-color: greenyellow;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      width: px2rem(6);
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: px2rem(3);
    } */

    &__search {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      height: px2rem(42);
      background-color: $bg-color;
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

    &__wheel {
      height: px2rem(400);
      background-color: gold;
    }
  }
</style>
