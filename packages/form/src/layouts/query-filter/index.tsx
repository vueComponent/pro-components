import type { ExtractPropTypes, VNode, VNodeChild } from 'vue'
import { cloneVNode, computed, defineComponent, shallowRef, toRef } from 'vue'
import type { FormProps } from 'ant-design-vue'
import {
  anyType,
  booleanType,
  classNames,
  functionType,
  isValidElement,
  numberType,
  objectType,
  omit,
  pick,
  someType,
  stringType
} from '@v-c/utils'
import { formProps } from 'ant-design-vue/es/form'
import {
  useConfigInject,
  useIntl,
  useProProviderContext
} from '@ant-design-vue/pro-provider'
import { isBrowser, useMergedState } from '@ant-design-vue/pro-utils'
import { Col, Form, Row } from 'ant-design-vue'
import { useElementSize } from '@vueuse/core'
import { BaseForm, commonFormProps } from '../../base-form'
import { exposeBaseFormInstance, exposeFormInstance } from '../../field-context'
import Actions, { actionsProps } from './actions'

import { useStyle } from './style'

const CONFIG_SPAN_BREAKPOINTS = {
  xs: 513,
  sm: 513,
  md: 785,
  lg: 992,
  xl: 1057,
  xxl: Infinity
}
/** 配置表单列变化的容器宽度断点 */
const BREAKPOINTS = {
  vertical: [
    // [breakpoint, cols, layout]
    [513, 1, 'vertical'],
    [785, 2, 'vertical'],
    [1057, 3, 'vertical'],
    [Infinity, 4, 'vertical']
  ],
  default: [
    [513, 1, 'vertical'],
    [701, 2, 'vertical'],
    [1062, 3, 'horizontal'],
    [1352, 3, 'horizontal'],
    [Infinity, 4, 'horizontal']
  ]
}

/**
 * 合并用户和默认的配置
 *
 * @param layout
 * @param width
 * @param span
 */
const getSpanConfig = (
  layout: FormProps['layout'],
  width: number,
  span?: SpanConfig
): { span: number; layout: FormProps['layout'] } => {
  if (span && typeof span === 'number') {
    return {
      span,
      layout
    }
  }

  const spanConfig = span
    ? ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map((key) => [
        CONFIG_SPAN_BREAKPOINTS[key as keyof typeof CONFIG_SPAN_BREAKPOINTS],
        24 / (span as any)[key],
        'horizontal'
      ])
    : (BREAKPOINTS as any)[layout || 'default']

  const breakPoint = (spanConfig || BREAKPOINTS.default).find(
    (item: [number, number, FormProps['layout']]) => width < item[0] + 16 // 16 = 2 * (ant-row -8px margin)
  )
  return {
    span: 24 / breakPoint[1],
    layout: breakPoint[2]
  }
}

export type SpanConfig =
  | number
  | {
      xs: number
      sm: number
      md: number
      lg: number
      xl: number
      xxl: number
    }

