import { useIntl } from '@ant-design-vue/pro-provider'
import { computed, defineComponent } from 'vue'
import { booleanType, eventType, stringType } from '@v-c/utils'
import { useMergedState } from '@ant-design-vue/pro-utils'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { Input, Space } from 'ant-design-vue'
import { proFieldFC } from '../../typing'
import { useMergeProps } from '../../_utils'

const FieldPassword = defineComponent({
  name: 'FieldPassword',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      text: stringType(),
      visible: booleanType(),
      onVisible: eventType<(visible: boolean) => void>(),
      open: booleanType(),
      onOpenChange: eventType<(open: boolean) => void>()
    })
  },
  setup(props, { slots, attrs }) {
    const intl = useIntl()
    const [open, setOpen] = useMergedState<boolean>(
      () => props.open || props.visible || false,
      {
        value: computed(() => props.open || props.visible),
        onChange: props.onOpenChange || props.onVisible
      }
    )
    return () => {
      const { text, mode, render, renderFormItem, fieldProps, ...rest } = props
      if (mode === 'read') {
        let dom = <>-</>
        if (text) {
          dom = (
            <Space>
              <span>{open.value ? text : '＊ ＊ ＊ ＊ ＊'}</span>
              <a onClick={() => setOpen(!open.value)}>
                {open.value ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </a>
            </Space>
          )
        }
        if (render) {
          return render(
            text,
            { mode, ...useMergeProps(rest, attrs, fieldProps) },
            dom
          )
        }
        return dom
      }
      if (mode === 'edit' || mode === 'update') {
        const dom = (
          <Input.Password
            placeholder={intl.value.getMessage(
              'tableForm.inputPlaceholder',
              '请输入'
            )}
            {...useMergeProps(rest, attrs, fieldProps)}
            v-slots={slots}
          />
        )
        if (renderFormItem) {
          return renderFormItem(
            text,
            { mode, ...useMergeProps(rest, attrs, fieldProps) },
            dom,
            slots
          )
        }
        return dom
      }
      return null
    }
  }
})

export default FieldPassword
