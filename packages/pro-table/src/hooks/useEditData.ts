import type { ColumnsType } from 'ant-design-vue/es/table';
import { isReactive, reactive, shallowRef } from 'vue';

export const useEditData = (dataSource: Record<string, unknown>[]) => {
    let editData = reactive(dataSource);

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
