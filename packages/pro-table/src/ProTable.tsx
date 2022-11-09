import {
    computed,
    reactive,
    unref,
    defineComponent,
    toRefs,
    provide,
    type App,
    type Plugin,
    type CSSProperties,
    type PropType,
    type ExtractPropTypes,
    type DefineComponent,
    watchEffect
} from 'vue';

import 'ant-design-vue/es/table/style';
import { Table } from 'ant-design-vue';
import type { ColumnType } from 'ant-design-vue/lib/table';
import useConfigInject from 'ant-design-vue/es/_util/hooks/useConfigInject';
import useMediaQuery from './hooks/useMediaQuery';

import { defaultSettingProps } from './defaultSettings';
import { routeContextInjectKey, defaultRouteContext, type RouteContextProps } from './RouteContext';

import './ProTable.less';

export const proTableProps = {
    loading: Boolean,
    bordered: Boolean,
    dataSource: Array,
    columns: Array,
    current: Number,
    pageSize: Number,
    total: Number
};

export type ProTableProps = Partial<ExtractPropTypes<typeof proTableProps>>;

const ProTable = defineComponent({
    name: 'ProTable',
    inheritAttrs: false,
    props: proTableProps,

    setup(props, { emit, attrs, slots }) {
        return () => {
            return (
                <div>
                    <Table dataSource={props?.dataSource} columns={props?.columns} />
                </div>
            );
        };
    }
});

ProTable.install = (app: App) => {
    app.component(ProTable.name, ProTable);
    return app;
};

export default ProTable as DefineComponent<ProTableProps> & Plugin;
