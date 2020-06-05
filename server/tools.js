// 这里主要用来封装一些后台的错误处理请求

/*
  cbPromise: 代表的是一个'async函数调用'返回的promise对象, aysnc函数返回的对象就是promise对象
  return的结果是一个数组 [err, data]   
 */
function awaitWrap(cbPromise) {
  // 如果回调函数返回的propmise对象返回值成功，err等于null, data=data
  return cbPromise.then((data) => [null, data]).catch((err) => [err, null])
}

module.exports = {
  awaitWrap,
}
