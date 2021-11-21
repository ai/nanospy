let spies = []

export function spy(cb) {
  let tracker = (...args) => {
    tracker.called = true
    tracker.callCount += 1
    tracker.calls.push(args)
    if (tracker.next) {
      let [nextType, nextResult] = tracker.next
      tracker.next = false
      if (nextType === 'error') {
        tracker.results.push(undefined)
        throw nextResult
      } else {
        tracker.results.push(nextResult)
        return nextResult
      }
    } else {
      let result
      if (cb) result = cb(...args)
      tracker.results.push(result)
      return result
    }
  }

  tracker.called = false
  tracker.callCount = 0
  tracker.results = []
  tracker.calls = []
  tracker.nextError = error => {
    tracker.next = ['error', error]
  }
  tracker.nextResult = result => {
    tracker.next = ['ok', result]
  }

  return tracker
}

export function spyOn(obj, methodName, mock) {
  let origin = obj[methodName]
  if (!mock) mock = origin
  let tracker = {
    called: false,
    callCount: 0,
    results: [],
    calls: [],
    nextError(error) {
      tracker.next = ['error', error]
    },
    nextResult(result) {
      tracker.next = ['ok', result]
    },
    restore() {
      obj[methodName] = origin
    }
  }
  obj[methodName] = (...args) => {
    tracker.called = true
    tracker.callCount += 1
    tracker.calls.push(args)
    if (tracker.next) {
      let [nextType, nextResult] = tracker.next
      tracker.next = false
      if (nextType === 'error') {
        tracker.results.push(undefined)
        throw nextResult
      } else {
        tracker.results.push(nextResult)
        return nextResult
      }
    } else {
      let result = mock.apply(obj, args)
      tracker.results.push(result)
      return result
    }
  }
  spies.push(tracker)
  return tracker
}

export function restoreAll() {
  for (let tracker of spies) {
    tracker.restore()
  }
  spies = []
}
