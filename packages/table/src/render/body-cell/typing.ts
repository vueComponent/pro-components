import type { ProColumnType } from '../../typing'

export interface BodyCellContext {
  index: number
  column: ProColumnType
  text: any
  record: Record<string, any>
  _text: any
}
