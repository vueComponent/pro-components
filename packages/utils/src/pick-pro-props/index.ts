const proFieldProps = `valueType request plain renderFormItem render text formItemProps valueEnum`

const proFormProps = `fieldProps isDefaultDom groupProps contentRender submitterProps submitter`

export function pickProProps(props: Record<string, any>) {
  const propList = `${proFieldProps} ${proFormProps}`.split(/[\s\n]+/)

  const attrs = {}
  Object.keys(props || {}).forEach((key) => {
    if (propList.includes(key)) {
      return
    }
    ;(attrs as any)[key] = props[key]
  })
  return attrs
}
