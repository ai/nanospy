export interface Spy<
  Fn extends (...args: any[]) => any = (...args: any[]) => any
> {
  called: boolean
  callCount: number
  calls: Parameters<Fn>[]
  results: ReturnType<Fn>[]
  nextError(error: Error): void
  nextResult(result: ReturnType<Fn>): void
  reset(): void
}

type Methods<Obj extends object> = {
  [Key in keyof Obj]-?: Obj[Key] extends (...args: any[]) => any ? Key : never
}[keyof Obj]

/**
 * Add spy to track how object’s method was called.
 *
 * ```js
 * import { spyOn } from 'nanospy'
 *
 * it('calls increase', () => {
 *   let increase = spyOn(counter, increase)
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
 * import { resetSpies } from 'nanospy'
 *
 * afterEach(() => {
 *   resetSpies()
 * })
 * ```
 */
export function resetSpies(): void
