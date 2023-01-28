import {
  defineComponent,
  computed,
  type App,
  DefineComponent,
  Plugin,
  PropType,
  ExtractPropTypes,
  Fragment,
} from "vue";
import {
  getSlot,
  objToMap,
  type ProFieldRequestData,
  ProFieldValueEnumType,
  ProSchemaValueEnumObj,
  VueNode,
} from "@ant-design-vue/pro-utils";
import { Spin, Space } from "ant-design-vue";
import renderEmpty from "ant-design-vue/es/config-provider/renderEmpty";
import SearchSelect from "./SearchSelect";
import type { SearchSelectProps } from "./SearchSelect/types";
import { proFieldFC } from "../typings";
import { useFetchData } from "./hooks/useFetchData";

export const proFieldParsingText = (
  text: string | number | (string | number)[],
  valueEnumParams: ProFieldValueEnumType,
  key?: number | string
): VueNode => {
  if (Array.isArray(text)) {
    return (
      // Space暂时还不支出split属性
      <Space key={key} size={2} wrap>
        {text.map((value, index) =>
          // @ts-ignore
          proFieldParsingText(value, valueEnumParams, index)
        )}
      </Space>
    );
  }

  const valueEnum = objToMap(valueEnumParams);

  if (!valueEnum.has(text) && !valueEnum.has(`${text}`)) {
    // @ts-ignore
    return text?.label || text;
  }

  const domText = (valueEnum.get(text) || valueEnum.get(`${text}`)) as {
    text: VueNode;
    color?: string;
  };

  if (!domText) {
    // @ts-ignore
    return <Fragment key={key}>{text?.label || text}</Fragment>;
  }

  // 什么都没有使用 text
  return (
    <Fragment key={key}>{domText.text || (domText as any as VueNode)}</Fragment>
  );
};

export const fieldSelectProps = {
  ...proFieldFC,
  fieldProps: {
    type: Object as PropType<SearchSelectProps>,
  },
  // 请求
  request: {
    type: Function as PropType<ProFieldRequestData>,
  }
};
export type FieldSelectProps = Partial<
  ExtractPropTypes<typeof fieldSelectProps>
>;

const FieldSelect = defineComponent({
  inheritAttrs: false,
  props: fieldSelectProps,
  slots: ["render", "renderFormItem"],
  setup(props, { slots }) {
    const { defaultKeyWords, loading, options } = useFetchData(props);

    const optionsValueEnum = computed(() => {
      if (props.mode !== "read") return;

      const {
        label: labelPropsName = "label",
        value: valuePropsName = "value",
        options: optionsPropsName = "options",
      } = (props.fieldProps || {}).fieldNames || {};

      const valuesMap = new Map();

      const traverseOptions = (_options: SearchSelectProps['options']) => {
        if (!_options?.length) {
          return valuesMap;
        }
        const length = _options.length;
        let i = 0;
        while (i < length) {
          const cur = _options[i++];
          valuesMap.set(cur[valuePropsName], cur[labelPropsName]);
          traverseOptions(cur[optionsPropsName]);
        }
        return valuesMap;
      };

      return traverseOptions(options.value);
    });


    return () => {
      const { mode, text, valueEnum, fieldProps } = props;
      const render = getSlot(slots, props, "render") as any;
      const renderFormItem = getSlot(slots, props, "renderFormItem") as any;
      
      if (mode === "read") {
        const dom = (
          <>
            {proFieldParsingText(
              text as string | string[],
              objToMap(
                valueEnum || optionsValueEnum.value
              ) as unknown as ProSchemaValueEnumObj
            )}
          </>
        );
        if (render) {
          return render(text, { mode, fieldProps }, dom) || null;
        }
        return dom;
      }
      if (mode === "edit" || mode === "update") {
        const hasChildren = typeof fieldProps?.default === "function";
        const renderDom = (
          <SearchSelect
            style={{
              minWidth: 100,
            }}
            {...fieldProps}
            loading={loading.value}
            options={hasChildren ? undefined : options.value}
            default={hasChildren ? fieldProps?.default : undefined}
            fetchData={(value) => (defaultKeyWords.value = value)}
            resetData={() => (defaultKeyWords.value = "")}
            v-slots={{
              notFoundContent: () => {
                return loading.value ? (
                  <Spin size={"small"} />
                ) : (
                  fieldProps?.notFoundContent || renderEmpty("Select")
                );
              },
            }}
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