export const baseQueryFilterProps = {
  ...omit(actionsProps, ['submitter', 'setCollapsed', 'isForm']),
  defaultCollapsed: booleanType(),
  /**
   * @name layout 的布局设置
   * @type 'horizontal' | 'inline' | 'vertical';
   */
  layout: someType<FormProps['layout']>([String]),
  /**
   * @name 默认一行显示几个表单项
   */
  defaultColsNumber: numberType(),
  /**
   * @name 文字标签的宽度
   *
   * @example 文字标签宽 80 ，一般用于只有两个字
   * labelWidth={80}
   * @example 文字标签宽 140 ，一般用于有四个字
   * labelWidth={140}
   * @example 自动计算，会导致不整齐
   * labelWidth="auto"
   */
  labelWidth: someType<string | 'auto'>([String, Number]),
  /**
   * @name 每一行之前要不要有分割线
   * @description 只有在 `layout` 为 `vertical` 时生效
   */
  split: booleanType(),
  /**
   * @name 配置列数，一般而言是 8 的倍数
   *
   * @example 配置一行4个
   * span={6}
   *
   * @example 配置一行3个
   * span={6}
   *
   * @example 根据屏幕宽度配置
   * span={xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 6}
   * */
  span: someType<SpanConfig>([Number, Object]),
  /**
   * @name 查询按钮的文本
   *  */
  searchText: stringType(),
  /**
   * @name 重置按钮的文本
   */
  resetText: stringType(),
  /**
   * @name 查询表单栅格间隔
   *
   * @example searchGutter={24}
   * */
  searchGutter: numberType(),
  form: anyType(),
  /**
   * @param searchConfig 基础的配置
   * @param props 更加详细的配置 {
   *     type?: 'form' | 'list' | 'table' | 'cardList' | undefined;
   *     form: FormInstance;
   *     submit: () => void;
   *     collapse: boolean;
   *     setCollapse: (collapse: boolean) => void;
   *     showCollapseButton: boolean; }
   * @name 底部操作栏的 render
   *
   *
   * @example 增加一个清空按钮
   * optionRender={(searchConfig, props, dom) =>[ <a key="clear">清空</a>,...dom]}
   *
   * @example 增自定义提交
   *
   * optionRender={(searchConfig) => [<a key="submit" onClick={()=> searchConfig?.form?.submit()}>提交</a>]}
   */
  optionRender: someType<
    ((searchConfig: any, props: any, dom: VNodeChild[]) => VNodeChild[]) | false
  >([Function, Boolean]),
  /**
   * @name 忽略 Form.Item rule规则配置
   */
  ignoreRules: booleanType(),
  /**
   * @name 是否显示 collapse 隐藏个数
   */
  showHiddenNum: booleanType(),
  // submitterColSpanProps 是一个可选属性，类型为一个对象。
  // 该对象使用 Omit 泛型去除了 ColProps 中的 'span' 属性，并新增了一个 'span' 属性，类型为 number 类型。
  // 也就是说，submitterColSpanProps 对象除了 'span' 属性外，还可以包含 ColProps 中的其他所有属性。
  submitterColSpanProps: someType([Object]),
  preserve: booleanType()
}

export type BaseQueryFilterContentProps = Partial<
  ExtractPropTypes<typeof baseQueryFilterProps>
>

const flatMapItems = (
  items: VNodeChild[],
  ignoreRules?: boolean
): VNodeChild[] => {
  // TODO
  return items.map((item) => {
    // if (item?.type.displayName === 'ProForm-Group' && !item.props?.title) {
    //   return item.props.children;
    // }
    if (ignoreRules && isValidElement(item)) {
      return cloneVNode(item as VNode, {
        ...(item as any).props,
        formItemProps: {
          ...(item as any).props?.formItemProps,
          rules: []
        }
      })
    }
    return item
  })
}

export type BaseQueryFilterProps = Partial<
  ExtractPropTypes<typeof baseQueryFilterProps>
>

export const queryFilterProps = {
  ...omit(formProps(), ['onFinish']),
  ...commonFormProps,
  ...baseQueryFilterProps,
  onReset: functionType<(values: any) => void>()
}

const queryFilterContentProps = {
  ...pick(queryFilterProps, [
    'defaultCollapsed',
    'resetText',
    'searchText',
    'searchGutter',
    'split',
    'showHiddenNum',
    'ignoreRules',
    'collapseRender',
    'onCollapse',
    'collapsed',
    'submitter',
    'submitterColSpanProps',
    'optionRender',
    'form'
  ]),
  items: someType<VNodeChild[]>([Array]),
  showLength: numberType(),
  spanSize: objectType<{
    span: number
    layout: FormProps['layout']
  }>(),
  baseClassName: stringType(),
  preserve: booleanType()
}

