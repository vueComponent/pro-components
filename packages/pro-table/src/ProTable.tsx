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
    onMounted,
    watch,
    ref
} from 'vue';

import 'ant-design-vue/es/table/style';
import { Table } from 'ant-design-vue';
import { tableProps } from 'ant-design-vue/es/table';
import { paginationProps } from 'ant-design-vue/es/pagination';
import type { PaginationProps } from 'ant-design-vue';
import './ProTable.less';
export type RequestData<T> = {
    data: T[] | undefined;
    success?: boolean;
    total?: number;
} & Record<string, any>;
export type PaginationData = {
    total?: number;
    current?: number;
    pageSize?: number;
};
export const proTablePaginationProps = {
    ...paginationProps()
};
export const proTableProps = {
    ...tableProps(),
    request: {
        type: Function
    },
    pagination: {
        type: Object as PropType<PaginationProps>,
        default: {
            ...proTablePaginationProps
        }
    }
};

export type ProTableProps = Partial<ExtractPropTypes<typeof proTableProps>>;

const ProTable = defineComponent({
    name: 'ProTable',
    inheritAttrs: false,
    props: proTableProps,

    setup(props, { emit, attrs, slots, expose }) {
        let stateDataSource: any = ref(props?.dataSource || []);
        let statePagination: PaginationData = reactive({
            total: props?.pagination.total || 0,
            current: props?.pagination.current || 1,
            pageSize: props?.pagination.pageSize || 20
        });

        const getDataSource = (current: number = 1, pageSize: number = 20) => {
            const request = props?.request || undefined;
            if (request) {
                request({ current, pageSize }).then((res: RequestData<any>) => {
                    if (res.success || res.data) {
                        stateDataSource.value = res.data || [];
                        statePagination.total =
                            res.total || props?.pagination.total || props?.dataSource?.length || 0;
                    } else {
                        stateDataSource.value = [];
                    }
                });
            } else {
                stateDataSource.value = props?.dataSource || [];
                statePagination.total = props?.pagination.total || props?.dataSource?.length || 0;
            }
        };
        onMounted(() => {
            getDataSource(statePagination?.current, statePagination?.pageSize);
        });
        const handleChange = (page: number, pageSize: number) => {
            let current = page;
            if (pageSize !== statePagination.pageSize) {
                current = 1;
            }
            statePagination.pageSize = pageSize;
            statePagination.current = current;
            getDataSource(statePagination.current, statePagination.pageSize);
        };
        const showSizeChange = (current: number, size: number) => {};
        expose({ handleChange });
        return () => {
            const tableProps: any = {
                dataSource: stateDataSource.value,
                pagination: {
                    total: statePagination.total,
                    pageSize: statePagination.pageSize,
                    current: statePagination.current,
                    onChange: handleChange,
                    onShowSizeChange: showSizeChange
                }
            };
            return <Table {...props} {...tableProps} />;
        };
    }
});

ProTable.install = (app: App) => {
    app.component(ProTable.name, ProTable);
    return app;
};

export default ProTable as DefineComponent<ProTableProps> & Plugin;
