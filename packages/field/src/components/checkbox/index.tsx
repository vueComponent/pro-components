import { defineComponent, ref } from 'vue'
import { anyType, classNames, stringType } from '@v-c/utils'
import type { CheckboxGroupProps } from 'ant-design-vue/es/checkbox'
import { useStyle } from '@ant-design-vue/pro-utils'
import { useConfigInject } from '@ant-design-vue/pro-provider'
import { Checkbox, Space, Spin } from 'ant-design-vue'
import {
  ObjToMap,
  fieldSelectProps,
  proFieldParsingText,
  useFieldFetchData
} from '../select'
import { proFieldFC } from '../../typing'
import { useMergeProps } from '../../_utils'

const FieldCheckbox = defineComponent({
  name: 'FieldCheckbox',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      ...fieldSelectProps,
      text: anyType(),
      layout: stringType<'horizontal' | 'vertical'>(),
      options: anyType<CheckboxGroupProps['options']>()
    })
  },
  setup(props, { slots, attrs, expose }) {
    const { prefixCls } = useConfigInject('pro-field-checkbox', props)
    const layoutClassName = prefixCls.value
    const [loading, options, fetchData] = useFieldFetchData(props as any, attrs)
    // css
    const { wrapSSR, hashId } = useStyle('Checkbox', (token) => {
      return {
        [`.${layoutClassName}`]: {
          '&-vertical': {
            // ant design 5
            [`&${token.antCls}-checkbox-group`]: {
              display: 'inline-block'
            },
            // ant design 5
            [`${token.antCls}-checkbox-wrapper+${token.antCls}-checkbox-wrapper`]:
              {
                'margin-inline-start': '0  !important'
              },
            // ant design 4
            [`${token.antCls}-checkbox-group-item`]: {
              display: 'flex',
              marginInlineEnd: 0
            }
          }
        }
      }
    })
    const checkBoxRef = ref()

    expose({
      checkBoxRef,
      fetchData: (keyWord: string) => fetchData(keyWord)
    })
    return () => {
      const {
        layout = 'horizontal',
        renderFormItem,
        mode,
        render,
        fieldProps,
        ...rest
      } = props
      const restProps = useMergeProps(rest, attrs, fieldProps)
      if (loading.value) {
        return <Spin size="small" />
      }

      if (mode === 'read') {
        const optionsValueEnum = options.value?.length
          ? options.value?.reduce((pre: any, cur) => {
              return { ...pre, [(cur.value as any) ?? '']: cur.label }
            }, {})
          : undefined

        const dom = proFieldParsingText(
          rest.text,
          ObjToMap(rest.valueEnum || optionsValueEnum)
        )

        if (render) {
          return render(rest.text, { mode, ...restProps }, <>{dom}</>) ?? null
        }
        return <Space>{dom}</Space>
      }

      if (mode === 'edit') {
        const dom = wrapSSR(
          <Checkbox.Group
            {...restProps}
            class={classNames(
              rest.fieldProps?.className,
              hashId,
              `${layoutClassName}-${layout}`
            )}
            options={options.value as any}
            v-slots={slots}
          />
        )
        if (renderFormItem) {
          return (
            renderFormItem(rest.text, { mode, ...restProps }, dom, slots) ??
            null
          )
        }
        return dom
      }

      return null
    }
  }
})

export default FieldCheckbox
