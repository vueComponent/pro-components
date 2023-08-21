import { ProFormField } from '@ant-design-vue/pro-form'
import { isBaseType } from '@v-c/utils'
import type { BodyCellContext } from '../typing'

export const checkValueType = (ctx: BodyCellContext) => {
  const column = ctx.column
  const text = ctx.text
  const index = ctx.index
  const valueType = column.valueType
    ? column.valueType
    : column.valueEnum
    ? 'select'
    : 'text'
  if (valueType && isBaseType(text)) {
    const isIndex =
      column.valueType === 'index' || column.valueType === 'indexBorder'

    return (
      <ProFormField
        {...column}
        mode={'read'}
        valueType={valueType}
        value={!isIndex ? text : index}
      />
    )
  }
}
