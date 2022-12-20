import type { ColumnsType } from 'ant-design-vue/es/table';
import { isReactive, reactive, shallowRef } from 'vue';

export const useEditData = (props: Record<string, unknown>, editKeys: number[] | string[]) => {
    const columns = props.columns as Array<ColumnsType & { dataIndex: string }>;
    let editData = reactive([]);
    const singRowData: { [x: string]: unknown }[] = [];
    columns.map(item => {
        if (!item?.disabled) {
            singRowData.push({ [item.dataIndex]: '' });
        }
    });
    editKeys.map(item => {
        editData.push(singRowData);
    });
    const updateEditData = (
        key: number | string,
        column: string | number,
        value: string | number
    ) => {
        let currentRow = editData[key];

        currentRow.map((item2: any, index2: number) => {
            let keys = Object.keys(item2);
            if (keys[0] == column) {
                console.log('currentRow', currentRow, 'key', key, 'index2', index2);

                currentRow[index2] = { [column]: value };
            }
        });
    };
    return { editData, updateEditData };
};
