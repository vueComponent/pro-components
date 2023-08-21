import { useState } from '@v-c/utils'
import type { ComputedRef, Ref } from 'vue'
import { computed, onMounted, onUnmounted, shallowRef, unref, watch } from 'vue'

const useLayoutUpdateEffect = (callback: Function, deps: any) => {
  const firstMountRef = shallowRef(true)
  watch(
    deps,
    () => {
      if (!firstMountRef.value) {
        return callback()
      }
    },
    {
      immediate: true,
      flush: 'post'
    }
  )
  onMounted(() => {
    firstMountRef.value = false
  })
  onUnmounted(() => {
    firstMountRef.value = true
  })
}

type Updater<T> = (
  updater: T | ((origin: T) => T),
  ignoreDestroy?: boolean
) => void

/** We only think `undefined` is empty */
function hasValue(value: any) {
  return value !== undefined
}

/**
 * Similar to `useState` but will use props value if provided.
 * Note that internal use rc-util `useState` hook.
 */
export default function useMergedState<T, R = T>(
  defaultStateValue: T | (() => T),
  option?: {
    defaultValue?: T | (() => T)
    value?: T | Ref<T>
    onChange?: (value: T, prevValue: T) => void
    postState?: (value: T) => T
  }
): [ComputedRef<R>, Updater<T>] {
  const { defaultValue, value: _value, onChange, postState } = option || {}

  // ======================= Init =======================
  const [innerValue, setInnerValue] = useState<T>(() => {
    const value = unref(_value)
    if (hasValue(value)) {
      return value
    } else if (hasValue(defaultValue)) {
      return typeof defaultValue === 'function'
        ? (defaultValue as any)()
        : defaultValue
    } else {
      return typeof defaultStateValue === 'function'
        ? (defaultStateValue as any)()
        : defaultStateValue
    }
  })

  const mergedValue = computed(() => {
    const value = unref(_value)
    return value !== undefined ? value : innerValue.value
  })
  const postMergedValue = computed(() =>
    postState ? postState(mergedValue.value) : mergedValue.value
  )

  // ====================== Change ======================
  const onChangeFn = onChange

  const [prevValue, setPrevValue] = useState<[T]>([mergedValue.value])

  useLayoutUpdateEffect(() => {
    const prev = prevValue.value[0]
    if (innerValue !== prev) {
      onChangeFn?.(innerValue.value, prev)
    }
  }, [prevValue])

  // Sync value back to `undefined` when it from control to un-control
  useLayoutUpdateEffect(() => {
    const value = unref(_value)
    if (!hasValue(value)) {
      setInnerValue(value!)
    }
  }, [_value])

  // ====================== Update ======================
  const triggerChange: Updater<T> = (updater, ignoreDestroy) => {
    setInnerValue(updater, ignoreDestroy)
    setPrevValue([mergedValue.value], ignoreDestroy)
  }

  return [postMergedValue as unknown as ComputedRef<R>, triggerChange]
}

export const useMountMergeState = useMergedState
