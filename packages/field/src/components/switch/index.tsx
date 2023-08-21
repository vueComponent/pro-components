import { defineComponent } from 'vue'
import { useIntl } from '@ant-design-vue/pro-provider'
import { booleanType, objectType, omit } from '@v-c/utils'
import type { SwitchProps } from 'ant-design-vue'
import { Switch } from 'ant-design-vue'
import { proFieldFC } from '../../typing'

const FieldSwitch = defineComponent({
  name: 'ProFieldSwitch',
  props: {
    ...proFieldFC({
      text: booleanType(),
      fieldProps: objectType<SwitchProps>()
    })
  },
  setup(props, { slots }) {
    const intl = useIntl()
    return () => {
      const { text, mode, render, renderFormItem, fieldProps } = props

      const renderDom = () => {
        const textVal = text ?? props?.value
        if (
          textVal === undefined ||
          textVal === null ||
          `${textVal}`.length < 1
        )
          return '-'
        return textVal
          ? fieldProps?.checkedChildren ??
              intl.value.getMessage('switch.open', '打开')
          : fieldProps?.unCheckedChildren ??
              intl.value.getMessage('switch.close', '关闭')
      }

      const dom = renderDom()

      if (mode === 'read') {
        if (render) {
          return render(text, { mode, ...fieldProps }, <>{dom}</>)
        }
        return dom ?? '-'
      }
      if (mode === 'edit' || mode === 'update') {
        const dataProps = {
          checked:
            props?.value ?? fieldProps?.checked ?? fieldProps?.value ?? text,
          'onUpdate:checked': (val: string | number | boolean) => {
            props?.['onUpdate:value']?.(val)
            props?.['onUpdate:checked']?.(val)
            fieldProps?.['onUpdate:value']?.(val)
            fieldProps?.['onUpdate:checked']?.(val)
          }
        }
        const editDom = (
          <Switch
            v-slots={slots}
            {...omit(fieldProps, [
              'value',
              'onUpdate:value',
              'onUpdate:checked'
            ])}
            {...dataProps}
          />
        )
        if (renderFormItem) {
          return renderFormItem(text, { mode, ...fieldProps }, editDom, slots)
        }
        return editDom
      }
      return null
    }
  }
})

export default FieldSwitch
