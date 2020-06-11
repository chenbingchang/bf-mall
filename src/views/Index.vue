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
  }
</style>
