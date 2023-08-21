import type { RadioGroupProps } from 'ant-design-vue'
import { Cascader } from 'ant-design-vue'
import { useConfigInject, useIntl } from '@ant-design-vue/pro-provider'
import { defineComponent, ref } from 'vue'
import { anyType, classNames, omit, stringType, useState } from '@v-c/utils'
import { FieldLabel } from '@ant-design-vue/pro-utils'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { proFieldFC } from '../../typing'
import {
  ObjToMap,
  fieldSelectProps,
  proFieldParsingText,
  useFieldFetchData
} from '../select'
import { useMergeProps } from '../../_utils'

const FieldCascader = defineComponent({
  name: 'FieldCascader',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      ...fieldSelectProps,
      text: anyType(),
      options: anyType<RadioGroupProps['options']>(),
      radioType: stringType<'button' | 'radio'>()
    })
  },
  setup(props, { slots, attrs, expose }) {
    const { prefixCls } = useConfigInject('pro-field-cascader', props)
    const layoutClassName = prefixCls.value
    const [loading, options, fetchData] = useFieldFetchData(props as any, attrs)
    const intl = useIntl()
    const cascaderRef = ref()
    const [open, setOpen] = useState<boolean>(false)

    expose({
      cascaderRef,
      fetchData: (keyWord: string) => fetchData(keyWord)
    })
    return () => {
      const {
        // radioType,
        renderFormItem,
        mode,
        render,
        label,
        light,
        fieldProps,
        ...rest
      } = props
      const restProps = omit(useMergeProps(rest, attrs, fieldProps), [
        'radioType'
      ])
      const optionsValueEnumFunc = () => {
        if (mode !== 'read') return
        /**
         * Support cascader fieldNames
         *
         * @see https://ant.design/components/cascader-cn/#header
         */
        const {
          value: valuePropsName = 'value',
          label: labelPropsName = 'label',
          children: childrenPropsName = 'children'
        } = rest.fieldProps?.fieldNames || {}

        const valuesMap = new Map()

        const traverseOptions = (_options: typeof options.value) => {
          if (!_options?.length) {
            return valuesMap
          }

          const length = _options.length
          let i = 0
          while (i < length) {
            const cur = _options[i++]
            valuesMap.set(cur[valuePropsName], cur[labelPropsName])
            traverseOptions(cur[childrenPropsName])
          }
          return valuesMap
        }

        return traverseOptions(options.value)
      }
      const optionsValueEnum = optionsValueEnumFunc()

      if (mode === 'read') {
        const dom = (
          <>
            {proFieldParsingText(
              rest.text,
              ObjToMap(rest.valueEnum || optionsValueEnum)
            )}
          </>
        )

        if (render) {
          return render(rest.text, { mode, ...rest.fieldProps }, dom) ?? null
        }
        return dom
      }

      if (mode === 'edit') {
        let dom = (
          <Cascader
            bordered={!light}
            ref={cascaderRef}
            open={open.value}
            suffixIcon={loading.value ? <LoadingOutlined /> : undefined}
            placeholder={intl.value.getMessage(
              'tableForm.selectPlaceholder',
              '请选择'
            )}
            allowClear={rest.fieldProps?.allowClear !== false}
            {...restProps}
            onDropdownVisibleChange={(isOpen) => {
              rest?.fieldProps?.onDropdownVisibleChange?.(isOpen)
              setOpen(isOpen)
            }}
            class={classNames(rest.fieldProps?.className, layoutClassName)}
            options={options.value as any}
            v-slots={slots}
          />
        )

        if (renderFormItem) {
          dom =
            renderFormItem(
              rest.text,
              { mode, ...rest.fieldProps },
              dom,
              slots
            ) ?? null
        }

        if (light) {
          const { disabled, value } = restProps.fieldProps
          const notEmpty = !!value && value?.length !== 0
          return (
            <FieldLabel
              label={label}
              disabled={disabled}
              bordered={rest.bordered}
              value={notEmpty ? dom : null}
              style={
                notEmpty
                  ? {
                      paddingInlineEnd: 0
                    }
                  : undefined
              }
              allowClear={false}
              downIcon={false}
              onClick={() => {
                setOpen(true)
                rest?.fieldProps?.onDropdownVisibleChange?.(true)
              }}
            />
          )
        }
        return dom
      }

      return null
    }
  }
})

export default FieldCascader
