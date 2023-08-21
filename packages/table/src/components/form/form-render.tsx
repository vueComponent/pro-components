import type { ExtractPropTypes } from 'vue'
import { defineComponent, reactive, ref, watchEffect } from 'vue'
import {
  anyType,
  arrayType,
  booleanType,
  classNames,
  eventType,
  objectType,
  omit,
  someType
} from '@v-c/utils'
import type { BaseQueryFilterProps } from '@ant-design-vue/pro-form'
import type { ProSchemaComponentTypes } from '@ant-design-vue/pro-utils'
import { formItemProps } from 'ant-design-vue/es/form'
import { useConfigInject, useProProviderContext } from '@ant-design-vue/pro-provider'
import { Table } from 'ant-design-vue'
import { BetaSchemaForm } from '@ant-design-vue/pro-form'
import type { ProColumns, ProTableProps } from '../../typing'

function toLowerLine(str: string) {
  let temp = str.replace(/[A-Z]/g, (match) => {
    return `-${match.toLowerCase()}`
  })

  if (temp.startsWith('-')) {
    // 如果首字母是大写，执行replace时会多一个_，这里需要去掉
    temp = temp.slice(1)
  }
  return temp
}

export type SearchConfig = BaseQueryFilterProps & {
  filterType?: 'query' | 'light'
}

/**
 * 获取当前选择的 Form Layout 配置
 *
 * @param isForm
 * @param searchConfig
 * @returns LightFilter | QueryFilter | ProForm
 */
const getFormCompetent = (
  isForm: boolean,
  searchConfig?: SearchConfig | false
): 'Form' | 'LightFilter' | 'QueryFilter' => {
  if (!isForm && searchConfig !== false) {
    if (searchConfig?.filterType === 'light') {
      return 'LightFilter'
    }
    return 'QueryFilter'
  }
  return 'Form'
}

/**
 * 获取需要传给相应表单的props
 *
 * @param isForm
 * @param searchConfig
 * @param name
 */
const getFromProps = (isForm: boolean, searchConfig: any, name: string) => {
  if (!isForm && name === 'LightFilter') {
    // 传给 lightFilter 的问题
    return omit(
      {
        ...searchConfig
      },
      ['labelWidth', 'defaultCollapsed', 'filterType']
    )
  }

  if (!isForm) {
    // 传给 QueryFilter 的配置
    return omit(
      {
        labelWidth: searchConfig ? searchConfig?.labelWidth : undefined,
        defaultCollapsed: true,
        ...searchConfig
      },
      ['filterType']
    )
  }
  return {}
}

/**
 * 从formConfig中获取传给相应表单的配置
 *
 * @param isForm
 * @param formConfig
 */
const getFormConfigs = (isForm: boolean, formConfig: any) => {
  if (isForm) {
    // 传给Form的配置
    return omit(formConfig, ['ignoreRules'])
  }
  // 传给Filter的配置
  return { ignoreRules: true, ...formConfig }
}

export const tableFormItem = {
  ...formItemProps(),
  onSubmit: eventType<(value: any, firstLoad: boolean) => void>(),
  onReset: eventType<(value: any) => void>(),
  form: objectType(),
  type: anyType<ProSchemaComponentTypes>(),
  dateFormatter: anyType<ProTableProps['dateFormatter']>(),
  search: someType<false | SearchConfig>([Boolean, Object]),
  columns: arrayType<ProColumns[]>(),
  submitButtonLoading: booleanType(),
  manualRequest: booleanType(),
  bordered: booleanType(),
  action: anyType(),
  ghost: booleanType()
}

export type TableFormItem = Partial<ExtractPropTypes<typeof tableFormItem>>

