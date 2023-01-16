import type { App } from 'vue';
import ProTable from './Table';
import EditableProTable from './components/EditableTable';

import './style.less';

export type { ProColumnType, ProColumnGroupType, ProColumnsType, ProTableProps, ResponseData } from './typings';

ProTable.EditableProTable = EditableProTable;

ProTable.install = (app: App) => {
  app.component(ProTable.name, ProTable);
  app.component(EditableProTable.name, EditableProTable);
  return app;
};

export { EditableProTable };

export default ProTable;
