import { createInjectionState, createSharedComposable } from '@v-c/utils'
import type { Ref } from 'vue'
import { ref } from 'vue'
import type { ProTableProps } from './typing'

const proTableCtx = (props: ProTableProps, hashId: Ref<string>) => {
  const rootDomRef = ref<HTMLElement | null>(null)
  return {
    proTableProps: props,
    rootDomRef,
    hashId
  }
}

type ProTableCtx = ReturnType<typeof proTableCtx>
export const useTableContext = createSharedComposable(proTableCtx)

const [useProTableProvide, useProTableInject] = createInjectionState(
  (state: ProTableCtx) => {
    return state
  }
)

export { useProTableProvide }
export const useProTableContext = () => {
  return useProTableInject()!
}