const QueryFilterContent = defineComponent({
  name: 'QueryFilterContent',
  inheritAttrs: false,
  props: {
    ...queryFilterContentProps
  },
  setup(props) {
    const intl = useIntl()
    const { hashId } = useProProviderContext()
    const context = useConfigInject('', props)
    const resetText = computed(
      () => props.resetText || intl.value.getMessage('tableForm.reset', '重置')
    )

    const searchText = computed(() => {
      return (
        props.searchText || intl.value.getMessage('tableForm.search', '搜索')
      )
    })

    const [collapsed, setCollapsed] = useMergedState<boolean>(
      () => props.defaultCollapsed && !!props.submitter,
      {
        value: toRef(props, 'collapsed'),
        onChange: props.onCollapse
      }
    )
    return () => {
      const {
        optionRender,
        collapseRender,
        split,
        items,
        spanSize,
        showLength,
        searchGutter,
        showHiddenNum
      } = props
      const submitterFunc = () => {
        if (!props.submitter || optionRender === false) {
          return null
        }
        return cloneVNode((props as any).submitter, {
          searchConfig: {
            resetText: resetText.value,
            submitText: searchText.value
          },
          render: optionRender
            ? (_: any, dom: VNodeChild[]) =>
                optionRender(
                  {
                    ...props,
                    resetText: resetText.value,
                    searchText: searchText.value
                  },
                  props,
                  dom
                )
            : optionRender,
          ...(props as any).submitter.props
        })
      }
      const submitter = submitterFunc()

      // totalSpan 统计控件占的位置，计算 offset 保证查询按钮在最后一列
      let totalSpan = 0
      let itemLength = 0
      // 首个表单项是否占满第一行
      let firstRowFull = false
      // totalSize 统计控件占的份数
      let totalSize = 0

      // for split compute
      let currentSpan = 0

      // 处理过，包含是否需要隐藏的 数组
      const processedList = flatMapItems(items, props.ignoreRules).map(
        (
          item: any,
          index
        ): { itemDom: VNodeChild; hidden: boolean; colSpan: number } => {
          // 如果 formItem 自己配置了 hidden，默认使用它自己的
          const colSize = isValidElement(item)
            ? (item as any)?.props?.colSize ?? 1
            : 1
          const colSpan = Math.min(spanSize.span * (colSize || 1), 24)
          // 计算总的 totalSpan 长度
          totalSpan += colSpan
          // 计算总的 colSize 长度
          totalSize += colSize

          if (index === 0) {
            firstRowFull = colSpan === 24 && !(item as VNode)?.props?.hidden
          }

          const hidden: boolean =
            (item as VNode)?.props?.hidden ||
            // 如果收起了
            (collapsed.value &&
              (firstRowFull ||
                // 如果 超过显示长度 且 总长度超过了 24
                totalSize > showLength - 1) &&
              !!index &&
              totalSpan >= 24)

          itemLength += 1

          const itemKey =
            (isValidElement(item) &&
              (item.key || `${(item.props as Record<string, any>)?.name}`)) ||
            index

          if (isValidElement(item) && hidden) {
            if (!props.preserve) {
              return {
                itemDom: null,
                colSpan: 0,
                hidden: true
              }
            }
            return {
              itemDom: cloneVNode(item, {
                hidden: true,
                key: itemKey || index
              } as Record<string, any>),
              hidden: true,
              colSpan
            }
          }

          return {
            itemDom: item,
            colSpan,
            hidden: false
          }
        }
      )

      const doms = processedList.map((itemProps, index: number) => {
        const { itemDom, colSpan } = itemProps
        const hidden: boolean = (itemDom as VNode)?.props?.hidden

        if (hidden) return itemDom

        // 每一列的key, 一般是存在的
        const itemKey =
          (isValidElement(itemDom) &&
            ((itemDom as any).key || `${(itemDom as any).props?.name}`)) ||
          index

        if (24 - (currentSpan % 24) < colSpan) {
          // 如果当前行空余位置放不下，那么折行
          totalSpan += 24 - (currentSpan % 24)
          currentSpan += 24 - (currentSpan % 24)
        }

        currentSpan += colSpan

        if (split && currentSpan % 24 === 0 && index < itemLength - 1) {
          return (
            <Col
              key={itemKey}
              span={colSpan}
              class={`${props.baseClassName}-row-split-line ${props.baseClassName}-row-split ${hashId.value}`.trim()}
            >
              {itemDom}
            </Col>
          )
        }

        return (
          <Col
            key={itemKey}
            class={`${props.baseClassName}-row-split ${hashId.value}`.trim()}
            span={colSpan}
          >
            {itemDom}
          </Col>
        )
      })
      const hiddenNum =
        showHiddenNum && processedList.filter((item) => item.hidden).length

      /** 是否需要展示 collapseRender */
      const needCollapseRender = !(totalSpan < 24 || totalSize <= showLength)

      const offset = (() => {
        const offsetSpan =
          (currentSpan % 24) +
          ((props as any).submitterColSpanProps?.span ?? spanSize.span)
        if (offsetSpan > 24) {
          return (
            24 - ((props as any).submitterColSpanProps?.span ?? spanSize.span)
          )
        }
        return 24 - offsetSpan
      })()

      const baseClassName = context.getPrefixCls('pro-query-filter')
      return (
        <Row
          gutter={searchGutter}
          justify="start"
          class={classNames(`${baseClassName}-row`, hashId.value)}
          key="resize-observer-row"
        >
          {doms}
          {submitter && (
            <Col
              key="submitter"
              span={spanSize.span}
              offset={offset}
              class={classNames((props as any).submitterColSpanProps?.class)}
              {...(props as any).submitterColSpanProps}
              style={{
                textAlign: 'end'
              }}
            >
              <Form.Item
                colon={false}
                class={`${baseClassName}-actions ${hashId.value}`.trim()}
                v-slots={{
                  label() {
                    return <>&nbsp;</>
                  }
                }}
              >
                <Actions
                  hiddenNum={hiddenNum}
                  key="pro-form-query-filter-actions"
                  collapsed={collapsed.value}
                  collapseRender={needCollapseRender ? collapseRender : false}
                  submitter={submitter as any}
                  setCollapsed={setCollapsed}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      )
    }
  }
})

const defaultWidth = isBrowser() ? document?.body?.clientWidth : 1024

const QueryFilter = defineComponent({
  name: 'QueryFilter',
  inheritAttrs: false,
  props: {
    ...queryFilterProps
  },
  setup(props, { attrs, slots, expose }) {
    const context = useConfigInject('', props)
    const baseClassName = context.getPrefixCls('pro-query-filter')
    const baseFormRef = shallowRef()
    const { wrapSSR, hashId } = useStyle(baseClassName)

    const defaultW = (
      typeof (attrs as any).style?.width === 'number'
        ? (attrs as any).style?.width
        : defaultWidth
    ) as number
    const { width } = useElementSize(baseFormRef, {
      width: defaultW,
      height: 0
    })
    const spanSize = computed(() =>
      getSpanConfig(props.layout, width.value + 16, props.span)
    )
    const showLength = computed(() => {
      // 查询重置按钮也会占一个spanSize格子，需要减掉计算
      if (props.defaultColsNumber !== undefined) {
        return props.defaultColsNumber - 1
      }
      return Math.max(1, 24 / spanSize.value.span - 1)
    })
    /** 计算最大宽度防止溢出换行 */
    const formItemFixStyle = computed(() => {
      const { labelWidth = '80' } = props

      if (
        labelWidth &&
        spanSize.value.layout !== 'vertical' &&
        labelWidth !== 'auto'
      ) {
        return {
          labelCol: {
            flex: `0 0 ${labelWidth}px`
          },
          wrapperCol: {
            style: {
              maxWidth: `calc(100% - ${labelWidth}px)`
            }
          },
          style: {
            flexWrap: 'nowrap'
          }
        }
      }
      return undefined
    })
    // 导出
    expose({
      ...exposeFormInstance(baseFormRef),
      ...exposeBaseFormInstance(baseFormRef)
    })
    return () => {
      const {
        collapsed: controlCollapsed,
        defaultCollapsed = true,
        searchGutter = 24,
        optionRender,
        collapseRender,
        onReset,
        onCollapse,
        split,
        ignoreRules,
        showHiddenNum = false,
        submitterColSpanProps,
        preserve = true,
        ...rest
      } = props
      return wrapSSR(
        <BaseForm
          {...rest}
          ref={baseFormRef}
          class={classNames(baseClassName, hashId.value, attrs.class)}
          onReset={onReset}
          style={attrs.style}
          layout={spanSize.value.layout}
          fieldProps={{
            style: {
              width: '100%'
            }
          }}
          formItemProps={formItemFixStyle.value}
          groupProps={{
            titleStyle: {
              display: 'inline-block',
              marginInlineEnd: 16
            }
          }}
          v-slots={slots}
          contentRender={(items, renderSubmitter, form) => (
            <QueryFilterContent
              spanSize={spanSize.value}
              collapsed={controlCollapsed}
              form={form}
              submitterColSpanProps={submitterColSpanProps}
              collapseRender={collapseRender}
              defaultCollapsed={defaultCollapsed}
              onCollapse={onCollapse}
              optionRender={optionRender}
              submitter={renderSubmitter as any}
              items={items as any}
              split={split}
              baseClassName={baseClassName}
              resetText={props.resetText}
              searchText={props.searchText}
              searchGutter={searchGutter}
              preserve={preserve}
              ignoreRules={ignoreRules}
              showLength={showLength.value}
              showHiddenNum={showHiddenNum}
            />
          )}
        />
      )
    }
  }
})

export default QueryFilter
