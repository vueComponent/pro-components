import type {
  ProFieldRequestData,
  RequestOptionsType
} from '@ant-design-vue/pro-utils'
import {
  useDeepCompareEffect,
  useMountMergeState,
  useStyle
} from '@ant-design-vue/pro-utils'
import {
  anyType,
  arrayType,
  booleanType,
  functionType,
  numberType,
  omit,
  pick,
  stringType,
  useState
} from '@v-c/utils'
import type { ExtractPropTypes, Ref, VNodeChild } from 'vue'
import {
  Fragment,
  computed,
  createVNode,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRef,
  watchPostEffect
} from 'vue'
import { Space, Spin } from 'ant-design-vue'
import { selectProps } from 'ant-design-vue/es/select'
import { useConfigInject, useIntl } from '@ant-design-vue/pro-provider'
import { useAsyncState } from '@vueuse/core'
import { proFieldFC, proFieldLightProps } from '../../typing'
import type {
  ProFieldValueEnumType,
  ProSchemaValueEnumMap,
  ProSchemaValueEnumObj
} from '../../typing'
import type { ProFieldStatusType } from '../status'
import TableStatus, { ProFieldBadgeColor } from '../status'
import LightSelect from './light-select'
import SearchSelect from './search-select'

type SelectOptionType = Partial<RequestOptionsType>[]

/**
 * 获取类型的 type
 *
 * @param obj
 */
function getType(obj: any) {
  // @ts-expect-error this is
  const type = Object.prototype.toString
    .call(obj)
    .match(/^\[object (.*)\]$/)[1]
    .toLowerCase()
  if (type === 'string' && typeof obj === 'object') return 'object' // Let "new String('')" return 'object'
  if (obj === null) return 'null' // PhantomJS has type "DOMWindow" for null
  if (obj === undefined) return 'undefined' // PhantomJS has type "DOMWindow" for undefined
  return type
}

export const fieldSelectProps = {
  ...proFieldLightProps,
  text: stringType(),
  /** 值的枚举，如果存在枚举，Search 中会生成 select */
  valueEnum: anyType<ProFieldValueEnumType>(),
  /** 防抖动时间 默认10 单位ms */
  debounceTime: numberType(10),
  /** 从服务器读取选项 */
  request: functionType<ProFieldRequestData>(),
  /** 重新触发的时机 */
  params: anyType(),
  /** 组件的全局设置 */
  fieldProps: anyType(),

  bordered: booleanType(),
  id: stringType()
}

export type FieldSelectProps = Partial<
  ExtractPropTypes<typeof fieldSelectProps>
>
export const ObjToMap = (
  value: ProFieldValueEnumType | undefined
): ProSchemaValueEnumMap => {
  if (getType(value) === 'map') {
    return value as ProSchemaValueEnumMap
  }
  return new Map(Object.entries(value || {}))
}

/**
 * 转化 text 和 valueEnum 通过 type 来添加 Status
 *
 * @param text
 * @param valueEnum
 * @param pure 纯净模式，不增加 status
 */
export const proFieldParsingText = (
  text: string | number | (string | number)[],
  valueEnumParams: ProFieldValueEnumType,
  key?: number | string
): VNodeChild => {
  if (Array.isArray(text)) {
    return (
      <Space key={key} {...{ split: ',' }} size={2} wrap>
        {text.map((value, index) =>
          proFieldParsingText(value, valueEnumParams, index)
        )}
      </Space>
    )
  }

  const valueEnum = ObjToMap(valueEnumParams)

  if (!valueEnum.has(text) && !valueEnum.has(`${text}`)) {
    // @ts-expect-error this is ts
    return text?.label || text
  }

  const domText = (valueEnum.get(text) || valueEnum.get(`${text}`)) as {
    text: VNodeChild
    status: ProFieldStatusType
    color?: string
  }

  if (!domText) {
    // @ts-expect-error this is ts
    return <Fragment key={key}>{text?.label || text}</Fragment>
  }

  const { status, color } = domText

  const Status = TableStatus[status || 'Init']
  // 如果类型存在优先使用类型
  if (Status) {
    return <Status key={key}>{domText.text}</Status>
  }

  // 如果不存在使用颜色
  if (color) {
    return (
      <ProFieldBadgeColor key={key} color={color}>
        {domText.text}
      </ProFieldBadgeColor>
    )
  }
  // 什么都没有使用 text
  return <Fragment key={key}>{domText.text || domText}</Fragment>
}

