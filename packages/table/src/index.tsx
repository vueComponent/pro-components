import type { App } from 'vue'
import { ProTable } from './table'
export type * from './typing'
ProTable.install = (app: App) => {
  app.component('ProTable', ProTable)
}
export default ProTable
