import type { SlotsType } from 'vue'
import { defineComponent, shallowRef } from 'vue'
import { booleanType, classNames, runEvent, vNodeType } from '@v-c/utils'
import { ConfigProvider } from 'ant-design-vue'
import type { ProTableSlots } from './typing'
import { proTableProps } from './typing'
import {
  useProTableContext,
  useProTableProvide,
  useTableContext
} from './context'
import { BasicTable, ProTableCard, Toolbar } from './components'
import { useStyle } from './style'
import FormRender from './components/form'

const TableRender = defineComponent({
  name: 'TableRender',
  inheritAttrs: false,
  props: {
    ...proTableProps,
    isLightFilter: booleanType(),
    searchNode: vNodeType()
  },
  setup(props, { slots, attrs }) {
    const { rootDomRef } = useProTableContext()
    return () => {
      const { toolBarRender = slots.toolBarRender } = props
      const { options, isLightFilter, searchNode } = props
      /** 内置的工具栏 */
      const toolbarDom =
        toolBarRender === false ? null : (
          <Toolbar toolBarRender={toolBarRender} />
        )

      const proTableDom = (
        <div {...attrs} ref={rootDomRef}>
          {isLightFilter ? null : searchNode}
          <ProTableCard>
            {toolbarDom}
            <BasicTable v-slots={slots} />
          </ProTableCard>
        </div>
      )

      // 如果不需要的全屏，ConfigProvider 没有意义
      if (!options || !options?.fullScreen) {
        return proTableDom
      }

      return (
        <ConfigProvider
          getPopupContainer={() => {
            return (rootDomRef.value || document.body) as any as HTMLElement
          }}
        >
          {proTableDom}
        </ConfigProvider>
      )
    }
  }
})

const ProTable = defineComponent({
  name: 'ProTable',
  inheritAttrs: false,
  props: {
    ...proTableProps
  },
  slots: Object as SlotsType<ProTableSlots>,
  setup(props, { slots, attrs }) {
    const { wrapSSR, hashId } = useStyle(props.defaultClassName)
    const useProTableCtxState = useTableContext(props, hashId)
    useProTableProvide(useProTableCtxState)
    const actionRef = shallowRef()
    return () => {
      const { search, type = 'table', columns: propsColumns = [] } = props

      /** 是不是 LightFilter, LightFilter 有一些特殊的处理 */
      const isLightFilter: boolean =
        search !== false && search?.filterType === 'light'

      const searchNode = () => {
        return search === false && type !== 'form' ? null : (
          <FormRender
            columns={propsColumns}
            action={actionRef}
            onReset={() => runEvent(props.onReset)}
            onSubmit={props.onSubmit}
            cardBordered={props.cardBordered}
          />
        )
      }
      return wrapSSR(
        <TableRender
          class={classNames(props.defaultClassName, attrs.class, hashId.value)}
          {...props}
          v-slots={slots}
          isLightFilter={isLightFilter}
          searchNode={searchNode()}
        />
      )
    }
  }
})

export { ProTable }
