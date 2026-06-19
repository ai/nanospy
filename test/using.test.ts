import { deepEqual, equal } from 'node:assert/strict'
import { test } from 'node:test'

import { spyOn } from '../index.js'

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
