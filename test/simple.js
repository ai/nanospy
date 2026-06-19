// Smoke test that runs on old Node.js (down to 8.x) without TypeScript
// or `node:test`. It only checks that the compiled CommonJS build is
// importable and that the core API works.

let assert = require('assert')
let nanospy = require('../index.js')

let spy = nanospy.spy
let spyOn = nanospy.spyOn
let restoreAll = nanospy.restoreAll

// spy() tracks calls and results
let fn = spy(function (name) {
  return name + '!'
})
assert.strictEqual(fn.called, false)
assert.strictEqual(fn.callCount, 0)
assert.strictEqual(fn('a'), 'a!')
assert.strictEqual(fn.called, true)
assert.strictEqual(fn.callCount, 1)
assert.deepStrictEqual(fn.calls, [['a']])
assert.deepStrictEqual(fn.results, ['a!'])

// nextResult() overrides the next return value
fn.nextResult('B!')
assert.strictEqual(fn('b'), 'B!')
assert.strictEqual(fn.callCount, 2)

// spyOn() wraps an object method and can mock it
let obj = {
  method: function (arg) {
    return arg + '!'
  }
}
let method = spyOn(obj, 'method', function (arg) {
  return arg.toUpperCase() + '!'
})
assert.strictEqual(obj.method('a'), 'A!')
assert.strictEqual(method.callCount, 1)
assert.deepStrictEqual(method.calls, [['a']])

// restore() and restoreAll() bring the original method back
restoreAll()
assert.strictEqual(obj.method('a'), 'a!')
assert.strictEqual(method.callCount, 1)

process.stdout.write('Smoke test passed on Node.js ' + process.version + '\n')
