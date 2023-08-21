import { defineComponent, ref } from 'vue'
import { anyType, omit, stringType, vNodeType } from '@v-c/utils'
import { Segmented, Spin } from 'ant-design-vue'
import { segmentedProps } from 'ant-design-vue/es/segmented/src/segmented'
import { proFieldFC } from '../../typing'
import { ObjToMap, proFieldParsingText, useFieldFetchData } from '../select'

const FieldSegmented = defineComponent({
  name: 'FieldSegmented',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      ...segmentedProps(),
      value: anyType(),
      text: stringType(),
      emptyText: vNodeType()
    })
  },
  setup(props, { slots, attrs, expose }) {
    const inputRef = ref<HTMLInputElement>()
    const [loading, options, fetchData] = useFieldFetchData(props as any, attrs)

    expose({
      inputRef,
      fetchData: (keyWord: string) => fetchData(keyWord)
    })
    return () => {
      const {
        mode,
        render,
        renderFormItem,
        fieldProps,
        emptyText = '-',
        ...rest
      } = props
      if (loading.value) {
        return <Spin size="small" />
      }

      if (mode === 'read') {
        const optionsValueEnum = options.value?.length
          ? options.value?.reduce((pre: any, cur) => {
              return { ...pre, [(cur.value as any) ?? '']: cur.label }
            }, {})
          : undefined

        const dom = (
          <>
            {proFieldParsingText(
              rest.text,
              ObjToMap(rest.valueEnum || optionsValueEnum)
            )}
          </>
        )

        if (render) {
          return (
            render(rest.text, { mode, ...rest, ...fieldProps }, <>{dom}</>) ??
            emptyText
          )
        }
        return dom
      }

      if (mode === 'edit' || mode === 'update') {
        const dom = (
          <Segmented
            ref={inputRef}
            {...{
              ...rest,
              ...(omit(fieldProps || {}, ['allowClear']) as any)
            }}
            options={options.value}
            v-slots={slots}
          />
        )

        if (renderFormItem) {
          return renderFormItem(
            rest.text,
            { mode, ...rest, ...fieldProps, options: options.value },
            dom,
            slots
          )
        }
        return dom
      }
      return null
    }
  }
})

export default FieldSegmented
