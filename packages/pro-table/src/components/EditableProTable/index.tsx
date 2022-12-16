import { defineComponent, ref, toRaw, toRef, unref, watch, type App, type PropType } from 'vue';
import ProTable from '../..';
import { proTableProps } from '../../Table';
import type { ProTableProps } from '../..';
import type { Key } from 'ant-design-vue/es/table/interface';
import { ProFormText, ProForm } from '@ant-design-vue/pro-form';
import { useEditData } from '@/hooks';
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
        const keys: string[] | number[] = toRaw(editableKeys || []);
        const { editData, updateEditData } = useEditData(props, keys);
        const slotsProps = {
            bodyCell: record => {
                console.log('record', record.column, 'editableKeys', keys);
                if (record.column.dataIndex !== 'action' && keys?.includes(record.index)) {
                    return (
                        <ProFormText
                            name={record.column.dataIndex + '_' + record.index}
                        ></ProFormText>
                    );
                } else {
                    return slots?.bodyCell(record);
                }
            }
        };
        const onFieldsChange = (value: any) => {
            console.log('onFieldsChange', value);

            emit('change', value);
        };

        console.log('editableKeys', editableKeys);

        watch(
            () => editData,
            (curr, prev) => {
                console.log('onFieldsChange', curr.value, prev.value);
                onFieldsChange(curr.value);
            },
            { deep: true }
        );
        return () => {
            return (
                <ProForm>
                    <ProTable {...{ columns, request }} v-slots={slotsProps}></ProTable>
                </ProForm>
            );
        };
    }
});

export default EditableProTable;