const FormRender = defineComponent({
  name: 'FormRender',
  inheritAttrs: false,
  props: {
    ...tableFormItem
  },
  setup(props, { expose }) {
    const { hashId } = useProProviderContext()
    const { getPrefixCls } = useConfigInject('', props)
    const formRef = ref<any>(null)
    const formObj = reactive({})
    /** 提交表单，根据两种模式不同，方法不相同 */
    const submit = async (values: any, firstLoad: boolean) => {
      if (props.onSubmit) {
        await props?.onSubmit?.(values, firstLoad)
      }
    }
    watchEffect(() => {
      if (formRef.value) {
        Object.assign(formObj, formRef.value)
      }
    })
    expose(formObj)
    return () => {
      const {
        dateFormatter = 'string',
        type,
        columns,
        action,
        ghost,
        manualRequest,
        onReset,
        submitButtonLoading,
        search: searchConfig,
        form: formConfig,
        bordered
      } = props
      const isForm = type === 'form'
      const columnsListFunc = () => {
        return columns
          .filter((item) => {
            if (
              item === Table.EXPAND_COLUMN ||
              item === Table.SELECTION_COLUMN
            ) {
              return false
            }
            if (
              (item.hideInSearch || item.search === false) &&
              type !== 'form'
            ) {
              return false
            }
            if (type === 'form' && item.hideInForm) {
              return false
            }
            return true
          })
          .map((item) => {
            const finalValueType =
              !item.valueType ||
              (['textarea', 'jsonCode', 'code'].includes(
                item?.valueType as any
              ) &&
                type === 'table')
                ? 'text'
                : (item?.valueType as 'text')
            const columnKey = item?.key || item?.dataIndex?.toString()

            return {
              ...item,
              width: undefined,
              ...(item.search ? item.search : {}),
              valueType: finalValueType,
              proFieldProps: {
                ...item.proFieldProps,
                proFieldKey: columnKey ? `table-field-${columnKey}` : undefined
              }
            }
          })
      }
      const columnsList = columnsListFunc()
      const className = getPrefixCls('pro-table-search')
      const formClassName = getPrefixCls('pro-table-form')
      const competentName = getFormCompetent(isForm, searchConfig)

      // 传给每个表单的配置，理论上大家都需要
      const loadingProps = {
        submitter: {
          submitButtonProps: {
            loading: submitButtonLoading
          }
        }
      }
      return (
        <div
          class={classNames(hashId.value, {
            [getPrefixCls('pro-card')]: true,
            [`${getPrefixCls('pro-card')}-border`]: !!bordered,
            [`${getPrefixCls('pro-card')}-bordered`]: !!bordered,
            [`${getPrefixCls('pro-card')}-ghost`]: !!ghost,
            [className]: true,
            [formClassName]: isForm,
            [getPrefixCls(`pro-table-search-${toLowerLine(competentName)}`)]:
              true,
            [`${className}-ghost`]: ghost,
            [(searchConfig as any)?.class]:
              searchConfig !== false && (searchConfig as any)?.class
          })}
        >
          <BetaSchemaForm
            layoutType={competentName}
            columns={columnsList}
            type={type}
            {...loadingProps}
            {...getFromProps(isForm, searchConfig, competentName)}
            {...getFormConfigs(isForm, formConfig || {})}
            action={action}
            dateFormatter={dateFormatter}
            onInit={(values: any, form) => {
              formRef.value = form
              // 触发一个 submit，之所以这里触发是为了保证 value 都被 format了
              if (type !== 'form') {
                // 修改 pageSize，变成从 url 中获取的
                const pageInfo = action.value?.pageInfo
                // 从 values 里获取是因为有时候要从 url中获取的 pageSize。
                const {
                  current = pageInfo?.current,
                  pageSize = pageInfo?.pageSize
                } = values as any
                action.value?.setPageInfo?.({
                  ...pageInfo,
                  current: parseInt(current, 10),
                  pageSize: parseInt(pageSize, 10)
                })
                /** 如果是手动模式不需要提交 */
                if (manualRequest) return
                submit(values, true)
              }
            }}
            onReset={(values: any) => {
              onReset?.(values)
            }}
            onFinish={(values: any) => {
              submit(values, false)
            }}
            initialValues={formConfig?.initialValues}
          />
        </div>
      )
    }
  }
})

export default FormRender
