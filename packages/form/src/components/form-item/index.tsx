import {
  anyType,
  booleanType,
  createInjectionState,
  eventType,
  filterEmpty,
  functionType,
  objectType,
  someType,
  stringType
  // vNodeType
} from '@v-c/utils'
import type {
  ProFieldValueType,
  // SearchConvertKeyFn,
  SearchTransformKeyFn
} from '@ant-design-vue/pro-utils'
import { isDropdownValueType } from '@ant-design-vue/pro-utils'

import { formItemProps } from 'ant-design-vue/es/form'
import type { ExtractPropTypes } from 'vue'
import { computed, defineComponent, isVNode, onMounted } from 'vue'
import type { FormItemProps } from 'ant-design-vue'
import { FormItem } from 'ant-design-vue'
import { useConfigInject } from '@ant-design-vue/pro-provider'
// import { useFieldContextInject } from '../../field-context'
import { LightWrapper } from '../../base-form/light-wrapper'
import { useFieldContextInject } from '../../field-context'
export const warpFormItemProps = {
  /** @name 前置的dom * */
  // addonBefore: vNodeType(),
  /** @name 后置的dom * */
  // addonAfter: vNodeType(),
  /**
   * @name 获取时转化值，一般用于将数据格式化为组件接收的格式
   * @param value 字段的值
   * @param namePath 字段的name
   * @returns 字段新的值
   *
   *
   * @example a,b => [a,b]     convertValue: (value,namePath)=> value.split(",")
   * @example string => json   convertValue: (value,namePath)=> JSON.parse(value)
   * @example number => date   convertValue: (value,namePath)=> Dayjs(value)
   * @example YYYY-MM-DD => date   convertValue: (value,namePath)=> Dayjs(value,"YYYY-MM-DD")
   * @example  string => object   convertValue: (value,namePath)=> { return {value,label:value} }
   */
  // convertValue: anyType<SearchConvertKeyFn>(),
  // valuePropName: stringType()
}

export type WarpFormItemProps = Partial<
  ExtractPropTypes<typeof warpFormItemProps>
>

const [useFormItemProvide, useFormItemInject] = createInjectionState(
  (props: WarpFormItemProps & FormItemProps) => {
    return {
      name: computed(() => props.name),
      label: computed(() => props.label)
    }
  }
)
export const useFormItemContext = () => {
  return (
    useFormItemInject() ?? {
      name: computed(() => undefined),
      label: computed(() => undefined)
    }
  )
}
export const proFormItemProps = {
  ...formItemProps(),
  ...warpFormItemProps,
  ignoreFormItem: booleanType(),
  valueType: someType<ProFieldValueType>([String, Object]),
  /**
   * @name 提交时转化值，一般用于将值转化为提交的数据
   * @param value 字段的值
   * @param namePath 字段的name
   * @param allValues 所有的字段
   * @returns 字段新的值，如果返回对象，会和所有值 merge 一次
   *
   * @example {name:[a,b] => {name:a,b }    transform: (value,namePath,allValues)=> value.join(",")
   * @example {name: string => { newName:string }    transform: (value,namePath,allValues)=> { newName:value }
   * @example {name:dayjs} => {name:string transform: (value,namePath,allValues)=> value.format("YYYY-MM-DD")
   * @example {name:dayjs}=> {name:时间戳} transform: (value,namePath,allValues)=> value.valueOf()
   * @example {name:{value,label}} => { name:string} transform: (value,namePath,allValues)=> value.value
   * @example {name:{value,label}} => { valueName,labelName  } transform: (value,namePath,allValues)=> { valueName:value.value, labelName:value.name }
   */
  transform: functionType<SearchTransformKeyFn>(),
  dataFormat: stringType(),
  lightProps: objectType(),
  proFormFieldKey: anyType(),
  value: anyType(),
  'onUpdate:value': eventType()
}

export type ProFormItemProps = Partial<
  ExtractPropTypes<typeof proFormItemProps>
>

export const WarpFormItem = defineComponent({
  name: 'WarpFormItem',
  inheritAttrs: false,
  props: {
    ...formItemProps(),
    ...warpFormItemProps
  },
  setup(props, { slots }) {
    useFormItemProvide(props)
    return () => {
      return <FormItem {...props}>{slots.default?.()}</FormItem>
    }
  }
})

const ProFormItem = defineComponent({
  name: 'ProFormItem',
  inheritAttrs: false,
  props: {
    ...proFormItemProps
  },
  setup(props, { slots }) {
    /** 从 context 中拿到的值 */
    const name = computed(() => {
      // if (formListField.name !== undefined) {
      //   return [formListField.name, props.name].flat(1) as string[];
      // }
      return props.name
    })
    const { size } = useConfigInject('', props)
    /** 从 context 中拿到的值 */
    const fieldContextInject = useFieldContextInject()
    // console.log(fieldContextInject)
    const initFieldValueType = () => {
      if (!fieldContextInject.value.setFieldValueType || !props.name) {
        return
      }
      fieldContextInject.value.setFieldValueType(
        ([props.name] as any)
          .flat(1)
          .filter((itemName: any) => itemName !== undefined),
        {
          valueType: props.valueType || 'text',
          dateFormat: props.dataFormat,
          transform: props.transform
        }
      )
    }
    onMounted(() => {
      initFieldValueType()
    })
    // watchEffect(() => {
    // console.log(fieldContextInject)
    // if (!fieldContextInject.value.setFieldValueType || !props.name) {
    // }
    //   fieldContextInject.value.setFieldValueType(
    //     [props.name].flat(1).filter((itemName) => itemName !== undefined),
    //     {
    //       valueType: props.valueType || 'text',
    //       dateFormat: props.dataFormat,
    //       transform: props.transform
    //     }
    //   )
    // })
    return () => {
      const { lightProps = {}, ignoreFormItem, ...rest } = props
      const children = filterEmpty(slots.default?.())

      const isDropdown =
        children.length > 0 &&
        isVNode(children[0]) &&
        isDropdownValueType((children[0] as any).props?.valueType)
      const noLightFormItem = !!(
        !lightProps.light ||
        lightProps.customLightMode ||
        isDropdown
      )

      const lightDom = noLightFormItem ? (
        children
      ) : (
        <LightWrapper
          {...lightProps}
          key={rest.proFormFieldKey || rest.name?.toString?.()}
          size={size.value}
        >
          {children}
        </LightWrapper>
      )
      if (ignoreFormItem) {
        return lightDom
      }
      return (
        <WarpFormItem
          key={rest.proFormFieldKey || rest.name?.toString()}
          {...formItemProps}
          {...rest}
          name={name.value}
        >
          {lightDom}
        </WarpFormItem>
      )
    }
  }
})

export default ProFormItem
