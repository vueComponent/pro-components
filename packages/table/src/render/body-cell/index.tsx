import type { Slots } from 'vue'
import { checkVNodes } from '../../utils/dom'
import type { BodyCellContext } from './typing'
import { checkValueType } from './plugins'

export const renderBodyCell = (slots: Slots) => {
  return (_ctx: any) => {
    const ctx = { ..._ctx, _text: _ctx.text } as BodyCellContext
    // 检查是否为indexNumber
    ctx._text = checkVNodes(checkValueType(ctx), ctx.text)
    // 最后会走默认的插槽，他可以按照自己的风格来处理数据
    const bodyCell = slots.bodyCell?.(_ctx)
    ctx._text = checkVNodes(bodyCell, ctx._text)
    return ctx._text !== ctx.record ? ctx._text : ''
  }
}
