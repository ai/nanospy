import { spyOn, restoreAll, spy } from '../index.js'

class Counter {
  count = 0

  increase(big: boolean): number {
    this.count += big ? 10 : 1
    return 0
  }

  reset(newBase: number): number {
    this.count = newBase
    return newBase
  }
}
let counter = new Counter()

function testBoolean(a: boolean): void {
  console.log(a)
}
function testNumber(a: number): void {
  console.log(a + 1)
}

let increase = spyOn(counter, 'increase')
testBoolean(increase.called)
testNumber(increase.callCount)
testBoolean(increase.calls[0][0])
increase.nextError(new Error('Test'))
increase.nextResult(10)

increase.onCall(big => (big ? 10 : 1))

spyOn(counter, 'reset', base => {
  testNumber(increase.callCount)
  return base
})

restoreAll()

let fn = spy((str: string): number => {
  return str.length
})
testNumber(fn('a'))
