import { computed, defineComponent } from 'vue';
import { Select } from 'ant-design-vue';
import type { RequestOptionsType } from '@ant-design-vue/pro-utils';
import { searchSelectProps } from './types';
const { Option, OptGroup } = Select;

const SearchSelect = defineComponent({
  props: searchSelectProps,
  setup(props) {
    const labelPropsName = computed(() => props.fieldNames?.label || 'label');
    const valuePropsName = computed(() => props.fieldNames?.value || 'value');
    const optionsPropsName = computed(() => props.fieldNames?.options || 'options');

    const renderOptions = (mapOptions: RequestOptionsType[]) => {
      return mapOptions.map((item) => {
        const { disabled: itemDisable, optionType } = item as RequestOptionsType;

        const label = item[labelPropsName.value];
        const value = item[valuePropsName.value];
        const itemOptions = item[optionsPropsName.value] ?? [];

        if (optionType === 'optGroup' || item.options) {
          return (
            <OptGroup key={value} label={label}>
              {renderOptions(itemOptions)}
            </OptGroup>
          );
        }

        return (
          <Option
            {...item}
            value={value}
            key={value || label?.toString()}
            disabled={itemDisable}
            data-item={item}
            label={label}
          >
            {props.optionItemRender?.(item as any) || label}
          </Option>
        );
      });
    };
    return () => {
      return (
        <Select allowClear autoClearSearchValue={props.autoClearSearchValue}>
          {renderOptions(props.options || [])}
        </Select>
      );
    };
  },
});

export default SearchSelect;
