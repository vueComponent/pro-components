import { defineComponent, ref, reactive, watch, toRaw } from 'vue';
import Provider, { defaultPrefixCls, defaultContext, type Context } from './shared/Context';
import { useFetchData, useFullscreen } from './hooks';
import { Card } from 'ant-design-vue';
import Table, { tableProps } from 'ant-design-vue/es/table';
import { SearchForm, ToolBar, TableAlert } from './components';
import { getSlot } from '@ant-design-vue/pro-utils';
import type { DefineComponent, FunctionalComponent, PropType, Plugin, Slot } from 'vue';
import type { ProTableProps, ActionType, MaybeElement } from './typings';

import './Table.less';
import { EditableFormWrapper } from './components/EditableFormWrapper';

const TableWrapper: FunctionalComponent<{
  cardBordered?: ProTableProps['cardBordered'];
  cardProps?: ProTableProps['cardProps'];
  toolbar?: ProTableProps['toolbar'];
}> = ({ cardProps, toolbar }, { slots }) => {
  const props = cardProps !== false && {
    bodyStyle: toolbar === false ? { padding: 0 } : { paddingTop: 0 },
    ...cardProps,
  };

  const Tag = cardProps !== false ? Card : 'div';

  return <Tag {...props}>{slots.default?.()}</Tag>;
};

export const proTableProps = {
  ...tableProps(),
  editable: {
    type: Boolean,
    default: false,
  },
  columns: Array as PropType<ProTableProps['columns']>,
  request: Function as PropType<ProTableProps['request']>,
  params: Object as PropType<ProTableProps['params']>,
  cardBordered: {
    type: [Boolean, Object] as PropType<ProTableProps['cardBordered']>,
    default: true,
  },
  cardProps: {
    type: [Boolean, Object] as PropType<ProTableProps['cardProps']>,
    default: undefined,
  },
  toolbar: {
    type: [Boolean, Object] as PropType<ProTableProps['toolbar']>,
    default: undefined,
  },
  options: {
    type: [Boolean, Object] as PropType<ProTableProps['options']>,
    default: undefined,
  },
};

const ProTable = defineComponent({
  name: 'ProTable',
  props: proTableProps,
  slots: ['actions', 'settings', 'editForm'],
  emits: ['change', 'load', 'requestError', 'valuesChange', 'update:size'],
  setup(props, { slots, emit, expose }) {
    const containerRef = ref<MaybeElement>();

    const { toggle } = useFullscreen(containerRef);

    // `request` will take over control of `loading`, `dataSource`, `pagination`.
    const {
      context: requestProps,
      reload,
      setPageInfo,
      setQueryFilter,
      setDataSource,
    } = useFetchData(props.request, props, {
      onLoad: dataSource => emit('load', dataSource),
      onRequestError: e => emit('requestError', e),
    });

    const onFinish = (model: Record<string, unknown>) => {
      setQueryFilter({ ...model });
    };

    const onChange: ProTableProps['onChange'] = (pagination, filters, sorter) => {
      setPageInfo({
        pageSize: pagination.pageSize,
        current: pagination.current,
      });
      emit('change', pagination, filters, sorter);
    };

    const actionRef: ActionType = {
      fullScreen: toggle,
      reload,
    };

    expose(actionRef);

    const context = reactive<Context>({
      ...defaultContext,
      actionRef,
      size: props.size ?? 'middle',
      setSize: size => {
        context.size = size;
        emit('update:size', context.size);
      },
    });

    watch(
      () => props.size,
      size => {
        context.size = size;
      },
    );

    const editDataModel = reactive<Record<string, Record<string, unknown>>>({ formData: { name_0: 123 } });

    const handleFilterValue = (value: any) => {
      const keys = Object.keys(toRaw(value));
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
        const tempEditData: Record<string, unknown> = {};
        cur.forEach((item, index) => {
          const keys = Object.keys(item);
          keys.forEach((item2, index2) => {
            const column = item2 + '_' + index;
            tempEditData[column] = item[item2];
          });
        });
        editDataModel.formData = tempEditData;
      },
    );

    watch(
      () => editDataModel.formData,
      curr => {
        handleFilterValue(curr);
      },
      {
        deep: true,
      },
    );

    return () => {
      const { editable, onChange: discard, cardBordered, cardProps, toolbar, options, ...others } = props;

      const tableProps = {
        ...others,
        ...requestProps,
        size: context.size,
      };

      const actions = getSlot<Slot>(slots, props, 'actions');
      const settings = getSlot<Slot>(slots, props, 'actions');

      const renderTable = () => {
        return editable ? (
          <EditableFormWrapper model={editDataModel.formData}>
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
              <ToolBar options={options} columns={props.columns} toolbar={toolbar} v-slots={{ actions, settings }} />
              {/* <TableAlert /> */}
              {renderTable()}
            </TableWrapper>
          </Provider>
        </div>
      );
    };
  },
});

export default ProTable as DefineComponent<ProTableProps> & Plugin;
