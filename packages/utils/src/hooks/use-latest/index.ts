import type { ComputedRef } from 'vue'
import { computed } from 'vue'

export const useLatest = <T>(props: T): ComputedRef<T> => {
  return computed(() => props)
}
