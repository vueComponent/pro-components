const proFieldProps = `valueType request plain renderFormItem render text formItemProps valueEnum`;

const proFormProps = `fieldProps isDefaultDom groupProps contentRender submitterProps submitter`;

const pickProProps = (
  props: Record<string, any>
): {
  [key: string]: any;
} => {
  const propList = `${proFieldProps} ${proFormProps}`.split(/[\s\n]+/);

  const attrs: {
    [key: string]: any;
  } = {};
  Object.keys(props || {}).forEach((key) => {
    if (propList.includes(key)) {
      return;
    }
    attrs[key] = props[key];
  });
  return attrs;
};

export default pickProProps;
