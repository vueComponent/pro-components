import { defineComponent, reactive, shallowRef, watchEffect } from 'vue'
import {
  anyType,
  arrayType,
  booleanType,
  eventType,
  functionType,
  omit,
  someType
} from '@v-c/utils'
import type { TablePaginationConfig } from 'ant-design-vue'
import { omitUndefined } from '@ant-design-vue/pro-utils'
import type { ProTableProps } from '../../typing'
import { isBordered } from '../../utils'
import FormRender from './form-render'

const baseFormProps = {
  pagination: someType<TablePaginationConfig | false>([Object, Boolean]),
  beforeSearchSubmit: functionType<(params: Record<string, any>) => any>(),
  action: anyType(),
  onSubmit: eventType<(params: Record<string, any>) => any>(),
  onReset: eventType(),
  loading: booleanType(),
  onFormSearchSubmit: functionType<(params: Record<string, any>) => any>(),
  columns: arrayType<ProTableProps['columns']>(),
  dateFormatter: anyType<ProTableProps['dateFormatter']>(),
  type: anyType<ProTableProps['type']>(),
  cardBordered: anyType<ProTableProps['cardBordered']>(),
  form: anyType<ProTableProps['form']>(),
  search: anyType<ProTableProps['search']>(),
  manualRequest: anyType<ProTableProps['manualRequest']>(),
  ghost: booleanType(),
  bordered: booleanType()
}

const FormSearch = defineComponent({
  name: 'FormSearch',
  inheritAttrs: false,
  props: {
    ...baseFormProps
  },
  setup(props, { expose }) {
    /** 查询表单相关的配置 */
    const formRef = reactive({})
    const baseFormRef = shallowRef()

    const onSubmit = (value: any, firstLoad: boolean) => {
      const {
        pagination,
        beforeSearchSubmit = (searchParams: any) => searchParams,
        action,
        onSubmit,
        onFormSearchSubmit
      } = props
      // 只传入 pagination 中的 current 和 pageSize 参数
      const pageInfo = pagination
        ? omitUndefined({
            current: pagination.current,
            pageSize: pagination.pageSize
          })
        : {}

      const submitParams = {
        ...value,
        _timestamp: Date.now(),
        ...pageInfo
      }
      const omitParams = omit(
        beforeSearchSubmit(submitParams),
        Object.keys(pageInfo!)
      ) as any
      onFormSearchSubmit(omitParams)
      if (!firstLoad) {
        // back first page
        action.value?.setPageInfo?.({
          current: 1
        })
      }
      // 不是第一次提交就不触发，第一次提交是 js 触发的
      // 为了解决 https://github.com/ant-design/pro-components/issues/579
      if (onSubmit && !firstLoad) {
        onSubmit?.(value)
      }
    }

    const onReset = (value: any) => {
      const {
        pagination,
        beforeSearchSubmit = (searchParams: any) => searchParams,
        action,
        onFormSearchSubmit,
        onReset
      } = props
      const pageInfo = pagination
        ? omitUndefined({
            current: pagination.current,
            pageSize: pagination.pageSize
          })
        : {}

      const omitParams = omit(
        beforeSearchSubmit({ ...value, ...pageInfo }),
        Object.keys(pageInfo!)
      ) as any
      onFormSearchSubmit(omitParams)
      // back first page
      action.value?.setPageInfo?.({
        current: 1
      })
      ;(onReset as any)?.()
    }

    watchEffect(() => {
      if (baseFormRef.value) {
        Object.assign(formRef, baseFormRef.value)
      }
    })
    expose(formRef)
    return () => {
      const {
        columns,
        loading,
        type,
        action,
        cardBordered,
        dateFormatter,
        form,
        search,
        pagination,
        ghost,
        manualRequest
      } = props

      const pageInfo = pagination
        ? omitUndefined({
            current: pagination.current,
            pageSize: pagination.pageSize
          })
        : {}
      return (
        <FormRender
          submitButtonLoading={loading}
          columns={columns!}
          ref={baseFormRef}
          type={type as any}
          ghost={ghost}
          onSubmit={onSubmit}
          manualRequest={manualRequest}
          onReset={onReset}
          dateFormatter={dateFormatter}
          search={search as any}
          form={{
            autoFocusFirstInput: false,
            ...form,
            extraUrlParams: {
              ...pageInfo,
              ...form?.extraUrlParams
            }
          }}
          action={action}
          bordered={isBordered('search', cardBordered)}
        />
      )
    }
  }
})

export default FormSearch
