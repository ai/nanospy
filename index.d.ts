export interface Spy<Fn extends (...args: any[]) => any = (...args: any[]) => any> {
  callCount: number
  called: boolean
  calls: Parameters<Fn>[]
  length: number
  nextError(error: Error): void
  nextResult(result: ReturnType<Fn>): void
  onCall(body: Fn): any
  restore(): void
  results: ReturnType<Fn>[]
}

export interface SpyFn<
  Fn extends (...args: any[]) => any = (...args: any[]) => any
> extends Spy {
  (...args: Parameters<Fn>): ReturnType<Fn>
}

type Methods<Obj extends object> = {
  [Key in keyof Obj]-?: Obj[Key] extends (...args: any[]) => any ? Key : never
}[keyof Obj]

/**
 * Create spy to track callbacks.
 *
 * ```
 * import { spy } from 'nanospy'
 *
 * let fn = spy()
 * fn('a', 10)
 * spy.callCount //=> 1
 * spy.calls //=> [['a', 10]]
 * ```
 *
 * @param cb Optional spy’s callback.
 * @returns Spy functions with tracker’s properties.
 */
export function spy<
  Fn extends (...args: any[]) => any = (...args: any[]) => any
>(cb?: Fn): SpyFn<Fn>

/**
 * Add spy to track how object’s method was called.
 *
 * ```js
 * import { spyOn } from 'nanospy'
 *
 * it('calls increase', () => {
 *   let increase = spyOn(counter, 'increase')
 *   counter.increase(5)
 *   expect(increase.called).toBe(true)
 *   expect(increase.callCount).toBe(1)
 *   expect(increase.calls).toEqual([5])
 * })
 * ```
 *
 * By default, it do not replace method. You can change it’s behavior
 * by setting `mock` argument.
 *
 * @param obj Object with methods.
 * @param methodName String with method name.
 * @param mock Optional mock for method.
 * @returns Spy object.
 */
export function spyOn<Obj extends object, Method extends Methods<Obj>>(
  obj: Obj,
  methodName: Method,
  mock?: Obj[Method]
  // @ts-ignore
): Spy<Obj[Method]>

/**
 * Remove all spies from objects.
 *
 * ```js
 * import { restoreAll } from 'nanospy'
 *
 * afterEach(() => {
 *   restoreAll()
 * })
 * ```
 */
export function restoreAll(): void
