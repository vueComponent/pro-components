import {
  booleanType,
  eventType,
  numberType,
  objectType,
  omit,
  pick,
  someType,
  vNodeType
} from '@v-c/utils'
import type { UploadProps } from 'ant-design-vue/es/upload/interface'
import { uploadProps } from 'ant-design-vue/es/upload/interface'
import { computed, defineComponent } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { Button, Upload } from 'ant-design-vue'
import { useFormContextInject } from '../../base-form/context'
import { proFormFieldItemProps } from '../../typing'
import { createField } from '../../base-form/create-field'

const pickUploadProps = pick(uploadProps(), [
  'listType',
  'action',
  'accept',
  'fileList',
  'onChange'
])

export const proFormUploadButtonProps = {
  ...proFormFieldItemProps,
  ...pickUploadProps,
  /**
   * @name  上传文件的图标
   * @default UploadOutlined
   *
   * @example 改成笑脸图标  icon={<SmileOutlined/>}
   */
  icon: vNodeType(),
  /**
   * @name 按钮文字
   * @default 单击上传
   *
   * @example  title="上传"
   * @example  title={<div>上传</div>}
   */
  title: vNodeType(),
  /**
   * @name 最大的文件数量，到达数量之后上传按钮会失效
   *
   * @example max=2
   */
  max: numberType(),

  /**
   * @name 上传组件的 fileList，为了配合form，改成了这个名字
   * @default []
   *
   * example:value={ [{uid: '-1', name: 'xxx.png', status: 'done', url: 'http://www.baidu.com/xxx.png'}] }
   */
  value: someType<UploadProps['fileList']>([Array]),
  'onUpdate:value': eventType<(fileList: UploadProps['fileList']) => void>(),
  /**
   * @name 上传按钮的配置
   *
   * @example 按钮修改为主色 buttonProps={{ type:"primary" }}
   */
  buttonProps: objectType(),

  /**
   * @name 是否禁用按钮
   * @example  disabled={true}
   */
  disabled: booleanType()
}

/**
 * 上传按钮组件
 *
 * @param
 */
const BaseProFormUploadButton = defineComponent({
  name: 'BaseProFormUploadButton',
  inheritAttrs: false,
  props: {
    ...proFormUploadButtonProps
  },
  setup(props, { slots }) {
    const value = computed(() => props?.fileList ?? props.value)
    const modeContext = useFormContextInject()
    return () => {
      const {
        fieldProps,
        action,
        accept,
        listType,
        title = '单击上传',
        max,
        icon = <UploadOutlined />,
        buttonProps,
        onChange,
        disabled,
        proFieldProps
      } = props

      const mode = proFieldProps?.mode || modeContext.mode.value || 'edit'

      // 如果配置了 max ，并且 超过了文件列表的大小，就不展示按钮
      const showUploadButton =
        (max === undefined || !value.value || value.value?.length < max) &&
        mode !== 'read'

      const isPictureCard =
        (listType ?? (fieldProps as any)?.listType) === 'picture-card'
      const onUploadChange = (info: UploadProps['fileList']) => {
        props?.['onUpdate:value']?.(info)
        ;(fieldProps as any)?.['onUpdate:fileList']?.(info)
      }
      return (
        <Upload
          action={action}
          accept={accept}
          listType={listType || 'picture'}
          fileList={value.value}
          v-slots={slots}
          {...{
            ...omit(fieldProps as any, [
              'onChange',
              'onUpdate:value',
              'onUpdate:fileList'
            ]),
            'onUpdate:fileList': onUploadChange
          }}
          name={(fieldProps as any)?.name ?? 'file'}
          onChange={(info: any) => {
            onChange?.(info)
            ;(fieldProps as any)?.onChange?.(info)
          }}
        >
          {showUploadButton &&
            (isPictureCard ? (
              <span>
                {icon} {title}
              </span>
            ) : (
              <Button
                disabled={disabled || (fieldProps as any)?.disabled}
                {...buttonProps}
              >
                {icon}
                {title}
              </Button>
            ))}
        </Upload>
      )
    }
  }
})

const ProFormUploadButton = createField(BaseProFormUploadButton as any, {
  getValueFromEvent: (value: { fileList: UploadProps['fileList'] }) =>
    value.fileList
})

export default ProFormUploadButton
