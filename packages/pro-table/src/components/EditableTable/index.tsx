import {
    computed,
    defineComponent,
    ref,
    toRaw,
    toRef,
    unref,
    watch,
    watchEffect,
    type App,
    type PropType
} from 'vue';
import ProTable from '../..';
import { proTableProps } from '../../Table';
import type { ProTableProps } from '../..';
import type { Key } from 'ant-design-vue/es/table/interface';
import { ProFormText, ProForm, useFormInstance } from '@ant-design-vue/pro-form';
export type EditableProps = {
    editableKeys: Key[];
};
export type EditableProTableProps = {} & EditableProps & ProTableProps;
export const editableProps = {
    ...proTableProps,
    editableKeys: Array as PropType<EditableProTableProps['editableKeys']>
};
const EditableProTable = defineComponent({
    name: 'EditableProTable',
    props: editableProps,
    setup(props, { attrs, emit, slots }) {
        const { columns, request, ...others } = props;
        let keys = ref<Key[]>([]);
        let editable = toRef(props, 'editable');
        const onValuesChange = (value: any) => {
            emit('valuesChange', value);
        };
        watchEffect(() => {
            keys.value = toRaw(props.editableKeys) as Key[];
        });

        return () => {
            const tableProps = {
                ...others,
                columns,
                request,
                editable,
                onValuesChange: onValuesChange
            };
            return (
                <ProTable
                    {...tableProps}
                    v-slots={{
                        bodyCell: (record: any) => {
                            if (!record.column.disabled && keys?.value.includes(record.index)) {
                                return (
                                    <ProFormText
                                        fieldProps={{
                                            placeholder: '请输入'
                                        }}
                                        name={record.column.dataIndex + '_' + record.index}
                                    ></ProFormText>
                                );
                            } else {
                                return slots?.bodyCell?.(record);
                            }
                        }
                    }}
                ></ProTable>
            );
        };
    }
});

export default EditableProTable;
