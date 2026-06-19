import { deepEqual, equal, throws } from 'node:assert/strict'
import { test } from 'node:test'

import { restoreAll, spy, spyOn } from '../index.js'

test('can spy on method', () => {
  let calls: string[] = []
  let obj = {
    method(arg: string) {
      calls.push(arg)
      return arg + '!'
    }
  }

  let method = spyOn(obj, 'method')
  equal(method.called, false)
  equal(method.callCount, 0)
  deepEqual(method.calls, [])
  equal(method.length, 1)
  deepEqual(method.results, [])

  equal(obj.method('a'), 'a!')
  deepEqual(calls, ['a'])
  equal(method.called, true)
  equal(method.callCount, 1)
  deepEqual(method.calls, [['a']])
  deepEqual(method.results, ['a!'])

  equal(obj.method('b'), 'b!')
  deepEqual(calls, ['a', 'b'])
  equal(method.callCount, 2)
  deepEqual(method.calls, [['a'], ['b']])
  deepEqual(method.results, ['a!', 'b!'])

  method.nextResult('C!')
  equal(obj.method('c'), 'C!')
  deepEqual(calls, ['a', 'b'])
  equal(method.callCount, 3)
  deepEqual(method.calls, [['a'], ['b'], ['c']])
  deepEqual(method.results, ['a!', 'b!', 'C!'])

  let error = new Error('test')
  method.nextError(error)
  throws(() => {
    obj.method('d')
  }, error)
  deepEqual(calls, ['a', 'b'])
  equal(method.callCount, 4)
  deepEqual(method.calls, [['a'], ['b'], ['c'], ['d']])
  deepEqual(method.results, ['a!', 'b!', 'C!', undefined])

  method.restore()
  equal(obj.method('e'), 'e!')
  deepEqual(calls, ['a', 'b', 'e'])
  equal(method.callCount, 4)
  deepEqual(method.calls, [['a'], ['b'], ['c'], ['d']])
  deepEqual(method.results, ['a!', 'b!', 'C!', undefined])
})

test('resets all spies', () => {
  let one = {
    method(arg: string) {
      return arg + '!'
    }
  }
  let two = {
    method(arg: string) {
      return arg + '!'
    }
  }

  let spy1 = spyOn(one, 'method')
  let spy2 = spyOn(two, 'method')

  one.method('a')
  equal(spy1.callCount, 1)
  equal(spy2.callCount, 0)

  restoreAll()
  one.method('b')
  two.method('b')
  equal(spy1.callCount, 1)
  equal(spy2.callCount, 0)
})

test('restores spy via using keyword', { skip: !Symbol.dispose }, () => {
  let calls: string[] = []
  let obj = {
    method(arg: string) {
      calls.push(arg)
      return arg + '!'
    }
  }
  let original = obj.method

  {
    using method = spyOn(obj, 'method', arg => arg.toUpperCase() + '!')
    equal(obj.method('a'), 'A!')
    deepEqual(calls, [])
    equal(method.callCount, 1)
    equal(obj.method === original, false)
  }

  equal(obj.method === original, true)
  equal(obj.method('b'), 'b!')
  deepEqual(calls, ['b'])
})

test('mocks method', () => {
  let calls: string[] = []
  let obj = {
    method(arg: string) {
      calls.push(arg)
      return arg + '!'
    }
  }

  let method = spyOn(obj, 'method', arg => {
    return arg.toUpperCase() + '!'
  })

  equal(obj.method('a'), 'A!')
  deepEqual(calls, [])
  equal(method.called, true)
  equal(method.callCount, 1)
  deepEqual(method.calls, [['a']])
  deepEqual(method.results, ['A!'])
})

test('has spy for callback', () => {
  let fn = spy()
  equal(fn.called, false)
  equal(fn.callCount, 0)
  deepEqual(fn.calls, [])
  equal(fn.length, 0)
  deepEqual(fn.results, [])

  equal(fn('a', 'A'), undefined)
  equal(fn.called, true)
  equal(fn.callCount, 1)
  deepEqual(fn.calls, [['a', 'A']])
  deepEqual(fn.results, [undefined])

  fn.nextResult('B!')
  equal(fn('b', 'B'), 'B!')
  equal(fn.callCount, 2)
  deepEqual(fn.calls, [
    ['a', 'A'],
    ['b', 'B']
  ])
  deepEqual(fn.results, [undefined, 'B!'])

  equal(fn('c', 'C'), undefined)
  equal(fn.callCount, 3)
  deepEqual(fn.results, [undefined, 'B!', undefined])

  let error = new Error('test')
  fn.nextError(error)
  throws(fn, error)
  equal(fn.callCount, 4)
  deepEqual(fn.results, [undefined, 'B!', undefined, undefined])
})

test('supports spy with callback', () => {
  let fn = spy((name: string): string => name + '!')

  equal(fn.length, 1)

  equal(fn('a'), 'a!')
  equal(fn.called, true)
  equal(fn.callCount, 1)
  deepEqual(fn.calls, [['a']])
  deepEqual(fn.results, ['a!'])

  fn.nextResult('B!')
  equal(fn('b'), 'B!')
  equal(fn.callCount, 2)
  deepEqual(fn.calls, [['a'], ['b']])
  deepEqual(fn.results, ['a!', 'B!'])
})

test('supports remocking', () => {
  let fn = spy((name: string, very?: boolean) => name + (very ? '!!!' : '!'))
  equal(fn.length, 2)
  fn.nextResult('ONE!')
  equal(fn('one'), 'ONE!')

  equal(fn('one', true), 'one!!!')
  equal(fn.callCount, 2)
  deepEqual(fn.calls, [['one'], ['one', true]])
  deepEqual(fn.results, ['ONE!', 'one!!!'])

  fn.onCall((name: string) => name + '?')
  equal(fn.length, 1)
  fn.nextResult('TWO?')
  equal(fn('two'), 'TWO?')

  equal(fn('two'), 'two?')
  equal(fn.callCount, 4)
  deepEqual(fn.calls, [['one'], ['one', true], ['two'], ['two']])
  deepEqual(fn.results, ['ONE!', 'one!!!', 'TWO?', 'two?'])
})

test('mock promises', async () => {
  let calls: string[] = []
  let obj = {
    async method() {
      return 'one'
    }
  }

  let method = spyOn(obj, 'method')
  let resolve = method.nextResolve()
  obj.method().then(result => {
    calls.push(result)
  })

  deepEqual(calls, [] as string[])
  await resolve('two')
  deepEqual(calls, ['two'])

  let reject = method.nextReject()
  obj.method().catch(error => {
    calls.push(error.message)
  })

  deepEqual(calls, ['two'])
  await reject(new Error('three'))
  deepEqual(calls, ['two', 'three'])
})
