import { computed, defineComponent, ref } from 'vue'
import { anyType, classNames, omit } from '@v-c/utils'
import type { RadioGroupProps } from 'ant-design-vue'
import { Radio, Spin } from 'ant-design-vue'
import { useStyle } from '@ant-design-vue/pro-utils'
import { useConfigInject } from '@ant-design-vue/pro-provider'
import { proFieldFC } from '../../typing'
import {
  ObjToMap,
  fieldSelectProps,
  proFieldParsingText,
  useFieldFetchData
} from '../select'
import { useMergeProps } from '../../_utils'

/**
 * 单选组件
 *
 */
const FieldRadio = defineComponent({
  name: 'FieldRadio',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      ...fieldSelectProps,
      options: anyType<RadioGroupProps['options']>(),
      radioType: anyType<RadioGroupProps['optionType']>()
    })
  },
  setup(props, { slots, attrs, expose }) {
    const { prefixCls } = useConfigInject('pro-field-radio', props)
    const layoutClassName = computed(() => prefixCls.value)
    const [loading, options, fetchData] = useFieldFetchData(props as any, attrs)
    const radioRef = ref()

    expose({
      radioRef,
      fetchData: (keyWord: string) => fetchData(keyWord)
    })

    // css
    const { wrapSSR, hashId } = useStyle('FieldRadioRadio', (token) => {
      return {
        [`.${layoutClassName.value}-vertical`]: {
          [`${token.antCls}-radio-wrapper`]: {
            display: 'flex',
            marginInlineEnd: 0
          }
        }
      }
    })
    return () => {
      const { radioType, renderFormItem, mode, render, ...rest } = props
      if (loading.value) {
        return <Spin size="small" />
      }

      if (mode === 'read') {
        const optionsValueEnum = options.value?.length
          ? options.value?.reduce((pre: any, cur) => {
              return { ...pre, [(cur.value as any) ?? '']: cur.label }
            }, {})
          : undefined
        const dom = (
          <>
            {proFieldParsingText(
              rest.text,
              ObjToMap(rest.valueEnum || optionsValueEnum)
            )}
          </>
        )

        if (render) {
          return (
            render(
              rest.text,
              {
                mode,
                ...useMergeProps(omit(rest, ['fieldProps']), rest.fieldProps)
              },
              dom
            ) ?? null
          )
        }
        return dom
      }

      if (mode === 'edit') {
        const dom = wrapSSR(
          <Radio.Group
            ref={radioRef}
            optionType={radioType}
            {...useMergeProps(omit(rest, ['fieldProps']), rest.fieldProps)}
            class={classNames(
              attrs.class,
              rest.fieldProps?.class,
              hashId,
              `${layoutClassName.value}-${
                rest.fieldProps.layout || 'horizontal'
              }`
            )}
            options={options.value as any}
          />
        )
        if (renderFormItem) {
          return (
            renderFormItem(
              rest.text,
              {
                mode,
                ...useMergeProps(omit(rest, ['fieldProps']), rest.fieldProps)
              },
              dom,
              slots
            ) ?? null
          )
        }
        return dom
      }

      return null
    }
  }
})

export default FieldRadio
