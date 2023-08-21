import { defineComponent } from 'vue'
import { Card } from 'ant-design-vue'
import { useProTableContext } from '../../context'
import { isBordered } from '../../utils'

export const ProTableCard = defineComponent({
  name: 'ProTableCard',
  inheritAttrs: false,
  setup(_props, { slots }) {
    const tableCtx = useProTableContext()
    return () => {
      const { cardBordered } = tableCtx?.proTableProps
      if (tableCtx.proTableProps?.toolBarRender === false) {
        return slots?.default?.()
      }
      return (
        <Card bordered={isBordered('table', cardBordered)}>
          {slots?.default?.()}
        </Card>
      )
    }
  }
})
