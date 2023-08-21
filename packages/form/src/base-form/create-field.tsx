import { createVNode, defineComponent } from 'vue'
import type { DefineComponent } from 'vue'
import { classNames, functionType, omit, stringType } from '@v-c/utils'
import { omitUndefined, pickProFormItemProps } from '@ant-design-vue/pro-utils'
import type { ProFormItemCreateConfig } from '../typing'
import { extendsProps, proFormFieldItemProps } from '../typing'
import ProFormItem from '../components/form-item'
import { useFieldContextInject } from '../field-context'
import { ColWrapper } from '../helpers'

const WIDTH_SIZE_ENUM = {
  // 适用于短数字，短文本或者选项
  xs: 104,
  s: 216,
  // 适用于较短字段录入、如姓名、电话、ID 等。
  sm: 216,
  m: 328,
  // 标准宽度，适用于大部分字段长度。
  md: 328,
  l: 440,
  // 适用于较长字段录入，如长网址、标签组、文件路径等。
  lg: 440,
  // 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
  xl: 552
}

const ignoreWidthValueType = ['switch', 'radioButton', 'radio', 'rate']

/**
 * 处理fieldProps和formItemProps为function时传进来的方法
 * 目前只在SchemaForm时可能会有
 */
const functionFieldProps = {
  getFormItemProps: functionType<() => Record<string, any>>(),
  getFieldProps: functionType<() => Record<string, any>>()
}

// type FunctionFieldProps = Partial<ExtractPropTypes<typeof functionFieldProps>>

