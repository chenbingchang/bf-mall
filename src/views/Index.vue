<template>
  <div class="index">
    <router-view></router-view>
    <IndexMenu></IndexMenu>
  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {
    IndexMenu: () => import(/* webpackChunkName: "index" */ '@components/Index/IndexMenu.vue'),
  },
}
</script>

<style lang="scss">
  .index {
    position: relative;
    @include full-wh();

    &__main {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: px2rem(52);
    }
  }
</style>
