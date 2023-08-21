import type { RequestOptionsType } from '@ant-design-vue/pro-utils'
import {
  anyType,
  arrayType,
  booleanType,
  classNames,
  functionType,
  numberType,
  omit,
  someType,
  stringType,
  useState
} from '@v-c/utils'
import { Select } from 'ant-design-vue'
import type { LabeledValue } from 'ant-design-vue/es/select'
import { selectProps } from 'ant-design-vue/es/select'
import type { ExtractPropTypes, VNodeChild } from 'vue'
import { defineComponent, ref, watchPostEffect } from 'vue'
import { useConfigInject } from '@ant-design-vue/pro-provider'

const { Option, OptGroup } = Select
// 支持 key, value, label，兼容 UserSearch 中只填写了 key 的情况。
export type KeyLabel = Partial<LabeledValue> & RequestOptionsType

/** 用户扩展数据后的值类型 */
export type DataValueType<T> = KeyLabel & T

/** 可能单选，可能多选 */
export type DataValuesType<T> = DataValueType<T> | DataValueType<T>[]

export const searchSelectProps = {
  ...omit(selectProps(), ['options']),
  /** 防抖动时间 默认10 单位ms */
  debounceTime: numberType(),
  /** 自定义搜索方法, 返回搜索结果的 Promise */
  request:
    functionType<
      (params: { query: string }) => Promise<DataValueType<any>[]>
    >(),
  /** 自定义选项渲染 */
  optionItemRender: functionType<(item: DataValueType<any>) => VNodeChild>(),
  /** 指定组件中的值 */
  value: anyType<KeyLabel | KeyLabel[]>(),
  /** 指定默认选中的条目 */
  defaultValue: someType<KeyLabel | KeyLabel[]>([Object, Array]),
  options: arrayType<RequestOptionsType[]>(),
  /**
   * Placeholder 输入提示
   *
   * @default 请输入关键字搜索
   */
  placeholder: stringType(),
  /**
   * 是否在输入框聚焦时触发搜索
   *
   * @default false
   */
  searchOnFocus: booleanType(false),
  /**
   * 选择完一个之后是否清空搜索项重新搜索
   *
   * @default false
   */
  resetAfterSelect: booleanType(false),
  /**
   * 自定义前缀
   *
   * @ignore
   */
  prefixCls: stringType(),
  /** 刷新数据 */
  fetchData: functionType<(keyWord?: string) => void>(),
  /** 清空数据 */
  resetData: functionType(),
  /**
   * 当搜索关键词发生变化时是否请求远程数据
   *
   * @default true
   */
  fetchDataOnSearch: booleanType(true),
  /** 默认搜索关键词 */
  defaultSearchValue: stringType()
}

export type SearchSelectProps = Partial<
  ExtractPropTypes<typeof searchSelectProps>
>

const SearchSelect = defineComponent({
  name: 'SearchSelect',
  inheritAttrs: false,
  props: {
    ...searchSelectProps
  },
  setup(props, { expose, attrs }) {
    const { searchValue: propsSearchValue, defaultSearchValue } = props

    const [searchValue, setSearchValue] = useState<string | undefined>(
      propsSearchValue ?? defaultSearchValue
    )

    const selectRef = ref()

    watchPostEffect(() => {
      if (props.autofocus) {
        selectRef?.value?.focus?.()
      }
    })

    watchPostEffect(() => {
      if (props.searchValue) {
        setSearchValue(props.searchValue)
      }
    })

    const { prefixCls } = useConfigInject('pro-filed-search-select', props)

    expose({
      selectRef
    })

    return () => {
      const {
        optionItemRender,
        mode,
        onSearch,
        onFocus,
        onChange,
        autoClearSearchValue = true,
        searchOnFocus = false,
        resetAfterSelect = false,
        fetchDataOnSearch = true,
        optionFilterProp = 'label',
        optionLabelProp = 'label',
        disabled,
        options,
        fetchData,
        resetData,
        onClear,
        showSearch,
        fieldNames,
        ...restProps
      } = props
      const {
        label: labelPropsName = 'label',
        value: valuePropsName = 'value',
        options: optionsPropsName = 'options'
      } = fieldNames || {}

      // 兼容 renderXXX API。

      const classString = classNames(prefixCls.value, attrs.class, {
        [`${prefixCls.value}-disabled`]: disabled
      })

      const getMergeValue = (value: any, option: any) => {
        if (Array.isArray(value) && value.length > 0) {
          // 多选情况且用户有选择
          return value.map((item, index) => {
            const optionItem = option?.[index]
            const dataItem = optionItem?.['data-item'] || {}
            return {
              ...dataItem,
              ...item
            }
          })
        }
        return []
      }

      const renderOptions = (mapOptions: RequestOptionsType[]) => {
        return mapOptions.map((item) => {
          const {
            disabled: itemDisable,
            className: itemClassName,
            optionType
          } = item as RequestOptionsType

          const label = item[labelPropsName]
          const value = item[valuePropsName]
          const itemOptions = item[optionsPropsName] ?? []

          if (optionType === 'optGroup' || item.options) {
            return (
              <OptGroup key={value} label={label}>
                {renderOptions(itemOptions)}
              </OptGroup>
            )
          }

          return (
            <Option
              {...item}
              value={value!}
              key={value || label?.toString()}
              disabled={itemDisable}
              data-item={item}
              className={`${prefixCls.value}-option ${itemClassName || ''}`}
              label={label}
            >
              {optionItemRender?.(item as any) || label}
            </Option>
          )
        })
      }

      return (
        <Select
          {...attrs}
          {...restProps}
          ref={selectRef}
          class={classString}
          autoClearSearchValue={autoClearSearchValue}
          disabled={disabled}
          mode={mode}
          showSearch={showSearch}
          {...({
            searchValue: searchValue?.value,
            allowClear: true
          } as any)}
          optionFilterProp={optionFilterProp}
          optionLabelProp={optionLabelProp}
          onClear={() => {
            onClear?.()
            fetchData(undefined)
            if (showSearch) {
              setSearchValue(undefined)
            }
          }}
          {...omit(restProps, ['onUpdate:value'])}
          onSearch={
            showSearch
              ? (value) => {
                  if (fetchDataOnSearch) {
                    fetchData(value)
                  }
                  onSearch?.(value)
                  setSearchValue(value)
                }
              : undefined
          }
          onChange={(value: any, optionList: any, ...rest) => {
            // 将搜索框置空 和 antd 行为保持一致
            if (showSearch && autoClearSearchValue) {
              fetchData(undefined)
              onSearch?.('')
              setSearchValue(undefined)
            }

            if (!props.labelInValue) {
              onChange?.(value, optionList, ...rest)
              return
            }

            if (mode !== 'multiple') {
              // 单选情况且用户选择了选项
              const dataItem = optionList && optionList['data-item']
              // 如果value值为空则是清空时产生的回调,直接传值就可以了
              if (!value || !dataItem) {
                onChange?.(value, optionList, ...rest)
              } else {
                onChange?.({ ...value, ...dataItem }, optionList, ...rest)
              }
              return
            }
            // 合并值
            const mergeValue = getMergeValue(value, optionList) as any
            onChange?.(mergeValue, optionList, ...rest)

            // 将搜索结果置空，重新搜索
            if (resetAfterSelect) resetData?.()
          }}
          onFocus={(e) => {
            if (searchOnFocus) {
              fetchData(searchValue.value)
            }
            onFocus?.(e)
          }}
        >
          {renderOptions(options || [])}
        </Select>
      )
    }
  }
})

export default SearchSelect
