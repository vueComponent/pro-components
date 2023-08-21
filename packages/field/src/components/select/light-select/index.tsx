import { anyType, classNames, stringType, toArray, useState } from '@v-c/utils'
import { computed, defineComponent, onMounted, reactive, shallowRef } from 'vue'
import { selectProps } from 'ant-design-vue/es/select'
import { useConfigInject } from '@ant-design-vue/pro-provider'
import { FieldLabel, useStyle } from '@ant-design-vue/pro-utils'
import { Input, Select } from 'ant-design-vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { proFieldLightProps } from '../../../typing'

export const lightSelectProps = {
  ...proFieldLightProps,
  label: stringType(),
  placeholder: anyType()
}

/**
 * 如果有 label 就优先使用 label
 *
 * @param valueMap
 * @param v
 */
const getValueOrLabel = (
  valueMap: Record<string, string>,
  v:
    | {
        label: string
        value: string
      }
    | string
) => {
  if (typeof v !== 'object') {
    return valueMap[v] || v
  }
  return valueMap[v?.value] || v.label
}

const LightSelect = defineComponent({
  name: 'LightSelect',
  inheritAttrs: false,
  props: {
    ...selectProps(),
    ...lightSelectProps
  },
  setup(props, { attrs, expose }) {
    const { prefixCls } = useConfigInject(
      'pro-field-select-light-select',
      props
    )

    const [open, setOpen] = useState<boolean>(false)
    const [keyword, setKeyword] = useState<string>('')

    const { wrapSSR, hashId } = useStyle('LightSelect', (token) => {
      return {
        [`.${prefixCls.value}`]: {
          [`${token.antCls}-select`]: {
            position: 'absolute',
            width: '153px',
            height: '28px',
            visibility: 'hidden',
            '&-selector': {
              height: 28
            }
          },

          [`&.${prefixCls.value}-searchable`]: {
            [`${token.antCls}-select`]: {
              width: '200px',
              '&-selector': {
                height: 28
              }
            }
          }
        }
      }
    })

    const valueMap = computed(() => {
      const {
        label: labelPropsName = 'label',
        value: valuePropsName = 'value'
      } = props?.fieldNames || {}
      const values: Record<string, any> = {}
      props?.options?.forEach((item) => {
        const optionLabel = item[labelPropsName]
        const optionValue = item[valuePropsName]
        values[optionValue] = optionLabel || optionValue
      })
      return values
    })

    const lightLabel = shallowRef()
    const instance = reactive({})
    onMounted(() => {
      if (lightLabel.value) {
        Object.assign(instance, lightLabel.value)
      }
    })
    expose(instance)
    return () => {
      const {
        label,
        prefixCls: customizePrefixCls,
        onChange,
        value,
        mode,
        // defaultValue,
        size,
        showSearch,
        disabled,
        bordered,
        options,
        onSearch,
        allowClear,
        labelInValue,
        // lightLabel,
        labelTrigger,
        optionFilterProp,
        fieldNames,
        ...restProps
      } = props
      const { placeholder = label } = props

      const {
        label: labelPropsName = 'label',
        value: valuePropsName = 'value'
      } = fieldNames || {}
      const cls = classNames(
        prefixCls.value,
        hashId.value,
        {
          [`${prefixCls.value}-searchable`]: showSearch
        },
        `${prefixCls.value}-container-${restProps.placement}`,
        attrs.class
      )

      const filterValue = Array.isArray(value)
        ? value.map((v) => getValueOrLabel(valueMap.value, v as any))
        : getValueOrLabel(valueMap.value, value as any)

      return wrapSSR(
        <div
          style={attrs.style as any}
          class={cls}
          onClick={(e) => {
            if (disabled) return
            // 点击label切换下拉菜单
            const isLabelClick = lightLabel.value?.labelRef?.contains(
              e.target as HTMLElement
            )

            if (isLabelClick) {
              setOpen(!open.value)
            } else {
              setOpen(true)
            }
          }}
        >
          <Select
            {...attrs}
            {...restProps}
            allowClear={allowClear}
            value={value}
            mode={mode}
            labelInValue={labelInValue}
            size={size}
            disabled={disabled}
            onChange={(v, option) => {
              onChange?.(v, option)
              if (mode !== 'multiple') {
                setOpen(false)
              }
            }}
            bordered={bordered}
            showSearch={showSearch}
            onSearch={onSearch}
            style={attrs.style as any}
            v-slots={{
              dropdownRender: ({ menuNode }: any) => {
                return (
                  <div>
                    {showSearch && (
                      <div style={{ margin: '4px 8px' }}>
                        <Input
                          value={keyword.value}
                          allowClear={allowClear}
                          onChange={(e: any) => {
                            setKeyword(e.target.value)
                            onSearch?.(e.target.value)
                          }}
                          {...{
                            onKeydown: (e: any) => {
                              // 避免按下删除键把选项也删除了
                              e.stopPropagation()
                            }
                          }}
                          style={{ width: '100%' }}
                          v-slots={{
                            prefix: () => <SearchOutlined />
                          }}
                        />
                      </div>
                    )}
                    {menuNode}
                  </div>
                )
              }
            }}
            open={open.value}
            onDropdownVisibleChange={(isOpen) => {
              if (!isOpen) {
                //  测试环境下直接跑
                setKeyword('')
              }
              if (!labelTrigger) {
                setOpen(isOpen)
              }
              restProps?.onDropdownVisibleChange?.(isOpen)
            }}
            prefixCls={customizePrefixCls}
            options={
              onSearch || !keyword.value
                ? options
                : options?.filter((o) => {
                    if (optionFilterProp) {
                      return toArray(o[optionFilterProp])
                        .join('')
                        .toLowerCase()
                        .includes(keyword.value)
                    }
                    return (
                      String(o[labelPropsName])
                        ?.toLowerCase()
                        ?.includes(keyword.value?.toLowerCase()) ||
                      o[valuePropsName]
                        ?.toString()
                        ?.toLowerCase()
                        ?.includes(keyword.value?.toLowerCase())
                    )
                  })
            }
          />
          <FieldLabel
            ellipsis
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            bordered={bordered}
            allowClear={allowClear}
            value={filterValue || (value as any)?.label || value}
            onClear={() => {
              onChange?.(undefined, undefined as any)
              props?.['onUpdate:value']?.(undefined)
            }}
            ref={lightLabel}
          />
        </div>
      )
    }
  }
})

export default LightSelect
