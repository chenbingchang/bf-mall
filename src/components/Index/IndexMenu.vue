<template>
  <footer class="index-menu">
    <router-link
      v-for="menu in menuList"
      :key="menu.routeName"
      class="index-menu__item"
      :to="{name: menu.routeName}"
    >
      <i
        class="iconfont index-menu__icon"
        :class="menu.iconClass"
      ></i>
      <span class="index-menu__name">{{menu.name}}</span>
    </router-link>
  </footer>
</template>

<script>
export default {
  name: 'IndexMenu',
  data () {
    return {
      menuList: [
        {
          name: '首页',
          iconClass: 'icon-home',
          routeName: 'Home',
        },
        {
          name: '分类',
          iconClass: 'icon-category',
          routeName: 'Category',
        },
        {
          name: '购物车',
          iconClass: 'icon-cart',
          routeName: 'Cart',
        },
        {
          name: '我的',
          iconClass: 'icon-user',
          routeName: 'User',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.index-menu {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: px2rem(52);

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $ft-color;

    /* router-link-exact-active这个类名是router-link激活时自动添加的类名 */
    &.router-link-exact-active {
      color: $main-color;
    }
  }

  &__icon {
    margin-bottom: px2rem(5);
    font-size: px2rem(20);
    line-height: px2rem(20);
  }

  &__name {
    font-size: px2rem(12);
    line-height: 1;
  }
}
</style>
