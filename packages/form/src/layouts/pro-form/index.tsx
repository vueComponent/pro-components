import { defineComponent, shallowRef } from 'vue'
import type { FormInstance } from 'ant-design-vue/es/form'
import { formProps } from 'ant-design-vue/es/form'
import { BaseForm, commonFormProps } from '../../base-form'
import { exposeBaseFormInstance, exposeFormInstance } from '../../field-context'
import Group from '../../components/group'

export const proFormProps = {
  ...formProps(),
  ...commonFormProps
}

const ProForm = defineComponent({
  name: 'ProForm',
  props: {
    ...proFormProps
  },
  setup(props, { slots, expose }) {
    const formRef = shallowRef<FormInstance>()
    expose({
      ...exposeFormInstance(formRef),
      ...exposeBaseFormInstance(formRef)
    })
    return () => {
      const { layout, submitter, contentRender, ...rest } = props

      return (
        <BaseForm
          ref={formRef}
          layout={layout ?? 'vertical'}
          submitter={
            submitter ?? {
              // 反转按钮，在正常模式下，按钮应该是主按钮在前
              render(_, dom) {
                return dom.reverse()
              }
            }
          }
          contentRender={
            contentRender ??
            ((items, submitter) => {
              return (
                <>
                  {items}
                  {submitter}
                </>
              )
            })
          }
          {...(rest as any)}
          v-slots={slots}
        />
      )
    }
  }
})
export const ProFormGroup = Group
ProForm.Group = Group
export { ProForm }

export default ProForm
