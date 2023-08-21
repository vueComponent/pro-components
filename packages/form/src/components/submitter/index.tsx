import type { VNodeChild } from 'vue'
import { defineComponent } from 'vue'
import type { ButtonProps } from 'ant-design-vue'
import { Button } from 'ant-design-vue'
import { eventType, isArray, omit, runEvent, someType } from '@v-c/utils'
import { useIntl } from '@ant-design-vue/pro-provider'
import { useFormContextInject } from '../../base-form/context'

/** @name 用于配置操作栏 */
export interface SearchConfig {
  /** @name 重置按钮的文本 */
  resetText?: VNodeChild
  /** @name 提交按钮的文本 */
  submitText?: VNodeChild
}

export interface SubmitterProps<T = any> {
  /** @name 提交方法 */
  onSubmit?: (value?: T) => void
  /** @name 重置方法 */
  onReset?: (value?: T) => void
  /** @name 搜索的配置，一般用来配置文本 */
  searchConfig?: SearchConfig
  /** @name 提交按钮的 props */
  submitButtonProps?: false | (ButtonProps & { preventDefault?: boolean })
  /** @name 重置按钮的 props */
  resetButtonProps?: false | (ButtonProps & { preventDefault?: boolean })
  /** @name 自定义操作的渲染 */
  render?:
    | ((
        props: SubmitterProps &
          T & {
            submit: () => void
            reset: () => void
          },
        dom: VNodeChild[]
      ) => VNodeChild[] | VNodeChild | false)
    | false
}

export const submitterProps = {
  onSubmit: eventType<SubmitterProps['onSubmit']>(),
  onReset: eventType<SubmitterProps['onReset']>(),
  searchConfig: someType<SubmitterProps['searchConfig']>([Object]),
  submitButtonProps: someType<SubmitterProps['submitButtonProps']>([
    Object,
    Boolean
  ]),
  resetButtonProps: someType<SubmitterProps['resetButtonProps']>([
    Object,
    Boolean
  ]),
  render: someType<SubmitterProps['render']>([Function, Boolean])
}

/**
 * FormFooter 的组件，可以自动进行一些配置
 *
 * @param props
 */

const Submitter = defineComponent({
  name: 'Submitter',
  inheritAttrs: false,
  props: {
    ...submitterProps
  },
  setup(props) {
    const intl = useIntl()
    const { formRef: form } = useFormContextInject()
    const submit = () => {
      if (props.onSubmit) {
        props.onSubmit()
      }
    }

    const reset = () => {
      form.value?.resetFields?.()
      if (props.onReset) {
        props.onReset()
      }
    }
    return () => {
      if (props.render === false) return null
      const {
        render,
        searchConfig = {},
        submitButtonProps = {},
        resetButtonProps = {}
      } = props
      const {
        submitText = intl.value.getMessage('tableForm.submit', '提交'),
        resetText = intl.value.getMessage('tableForm.reset', '重置')
      } = searchConfig
      /** 默认的操作的逻辑 */
      const dom: any[] = []
      if (resetButtonProps !== false) {
        dom.push(
          <Button
            {...omit(resetButtonProps, ['preventDefault'])}
            key={'reset'}
            onClick={(e) => {
              if (!resetButtonProps?.preventDefault) reset()
              runEvent(resetButtonProps.onClick, e)
            }}
          >
            {resetText}
          </Button>
        )
      }
      if (submitButtonProps !== false) {
        dom.push(
          <Button
            type="primary"
            htmlType="submit"
            {...omit(submitButtonProps || {}, ['preventDefault'])}
            key="submit"
            onClick={(e) => {
              if (!submitButtonProps?.preventDefault) submit()
              runEvent(submitButtonProps?.onClick, e)
            }}
          >
            {submitText}
          </Button>
        )
      }
      const renderDom = render
        ? render({ ...props, form: form.value, submit, reset }, dom)
        : dom
      if (!renderDom) {
        return null
      }
      if (isArray(renderDom)) {
        if (renderDom?.length < 1) {
          return null
        }
        if (renderDom.length === 1) {
          return renderDom[0]
        }

        return (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            {renderDom}
          </div>
        )
      }
      return renderDom
    }
  }
})
export default Submitter
