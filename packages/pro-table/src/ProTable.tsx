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
    watchEffect,
    onMounted
} from 'vue';

import 'ant-design-vue/es/table/style';
import { Table } from 'ant-design-vue';
import { tableProps } from 'ant-design-vue/es/table';

import './ProTable.less';
export type RequestData<T> = {
    data: T[] | undefined;
    success?: boolean;
    total?: number;
} & Record<string, any>;
export const proTableProps = {
    ...tableProps(),
    request: {
        type: Promise<Partial<RequestData<any>>>
    }
};

export type ProTableProps = Partial<ExtractPropTypes<typeof proTableProps>>;

const ProTable = defineComponent({
    name: 'ProTable',
    inheritAttrs: false,
    props: proTableProps,

    setup(props, { emit, attrs, slots }) {
        console.log('props', props);
        let dataSource = reactive([]);
        onMounted(() => {
            const request = props?.request || undefined;
            if (request) {
                request.then(res => {
                    console.log('request', res);
                    if (res.success) {
                        dataSource = res.data;
                    }
                });
            }
        });
        return () => {
            console.log('dataSource', dataSource);

            return (
                <div>
                    <Table dataSource={dataSource} {...props} />
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
