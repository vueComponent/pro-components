import { defineComponent, ref, reactive, watch } from 'vue';
import Provider, { defaultPrefixCls, defaultContext, type Context } from './store/Provider';
import { useFetchData, useFullscreen } from './hooks';
import Table, { tableProps } from 'ant-design-vue/es/table';
import { SearchForm, Wrapper, TableAlert, ToolBar } from './components';
import { getSlot } from '@ant-design-vue/pro-utils';
import type { DefineComponent, PropType, Plugin, Slot } from 'vue';
import type { ProTableProps, ActionType, MaybeElement } from './typings';

import './Table.less';

const props = {
  ...tableProps(),
  columns: Array as PropType<ProTableProps['columns']>,
  request: Function as PropType<ProTableProps['request']>,
  params: Object as PropType<ProTableProps['params']>,
  cardBordered: [Boolean, Object] as PropType<ProTableProps['cardBordered']>,
  cardProps: [false, Object] as PropType<ProTableProps['cardProps']>,
  toolbar: [false, Object] as PropType<ProTableProps['toolbar']>,
  options: [false, Object] as PropType<ProTableProps['options']>,
};

const ProTable = defineComponent({
  name: 'ProTable',
  props,
  slots: ['actions', 'settings', 'editForm'],
  emits: ['change', 'load', 'requestError', 'update:size'],
  setup(props, { slots, emit, expose }) {
    const containerRef = ref<MaybeElement>();

    const { toggle } = useFullscreen(containerRef);

    // `request` will take over control of `loading`, `dataSource`, `pagination`.
    const {
      context: requestProps,
      reload,
      setPageInfo,
      setQueryFilter,
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

    return () => {
      const { onChange: discard, cardBordered, cardProps, toolbar, options, ...others } = props;

      const tableProps = {
        ...others,
        ...requestProps,
        size: context.size,
        bordered: typeof cardBordered === 'boolean' ? cardBordered : cardBordered?.table,
      };

      const actions = getSlot<Slot>(slots, props, 'actions');
      const settings = getSlot<Slot>(slots, props, 'actions');

      return (
        <div class={defaultPrefixCls} ref={containerRef}>
          <Provider value={context}>
            <SearchForm columns={props.columns} onFinish={onFinish} />
            <Wrapper cardProps={cardProps} toolbar={toolbar}>
              <ToolBar options={options} columns={props.columns} toolbar={toolbar} v-slots={{ actions, settings }} />
              {/* <TableAlert /> */}
              <Table {...tableProps} v-slots={slots} onChange={onChange} />
            </Wrapper>
          </Provider>
        </div>
      );
    };
  },
});

export default ProTable as DefineComponent<ProTableProps> & Plugin;
