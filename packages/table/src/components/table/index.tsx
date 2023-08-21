import { defineComponent, h, isVNode } from 'vue'
import { Table } from 'ant-design-vue'
import { isValidElement, vNodeType, warningOnce } from '@v-c/utils'
import { useProTableContext } from '../../context'
import { useRenderSlots } from '../../render/render-slots'
export const BasicTable = defineComponent({
  name: 'BasicTable',
  inheritAttrs: false,
  props: {
    customTable: vNodeType()
  },
  setup(props, { slots, attrs }) {
    const { proTableProps } = useProTableContext()
    return () => {
      const renderSlots = useRenderSlots(slots)
      const tableSlots = {
        ...slots,
        ...renderSlots.tableSlots
      }
      const { customTable } = props
      if (customTable && isVNode(customTable) && isValidElement(customTable)) {
        return h(
          customTable,
          {
            ...attrs
          },
          tableSlots
        )
      } else {
        warningOnce(!customTable, 'customTable is not a valid VNode')
      }
      return (
        <Table {...attrs} {...(proTableProps as any)} v-slots={tableSlots} />
      )
    }
  }
})

export default BasicTable
