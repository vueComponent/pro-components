import {
  anyType,
  eventType,
  functionType,
  numberType,
  objectType,
  omit,
  someType,
  useState
} from '@v-c/utils'
import { Button, type ButtonProps, Input } from 'ant-design-vue'
import type { DefineComponent, ExtractPropTypes, VNodeChild } from 'vue'
import { defineComponent, onBeforeUnmount, watch } from 'vue'
import { createField } from '../../base-form/create-field'
import { proFormFieldItemProps } from '../../typing'
import { useFormContextInject } from '../../base-form/context'
export const proFormCaptchaProps = {
  ...proFormFieldItemProps,
  /** @name 倒计时的秒数 */
  countDown: numberType(60),
  /** 手机号的 name */
  phoneName: someType<string | string[]>([String, Array]),
  /** @name 获取验证码的方法 */
  onGetCaptcha: functionType<(mobile: string) => Promise<void>>(),
  /** @name 渲染按钮的文字 */
  captchaTextRender:
    functionType<(timing: boolean, count: number) => VNodeChild>(),
  /** @name 获取按钮验证码的props */
  captchaProps: objectType<ButtonProps>(),
  value: anyType(),
  'onUpdate:value': eventType<(value: any) => void>(),
  onChange: anyType()
}

export type ProFormCaptchaProps = Partial<
  ExtractPropTypes<typeof proFormCaptchaProps>
>

export interface CaptFieldRef {
  startTiming: () => never
  endTiming: () => never
}
const BaseProFormCaptcha = defineComponent({
  name: 'BaseProFormCaptcha',
  inheritAttrs: false,
  props: {
    ...proFormCaptchaProps
  },
  setup(props, { slots, expose }) {
    const { form } = useFormContextInject()
    const [count, setCount] = useState<number>(props.countDown || 60)
    const [timing, setTiming] = useState(false)
    const [loading, setLoading] = useState<boolean>()
    const onGetCaptcha = async (mobile: string) => {
      if (!props.onGetCaptcha) return
      try {
        setLoading(true)
        await props.onGetCaptcha(mobile)
        setLoading(false)
        setTiming(true)
      } catch (error) {
        setTiming(false)
        setLoading(false)
        // eslint-disable-next-line no-console
        console.log(error)
      }
    }
    let interval = 0

    watch(timing, () => {
      const { countDown } = props
      if (timing.value) {
        interval = window.setInterval(() => {
          setCount((preSecond) => {
            if (preSecond <= 1) {
              setTiming(false)
              clearInterval(interval)
              // 重置秒数
              return countDown || 60
            }
            return preSecond - 1
          })
        }, 1000)
      }
    })

    onBeforeUnmount(() => {
      clearInterval(interval)
    })

    expose({
      startTiming: () => setTiming(true),
      endTiming: () => setTiming(false)
    } as CaptFieldRef)
    return () => {
      const {
        phoneName = props.name,
        fieldProps,
        captchaTextRender = slots.captchaTextRender,
        captchaProps,
        ...restProps
      } = omit(props, ['onGetCaptcha', 'rules', 'name'])
      let captchaTextRenderVNode = captchaTextRender
      if (captchaTextRender === undefined) {
        captchaTextRenderVNode = (
          paramsTiming: boolean,
          paramsCount: number
        ) => {
          return paramsTiming ? `${paramsCount} 秒后重新获取` : '获取验证码'
        }
      }
      return (
        <div
          style={{
            ...fieldProps?.style,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Input
            {...(restProps as any)}
            {...fieldProps}
            style={{
              flex: 1,
              transition: 'width .3s',
              marginRight: 8
            }}
          />
          <Button
            style={{
              display: 'block'
            }}
            disabled={timing.value}
            loading={loading.value}
            {...captchaProps}
            onClick={async () => {
              try {
                if (phoneName) {
                  await form.value?.validateFields(
                    ([phoneName] as any).flat(1) as string[]
                  )
                  const mobile = form.value?.getFieldValue(
                    ([phoneName] as any).flat(1) as string[]
                  )
                  await onGetCaptcha(mobile)
                } else {
                  await onGetCaptcha('')
                }
              } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error)
              }
            }}
          >
            {captchaTextRenderVNode?.(timing.value, count.value)}
          </Button>
        </div>
      )
    }
  }
})

const ProFormCaptcha = createField<ProFormCaptchaProps>(
  BaseProFormCaptcha as DefineComponent<ProFormCaptchaProps>
)

export default ProFormCaptcha
