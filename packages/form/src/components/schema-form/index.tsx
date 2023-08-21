import { defineComponent, reactive, ref } from 'vue'
import {
  LabelIconTip,
  omitUndefined,
  runFunction,
  useLatest
} from '@ant-design-vue/pro-utils'
import { stringify } from 'use-json-comparison'
import { get, merge, set, toArray, useState } from '@v-c/utils'
import QueryFilter from '../../layouts/query-filter'
import { ProForm } from '../../layouts/pro-form'
import { exposeBaseFormInstance, exposeFormInstance } from '../../field-context'
import type { ProFormColumnsType } from './typing'
import { formSchema } from './typing'
import { renderValueType } from './value-type'
const FormLayoutType: Record<string, any> = {
  QueryFilter
}
/**
 * 此组件可以根据 Json Schema 来生成相应的表单,大部分配置与 antd 的 table 列配置相同
 *
 * @see 此组件仍为 beta 版本，api 可能发生变化
 */
const BetaSchemaForm = defineComponent({
  inheritAttrs: false,
  props: {
    ...formSchema
  },
  setup(props, { expose }) {
    const formRef = ref()
    const propsRef = useLatest(props)
    const oldValuesRef = ref()
    const model = reactive({})
    const [formDomsDeps, updatedFormDoms] = useState<[]>(() => [])
    const onValuesChange = (changedValues: any, values: any) => {
      const {
        shouldUpdate = (pre, next) => stringify(pre) !== stringify(next)
      } = props
      const { onValuesChange: propsOnValuesChange } = propsRef.value
      if (
        shouldUpdate === true ||
        (typeof shouldUpdate === 'function' &&
          shouldUpdate(values, oldValuesRef.value))
      ) {
        updatedFormDoms([])
      }
      oldValuesRef.value.current = values
      propsOnValuesChange?.(changedValues, values)
    }
    expose({
      ...exposeFormInstance(formRef),
      ...exposeBaseFormInstance(formRef),
      initForm: (...args: any[]) => formRef.value?.initForm(...args)
    })
    return () => {
      const {
        columns,
        layoutType = 'Form',
        type = 'form',
        action,
        ...restProps
      } = props

      const FormRenderComponents = FormLayoutType[layoutType] || ProForm

      /**
       * 生成子项，方便被 table 接入
       *
       * @param items
       */
      const genItems = (items: ProFormColumnsType[]) => {
        return items
          .filter((originItem) => {
            return !(originItem.hideInForm && type === 'form')
          })
          .sort((a: any, b: any) => {
            if (b.order || a.order) {
              return (b.order || 0) - (a.order || 0)
            }
            return (b.index || 0) - (a.index || 0)
          })
          .map((originItem: any, index: number) => {
            const title = runFunction(
              originItem.title,
              originItem,
              'form',
              <LabelIconTip
                label={originItem.title as string}
                tooltip={originItem.tooltip || originItem.tip}
              />
            )
            const keyPath = toArray(
              originItem.key || originItem.dataIndex || originItem.name
            ).join('.')
            const value = get(model, keyPath) ?? null
            const setValue = (val: any) => {
              const obj = set(
                {},
                toArray(
                  originItem.key || originItem.dataIndex || originItem.names
                ),
                val
              )
              merge(model, obj)
            }
            const item = omitUndefined({
              title,
              value,
              'onUpdate:value': setValue,
              label: title,
              name: originItem.name,
              valueType: runFunction(originItem.valueType, {}),
              key: originItem.key || originItem.dataIndex || index,
              columns: originItem.columns,
              valueEnum: originItem.valueEnum,
              dataIndex: originItem.dataIndex || originItem.key,
              initialValue: originItem.initialValue,
              width: originItem.width,
              index: originItem.index,
              readonly: originItem.readonly,
              colSize: originItem.colSize,
              colProps: originItem.colProps,
              rowProps: originItem.rowProps,
              className: originItem.className,
              tooltip: originItem.tooltip || originItem.tip,
              dependencies: originItem.dependencies,
              proFieldProps: originItem.proFieldProps,
              ignoreFormItem: originItem.ignoreFormItem,
              getFieldProps: originItem.fieldProps
                ? () =>
                    runFunction(
                      originItem.fieldProps,
                      formRef.value,
                      originItem
                    )
                : undefined,
              getFormItemProps: originItem.formItemProps
                ? () =>
                    runFunction(
                      originItem.formItemProps,
                      formRef.value,
                      originItem
                    )
                : undefined,
              render: originItem.render,
              renderFormItem: originItem.renderFormItem,
              renderText: originItem.renderText,
              request: originItem.request,
              params: originItem.params,
              transform: originItem.transform,
              convertValue: originItem.convertValue,
              debounceTime: originItem.debounceTime,
              defaultKeyWords: originItem.defaultKeyWords
            })
            return renderValueType(item, {
              action,
              type,
              originItem,
              formRef,
              genItems: genItems as any
            })
          })
          .filter((field) => Boolean(field))
      }

      const formChildrenDomsFunc = () => {
        if (formDomsDeps.value) {
          // TODO
        }
        if (!formRef.value) return
        // like StepsForm's columns but not only for StepsForm
        if (columns.length && Array.isArray(columns[0])) return
        return genItems(columns as ProFormColumnsType[])
      }
      const formChildrenDoms = formChildrenDomsFunc()

      /**
       * Append layoutType component specific props
       */
      const specificPropsFunc = () => {
        if (layoutType === 'StepsForm') {
          return {
            // forceUpdate,
            columns: columns as ProFormColumnsType[][]
          }
        }

        return {}
      }
      const specificProps = specificPropsFunc()

      return (
        <FormRenderComponents
          {...specificProps}
          {...restProps}
          ref={formRef}
          model={model}
        >
          {formChildrenDoms}
        </FormRenderComponents>
      )
    }
  }
})

export default BetaSchemaForm
