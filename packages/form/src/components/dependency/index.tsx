import { arrayType, booleanType, get, merge, omit, set } from '@v-c/utils'
import { formItemProps } from 'ant-design-vue/es/form'
import type { NamePath } from 'ant-design-vue/es/form/interface'
import { computed, defineComponent } from 'vue'
import { useProFormContext } from '@ant-design-vue/pro-utils'
import { Form } from 'ant-design-vue'

export const proFormDependencyProps = {
  ...omit(formItemProps(), ['name', 'noStyle', 'label']),
  name: arrayType<NamePath[]>(),
  originDependencies: arrayType<NamePath[]>(),
  ignoreFormListField: booleanType()
}

const ProFormDependency = defineComponent({
  name: 'ProFormDependency',
  inheritAttrs: false,
  props: {
    ...proFormDependencyProps
  },
  setup(props, { slots }) {
    const context = useProFormContext()
    // flatten each name into an (string | number)[]
    const flattenNames = computed(() => {
      const nameList = props.name ?? []
      return nameList.map((itemName: NamePath) => {
        const name = [itemName]

        // ignoreFormListField为 true 或 formListField.name === undefined 时
        // 应从全局取值，要将 names 中各项的路径前缀(formListField.listName)忽略
        // if (
        //   !ignoreFormListField &&
        //   formListField.name !== undefined &&
        //   formListField.listName?.length
        // ) {
        //   name.unshift(formListField.listName);
        // }

        return (name as any).flat(1)
      })
    })
    return () => {
      const { name: nameList, originDependencies = nameList, ...rest } = props
      return (
        <Form.Item {...rest} noStyle>
          {(form: any) => {
            let values: Record<string, any> = {}
            for (let i = 0; i < nameList.length; i++) {
              const itemName = flattenNames.value[i]
              const itemOriginName = originDependencies[i]
              const finalName = ([itemOriginName] as any).flat(1)
              let value = context.getFieldFormatValueObject?.(itemName)
              if (value && Object.keys(value).length) {
                // transform 会生成多余的value，这里需要注入一下
                values = merge({}, values, value)
                if (get(value, itemName)) {
                  values = set(values, finalName, get(value, itemName), false)
                }
              } else {
                value = form.getFieldValue?.(itemName)
                if (typeof value !== 'undefined') {
                  values = set(values, finalName, value, false)
                }
              }
            }
            return slots.default?.(values, {
              ...form,
              ...context
            })
          }}
        </Form.Item>
      )
    }
  }
})
export default ProFormDependency
