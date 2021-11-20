import { spyOn, restoreAll } from '../index.js'

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

// THROWS '"increse"' is not assignable to parameter of type 'Methods<Counter>'
let increse = spyOn(counter, 'increse')

let increase = spyOn(counter, 'increase')
testBoolean(increase.called)
testNumber(increase.callCount)
// THROWS 'boolean' is not assignable to parameter of type 'number'
testNumber(increase.calls[0][0])
increase.nextError(new Error('Test'))
increase.nextResult(10)

// THROWS assignable to parameter of type '(newBase: number) => number'
spyOn(counter, 'reset', base => {
  testNumber(increase.callCount)
})

restoreAll()
