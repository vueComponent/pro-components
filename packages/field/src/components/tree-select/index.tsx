import { computed, defineComponent, ref } from 'vue'
import {
  anyType,
  booleanType,
  classNames,
  omit,
  stringType,
  useState
} from '@v-c/utils'
import type { RadioGroupProps, TreeSelectProps } from 'ant-design-vue'
import { Spin, TreeSelect } from 'ant-design-vue'
import { useConfigInject, useIntl } from '@ant-design-vue/pro-provider'
import { FieldLabel, useMergedState } from '@ant-design-vue/pro-utils'
import { proFieldFC } from '../../typing'
import {
  ObjToMap,
  fieldSelectProps,
  proFieldParsingText,
  useFieldFetchData
} from '../select'
import { useMergeProps } from '../../_utils'

const FieldTreeSelect = defineComponent({
  name: 'FieldTreeSelect',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      ...fieldSelectProps,
      options: anyType<RadioGroupProps['options']>(),
      radioType: stringType<'button' | 'radio'>(),
      /**
       * 当搜索关键词发生变化时是否请求远程数据
       *
       * @default true
       */
      fetchDataOnSearch: booleanType(true)
    })
  },
  setup(props, { slots, attrs, expose }) {
    const { prefixCls } = useConfigInject('pro-field-tree-select', props)
    const layoutClassName = prefixCls.value
    const treeSelectRef = ref()
    const [open, setOpen] = useState(false)
    const intl = useIntl()
    const [loading, options, fetchData] = useFieldFetchData(
      {
        ...props,
        defaultKeyWords: props?.fieldProsp?.propsSearchValue
      } as any,
      attrs
    )

    const [searchValue, setSearchValue] = useMergedState<string | undefined>(
      undefined,
      {
        onChange: props?.onSearch as any,
        value: computed(() => props?.fieldProsp?.propsSearchValue)
      }
    )

    expose({
      treeSelectRef,
      fetchData: (keyWord: string) => fetchData(keyWord)
    })

    const onChange: TreeSelectProps['onChange'] = (
      value,
      optionList,
      extra
    ) => {
      const {
        onChange: propsOnChange,
        showSearch,
        autoClearSearchValue
      } = props.fieldProps as TreeSelectProps
      // 将搜索框置空 和 antd 行为保持一致
      if (showSearch && autoClearSearchValue) {
        fetchData(undefined)
        setSearchValue(undefined)
      }
      propsOnChange?.(value, optionList, extra)
    }

    return () => {
      const {
        renderFormItem,
        mode,
        light,
        label,
        render,
        fetchDataOnSearch = true,
        ...rest
      } = props

      const restProps = omit(useMergeProps(rest, attrs, props.fieldProps), [
        'onChange'
      ])
      const {
        onClear,
        onBlur,
        showSearch,
        autoClearSearchValue,
        ...fieldProps
      } = rest.fieldProps as TreeSelectProps & {
        fetchDataOnSearch?: boolean
      }
      const optionsValueEnumFunc = () => {
        if (mode !== 'read') return
        /**
         * Support TreeSelect fieldNames
         * @see https://ant.design/components/tree-select-cn
         */
        const {
          value: valuePropsName = 'value',
          label: labelPropsName = 'label',
          children: childrenPropsName = 'children'
        } = fieldProps?.fieldNames || {}

        const valuesMap = new Map()

        const traverseOptions = (_options: typeof options.value) => {
          if (!_options?.length) {
            return valuesMap
          }

          const length = _options.length
          let i = 0
          while (i < length) {
            const cur = _options[i++]
            valuesMap.set(cur[valuePropsName], cur[labelPropsName])
            traverseOptions(cur[childrenPropsName])
          }
          return valuesMap
        }

        return traverseOptions(options.value)
      }
      const optionsValueEnum = optionsValueEnumFunc()

      if (mode === 'read') {
        const dom = (
          <>
            {proFieldParsingText(
              rest.text,
              ObjToMap(rest.valueEnum || optionsValueEnum)
            )}
          </>
        )

        if (render) {
          return render(rest.text, { mode, ...(restProps as any) }, dom) ?? null
        }
        return dom
      }
      if (mode === 'edit') {
        const valuesLength = Array.isArray(restProps?.value)
          ? restProps?.value?.length
          : 0
        let dom = (
          <Spin spinning={loading.value}>
            {/* popupMatchSelectWidth={!light}  */}
            <TreeSelect
              open={open.value}
              onDropdownVisibleChange={(isOpen) => {
                fieldProps?.onDropdownVisibleChange?.(isOpen)
                setOpen(isOpen)
              }}
              ref={treeSelectRef}
              placeholder={intl.value.getMessage(
                'tableForm.selectPlaceholder',
                '请选择'
              )}
              tagRender={
                light
                  ? (item) => {
                      if (valuesLength < 2) return <>{item.label}</>
                      /**
                       * 性能不好，等我给 antd 提个issue
                       */
                      const itemIndex = restProps?.value?.findIndex(
                        (v: any) => v === item.value || v.value === item.value
                      )
                      return (
                        <>
                          {item.label} {itemIndex < valuesLength - 1 ? ',' : ''}
                        </>
                      )
                    }
                  : undefined
              }
              {...restProps}
              bordered={!light}
              treeData={options.value as TreeSelectProps['treeData']}
              showSearch={showSearch}
              style={[
                {
                  minWidth: 60
                },
                restProps.style
              ]}
              allowClear={restProps.allowClear !== false}
              searchValue={searchValue.value as string}
              autoClearSearchValue={autoClearSearchValue}
              onClear={() => {
                onClear?.()
                fetchData(undefined)
                if (showSearch) {
                  setSearchValue(undefined)
                }
              }}
              onChange={onChange}
              onSearch={(value) => {
                if (fetchDataOnSearch) {
                  fetchData(value)
                }
                setSearchValue(value)
              }}
              onBlur={(event) => {
                setSearchValue(undefined)
                fetchData(undefined)
                onBlur?.(event)
              }}
              class={classNames(restProps?.class, layoutClassName)}
              v-slots={slots}
            />
          </Spin>
        )

        if (renderFormItem) {
          dom =
            renderFormItem(rest.text, { mode, ...(restProps as any) }, dom) ??
            null
        }

        if (light) {
          const { disabled, placeholder } = restProps
          const notEmpty = !!restProps.value && restProps.value?.length !== 0

          return (
            <FieldLabel
              label={label}
              disabled={disabled}
              placeholder={placeholder}
              onClick={() => {
                setOpen(true)
                restProps?.onDropdownVisibleChange?.(true)
              }}
              bordered={rest.bordered}
              value={notEmpty || open.value ? dom : null}
              style={
                notEmpty
                  ? {
                      paddingInlineEnd: 0
                    }
                  : undefined
              }
              allowClear={false}
              downIcon={false}
            />
          )
        }
        return dom
      }

      return null
    }
  }
})

export default FieldTreeSelect
