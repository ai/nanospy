# Nano Spy

A tiny Node.js library to spy and mock methods in tests
with great **TypeScript** support.

It will take only **[5 KB](https://packagephobia.com/result?p=nanospy)**
in your `node_modules` and have **0 dependencies**.

```js
import { spyOn, restoreAll } from 'nanospy'

test.after.each(() => {
  restoreAll()
})

test('calls increase', () => {
  let spy = spyOn(counter, 'increase')
  counter.increase(5)
  assert.equal(spy.callCount, 1)
  assert.equal(spy.calls, [[5]])
})
```

<a href="https://evilmartians.com/?utm_source=nanospy">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>


## Usage

### Method Spy

Spy tracks method calls, but do not change method’s behavior.

```js
import { spyOn, restoreAll } from 'nanospy'

test.after.each(() => {
  restoreAll()
})

test('calls increase', () => {
  let spy = spyOn(counter, 'increase')
  counter.increase(5)
  assert.is(spy.called, true)
  assert.equal(spy.callCount, 1)
  assert.equal(spy.calls, [[5]])
  assert.equal(spy.results, [true])
})
```

### Mock

Mock change the method’s behavior.

```js
let spy = spyOn(global, 'fetch', async () => {
  return {
    json: () => ({ posts })
  }
})
```

Or change next function call:

```js
spy.nextResult({ ok: false })
```

```js
spy.nextError(error)
```

### Functions

`spy` can be used to track callback calls.

```js
import { spy } from 'nanospy'

let fn = spy()
fn('a', 10)
fn.callCount //=> 1
fn.calls //=> [['a', 10]]
```

You can pass `spy`’s callback:

```js
let fn = spy((name: string) => {
  console.log(`Hello, ${name}!`)
})
fn('Ivan') //=> Hello, Ivan!
```

Or change next function call:

```js
fn.nextResult({ ok: false })
```

```js
fn.nextError(error)
```
