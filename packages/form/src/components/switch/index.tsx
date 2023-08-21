import { vNodeType } from '@v-c/utils'
import { defineComponent } from 'vue'
import { proFormFieldItemProps } from '../../typing'
import ProField from '../field'

export const proFormSwitchProps = {
  ...proFormFieldItemProps,
  checkedChildren: vNodeType(),
  unCheckedChildren: vNodeType()
}

/**
 * @zh-cn 单选 Switch
 * @en-us Single Choice Switch
 */
const ProFormSwitch = defineComponent({
  name: 'ProFormSwitch',
  inheritAttrs: false,
  props: {
    ...proFormSwitchProps
  },
  setup(props, { slots }) {
    return () => {
      const {
        fieldProps,
        unCheckedChildren,
        checkedChildren,
        proFieldProps,
        fieldConfig,
        ...rest
      } = props
      return (
        <ProField
          valueType="switch"
          fieldProps={{
            unCheckedChildren,
            checkedChildren,
            ...fieldProps
          }}
          valuePropName="checked"
          proFieldProps={proFieldProps}
          fieldConfig={{
            valuePropName: 'checked',
            ignoreWidth: true,
            ...fieldConfig
          }}
          v-slots={slots}
          {...rest}
        />
      )
    }
  }
})

export default ProFormSwitch
