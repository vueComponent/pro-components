import { runFunction } from '@ant-design-vue/pro-utils'
import type { SelectProps } from 'ant-design-vue'
import { booleanType, someType } from '@v-c/utils'
import { defineComponent } from 'vue'
import ProFormField from '../field'
import { proFormFieldItemProps, proFormFieldRemoteProps } from '../../typing'
import { useFieldContextInject } from '../../field-context'

export const proFormSelectProps = {
  ...proFormFieldItemProps,
  ...proFormFieldRemoteProps,
  options: someType<SelectProps['options'] | string[]>([Array]),
  mode: someType<SelectProps['mode'] | 'single'>([String]),
  showSearch: booleanType(),
  readonly: booleanType()
}

/**
 * 选择框
 *
 * @param
 */
const ProFormSelectComponents = defineComponent({
  name: 'ProFormSelectComponents',
  inheritAttrs: false,
  props: {
    ...proFormSelectProps
  },
  setup(props, { slots }) {
    const context = useFieldContextInject()
    return () => {
      const {
        fieldProps,
        params,
        proFieldProps,
        mode,
        valueEnum,
        request,
        showSearch,
        fieldConfig,
        options,
        ...rest
      } = props

      return (
        <ProFormField
          valueEnum={runFunction(valueEnum)}
          request={request}
          params={params}
          valueType="select"
          fieldConfig={{ customLightMode: true, ...fieldConfig }}
          fieldProps={
            {
              options,
              mode,
              showSearch,
              getPopupContainer: context.value.getPopupContainer,
              ...fieldProps
            } as SelectProps
          }
          proFieldProps={proFieldProps}
          {...rest}
          v-slots={slots}
        />
      )
    }
  }
})
const SearchSelect = defineComponent({
  name: 'SearchSelect',
  inheritAttrs: false,
  props: {
    ...proFormSelectProps
  },
  setup(props, { slots }) {
    const context = useFieldContextInject()

    return () => {
      const {
        fieldProps,
        params,
        proFieldProps,
        mode,
        valueEnum,
        request,
        options,
        fieldConfig,
        ...rest
      } = props

      const selectProps = {
        options,
        mode: (mode as 'multiple') || 'multiple',
        labelInValue: true,
        showSearch: true,
        showArrow: false,
        autoClearSearchValue: true,
        optionLabelProp: 'label',
        ...fieldProps
      }
      return (
        <ProFormField
          valueEnum={runFunction(valueEnum)}
          request={request}
          params={params}
          valueType="select"
          fieldConfig={{ customLightMode: true, ...fieldConfig }}
          fieldProps={{
            getPopupContainer: context.value.getPopupContainer,
            ...selectProps
          }}
          proFieldProps={proFieldProps}
          {...rest}
          v-slots={slots}
        />
      )
    }
  }
})

const ProFormSelect = ProFormSelectComponents
const ProFormSearchSelect = SearchSelect

const WrappedProFormSelect = ProFormSelect
WrappedProFormSelect.SearchSelect = ProFormSearchSelect
export default WrappedProFormSelect