function createField<T = any>(
  Field: DefineComponent<T>,
  props: Record<string, any> = {},
  config: ProFormItemCreateConfig = {}
) {
  const FieldWithContext = defineComponent({
    name: 'FieldWithContext',
    inheritAttrs: false,
    props: {
      ...props,
      ...proFormFieldItemProps,
      ...extendsProps,
      ...functionFieldProps,
      mode: stringType()
    },
    setup(props, { slots, attrs }) {
      /**
       * 从 context 中拿到的值
       */
      const contextValue = useFieldContextInject()

      return () => {
        const {
          valueType: tmpValueType,
          customLightMode,
          lightFilterLabelFormatter,
          valuePropName = 'value',
          ignoreWidth,
          defaultProps,
          ...defaultFormItemProps
        } = { ...props?.fieldConfig, ...config } || {}
        const {
          label,
          // tooltip,
          placeholder,
          width,
          bordered,
          messageVariables,
          ignoreFormItem,
          transform,
          // convertValue,
          // readonly,
          allowClear,
          // colSize,
          getFormItemProps,
          getFieldProps,
          // filedConfig,
          // cacheForSwr,
          proFieldProps,
          ...rest
        } = { ...attrs, ...defaultProps, ...props }

        const valueType = tmpValueType || (rest as any).valueType
        const isIgnoreWidth =
          ignoreWidth || ignoreWidthValueType.includes(valueType)
        const changedProps = {
          formItemProps: getFormItemProps?.(),
          fieldProps: getFieldProps?.()
        }
        const fieldProps = {
          ...(ignoreFormItem
            ? omitUndefined({ value: (rest as any).value })
            : {}),
          placeholder,
          disabled: props.disabled,
          ...contextValue.value.fieldProps,
          ...changedProps.fieldProps,
          // 支持未传递getFieldProps的情况
          // 某些特殊hack情况下覆盖原来设置的fieldProps参数
          ...rest.fieldProps
        }
        fieldProps.style = omitUndefined(fieldProps?.style)
        const restFormItemProps = pickProFormItemProps(rest)
        const formItemProps = {
          ...contextValue.value?.formItemProps,
          ...restFormItemProps,
          ...changedProps.formItemProps,
          // 支持未传递getFormItemProps的情况
          // 某些特殊hack情况下覆盖原来设置的formItemProps参数
          ...rest.formItemProps
        }
        const otherProps = {
          messageVariables,
          ...defaultFormItemProps,
          ...formItemProps
        }
        // const proFieldKeyFunc = () => {
        //   let name = otherProps?.name
        //   if (isArray(name)) name = name.join('_')
        //   const key =
        //     name && `form-${contextValue.value?.formKey ?? ''}-field-${name}`
        //   return key
        // }
        // const proFieldKey = proFieldKeyFunc()
        const newStyle = {
          width:
            width && !(WIDTH_SIZE_ENUM as any)[width]
              ? width
              : contextValue.value.grid
              ? '100%'
              : undefined,
          ...fieldProps?.style
        }
        if (isIgnoreWidth) {
          Reflect.deleteProperty(newStyle, 'width')
        }
        const style = omitUndefined(newStyle)
        const isSizeEnum = width && (WIDTH_SIZE_ENUM as any)[width]

        const className = classNames((fieldProps as any)?.class, {
          'pro-field': isSizeEnum,
          [`pro-field-${width}`]: isSizeEnum && !isIgnoreWidth
        })
        // const fieldProFieldProps = omitUndefined({
        //   ...contextValue.value?.proFieldProps,
        //   mode: (rest as any)?.mode,
        //   readonly,
        //   params: rest.params,
        //   // proFieldKey,
        //   // cacheForSwr,
        //   ...proFieldProps
        // })
        const fieldFieldProps = {
          [valuePropName]: (rest as any).value,
          [`onUpdate:${valuePropName}`]: (rest as any)['onUpdate:value'],
          allowClear,
          ...fieldProps,
          style,
          class: className
        }
        // const field = (
        //   // proFieldProps={fieldProFieldProps}
        //   // <Field
        //   //   key={props.proFormFieldKey || props.name}
        //   //   // ProXxx 上面的 props 透传给 FieldProps，可能包含 Field 自定义的 props，
        //   //   // 比如 ProFormSelect 的 request
        //   //   {...(omit(rest as any, ['rules', 'noStyle', 'cacheForSwr']) as any)}
        //   //   fieldProps={fieldFieldProps}
        //   //   v-slots={slots}
        //   // />

        // )
        const field = createVNode(
          Field,
          {
            key: props.proFormFieldKey || props.name,
            ...(omit(rest as any, ['rules', 'noStyle', 'cacheForSwr']) as any),
            fieldProps: fieldFieldProps
          },
          slots
        )
        if (props.mode === 'read') {
          return field
        }
        const formItem = (
          // convertValue={convertValue as any}
          // tooltip={proFieldProps?.light !== true && tooltip}
          // valuePropName={valuePropName}
          //
          <ProFormItem
            // 全局的提供一个 tip 功能，可以减少代码量
            // 轻量模式下不通过 FormItem 显示 label
            label={label && proFieldProps?.light !== true ? label : undefined}
            key={props.proFormFieldKey || otherProps.name?.toString()}
            {...otherProps}
            ignoreFormItem={ignoreFormItem}
            transform={transform}
            dataFormat={(fieldProps as any)?.format}
            valueType={valueType}
            messageVariables={{
              label: (label as string) || '',
              ...otherProps?.messageVariables
            }}
            lightProps={omitUndefined({
              ...fieldProps,
              valueType,
              bordered,
              allowClear: field?.props?.allowClear ?? allowClear,
              light: proFieldProps?.light,
              label,
              customLightMode,
              labelFormatter: lightFilterLabelFormatter,
              valuePropName,
              footerRender: field?.props?.footerRender,
              // 使用用户的配置覆盖默认的配置
              ...rest.lightProps,
              ...otherProps.lightProps
            })}
          >
            {field}
          </ProFormItem>
        )
        return (
          <ColWrapper grid={contextValue.value?.grid} colProps={rest.colProps}>
            {formItem}
          </ColWrapper>
        )
      }
    }
  })
  const DependencyWrapper = defineComponent({
    name: 'DependencyWrapper',
    inheritAttrs: false,
    props: {
      ...proFormFieldItemProps,
      ...extendsProps,
      ...functionFieldProps
    },
    setup(props, { slots, attrs }) {
      return () => {
        return <FieldWithContext {...attrs} {...props} v-slots={slots} />
      }
    }
  })
  return DependencyWrapper
}

export { createField }