const Highlight = defineComponent({
  props: {
    label: stringType(),
    words: arrayType<string[]>()
  },
  setup(props) {
    const { getPrefixCls, prefixCls } = useConfigInject(
      'pro-select-item-option-content',
      props
    )
    const lightCls = computed(() => getPrefixCls('light'))
    const optionCls = computed(() => prefixCls.value)

    const { wrapSSR } = useStyle('HightLight', (token) => {
      return {
        [`.${lightCls.value}`]: {
          color: token.colorPrimary
        },
        [`.${optionCls.value}`]: {
          flex: 'auto',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }
      }
    })

    return () => {
      const { words, label } = props
      const matchKeywordsRE = new RegExp(
        words
          .map((word) => word.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'))
          .join('|'),
        'gi'
      )

      let matchText = label

      const elements: VNodeChild[] = []

      while (matchText.length) {
        const match = matchKeywordsRE.exec(matchText)
        if (!match) {
          elements.push(matchText)
          break
        }

        const start = match.index
        const matchLength = match[0].length + start

        elements.push(
          matchText.slice(0, start),
          createVNode(
            'span',
            {
              className: lightCls
            },
            matchText.slice(start, matchLength)
          )
        )
        matchText = matchText.slice(matchLength)
      }
      return wrapSSR(
        <div title={label} class={optionCls.value}>
          {elements}
        </div>
      )
    }
  }
})

/**
 * 递归筛选 item
 *
 * @param item
 * @param keyWords
 * @returns
 */
function filerByItem(
  item: {
    label: string
    value: string
    optionType: string
    children: any[]
    options: any[]
  },
  keyWords?: string
) {
  if (!keyWords) return true
  if (
    item?.label?.toString().toLowerCase().includes(keyWords.toLowerCase()) ||
    item?.value?.toString().toLowerCase().includes(keyWords.toLowerCase())
  ) {
    return true
  }
  if (item.children || item.options) {
    const findItem = [...(item.children || []), item.options || []].find(
      (mapItem) => {
        return filerByItem(mapItem, keyWords)
      }
    )
    if (findItem) return true
  }
  return false
}

/**
 * 把 value 的枚举转化为数组
 *
 * @param valueEnum
 */
export const proFieldParsingValueEnumToArray = (
  valueEnumParams: ProFieldValueEnumType
): SelectOptionType => {
  const enumArray: Partial<
    RequestOptionsType & {
      text: string
      /** 是否禁用 */
      disabled?: boolean
    }
  >[] = []
  const valueEnum = ObjToMap(valueEnumParams)

  valueEnum.forEach((_, key) => {
    const value = (valueEnum.get(key) || valueEnum.get(`${key}`)) as {
      text: string
      disabled?: boolean
    }

    if (!value) {
      return
    }

    if (typeof value === 'object' && value?.text) {
      enumArray.push({
        text: value?.text as unknown as string,
        value: key,
        label: value?.text as unknown as string,
        disabled: value.disabled
      })
      return
    }
    enumArray.push({
      text: value as unknown as string,
      value: key
    })
  })
  return enumArray
}

export const useFieldFetchData = (
  props: ReturnType<typeof selectProps> &
    FieldSelectProps & {
      proFieldKey?: any
      defaultKeyWords?: string
      cacheForSwr?: boolean
    },
  attrs: any
): [
  Ref<boolean>,
  Ref<SelectOptionType>,
  (fetchKeyWords?: string) => void,
  () => void
] => {
  const fieldProps = toRef(props, 'fieldProps')
  const [keyWords, setKeyWords] = useState<string | undefined>(
    props.defaultKeyWords
  )

  const getOptionsFormValueEnum = (coverValueEnum: ProFieldValueEnumType) => {
    return proFieldParsingValueEnumToArray(ObjToMap(coverValueEnum)).map(
      ({ value, text, ...rest }) => ({
        label: text,
        value,
        key: value,
        ...rest
      })
    )
  }

  const defaultOptions = computed(() => {
    if (!props.fieldProps) return undefined
    const data =
      fieldProps.value?.options ||
      fieldProps.value?.treeData ||
      props?.options ||
      attrs?.treeData

    if (!data) return undefined
    const { children, label, value } = props?.fieldProps.fieldNames || {}

    const traverseFieldKey = (
      _options: any,
      type: 'children' | 'label' | 'value'
    ) => {
      if (!_options?.length) return
      const length = _options.length
      let i = 0
      while (i < length) {
        const cur = _options[i++]
        if (cur[children] || cur[label] || cur[value]) {
          cur[type] =
            cur[
              type === 'children' ? children : type === 'label' ? label : value
            ]
          traverseFieldKey(cur[children], type)
        }
      }
    }
    if (children) traverseFieldKey(data, 'children')
    if (label) traverseFieldKey(data, 'label')
    if (value) traverseFieldKey(data, 'value')
    return data
  })

  const [options, setOptions] = useMountMergeState<SelectOptionType>(
    () => {
      if (props.valueEnum) {
        return getOptionsFormValueEnum(props.valueEnum)
      }
      return []
    },
    {
      value: defaultOptions
    }
  )

  useDeepCompareEffect(() => {
    // 优先使用 fieldProps?.options
    if (
      !props.valueEnum ||
      props.fieldProps?.options ||
      props.fieldProps?.treeData
    )
      return
    setOptions(getOptionsFormValueEnum(props.valueEnum))
  }, [toRef(props, 'valueEnum')])

  const { state: data, isLoading } = useAsyncState(async () => {
    if (!props.request) {
      return null
    }
    return props.request?.(
      {
        ...props?.params,
        keyWords: keyWords.value
      },
      props
    )
  }, [])

  const resOptions = computed(() => {
    const opt = options.value?.map((item) => {
      if (typeof item === 'string') {
        return {
          label: item,
          value: item
        }
      }
      if (item.children || item.options) {
        const childrenOptions = [
          ...(item.children || []),
          ...(item.options || [])
        ].filter((mapItem) => {
          return filerByItem(mapItem, keyWords.value)
        })
        return {
          ...item,
          children: childrenOptions,
          options: childrenOptions
        }
      }
      return item
    })
    // filterOption 为 true 时 filter数据, filterOption 默认为true
    if (
      props.fieldProps?.filterOption === true ||
      props.fieldProps?.filterOption === undefined
    ) {
      return opt?.filter((item) => {
        if (!item) return false
        if (!keyWords) return true
        return filerByItem(item as any, keyWords.value)
      })
    }

    return opt
  })
  return [
    isLoading,
    props.request ? (data as Ref<SelectOptionType>) : resOptions,
    (fetchKeyWords?: string) => {
      setKeyWords(fetchKeyWords)
    },
    () => {
      setKeyWords(undefined)
      data.value = []
    }
  ]
}

/**
 * 可以根据 valueEnum 来进行类型的设置
 *
 * @param
 */
const FieldSelect = defineComponent({
  name: 'FieldSelect',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      ...pick(selectProps(), ['fieldNames', 'options', 'onUpdate:value']),
      ...fieldSelectProps,
      defaultKeyWords: stringType()
    })
  },
  setup(props, { attrs, expose }) {
    const inputRef = ref()
    const intl = useIntl()
    const keyWordsRef = ref('')
    const [loading, options, fetchData, resetData] = useFieldFetchData(
      props as any,
      attrs
    )

    watchPostEffect(() => {
      if (props.fieldProps?.searchValue) {
        keyWordsRef.value = props.fieldProps?.searchValue
      }
    })
    const { size: compSize } = useConfigInject('', props)
    const componentSize = computed(() => {
      return compSize?.value ?? 'middle'
    })
    const inputReactive = reactive<Record<string, any>>({})
    onMounted(() => {
      if (inputRef.value) {
        Object.assign(inputReactive, inputRef.value)
      }
      inputReactive.fetchData = (keyWords: string) => {
        fetchData(keyWords)
      }
    })
    expose(inputReactive)

    const optionsValueEnum = computed(() => {
      if (props.mode !== 'read') return
      const {
        label: labelPropsName = 'label',
        value: valuePropsName = 'value',
        options: optionsPropsName = 'options'
      } = props?.fieldProps?.fieldNames || {}

      const valuesMap = new Map()

      const traverseOptions = (_options: any) => {
        if (!_options?.length) {
          return valuesMap
        }
        const length = _options.length
        let i = 0
        while (i < length) {
          const cur = _options[i++]
          valuesMap.set(cur[valuePropsName], cur[labelPropsName])
          traverseOptions(cur[optionsPropsName])
        }
        return valuesMap
      }

      return traverseOptions(options)
    })
    return () => {
      const {
        mode,
        valueEnum,
        render,
        renderFormItem,
        fieldProps,
        light,
        label,
        bordered,
        id,
        lightLabel,
        labelTrigger,
        ...rest
      } = props

      if (mode === 'read') {
        const dom = (
          <>
            {proFieldParsingText(
              rest.text,
              ObjToMap(
                valueEnum || optionsValueEnum
              ) as unknown as ProSchemaValueEnumObj
            )}
          </>
        )

        if (render) {
          return render(rest.text, { mode, ...fieldProps }, dom) ?? null
        }
        return dom
      }
      const restProps = {
        ...attrs,
        ...rest,
        ...pick(fieldProps, ['onUpdate:value'])
      }
      if (mode === 'edit' || mode === 'update') {
        const renderDom = () => {
          if (light) {
            return (
              <LightSelect
                {...restProps}
                bordered={bordered}
                id={id}
                loading={loading.value}
                ref={inputRef}
                allowClear
                size={componentSize.value}
                options={options.value as any}
                label={label}
                placeholder={intl.value.getMessage(
                  'tableForm.selectPlaceholder',
                  '请选择'
                )}
                lightLabel={lightLabel}
                labelTrigger={labelTrigger}
                {...omit(fieldProps, ['onUpdate:value'])}
              />
            )
          }

          return (
            <SearchSelect
              {...restProps}
              key="SearchSelect"
              class={attrs.className}
              style={[
                {
                  minWidth: 100
                },
                attrs.style
              ]}
              bordered={bordered}
              id={id}
              loading={loading.value}
              ref={inputRef}
              allowClear
              defaultSearchValue={props.defaultKeyWords}
              notFoundContent={
                loading.value ? (
                  <Spin size="small" />
                ) : (
                  fieldProps?.notFoundContent
                )
              }
              fetchData={(keyWord) => {
                keyWordsRef.value = keyWord ?? ''
                fetchData(keyWord)
              }}
              resetData={resetData}
              optionItemRender={(item) => {
                if (typeof item.label === 'string' && keyWordsRef.value) {
                  return (
                    <Highlight label={item.label} words={[keyWordsRef.value]} />
                  )
                }
                return item.label
              }}
              placeholder={intl.value.getMessage(
                'tableForm.selectPlaceholder',
                '请选择'
              )}
              {...{
                label
              }}
              options={options.value}
              {...omit(fieldProps, ['onUpdate:value'])}
            />
          )
        }
        const dom = renderDom()
        if (renderFormItem) {
          return (
            renderFormItem(
              rest.text,
              { mode, ...fieldProps, options: options.value },
              dom
            ) ?? null
          )
        }
        return dom
      }
    }
  }
})

export default FieldSelect
