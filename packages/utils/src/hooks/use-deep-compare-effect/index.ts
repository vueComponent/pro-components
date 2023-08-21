import { shallowRef, unref, watch } from 'vue'
import { isDeepEqualReact } from '../../is-deep-equal-react'
import { useDebounceFn } from '../use-debounce-fn'

export const isDeepEqual = (a: any, b: any, ignoreKeys?: string[]) =>
  isDeepEqualReact(a, b, ignoreKeys)

function useDeepCompareMemoize(value: any, ignoreKeys?: string[]) {
  const ref = shallowRef()
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier
  if (!isDeepEqual(unref(value), ref.value, ignoreKeys)) {
    ref.value = value
  }

  return ref
}

export function useDeepCompareEffect(
  effect: () => void,
  dependencies: any[],
  ignoreKeys?: string[]
) {
  const deps = useDeepCompareMemoize(dependencies || [], ignoreKeys)
  watch(deps, () => {
    effect()
  })
}

export function useDeepCompareEffectDebounce(
  effect: () => void,
  dependencies: any[],
  ignoreKeys?: string[],
  waitTime?: number
) {
  const effectDn = useDebounceFn(async () => {
    effect()
  }, waitTime || 16)
  const deps = useDeepCompareMemoize(dependencies || [], ignoreKeys)
  watch(deps, () => {
    effectDn.run()
  })
}
