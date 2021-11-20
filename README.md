# Nano Spy

A tiny library to spy and mock methods in tests with great TypeScript support.

```js
import { spyOn, restoreAll } from 'nanospy'

test.after.each(() => {
  restoreAll()
})

test('calls increase', () => {
  let spy = spyOn(counter, increase)
  counter.increase(5)
  assert.is(spy.called, true)
  assert.equal(spy.callCount, 1)
  assert.equal(spy.calls, [5])
})
```
