let spies = []

export function spyOn(obj, methodName, mock) {
  let origin = obj[methodName]
  if (!mock) mock = origin
  let spy = {
    called: false,
    callCount: 0,
    results: [],
    calls: [],
    next: false,
    nextError(error) {
      super.next = ['error', error]
    },
    nextResult(result) {
      super.next = ['ok', result]
    },
    reset() {
      obj[methodName] = origin
    }
  }
  obj[methodName] = (...args) => {
    spy.called = true
    spy.callCount += 1
    spy.calls.push(args)
    if (spy.next) {
      let [nextType, nextResult] = spy.next
      spy.next = false
      if (nextType === 'error') {
        spy.results.push(undefined)
        throw nextResult
      } else {
        spy.results.push(nextResult)
        return nextResult
      }
    } else {
      let result = mock.apply(obj, args)
      spy.results.push(result)
      return result
    }
  }
  spies.push(spy)
  return spy
}

export function resetSpies() {
  for (let spy of spies) {
    spy.reset()
  }
  spies = []
}
