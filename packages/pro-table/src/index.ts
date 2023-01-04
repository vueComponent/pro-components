import './style.less';

export type {
    ProColumnType,
    ProColumnGroupType,
    ProColumnsType,
    ProTableProps,
    ResponseData
} from './typings';
import EditableProTable from './components/EditableTable';
import ProTable from './Table';
import type { App } from 'vue';
ProTable.EditableProTable = EditableProTable;
ProTable.install = (app: App) => {
    app.component(ProTable.name, ProTable);
    app.component(EditableProTable.name, EditableProTable);

    return app;
};
export { EditableProTable };

export default ProTable;
