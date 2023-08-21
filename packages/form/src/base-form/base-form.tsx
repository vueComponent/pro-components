import {
  classNames,
  filterEmpty,
  getArr as get,
  isArray,
  isBoolean,
  isObject,
  set as namePathSet,
  omit,
  runEvent,
  set
} from '@v-c/utils'
import type { FormInstance } from 'ant-design-vue/es/form'
import {
  computed,
  defineComponent,
  isVNode,
  onMounted,
  ref,
  shallowRef
} from 'vue'
import { Form } from 'ant-design-vue'
import type { NamePath } from '@ant-design-vue/pro-utils'
import {
  conversionMomentValue,
  nanoid,
  transformKeySubmitValue,
  useStyle
} from '@ant-design-vue/pro-utils'
import useConfigInject from 'ant-design-vue/es/config-provider/hooks/useConfigInject'
import Submitter from '../components/submitter'
import { RowWrapper } from '../helpers'
import { FieldContext, exposeFormInstance } from '../field-context'
import { useFormContextProvide } from './context'
import { baseFormProps, commonBaseFormProps } from './typing'
/**
 * It takes a name path and converts it to an array.
 * @param {NamePath} name - The name of the form.
 * @returns string[]
 *
 * a-> [a]
 * [a] -> [a]
 */
const covertFormName = (name?: NamePath) => {
  if (!name) return name
  if (Array.isArray(name)) return name
  return [name]
}

