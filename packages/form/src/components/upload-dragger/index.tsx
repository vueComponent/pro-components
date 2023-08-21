import {
  eventType,
  filterEmpty,
  numberType,
  omit,
  pick,
  someType,
  vNodeType
} from '@v-c/utils'
import type { UploadProps } from 'ant-design-vue'
import { uploadProps } from 'ant-design-vue/es/upload/interface'
import { defineComponent } from 'vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import { useConfigInject } from '@ant-design-vue/pro-provider'
import { Upload } from 'ant-design-vue'
import { proFormFieldItemProps } from '../../typing'
import { useFormContextInject } from '../../base-form/context'
import { createField } from '../../base-form/create-field'
const pickerUploadProps = pick(uploadProps(), ['onChange', 'action', 'accept'])

export const proFormUploadDraggerProps = {
  ...proFormFieldItemProps,
  ...pickerUploadProps,
  /**
   * @name  上传文件块的图标
   * @default UploadOutlined
   *
   * @example 改成笑脸图标  icon={<SmileOutlined/>}
   */
  icon: vNodeType(),
  /**
   * @name 上传文件块的标题
   * @default 单击或拖动文件到此区域进行上传
   *
   * @example  title="上传"
   * @example  title={<div>上传</div>}
   */
  title: vNodeType(),
  /**
   * @name 上传文件块的说明，比标题小一点，但是字数可以更多
   * @default 支持单次或批量上传
   *
   * @example  description="支持xxx文件"
   * @example  description={<div>支持xxx文件</div>}
   */
  description: vNodeType(),
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
  'onUpdate:value': eventType<(fileList: UploadProps['fileList']) => void>()
}
/**
 * 拖动上传组件
 *
 * @param
 */
const BaseProFormUploadDragger = defineComponent({
  name: 'BaseProFormUploadDragger',
  inheritAttrs: false,
  props: {
    ...proFormUploadDraggerProps
  },
  setup(props, { slots }) {
    const context = useConfigInject('', props)
    const modeContext = useFormContextInject()
    return () => {
      const {
        fieldProps,
        title = '单击或拖动文件到此区域进行上传',
        icon = <InboxOutlined />,
        description = '支持单次或批量上传',
        action,
        accept,
        onChange,
        value,
        max,
        proFieldProps
      } = props
      const children = filterEmpty(slots.default?.())

      const mode = proFieldProps?.mode || modeContext.mode.value || 'edit'

      const baseClassName = context.getPrefixCls('upload')
      // 如果配置了 max ，并且 超过了文件列表的大小，就不展示按钮
      const showUploadButton =
        (max === undefined || !value || value?.length < max) &&
        mode !== 'read' &&
        proFieldProps?.readonly !== true

      return (
        <Upload.Dragger
          name="files"
          action={action}
          accept={accept}
          fileList={value}
          v-slots={slots}
          {...{
            ...omit(fieldProps as any, [
              'onChange',
              'onUpdate:value',
              'onUpdate:fileList'
            ]),
            'onUpdate:fileList': (fileList: UploadProps['fileList']) => {
              if ((fieldProps as any)?.['onUpdate:value']) {
                ;(fieldProps as any)?.['onUpdate:value'](fileList)
              }
              props?.['onUpdate:value']?.(fileList)
            }
          }}
          onChange={(info: any) => {
            onChange?.(info)
            if ((fieldProps as any)?.onChange) {
              ;(fieldProps as any)?.onChange(info)
            }
          }}
          style={{
            ...fieldProps?.style,
            display: !showUploadButton ? 'none' : undefined
          }}
        >
          <p class={`${baseClassName}-drag-icon`}>{icon}</p>
          <p class={`${baseClassName}-text`}>{title}</p>
          <p class={`${baseClassName}-hint`}>{description}</p>
          {children.length > 0 ? (
            <div
              class={`${baseClassName}-extra`}
              style={{
                padding: 16
              }}
            >
              {children}
            </div>
          ) : null}
        </Upload.Dragger>
      )
    }
  }
})

const ProFormUploadDragger = createField(BaseProFormUploadDragger as any, {
  getValueFromEvent: (value: { fileList: UploadProps['fileList'] }) =>
    value.fileList
})
export default ProFormUploadDragger
