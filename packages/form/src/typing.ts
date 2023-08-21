import {
  type ProFieldProps,
  type ProFieldValueType,
  type SearchConvertKeyFn,
  proSchemaProps
} from '@ant-design-vue/pro-utils'
import {
  anyType,
  booleanType,
  eventType,
  functionType,
  numberType,
  objectType,
  omit,
  pick,
  someType,
  stringType,
  vNodeType
} from '@v-c/utils'
import type {
  ColProps,
  FormInstance,
  FormItemProps,
  RowProps,
  SpaceProps
} from 'ant-design-vue'
import type { CSSProperties, ExtractPropTypes, VNodeChild } from 'vue'
import { proFormItemProps } from './components/form-item'

export interface ProFormGridConfig {
  /**
   * open grid layout
   * @default false
   */
  grid?: boolean
  /**
   * only works when grid is enabled
   *
   * When passing the `span` attribute, the default value is empty
   * @default
   * { xs: 24 }
   */
  colProps?: ColProps
  /**
   * only works when grid is enabled
   * @default
   * { gutter: 8 }
   */
  rowProps?: RowProps
}

export const proFormGridConfig = {
  grid: booleanType(),
  colProps: someType<ProFormGridConfig['colProps']>([Object]),
  rowProps: someType<ProFormGridConfig['rowProps']>([Object])
}

export const fieldProps = {
  width: stringType(),
  style: anyType()
}

export type LightFilterFooterRender =
  | ((
      /**
       * @name 确认选择的值
       */
      onConfirm?: (e?: MouseEvent) => void,
      /**
       * @name 清除选择
       */
      onClear?: (e?: MouseEvent) => void
    ) => JSX.Element | false)
  | false
export type FieldProps = Partial<ExtractPropTypes<typeof fieldProps>>

export const extendsProps = {
  secondary: booleanType(),
  allowClear: booleanType(),
  bordered: booleanType(),
  colSize: numberType(),
  /**
   * 需要与 request 配合使用
   *
   * @name 网络请求用的输出，会触发reload
   */
  params: someType<
    ((form: FormInstance) => Record<string, any>) | Record<string, any>
  >([Function, Object]),
  /** @name 需要放在formItem 时使用 */
  ignoreFormItem: booleanType(),
  /**
   * 实验性质，可能 api 会有改动，谨慎使用
   *
   * @name 只读模式
   */
  readonly: booleanType(),
  /**
   * @name 获取时转化值，一般用于将数据格式化为组件接收的格式
   */
  convertValue: functionType<SearchConvertKeyFn>(),
  /**
   * 给 protable 开的口子
   *
   * @name 自定义的 formItemProps
   */
  formItemProps: objectType<FormItemProps>(),
  /** 给自定义组件行为开的口子 */
  fieldConfig: objectType<ProFormItemCreateConfig>(),
  // 给proForm添加fieldRef,用来获取暴露的方法
  fieldRef: objectType()
}

export type ExtendsProps = Partial<ExtractPropTypes<typeof extendsProps>>

