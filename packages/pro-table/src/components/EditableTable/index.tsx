import { defineComponent, ref, toRaw, toRef, unref, watch, type App, type PropType } from 'vue';
import ProTable from '../..';
import { proTableProps } from '../../Table';
import type { ProTableProps } from '../..';
import type { Key } from 'ant-design-vue/es/table/interface';
import { ProFormText, ProForm, useFormInstance } from '@ant-design-vue/pro-form';
import { useEditData } from '../../hooks';
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
        const { editData, updateEditData } = useEditData(props, keys);
        const editModel = ref({});
        const slotsProps = {
            bodyCell: (record: any) => {
                console.log('record', record.column, 'editableKeys', keys);
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

        const handleFilterValue = (value: any) => {
            console.log('editData handleFilterValue', value);
            const keys = Object.keys(value);
            console.log(keys, 'onFieldsChange keys');
            for (let i = 0; i < keys.length; i++) {
                const column = keys[i].split('_')[0];
                const key = keys[i].split('_')[1];
                const val = value[keys[i]];
                console.log('editData', key, column, val);

                updateEditData(key, column, val);
            }
        };
        const onFieldsChange = (value: any) => {
            handleFilterValue(value);
            console.log('editData', editData);

            emit('change', value);
        };

        console.log('editableKeys', editableKeys);

        watch(
            () => editModel,
            (curr, prev) => {
                console.log('onFieldsChange', curr.value, prev.value);
                onFieldsChange(curr.value);
            },
            { deep: true }
        );
        return () => {
            return (
                <ProTable
                    {...{ columns, request, editable: true, model: editModel }}
                    v-slots={slotsProps}
                ></ProTable>
            );
        };
    }
});

export default EditableProTable;
