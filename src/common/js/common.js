/**
 * 防抖
 * @param {Function} fn 实际要执行的函数
 * @param {number} delay 延迟时间，单位毫秒，默认200
 * @return {Function} 返回防抖函数
 */
function debounced (fn, delay = 200) {
  // 定时器
  let timer

  return function () {
    // 保存函数调用时的上下文和参数，传递给fn
    const context = this
    const args = arguments
    // 如果定时器已存在则先清除，保证不执行fn
    clearTimeout(timer)
    // 当返回的函数被最后一次调用，即过了delay毫秒后执行fn
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

/**
 * 节流
 * @param {Function} fn 实际要执行对函数
 * @param {number} threshhold 执行间隔，单位毫秒，默认250
 * @return {Function} 返回一个“节流”函数
 */
function throttle (fn, threshhold = 250) {
  // 记录上次执行对时间
  let last
  // 定时器
  let timer

  // 返回的函数，每过 threshhold 毫秒就执行一次 fn 函数
  return function () {
    // 保存函数调用时的上下文和参数，传递给fn
    const context = this
    const args = arguments
    const now = +new Date()
    // 如果距离上次执行的时间小于threshhold那么就放弃执行fn，并重新计时
    if (last && now < last + threshhold) {
      clearTimeout(timer)
      // 保证在当前时间区间结束后，再执行一次fn
      timer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, threshhold)
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}

/**
 * 获取当前日期时间，格式：yyyy-MM-dd HH:mm:ss
 * @param {number} tiems 时间戳，可选
 * @param {string} timeType 时间的格式。H，小时; I,小时：分钟; S，小时:分钟:秒; 默认S
 */
function curDateTime (tiems, timeType = 'S') {
  const d = tiems ? new Date(tiems) : new Date()
  const year = d.getFullYear()
  let month = d.getMonth() + 1
  let date = d.getDate()
  let hours = d.getHours()
  let minutes = d.getMinutes()
  let seconds = d.getSeconds()

  if (month < 10) {
    month = '0' + month
  }
  if (date < 10) {
    date = '0' + date
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }

  let timeTxt = ''
  switch (timeType.toLocaleUpperCase()) {
    case 'H':
      timeTxt = `${hours}`
      break
    case 'I':
      timeTxt = `${hours}:${minutes}`
      break
    case 'S':
      timeTxt = `${hours}:${minutes}:${seconds}`
      break
    default:
      timeTxt = `${hours}:${minutes}:${seconds}`
  }

  const result = `${year}-${month}-${date} ${timeTxt}`
  return result
}

/**
 * 获取当前时间、当前时间戳、和今天0时的时间戳
 * @returns {Object} 当前的时间信息。todayZeroTimeStamp,// 今天0时的时间戳；curDateTimeStr,// 现在的时间，yyyy-MM-dd HH:mm:ss；curTimeStamp// 现在的时间戳
 */
function curTimeObj () {
  const time = new Date()
  const curTimeStamp = time.getTime()
  const todayZeroTimeStamp =
    curTimeStamp -
    ((time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds()) *
      1000 +
      time.getMilliseconds())
  const curDateTimeStr = curDateTime(curTimeStamp)

  return {
    todayZeroTimeStamp, // 今天0时的时间戳
    curDateTimeStr, // 现在的时间，yyyy-MM-dd HH:mm:ss
    curTimeStamp, // 现在的时间戳
  }
}

/**
 * 计算选择时间的范围，供el-data-picker动态设置时间范围使用
 * @param {string} curDateTimeStr 当前的日期时间字符串，格式：yyyy-MM-dd HH:mm:ss
 * @param {string} selDateTimeStr 选择的日期时间字符串，格式：yyyy-MM-dd HH:mm:ss
 * @param {Boolean} isAfter 可选的时间是当前时间之前还是之后。true: 之后（默认）；false: 之前；
 * @returns {Object} selectableRange // 时间范围;isValid: true,// 选择的时间是否合法
 */
function computedTimeRange (curDateTimeStr, selDateTimeStr, isAfter = true) {
  const result = {
    selectableRange: '00:00:00 - 23:59:59', // 时间范围
    isValid: true, // 选择的时间是否合法
  }

  if (curDateTimeStr && selDateTimeStr) {
    const curDateTimeArr = curDateTimeStr.split(' ')
    const selDataTimeArr = selDateTimeStr.split(' ')

    // 同一天，
    if (curDateTimeArr[0] === selDataTimeArr[0]) {
      const curTimeArr = curDateTimeArr[1].split(':').map(item => parseInt(item))
      const selTimeArr = selDataTimeArr[1].split(':').map(item => parseInt(item))

      if (isAfter) {
        // 之后，则只能选择当前时间之后的时间
        result.selectableRange = `${curDateTimeArr[1]} - 23:59:59` // 设置时间范围

        // 判断当前时间是否在范围内
        if (
          selTimeArr[0] < curTimeArr[0] ||
          (selTimeArr[0] === curTimeArr[0] && selTimeArr[1] < curTimeArr[1]) ||
          (selTimeArr[0] === curTimeArr[0] &&
            selTimeArr[1] === curTimeArr[1] &&
            selTimeArr[2] < curTimeArr[2])
        ) {
          // 选择时间无效
          result.isValid = false
        }
      } else {
        // 之前，则只能选择当前时间之前的时间
        result.selectableRange = `00:00:00 - ${curDateTimeArr[1]}` // 设置时间范围

        // 判断当前时间是否在范围内
        if (
          selTimeArr[0] > curTimeArr[0] ||
          (selTimeArr[0] === curTimeArr[0] && selTimeArr[1] > curTimeArr[1]) ||
          (selTimeArr[0] === curTimeArr[0] &&
            selTimeArr[1] === curTimeArr[1] &&
            selTimeArr[2] > curTimeArr[2])
        ) {
          // 选择时间无效
          result.isValid = false
        }
      }
    }
  }

  return result
}

/**
 * 解析日期时间字符串，别传只有日期的字符串，我不能处理
 * @param {string} str 要解析的日期时间字符串，日期和
 * @param {string} dateSeparator 日期的分隔符，默认'-'
 * @param {string} timeSeparator 时间的分隔符，默认':'
 * @param {string} dateTimeSeparator 日期和时间之间的连接符，默认' '
 * @param {Boolean} isDate 是返回Date对象还是返回时间戳。true: Date对象；false: 时间戳；
 * @returns {Object | number} Date对象或者时间戳，根据isDate参数决定
 */
function parseDateTimeStr (
  str,
  dateSeparator = '-',
  timeSeparator = ':',
  dateTimeSeparator = ' ',
  isDate = false,
) {
  const dateTimeArr = str.split(dateTimeSeparator)
  const dateArr = dateTimeArr[0].split(dateSeparator).map(item => parseInt(item))
  const timeArr = dateTimeArr[1].split(timeSeparator).map(item => parseInt(item))
  // new Date()的参数
  const param = []

  // 日期
  for (let i = 0; i < dateArr.length; i++) {
    if (i === 1) {
      // 月份要-1
      param.push(dateArr[i] - 1)
    } else {
      param.push(dateArr[i])
    }
  }
  // 时间
  for (const j in timeArr) {
    param.push(timeArr[j])
  }
  // 加上毫秒
  param.push(0)

  if (isDate) {
    return new Date(...param)
  } else {
    return new Date(...param).getTime()
  }
}

/**
 * 判断删除的数据是否是最后一页最后一条数据，是则查询页码要-1
 * @param {number} total 总数
 * @param {number} pageSize 每页数
 * @param {number} pageIndex 当前页码
 * @returns {Boolean} true: 是；false： 不是;
 */
function isLastPageLastData (total, pageSize, pageIndex) {
  // 当前页码是1，则不用判断
  if (pageIndex === 1) {
    return false
  }

  // 最后一页
  if (Math.ceil(total / pageSize) === pageIndex) {
    // 最后一条
    if (total % pageSize === 1) {
      return true
    }
  }

  return false
}

/**
 * 转义'<'、'>'防止XSS攻击
 * @param {string} srt 需要转义的字符串
 * @returns {string} 转义后的字符串
 */
function htmlEncode (str) {
  if (!str) {
    return ''
  }
  return str
    .toString()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * 观察者模式
 */
class Observer {
  constructor () {
    this.handles = {}
  }

  /**
   * 订阅事件，context是handle方法运行时的上下文
   * @param {string} eventType 事件名称
   * @param {Function} handle 处理函数
   * @param {*} context 指定上下文，或者是undefined
   * @returns 返回实例本身，可以链式调用
   */
  on (eventType, handle, context) {
    if (!Reflect.hasOwnProperty.call(this.handles, eventType)) {
      this.handles[eventType] = []
    }
    if (typeof handle === 'function') {
      this.handles[eventType].push({ fn: handle, context: context })
    } else {
      throw new Error('缺少回调函数')
    }

    return this
  }

  /**
   * 发布事件
   * @param {string} eventType 事件名称
   * @param  {Array} args 参数，可以是多个
   * @returns 返回实例本身，可以链式调用
   */
  emit (eventType, ...args) {
    if (Reflect.hasOwnProperty.call(this.handles, eventType)) {
      this.handles[eventType].forEach((item, key, arr) => {
        item.fn.apply(item.context, args)
      })
    } else {
      // throw new Error(`"${eventType}"事件未注册`);
    }

    return this
  }

  /**
   * 删除订阅
   * @param {string} eventType 事件名称
   * @param {Function} handle 处理函数
   * @returns 返回实例本身，可以链式调用
   */
  off (eventType, handle) {
    if (!Reflect.hasOwnProperty.call(this.handles, eventType)) {
      throw new Error(`"${eventType}"事件未注册`)
    }

    // 存在则只删除一个，不存在则删除全部
    if (handle) {
      if (typeof handle !== 'function') {
        throw new Error('缺少回调函数')
      } else {
        this.handles[eventType].forEach((item, index, arr) => {
          if (item.fn === handle) {
            arr.splice(index, 1)
          }
        })
      }
    } else {
      this.handles[eventType] = []
    }

    return this // 实现链式操作
  }
}

/**
 * 生成uuid
 * @param {number} length uuid的长度，默认32
 */
function uuid (length = 32) {
  const charts = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const chartLength = charts.length
  let id = ''

  for (let i = 0; i < length; i++) {
    id += charts.charAt(Math.floor(Math.random() * (chartLength + 1)))
  }

  return id
}

/**
 * 获取当前月份偏移量的开始和结束时间
 * @param {number} offset 当前月份的偏移量，要是整数
 * @returns 目标月份的开始时间和结束时间
 *  --start 开始时间
 *  --end 结束时间
 */
function monthRange (offset = 0) {
  offset = parseInt(offset)
  const d = new Date() // 当前日期时间
  const year = d.getFullYear() // 当前的年
  const month = d.getMonth() + 1 // 当前的月，1-12
  let resYear // 偏移N月的年
  let resMonth // 偏移N月的月份，1-12

  if (offset > 0) {
    // 往后偏移
    resYear = year + parseInt(offset / 12)
    // resMonth = (offset + month) % 12
    resMonth = month + (offset % 12)
    if (resMonth >= 13) {
      // 月份不够用，即：该年已不够加，需要再往后一年
      ++resYear
      resMonth = resMonth - 12
    }
  } else if (offset < 0) {
    // 往前偏移
    resYear = year + parseInt(offset / 12)
    // resMonth = 12 + ((offset + month) % 12)
    resMonth = month + (offset % 12)
    if (resMonth <= 0) {
      // 月份不够用，即：该年已不够减，需要再往上一年
      --resYear
      resMonth = 12 + resMonth
    }
  } else {
    // 不偏移
    resYear = year
    resMonth = month
  }

  const nextMonthFirstDay = new Date(resYear, resMonth - 1 + 1, 1) // 下个月的第一天
  // 这个月的最后一天 = 下个月的第一天 - 一天
  const lastDay = new Date(nextMonthFirstDay.getTime() - 60 * 60 * 24 * 1000).getDate() // 当前月份最后一天
  let start = ''
  let end = ''

  start = `${resYear}-${resMonth > 10 ? resMonth : '0' + resMonth}-01 00:00:00`
  end = `${resYear}-${resMonth > 10 ? resMonth : '0' + resMonth}-${
    lastDay > 10 ? lastDay : '0' + lastDay
  } 23:59:59`

  return {
    start,
    end,
  }
}
/**
 * 替换空格、回车，并防止xss攻击
 * @param {string} txt 需要替换的文本
 * @returns 替换后的文本
 */
function replaceSpaceBr (txt) {
  return txt
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(\r)|(\n)|(\r\n)/g, '<br/>')
    .replace(/\s/g, '&nbsp;')
}

/**
 * 监听元素大小改变，改变时调用回调
 * @param {HTMLElement} el 监听的元素，el要相对定位，这里已经手动添加到style
 * @param {Function} handler 回调函数
 */
// 这段样式要么放到样式里，要么自己手动加到style
// /* 监听元素尺寸变化(monitorElementResize)需要的css */
// .monitor-size-expand,
// .monitor-size-shrink {
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   overflow: scroll;
//   visibility: hidden;
// }

// /* 监听变大,则子元素宽高 > 父容器宽高 即可，一般动态设置，避免到达一定程度后不满足该条件 */
// .monitor-size-expand-content {
// }

// /* 监听变小,则子元素宽高要 >= 200%父容器宽高 */
// .monitor-size-shrink-content {
//   width: 240%;
//   height: 240%;
// }

function monitorElementResize (el, handler) {
  // 判断是否是元素
  if (!(el instanceof HTMLElement)) {
    throw new TypeError('Parameter 1 is not instance of \'HTMLElement\'.')
  }
  // https://www.w3.org/TR/html/syntax.html#writing-html-documents-elements，部分元素无法监听大小
  if (
    /^(area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style|textarea|title)$/i.test(
      el.tagName,
    )
  ) {
    throw new TypeError(
      'Unsupported tag type. Change the tag or wrap it in a supported tag(e.g. div).',
    )
  }
  // 判断回调函数
  if (typeof handler !== 'function') {
    throw new TypeError('Parameter 2 is not of type \'function\'.')
  }

  const expand = document.createElement('div')
  const shrink = document.createElement('div')
  const expandChild = document.createElement('div')
  const shrinkChild = document.createElement('div')
  let resetEmitTimes = 0 // 因为重置scroll，而需要取消滚动事件回调的次数

  expand.className = 'monitor-size-expand'
  shrink.className = 'monitor-size-shrink'
  expandChild.className = 'monitor-size-expand-content'
  shrinkChild.className = 'monitor-size-shrink-content'

  function resetExpandChildSize (resizeType) {
    /* 变小时，改变expandChild的宽高，scroll自动会变小，导致resetScroll这里检测不到 */
    if (resizeType === 'shrink') {
      resetEmitTimes += 1
    }
    const styleObj = getComputedStyle(el)
    expandChild.style.width = parseFloat(styleObj.width) * 2 + 'px'
    expandChild.style.height = parseFloat(styleObj.height) * 2 + 'px'
  }

  resetExpandChildSize('')
  expand.appendChild(expandChild)
  shrink.appendChild(shrinkChild)
  el.style.position = 'relative' // 被监听元素要相对定位，
  el.appendChild(expand)
  el.appendChild(shrink)

  function resetScroll () {
    const expandScrollMaxTop = expand.scrollHeight - expand.clientHeight
    const expandScrollMaxLeft = expand.scrollWidth - expand.clientWidth
    const shrinkScrollMaxTop = shrink.scrollHeight - shrink.clientHeight
    const shrinkScrollMaxLeft = shrink.scrollWidth - shrink.clientWidth

    // 如果滚动条没有到底部，则设置到底部，让滚动条一直处于底部
    if (
      expand.scrollTop !== expandScrollMaxTop ||
          expand.scrollLeft !== expandScrollMaxLeft
    ) {
      resetEmitTimes += 1
      expand.scrollTop = expandScrollMaxTop
      expand.scrollLeft = expandScrollMaxLeft
    }
    if (
      shrink.scrollTop !== shrinkScrollMaxTop ||
          shrink.scrollLeft !== shrinkScrollMaxLeft
    ) {
      resetEmitTimes += 1
      shrink.scrollTop = shrinkScrollMaxTop
      shrink.scrollLeft = shrinkScrollMaxLeft
    }
  }
  resetScroll()

  function onScroll (resizeType) {
    if (resetEmitTimes > 0) {
      resetEmitTimes--
      return
    }
    resetExpandChildSize(resizeType)
    resetScroll()

    // 触发回调函数
    handler()
  }
  expand.addEventListener('scroll', function () {
    onScroll('expand')
  })
  shrink.addEventListener('scroll', function () {
    onScroll('shrink')
  })
}

export {
  debounced,
  throttle,
  curDateTime,
  isLastPageLastData,
  htmlEncode,
  curTimeObj,
  computedTimeRange,
  parseDateTimeStr,
  replaceSpaceBr,
  monthRange,
  uuid,
  Observer,
  monitorElementResize,
}
