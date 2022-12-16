import type { ColumnsType } from 'ant-design-vue/es/table';
import { isReactive, reactive, shallowRef } from 'vue';

export const useEditData = (props: Record<string, unknown>, editKeys: number[] | string[]) => {
    const columns = props.columns as Array<ColumnsType & { dataIndex: string }>;
    let editData = reactive([]);
    const singRowData: { [x: string]: unknown }[] = [];
    columns.map(item => {
        singRowData.push({ [item.dataIndex]: item.dataIndex });
    });
    editKeys.map(item => {
        editData.push(singRowData);
    });
    const updateEditData = (key: number | string, rowData: { [x: string]: unknown }) => {
        editData[key] = rowData;
        editData = [...editData];
    };
    return { editData, updateEditData };
};
