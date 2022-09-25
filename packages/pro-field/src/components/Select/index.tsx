import { defineComponent, type App, DefineComponent, Plugin, PropType, ExtractPropTypes } from 'vue';
import { getSlot, type ProFieldRequestData } from '@ant-design-vue/pro-utils';
import { Spin } from 'ant-design-vue';
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
    const { defaultKeyWords, loading, options } = useFetchData(props);
    return () => {
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
        const renderDom = (
          <SearchSelect
            style={{
              minWidth: 100,
            }}
            {...fieldProps}
            loading={loading.value}
            options={options.value}
            fetchData={(value) => (defaultKeyWords.value = value)}
            resetData={() => (defaultKeyWords.value = '')}
            default={fieldProps?.default}
          />
        );
        if (renderFormItem) {
          return renderFormItem(text, { mode, fieldProps }, renderDom) || null;
        }
        return renderDom;
      }
      return null;
    };
  },
});

FieldSelect.install = (app: App) => {
  app.component(FieldSelect.name, FieldSelect);
  return app;
};

export default FieldSelect as DefineComponent<FieldSelectProps> & Plugin;
