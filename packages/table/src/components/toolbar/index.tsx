import type { VNodeChild } from 'vue'
import { computed, defineComponent } from 'vue'
import {
  anyType,
  arrayType,
  booleanType,
  classNames,
  eventType,
  pick,
  someType,
  stringType,
  vNodeType
} from '@v-c/utils'
import { useProTableContext } from '../../context'
import { proTableProps } from '../../typing'
import { useStyle } from './style'
export interface ListToolBarSetting {
  icon: VNodeChild
  tooltip?: Record<string, any> | string
  key?: string
  onClick?: (key?: string) => void
}
type SearchProps = any
type SearchPropType =
  | (SearchProps & {
      onSearch: (searchValue: string) => Promise<false | void> | false | void
    })
  | VNodeChild
  | boolean

type SettingPropType = VNodeChild | ListToolBarSetting

export const listToolBarProps = {
  // prefixCls?: string;
  prefixCls: stringType(),
  /** 标题 */
  title: vNodeType(),
  /** 副标题 */
  subTitle: vNodeType(),
  /** 标题提示 */
  tooltip: someType([String, Object]),
  /** 搜索输入栏相关配置 */
  search: anyType<SearchPropType>(),
  /** 搜索回调 */
  onSearch: eventType<(keyWords: string) => void>(),
  /** 工具栏右侧操作区 */
  actions: vNodeType(),
  /** 工作栏右侧设置区 */
  settings: arrayType<SettingPropType[]>(),
  /** 是否多行展示 */
  multipleLine: booleanType(),
  /** 过滤区，通常配合 LightFilter 使用 */
  filter: vNodeType(),
  /** 标签页配置，仅当 `multipleLine` 为 true 时有效 */
  tabs: anyType(),
  /** 菜单配置 */
  menu: anyType()
}

export const Toolbar = defineComponent({
  name: 'Toolbar',
  inheritAttrs: false,
  props: {
    ...pick(proTableProps, ['toolBarRender'])
  },
  setup(_) {
    const { proTableProps } = useProTableContext()
    const prefixCls = computed(
      () => `${proTableProps.defaultClassName}-list-toolbar`
    )
    const { wrapSSR, hashId } = useStyle(prefixCls.value)

    return () => {
      const cls = classNames(hashId.value, {
        [prefixCls.value]: true
      })

      const titleNode = () => {
        return (
          <div class={[`${prefixCls.value}-title`, hashId.value]}>高级表格</div>
        )
      }
      return wrapSSR(
        <div class={cls}>
          <div class={[`${prefixCls.value}-container`, hashId.value]}>
            <div class={[`${prefixCls.value}-left`, hashId.value]}>
              {titleNode()}
            </div>
            <div class={[`${prefixCls.value}-right`, hashId.value]}>右侧</div>
          </div>
        </div>
      )
    }
  }
})