const BaseForm = defineComponent({
  name: 'BaseForm',
  inheritAttrs: false,
  props: {
    ...baseFormProps
  },
  setup(props, { slots, attrs, expose }) {
    const formRef = shallowRef<FormInstance>()
    const fieldsValueType = ref<Record<string, any>>({})
    /** 保存 transformKeyRef，用于对表单key transform */
    const transformKeyRef = ref<Record<string, any>>({})
    const { prefixCls } = useConfigInject('pro-form', props)
    const modelValue = ref<Record<string, any>>({})
    const curFormKey = ref<string>(nanoid())
    const transformKey = (
      values: any,
      paramsOmitNil: boolean,
      parentKey?: NamePath
    ) => {
      return transformKeySubmitValue(
        conversionMomentValue(
          values,
          props.dateFormatter,
          fieldsValueType.value,
          paramsOmitNil,
          parentKey
        ),
        transformKeyRef.value,
        paramsOmitNil
      )
    }
    const onChangeValue = (namePath: NamePath, value: any) => {
      // 修改某一行的值
      const names = (covertFormName(namePath) as any[]) ?? []
      let obj: Record<string, any> = modelValue.value
      for (const name of names) {
        const val = names[name]
        if (isObject(val) || isArray(val)) {
          obj = val
        } else {
          obj[name] = value
          break
        }
      }
    }
    const exposeProFormMethods = {
      /**
       * 获取被 ProForm 格式化后的所有数据
       * @param allData boolean
       * @returns T
       *
       * @example  getFieldsFormatValue(true) ->返回所有数据，即使没有被 form 托管的
       */
      getFieldsFormatValue: (allData?: true) => {
        return transformKey(
          formRef.value?.getFieldsValue(allData),
          props.omitNil
        )
      },
      /**
       * 获取被 ProForm 格式化后的单个数据
       * @param nameList (string|number)[]
       * @returns T
       *
       * @example {a:{b:value}} -> getFieldFormatValue(['a', 'b']) -> value
       */
      /** 获取格式化之后的单个数据 */
      getFieldFormatValue: (paramsNameList: NamePath = []) => {
        const nameList = covertFormName(paramsNameList)
        if (!nameList) throw new Error('nameList is require')
        const value = formRef.value?.getFieldsValue([nameList as any])
        const obj = nameList ? set({}, nameList as string[], value) : value
        return get(
          transformKey(obj, props.omitNil, nameList),
          nameList as string[]
        )
      },
      /**
       * 获取被 ProForm 格式化后的单个数据, 包含他的 name
       * @param nameList (string|number)[]
       * @returns T
       *
       * @example  {a:{b:value}} -> getFieldFormatValueObject(['a', 'b']) -> {a:{b:value}}
       */
      /** 获取格式化之后的单个数据 */
      getFieldFormatValueObject: (paramsNameList?: NamePath) => {
        const nameList = covertFormName(paramsNameList)
        const value = formRef.value?.getFieldsValue([nameList] as any)
        const obj = nameList ? set({}, nameList as string[], value) : value
        return transformKey(obj, props.omitNil, nameList)
      },
      /**
       /**
       *验字段后返回格式化之后的所有数据
       * @param nameList (string|number)[]
       * @returns T
       *
       * @example validateFieldsReturnFormatValue -> {a:{b:value}}
       */
      validateFieldsReturnFormatValue: async (nameList?: NamePath[]) => {
        if (!Array.isArray(nameList) && nameList)
          throw new Error('nameList must be array')
        const values = await formRef.value?.validateFields(nameList)
        const transformedKey = transformKey(values, props.omitNil)
        return transformedKey || {}
      }
    }
    const loading = ref(false)
    const getPopupContainer = computed(() => {
      if (typeof window === 'undefined') return undefined
      // 如果在 drawerForm 和  modalForm 里就渲染dom到父节点里
      // modalForm 可能高度太小不适合
      if (
        props.formComponentType &&
        ['DrawerForm'].includes(props.formComponentType)
      ) {
        return (e: HTMLElement) => e.parentNode || document.body
      }
      return undefined
    })
    const setLoading = (value: boolean) => {
      props?.onLoadingChange?.(value)
      props?.['onUpdate:loading']?.(value)
      loading.value = value
    }
    const onLoadData = async () => {
      if (!props.request) return
      setLoading(true)
      try {
        const data = await props.request?.(props.params, props)
        if (data) {
          modelValue.value = data
        }
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    }

    onMounted(async () => {
      await onLoadData()
      props?.onInit?.(
        props?.request ? modelValue.value : props.model,
        formRef.value
      )
    })
    const { wrapSSR } = useStyle('ProForm', (token) => {
      return {
        [`.${prefixCls}`]: {
          [`> div:not(${token.proComponentsCls}-form-light-filter)`]: {
            '.pro-field': {
              maxWidth: '100%',
              // 适用于短数字，短文本或者选项
              '&-xs': {
                width: 104
              },
              '&-s': {
                width: 216
              },
              // 适用于较短字段录入、如姓名、电话、ID 等。
              '&-sm': {
                width: 216
              },
              '&-m': {
                width: 328
              },
              // 标准宽度，适用于大部分字段长度
              '&-md': {
                width: 328
              },
              '&-l': {
                width: 440
              },
              // 适用于较长字段录入，如长网址、标签组、文件路径等。
              '&-lg': {
                width: 440
              },
              // 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
              '&-xl': {
                width: 552
              }
            }
          }
        }
      }
    })
    const onFinish = async () => {
      // 如果不存在onFinish就不需要执行
      if (!props?.onFinish) return
      // 防止重复提交
      if (loading.value) return
      setLoading(true)
      try {
        const finalValues = exposeProFormMethods.getFieldsFormatValue()
        await props?.onFinish?.(finalValues)
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    }
    useFormContextProvide(
      {
        formRef,
        modelValue,
        onChangeValue
      },
      props
    )
    expose({
      ...exposeFormInstance(formRef),
      ...exposeProFormMethods
    })
    return () => {
      const {
        submitter,
        onReset,
        grid,
        autoFocusFirstInput = true,
        contentRender,
        request
      } = props
      const isLoading = props?.loading ?? loading.value
      const children = filterEmpty(slots.default?.())

      const items = children?.map((item: any, index) => {
        if (index === 0 && isVNode(item) && autoFocusFirstInput && item.props) {
          item.props.autoFocus = true
        }
        return item
      })
      // 提交按钮配置
      const submitterProps = isBoolean(submitter) || !submitter ? {} : submitter
      let submitterNode
      if (submitter !== false) {
        submitterNode = (
          <Submitter
            key="submitter"
            {...submitterProps}
            onReset={() => {
              submitterProps?.onReset?.()
              runEvent(onReset)
            }}
            submitButtonProps={{
              loading: isLoading,
              ...submitterProps.submitButtonProps
            }}
          />
        )
      }

      const wrapperItems = grid ? <RowWrapper>{items}</RowWrapper> : items
      let content
      if (contentRender) {
        content = contentRender(wrapperItems, submitterNode, formRef.value!)
      } else {
        content = wrapperItems
      }

      const formPropsOmitKeys = [
        ...Object.keys(commonBaseFormProps),
        'onFinish',
        'model'
      ]
      const formProps = {
        ...omit(props, formPropsOmitKeys as any),
        autoComplete: 'off',
        model: request ? modelValue.value : props.model
      }
      return wrapSSR(
        <Form
          ref={formRef}
          {...{ ...formProps, autoComplete: 'off' }}
          class={classNames(attrs.class, prefixCls.value)}
          onFinish={onFinish}
        >
          <FieldContext
            value={{
              formRef: formRef.value as any,
              fieldProps: props.fieldProps,
              proFieldProps: props.proFieldProps,
              formItemProps: props.formItemProps,
              groupProps: props.groupProps,
              formKey: curFormKey.value,
              getPopupContainer: getPopupContainer.value,
              setFieldValueType: (
                name,
                { valueType = 'text', dateFormat, transform }
              ) => {
                if (!isArray(name)) return
                transformKeyRef.value = namePathSet(
                  transformKeyRef.value,
                  name,
                  transform
                )
                fieldsValueType.value = namePathSet(
                  fieldsValueType.value,
                  name,
                  {
                    valueType,
                    dateFormat
                  }
                )
              }
            }}
          >
            {content}
          </FieldContext>
        </Form>
      )
    }
  }
})

export { BaseForm }
