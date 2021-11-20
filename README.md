# Nano Spy

A tiny Node.js library to spy and mock methods in tests with great TypeScript support.

It will took only [5 KB](https://packagephobia.com/result?p=nanospy)
in your `node_modules` and have 0 dependencies.

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

<a href="https://evilmartians.com/?utm_source=nanospy">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>
