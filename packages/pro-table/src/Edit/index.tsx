import { defineComponent, ref, reactive, watch, watchEffect } from 'vue';
import { Wrapper } from '../components';
import Table, { tableProps } from 'ant-design-vue/es/table';
import { Form, Input } from 'ant-design-vue';
// import { ProForm, ProFormText } from '@ant-design-vue/pro-form';
import type { DefineComponent, PropType, Plugin } from 'vue';
import type { ValidateInfo } from 'ant-design-vue/es/form/useForm';
import type { ProTableProps, DefaultRecordType, ProColumnType } from '../typings';

const { Item, useForm } = Form;

type Option<RecordType extends DefaultRecordType = DefaultRecordType> = {
  value: any;
  text: any;
  record: RecordType;
  index: number;
  renderIndex: number;
  column: ProColumnType<RecordType>;
};

export type EditableProTableProps<RecordType extends DefaultRecordType = DefaultRecordType> = Omit<
  ProTableProps<RecordType>,
  'columns' | 'request' | 'params'
> & {
  columns: ProColumnType<RecordType>[];
};

const props = {
  ...tableProps(),
  columns: Array as PropType<EditableProTableProps['columns']>,
  cardBordered: [Boolean, Object] as PropType<EditableProTableProps['cardBordered']>,
  cardProps: [false, Object] as PropType<EditableProTableProps['cardProps']>,
  value: Array as PropType<EditableProTableProps['dataSource']>
};

const EditableProTable = defineComponent({
  props,
  emits: ['update:value'],
  setup(props, { slots, emit }) {
    const modelRef = reactive<Record<string, unknown>[]>(props.dataSource || []);
    const rulesRef = ref<Record<string, ValidateInfo>>({});

    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

    watch(
      modelRef,
      (value) => {
        emit('update:value', value);
        console.log('modelRef', value);
      },
      { deep: true, immediate: true }
    );

    return () => {
      const { cardBordered, cardProps, columns: propsColumns = [], ...others } = props;

      const columns = propsColumns.map((column) => ({
        ...column,
        customRender: (option: Option) => {
          const { record, index } = option;
          return (
            <Item>
              {column.customRender?.(option) || (
                <Input v-model:value={modelRef[index][column.dataIndex as string]} allowClear />
              )}
            </Item>
          );
        }
      }));

      const tableProps = {
        ...others,
        columns,
        bordered: typeof cardBordered === 'boolean' ? cardBordered : cardBordered?.table
      };

      return (
        <Wrapper cardProps={cardProps} toolbar={false}>
          <Form model={modelRef}>
            <Table {...tableProps} v-slots={slots} />
          </Form>
        </Wrapper>
      );
    };
  }
});

export default EditableProTable as DefineComponent<EditableProTableProps> & Plugin;
