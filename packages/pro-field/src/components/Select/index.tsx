import { defineComponent, type App, DefineComponent, Plugin, PropType, ExtractPropTypes } from 'vue';
import { getSlot, type ProFieldRequestData } from '@ant-design-vue/pro-utils';
import SearchSelect from './SearchSelect';
import type { SearchSelectProps } from './SearchSelect/types';
import { proFieldFC } from '../typings';
import { useFetchData } from './hooks/useFetchData';

export const fieldSelectProps = {
  ...proFieldFC,
  fieldProps: {
    type: Object as PropType<SearchSelectProps>,
  },
  // 请求参数
  params: {
    type: Object as PropType<Record<string, any>>,
  },
  // 请求
  request: {
    type: Function as PropType<ProFieldRequestData>,
  },
};
export type FieldSelectProps = Partial<ExtractPropTypes<typeof fieldSelectProps>>;

const FieldSelect = defineComponent({
  props: fieldSelectProps,
  slots: ['render', 'renderFormItem'],
  setup(props, { slots }) {
    const { loading, options } = useFetchData(props);
    const children = () => {
      const { mode, text, fieldProps } = props;
      const render = getSlot(slots, props, 'render') as any;
      const renderFormItem = getSlot(slots, props, 'renderFormItem') as any;

      if (mode === 'read') {
        const dom = <>{text}</>;
        if (render) {
          return render(text, { mode, fieldProps }, dom) || null;
        }
        return dom;
      }
      if (mode === 'edit' || mode === 'update') {
        const restProps: SearchSelectProps = {
          ...fieldProps,
          loading: loading.value,
        };
        // 这里兼容options为空时，自定义SelectOption的情况
        if (typeof fieldProps?.default === 'function') {
          restProps.default = fieldProps?.default;
        } else {
          restProps.options = options.value;
        }
        const renderDom = () => {
          return (
            <SearchSelect
              style={{
                minWidth: 100,
              }}
              {...restProps}
            />
          );
        };
        const dom = renderDom();
        if (renderFormItem) {
          return renderFormItem(text, { mode, fieldProps }, dom) || null;
        }
        return dom;
      }
      return null;
    };

    return () => children();
  },
});

FieldSelect.install = (app: App) => {
  app.component(FieldSelect.name, FieldSelect);
  return app;
};

export default FieldSelect as DefineComponent<FieldSelectProps> & Plugin;
