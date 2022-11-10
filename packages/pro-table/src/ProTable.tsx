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
import { Table, FormItem, Input } from 'ant-design-vue';
import { tableProps, type ColumnsType } from 'ant-design-vue/es/table';
import { paginationProps } from 'ant-design-vue/es/pagination';
import { QueryFilter } from '@ant-design-vue/pro-form';
import type { PaginationProps } from 'ant-design-vue';
import './ProTable.less';
import type { type } from 'os';
import type { ChangeEvent } from 'ant-design-vue/lib/_util/EventInterface';
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

export interface ColumnsType<T> {
    search?: boolean;
}
export const proTableProps = {
    ...tableProps(),
    columns: {
        type: Array as PropType<ColumnsType<any>>
    },
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
        let formData: any = reactive({});
        let searchParams: any = reactive({});
        let statePagination: PaginationData = reactive({
            total: props?.pagination.total || 0,
            current: props?.pagination.current || 1,
            pageSize: props?.pagination.pageSize || 20
        });
        const columns = props?.columns || [];
        const searchColumns = columns?.filter(item => item?.search);
        const renderSearchForm = () => {
            let doms: any = [];
            searchColumns.map(item => {
                doms.push(
                    <FormItem name={item.dataIndex} label={item.title}>
                        <Input
                            onChange={e => {
                                triggerChange(item.dataIndex, e);
                            }}
                            value={formData[item.dataIndex]}
                            placeholder="请输入"
                            allow-clear
                        />
                    </FormItem>
                );
            });
            return doms;
        };
        const getDataSource = (
            current: number = 1,
            pageSize: number = 20,
            otherParams: Record<string, any> = {}
        ) => {
            const request = props?.request || undefined;
            if (request) {
                request({ current, pageSize, ...otherParams }).then((res: RequestData<any>) => {
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
            getDataSource(statePagination.current, statePagination.pageSize, searchParams);
        };
        const showSizeChange = (current: number, size: number) => {};

        // 查询
        const handleSearch = (values: any) => {
            statePagination.current = 1;
            searchParams = values;
            getDataSource(1, statePagination.pageSize, values);
        };
        //重置
        const handleReset = (values: any) => {
            statePagination.current = 1;
            getDataSource(1, statePagination.pageSize, {});
        };
        const triggerChange = (key: string, e: ChangeEvent) => {
            handleFormData(key, e.target.value);
        };
        //收集表单
        const handleFormData = (key: string, value: any) => {
            formData[key] = value;
        };
        const formRef = ref();
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
            return (
                <>
                    <QueryFilter
                        collapsed={false}
                        model={formData}
                        layout="inline"
                        ref={formRef}
                        onReset={handleReset}
                        onSubmit={handleSearch}
                    >
                        {...renderSearchForm()}
                    </QueryFilter>
                    <Table {...props} {...tableProps} />
                </>
            );
        };
    }
});

ProTable.install = (app: App) => {
    app.component(ProTable.name, ProTable);
    return app;
};

export default ProTable as DefineComponent<ProTableProps> & Plugin;
