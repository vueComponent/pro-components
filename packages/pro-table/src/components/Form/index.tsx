import { defineComponent, reactive, computed, toRaw } from 'vue';
import { useSharedContext } from '../../store/Provider';
import { QueryFilter, queryFilterProps, ProFormText } from '@ant-design-vue/pro-form';
import type { PropType } from 'vue';
import type { ProColumnsType, ProColumnType } from '../../typings';

import './index.less';

type RecordType = Record<string, unknown>;

const filterSeatchColumns = <T extends RecordType>(columns: ProColumnsType<T> = []) =>
  columns.filter(column => column.search).map(column => column as ProColumnType<T>);

const searchFormProps = {
  ...queryFilterProps,
  columns: Array as PropType<ProColumnsType<RecordType>>,
};

const SearchForm = defineComponent({
  props: searchFormProps,
  emits: ['finish'],
  setup(props, { emit }) {
    const { getPrefixCls } = useSharedContext();

    const className = ['ant-card', { ['ant-card-bordered']: true }, getPrefixCls('search')];

    const formClassName = getPrefixCls('form');

    const model = reactive({});

    const searchColumns = computed(() => filterSeatchColumns(props.columns));

    return () => {
      if (searchColumns.value.length === 0) return null;

      const formFields = searchColumns.value.map(column => (
        <ProFormText
          name={column.dataIndex as string}
          label={column.title as string}
          fieldProps={{
            allowClear: true,
          }}
        />
      ));

      const onFinish = (model: Record<string, unknown>) => {
        emit('finish', toRaw(model));
      };

      return (
        <div class={className}>
          <QueryFilter class={formClassName} model={model} onFinish={onFinish}>
            {...formFields}
          </QueryFilter>
        </div>
      );
    };
  },
});

export default SearchForm;
