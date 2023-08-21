import { onUnmounted, ref } from 'vue'
import { useRefFunction } from '../use-ref-function'
/**
 * 一个去抖的 hook，传入一个 function，返回一个去抖后的 function
 */
export function useDebounceFn<T extends any[], U = any>(
  fn: (...args: T) => Promise<any>,
  wait?: number
) {
  const callback = useRefFunction(fn)

  const timer = ref<any>()

  const cancel = () => {
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
  }

  const run = async (...args: any): Promise<U | undefined> => {
    if (wait === 0 || wait === undefined) {
      return callback(...args)
    }
    cancel()
    return new Promise<U>((resolve) => {
      timer.value.current = setTimeout(async () => {
        resolve(await callback(...args))
      }, wait)
    })
  }

  onUnmounted(cancel)

  return {
    run,
    cancel
  }
}
