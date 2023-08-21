import type { Slots } from 'vue'
import { renderBodyCell } from './body-cell'

export const useRenderSlots = (slots: Slots) => {
  const proToolbarCard = {
    headerTitle: slots.headerTitle,
    toolBarRender: slots.toolBarRender
  }
  const tableSlots = {
    bodyCell: renderBodyCell(slots)
  }
  return {
    proToolbarCard,
    tableSlots
  }
}
