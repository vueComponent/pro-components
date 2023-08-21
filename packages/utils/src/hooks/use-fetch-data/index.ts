import type { VueKey } from '@v-c/utils'
import type { Ref } from 'vue'
import { computed, onUnmounted, ref, watchPostEffect } from 'vue'
import { useAsyncState } from '@vueuse/core'

let testId = 0

export type ProRequestData<T, U = Record<string, any>> = (
  params: U,
  props: any
) => Promise<T>

export function useFetchData<
  T,
  U extends Record<string, any> = Record<string, any>
>(props: {
  proFieldKey?: VueKey
  params?: U
  request?: ProRequestData<T, U>
}): [Ref<T> | undefined] {
  const abortRef = ref<AbortController | null>(null)
  /** Key 是用来缓存请求的，如果不在是有问题 */
  const cacheKey = computed(() => {
    if (props.proFieldKey) {
      return props.proFieldKey?.toString()
    }
    testId += 1
    return testId.toString()
  })

  const proFieldKeyRef = ref(cacheKey.value)

  const fetchData = async () => {
    abortRef.value?.abort()
    const abort = new AbortController()
    abortRef.value = abort
    const loadData = await Promise.race([
      props?.request?.(props.params as U, props),
      new Promise((_resolve, reject) => {
        abortRef.value?.signal?.addEventListener('abort', () => {
          reject(new Error('aborted'))
        })
      })
    ])
    return loadData as T
  }

  onUnmounted(() => {
    testId += 1
  })
  const { state: data, execute } = useAsyncState(fetchData, {} as T, {
    immediate: false
  })
  // onMounted(() => {
  //   execute()
  // })
  watchPostEffect(() => {
    if (proFieldKeyRef.value || props.params) {
      execute()
    }
  })
  return [data]
}
