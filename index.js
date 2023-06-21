let spies = []

function spy(cb) {
  let fn = (...args) => {
    fn.called = true
    fn.callCount += 1
    fn.calls.push(args)
    if (fn.next) {
      let [nextType, nextResult] = fn.next
      fn.next = false
      if (nextType === 'error') {
        fn.results.push(undefined)
        throw nextResult
      } else {
        fn.results.push(nextResult)
        return nextResult
      }
    } else {
      let result
      if (fn.impl) result = fn.impl(...args)
      fn.results.push(result)
      return result
    }
  }

  fn.called = false
  fn.callCount = 0
  fn.results = []
  fn.calls = []
  fn.nextError = error => {
    fn.next = ['error', error]
  }
  fn.nextResult = result => {
    fn.next = ['ok', result]
  }
  fn.nextResolve = () => {
    let promiseResolve
    let promise = new Promise(resolve => {
      promiseResolve = resolve
    })
    fn.next = ['ok', promise]
    return result => {
      promiseResolve(result)
      return new Promise(resolve => {
        setTimeout(resolve, 10)
      })
    }
  }
  fn.nextReject = () => {
    let promiseReject
    let promise = new Promise((resolve, reject) => {
      promiseReject = reject
    })
    fn.next = ['ok', promise]
    return error => {
      promiseReject(error)
      return new Promise(resolve => {
        setTimeout(resolve, 10)
      })
    }
  }
  fn.onCall = body => {
    Object.defineProperty(fn, 'length', { value: body ? body.length : 0 })
    fn.impl = body
  }
  fn.onCall(cb)

  return fn
}

function spyOn(obj, methodName, mock) {
  let origin = obj[methodName]
  if (!mock) mock = origin
  let fn = spy(mock.bind(obj))
  fn.restore = () => {
    obj[methodName] = origin
  }

  obj[methodName] = fn

  spies.push(fn)
  return fn
}

function restoreAll() {
  for (let fn of spies) {
    fn.restore()
  }
  spies = []
}

module.exports.spy = spy
module.exports.spyOn = spyOn
module.exports.restoreAll = restoreAll
