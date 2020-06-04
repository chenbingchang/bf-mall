<template>
  <div class="index">
    Index222
    <div class="ass"></div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Index',
}
</script>

<style lang="scss">
  .index {
    @include full-wh();
  }
</style>