export const groupProps = {
  ...proFormGridConfig,
  /**
   * @name 分组的标题
   */
  title: vNodeType(),
  /**
   * @name 分组的标题
   * @deprecated 尽量用 title
   */
  label: vNodeType(),
  /**
   * @name 标题旁边的？号提示展示的信息
   *
   * @example 自定义提示信息
   * <ProForm.Group title="标题"  tooltip="自定义提示信息">
   *  @example 自定义Icon
   * <ProForm.Group title="标题"  tooltip={{icon:<Info/>,title:自定义提示信息}}>
   */
  tooltip: someType<Record<string, any> | string>([Object, String]),
  /**
   * @name 额外的内容配置,在标题的另外一边
   *
   * @example 额外的内容配置
   * <ProForm.Group title="标题" extra={<ProFormSwitch name="open"/>} />
   */
  extra: vNodeType(),
  /**
   * @name 组件之前的间隔
   */
  size: someType<SpaceProps['size']>([String, Number, Array]),
  /**
   * @name 自定义 title 样式
   * @example 增加背景颜色
   * <ProForm.Group titleStyle={{ backgroundColor: '#f0f0f0' }} />
   */
  titleStyle: anyType<CSSProperties>(),
  /**
   * @name 自定义title
   * @example 自定义标题
   * <ProForm.Group title={(_,props)=><span>自定义标题</span>}>
   */
  titleRender: vNodeType<(text: VNodeChild, props: any) => VNodeChild>(),
  /** 子项的对齐方式 */
  align: someType<SpaceProps['align']>([String]),
  spaceProps: someType<SpaceProps>([Object]),
  /**
   * @name 子项的排列方式
   */
  direction: someType<SpaceProps['direction']>([String]),
  /**
   * @name 布局方式，键值对模式和两行模式
   * @default inline
   */
  labelLayout: stringType<'inline' | 'twoLine'>(),
  /**
   * @name 是否折叠
   */
  collapsed: booleanType(),
  /**
   * @name 是否可折叠
   */
  collapsible: booleanType(),
  /**
   * @name 默认的折叠状态
   *  */
  defaultCollapsed: booleanType(),
  /**
   * @name 折叠修改的事件
   *  */
  onCollapse: eventType<(collapsed: boolean) => void>(),
  'onUpdate:collapsed': eventType<(collapsed: boolean) => void>(),
  /**
   * @name 自定选中一个input，只能有一个生效
   */
  autoFocus: booleanType()
}
export type GroupProps = Partial<ExtractPropTypes<typeof groupProps>>

export const proFormItemCreateConfig = {
  ...proFormItemProps,
  /** 自定义类型 */
  valueType: stringType<ProFieldValueType>(),
  /** 自定义 lightMode */
  customLightMode: booleanType(),
  /** Light mode 自定义的 label 模式 */
  lightFilterLabelFormatter: functionType<(value: any) => string>(),
  /** 默认的props，如果用户设置会被覆盖 */
  defaultProps: objectType(),
  /** @name 不使用默认的宽度 */
  ignoreWidth: booleanType(),
  valuePropName: stringType<string>('value')
}

export type ProFormItemCreateConfig = Partial<
  ExtractPropTypes<typeof proFormItemCreateConfig>
>

export const proFormFieldItemProps = {
  ...omit(proFormItemProps, ['valueType']),
  ...pick(proFormGridConfig, ['colProps']),
  ...extendsProps,
  /**
   * @name 设置到控件上的属性
   *
   * @example 设置select 多选
   * <ProFormSelect fieldProps={{mode:"multiple"}} />
   * @example 设置select 多选
   * <ProFormText fieldProps={{placeholder:"请输入！"}} />
   */
  fieldProps: objectType<FieldProps>(),
  /**
   * @name 输入的描述，没有值的时候展示
   */
  placeholder: someType<string | string[]>([String, Array]),
  /**
   * @name 是否是次要控件，只针对 LightFilter 下有效
   */
  secondary: booleanType(),
  /**
   * @name 是否使用 swr 来缓存 缓存可能导致数据更新不及时，请谨慎使用，尤其是页面中多个组件 name 相同
   *
   * @default false
   */
  cacheForSwr: booleanType(false),
  /**
   * @name disabled=true 时控件不可用
   */
  disabled: booleanType(),
  /**
   * @type auto 使用组件默认的宽度
   * @type xs=104px 适用于短数字、短文本或选项。
   * @type sm=216px 适用于较短字段录入、如姓名、电话、ID 等。
   * @type md=328px 标准宽度，适用于大部分字段长度。
   * @type lg=440px 适用于较长字段录入，如长网址、标签组、文件路径等。
   * @type xl=552px 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
   */
  width: someType<number | 'sm' | 'md' | 'xl' | 'xs' | 'lg'>([Number, String]),
  /**
   * @name 设置到 ProField 上面的 Props，内部属性
   */
  proFieldProps: objectType<ProFieldProps>(),
  /**
   * @name QueryFilter 上的footer
   *
   * @example 自定义清除按钮
   * footerRender={(onConfirm,onClear)=>{ return <Button onClick={onClear}>清除</Button> }}
   */
  footerRender: functionType<LightFilterFooterRender>()
}

export type ProFormFieldItemProps = Partial<
  ExtractPropTypes<typeof proFormFieldItemProps>
>

export const proFormFieldRemoteProps = pick(proSchemaProps(), [
  'debounceTime',
  'request',
  'valueEnum',
  'params'
])
