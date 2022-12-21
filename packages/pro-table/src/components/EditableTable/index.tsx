import {
    computed,
    defineComponent,
    ref,
    toRaw,
    toRef,
    unref,
    watch,
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
    onChange: (editableKeys: Key[], editableRows: any) => void;
};
export type EditableProTableProps = {} & EditableProps & ProTableProps;
export const editableProps = {
    ...proTableProps,
    editableKeys: Array as PropType<EditableProTableProps['editableKeys']>,
    onChange: Function as PropType<EditableProTableProps['onChange']>
};
const EditableProTable = defineComponent({
    name: 'EditableProTable',
    props: editableProps,
    setup(props, { attrs, emit, slots }) {
        const { columns, request, editableKeys } = props;
        const keys: string[] | number[] = toRaw(editableKeys || []) as string[] | number[];

        const slotsProps = {
            bodyCell: (record: any) => {
                if (!record.column.disabled && keys?.includes(record.index)) {
                    return (
                        <ProFormText
                            name={record.column.dataIndex + '_' + record.index}
                        ></ProFormText>
                    );
                } else {
                    return slots?.bodyCell?.(record);
                }
            }
        };

        const onValuesChange = (value: any) => {
            emit('valuesChange', value);
        };

        return () => {
            return (
                <ProTable
                    {...{
                        columns,
                        request,
                        editable: true,
                        onValuesChange: onValuesChange
                    }}
                    v-slots={slotsProps}
                ></ProTable>
            );
        };
    }
});

export default EditableProTable;
