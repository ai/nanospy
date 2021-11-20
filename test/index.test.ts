import { equal, is, throws } from 'uvu/assert'
import { test } from 'uvu'

import { spyOn, resetSpies } from '../index.js'

test('can spy on method', () => {
  let calls: string[] = []
  let obj = {
    method(arg: string) {
      calls.push(arg)
      return arg + '!'
    }
  }

  let spy = spyOn(obj, 'method')
  is(spy.called, false)
  equal(spy.callCount, 0)
  equal(spy.calls, [])
  equal(spy.results, [])

  equal(obj.method('a'), 'a!')
  equal(calls, ['a'])
  is(spy.called, true)
  equal(spy.callCount, 1)
  equal(spy.calls, [['a']])
  equal(spy.results, ['a!'])

  equal(obj.method('b'), 'b!')
  equal(calls, ['a', 'b'])
  equal(spy.callCount, 2)
  equal(spy.calls, [['a'], ['b']])
  equal(spy.results, ['a!', 'b!'])

  spy.nextResult('C!')
  equal(obj.method('c'), 'C!')
  equal(calls, ['a', 'b'])
  equal(spy.callCount, 3)
  equal(spy.calls, [['a'], ['b'], ['c']])
  equal(spy.results, ['a!', 'b!', 'C!'])

  let error = new Error('test')
  spy.nextError(error)
  throws(() => {
    obj.method('d')
  }, error)
  equal(calls, ['a', 'b'])
  equal(spy.callCount, 4)
  equal(spy.calls, [['a'], ['b'], ['c'], ['d']])
  equal(spy.results, ['a!', 'b!', 'C!', undefined])

  spy.reset()
  equal(obj.method('e'), 'e!')
  equal(calls, ['a', 'b', 'e'])
  equal(spy.callCount, 4)
  equal(spy.calls, [['a'], ['b'], ['c'], ['d']])
  equal(spy.results, ['a!', 'b!', 'C!', undefined])
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

  resetSpies()
  one.method('b')
  two.method('b')
  equal(spy1.callCount, 1)
  equal(spy2.callCount, 0)
})

test('mocks method', () => {
  let calls: string[] = []
  let obj = {
    method(arg: string) {
      calls.push(arg)
      return arg + '!'
    }
  }

  let spy = spyOn(obj, 'method', arg => {
    return arg.toUpperCase() + '!'
  })

  equal(obj.method('a'), 'A!')
  equal(calls, [])
  is(spy.called, true)
  equal(spy.callCount, 1)
  equal(spy.calls, [['a']])
  equal(spy.results, ['A!'])
})

test.run()
