/**
 * @author 陈柄昌
 * @date 2020-06-16
 * @desc 由于touchstart/touchmove/touchend有可能会和滚动条的scroll事件重叠
 * 导致在绑定了touch事件的元素上滚动，滚动条会滚动，同时元素绑定的touch事件也会触发
 * 所以需要滚动后阻止touchend事件冒泡
 * 这里为了解决点击穿透，用touchend代替click
 */
/**
 * 利用viewport不缩放，或者宽度设置为设备宽度，解决click300ms延迟，
 * 同时不混用click和touch事件，来解决点击穿透，
 * 即：点击事件都用click。而touch事件禁止用于地址跳转或者关闭某个弹框，只用于类似移动的事件中
 */
function stopTouchendAfterScroll () {
  let isTouchmove = false

  // 必须在捕获时绑定
  window.addEventListener('touchmove', windowTouchmove, true)

  function windowTouchmove (e) {
    console.log('全局touchmove', e.aa_isStopPropagation, e)
    if (!isTouchmove) {
      isTouchmove = true
      window.addEventListener('touchend', stopTouchendPropagation, true)
    }
  }

  function stopTouchendPropagation (e) {
    // 阻止冒泡
    e.stopPropagation()
    window.removeEventListener('touchend', stopTouchendPropagation, true)
    isTouchmove = false
  }
}

export default stopTouchendAfterScroll
