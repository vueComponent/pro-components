import { defineComponent, ref, reactive, unref, watch, toRaw } from 'vue';
import Table, { tableProps } from 'ant-design-vue/es/table';
import { Card } from 'ant-design-vue';
import { SearchForm, ToolBar, TableAlert } from './components';
import Provider, { defaultPrefixCls, defaultContext, type Context } from './shared/Context';
import { useEditData, useFetchData, useFullscreen } from './hooks';
import { getSlot } from '@ant-design-vue/pro-utils';
import type { App, DefineComponent, FunctionalComponent, Slot, Plugin, PropType } from 'vue';
import type { MaybeElement, ProTableProps, ActionType, SizeType } from './typings';

import 'ant-design-vue/es/table/style';
import 'ant-design-vue/es/card/style';
import './index.less';
import { EditableFormWrapper } from './components/EditableFormWrapper';

const TableWrapper: FunctionalComponent<{
    cardBordered?: ProTableProps['cardBordered'];
    cardProps?: ProTableProps['cardProps'];
    toolbar?: ProTableProps['toolbar'];
}> = ({ cardProps, toolbar }, { slots }) => {
    const props = cardProps !== false && {
        bodyStyle: toolbar === false ? { padding: 0 } : { paddingTop: 0 },
        ...cardProps
    };

    const Tag = cardProps !== false ? Card : 'div';

    return <Tag {...props}>{slots.default?.()}</Tag>;
};

export const proTableProps = {
    ...tableProps(),
    editable: {
        type: Boolean,
        default: false
    },
    columns: Array as PropType<ProTableProps['columns']>,
    request: Function as PropType<ProTableProps['request']>,
    params: Object as PropType<ProTableProps['params']>,
    cardBordered: {
        type: [Boolean, Object] as PropType<ProTableProps['cardBordered']>,
        default: true
    },
    cardProps: {
        type: [Boolean, Object] as PropType<ProTableProps['cardProps']>,
        default: undefined
    },
    toolbar: {
        type: [Boolean, Object] as PropType<ProTableProps['toolbar']>,
        default: undefined
    },
    options: {
        type: [Boolean, Object] as PropType<ProTableProps['options']>,
        default: undefined
    }
};

const ProTable = defineComponent({
    name: 'ProTable',
    props: proTableProps,
    slots: ['actions', 'settings', 'editForm'],
    emits: ['change', 'load', 'requestError', 'update:size', 'valuesChange'],
    setup(props, { slots, emit, expose }) {
        const containerRef = ref<MaybeElement>();

        const { toggle } = useFullscreen(containerRef);

        // `request` will take over control of `loading`, `dataSource`, `pagination`.
        const {
            context: requestProps,
            reload,
            setPageInfo,
            setQueryFilter,
            setDataSource
        } = useFetchData(props.request, props, {
            onLoad: dataSource => emit('load', dataSource),
            onRequestError: e => emit('requestError', e)
        });

        const onFinish = (model: Record<string, unknown>) => {
            console.log('model', model);

            setQueryFilter({ ...model });
        };

        const onChange: ProTableProps['onChange'] = (pagination, filters, sorter) => {
            setPageInfo({
                pageSize: pagination.pageSize,
                current: pagination.current
            });
            emit('change', pagination, filters, sorter);
        };

        /**
         * `size` support two-way binding(v-model:size).
         *
         * BUG: const size = ref<SizeType>(props.size ?? 'middle');
         */
        const size = ref<SizeType>('middle');

        const changeSize = (tableSize: SizeType) => {
            size.value = tableSize;
            emit('update:size', tableSize);
        };

        const actionRef: ActionType = {
            changeSize,
            fullScreen: toggle,
            reload
        };

        expose(actionRef);

        const context = reactive<Context>({ ...defaultContext, actionRef });
        let editDataModel = reactive<Record<string, unknown>>({ name_0: 123 });

        const handleFilterValue = (value: any) => {
            const keys = Object.keys(value);
            const currenDataSource = toRaw(requestProps.dataSource);

            for (let i = 0; i < keys.length; i++) {
                const column = keys[i].split('_')[0];
                const key = parseInt(keys[i].split('_')[1]) as number;
                const val = value[keys[i]];
                const currentRow = currenDataSource[key];
                currentRow[column] = val;
                currenDataSource[key] = currentRow;
                setDataSource(currenDataSource);
            }
            emit('valuesChange', currenDataSource);
        };
        watch(
            () => requestProps.dataSource,
            cur => {
                let tempEditData: Record<string, unknown> = {};
                cur.forEach((item, index) => {
                    const keys = Object.keys(item);
                    keys.forEach((item2, index2) => {
                        let column = item2 + '_' + index;
                        tempEditData[column] = item[item2];
                    });
                });
                editDataModel = tempEditData;
            }
        );

        const onValuesChange = (values: any) => {
            handleFilterValue(values);
        };
        return () => {
            const {
                editable,
                onChange: discard,
                cardBordered,
                cardProps,
                toolbar,
                options,
                ...others
            } = props;

            const tableProps = {
                ...others,
                ...requestProps,
                size: size.value
            };

            const actions = getSlot<Slot>(slots, props, 'actions');
            const settings = getSlot<Slot>(slots, props, 'actions');
            const renderTable = () => {
                return editable ? (
                    <EditableFormWrapper onValuesChange={onValuesChange} model={editDataModel}>
                        <Table {...tableProps} v-slots={slots} onChange={onChange} />
                    </EditableFormWrapper>
                ) : (
                    <Table {...tableProps} v-slots={slots} onChange={onChange} />
                );
            };
            return (
                <div class={defaultPrefixCls} ref={containerRef}>
                    <Provider value={context}>
                        <SearchForm columns={props.columns} onFinish={onFinish} />
                        <TableWrapper cardProps={cardProps} toolbar={toolbar}>
                            <ToolBar
                                options={options}
                                toolbar={toolbar}
                                v-slots={{ actions, settings }}
                            />
                            {/* <TableAlert /> */}
                            {renderTable()}
                        </TableWrapper>
                    </Provider>
                </div>
            );
        };
    }
});

export default ProTable;
