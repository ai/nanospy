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
      if (cb) result = cb(...args)
      fn.results.push(result)
      return result
    }
  }

  Object.defineProperty(fn, 'length', { value: cb ? cb.length : 0 })
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
