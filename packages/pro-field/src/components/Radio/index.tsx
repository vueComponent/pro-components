import {
  defineComponent,
  type App,
  DefineComponent,
  Plugin,
  computed,
} from "vue";
import { fieldRadioProps, FieldRadioProps } from "./types";
import { Radio } from "ant-design-vue";
import { getSlot, VueText, objToMap } from "@ant-design-vue/pro-utils";
import { proFieldParsingText } from "../Select";

export const slots = ["renderExtraFooter", "suffixIcon", "clearIcon"];

const FieldRadio = defineComponent({
  name: "FieldRadio",
  inheritAttrs: false,
  props: fieldRadioProps,
  slots,
  setup(props, { slots }) {
    const render = getSlot(
      slots,
      props.fieldProps as Record<string, any>,
      "render"
    ) as Function;
    const renderFormItem = getSlot(
      slots,
      props.fieldProps as Record<string, any>,
      "renderFormItem"
    ) as Function;
    const children = getSlot(
      slots,
      props.fieldProps as Record<string, any>,
      "default"
    );

    return () => {
      const { mode, text, valueEnum, fieldProps = {} } = props;
      const { options } = fieldProps;

      if (mode === "read") {
        const optionsValueEnum = options?.length
          ? options?.reduce((pre: any, cur: any) => {
              return { ...pre, [cur.value ?? ""]: cur.label };
            }, {})
          : undefined;
        const dom = (
          <>
            {proFieldParsingText(
              text as VueText,
              objToMap(valueEnum || optionsValueEnum)
            )}
          </>
        );

        if (render) {
          return render(text, { mode, ...fieldProps }, dom) || null;
        }
        return dom;
      }

      if (mode === "edit") {
        const dom = (
          <Radio.Group
            {...fieldProps}
            options={options}
            v-slots={{
              default: children,
            }}
          />
        );
        if (renderFormItem) {
          return renderFormItem(text, { mode, ...fieldProps }, dom);
        }
        return dom;
      }
      return null;
    };
  },
});

FieldRadio.install = (app: App) => {
  app.component(FieldRadio.name, FieldRadio);
  return app;
};

export default FieldRadio as DefineComponent<FieldRadioProps> & Plugin;
