import {
  defineComponent,
  resolveComponent,
  computed,
  watchEffect,
  withCtx,
  getCurrentInstance,
  isVNode,
  type ComputedRef,
  type VNodeChild,
  type VNode,
  type PropType,
  type ExtractPropTypes,
  type ConcreteComponent,
  type FunctionalComponent,
  type ComponentInternalInstance,
} from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { Menu } from 'ant-design-vue'
import { defaultSettingProps, defaultSettings } from '../../defaultSettings'
import { isImg, isUrl } from '../../utils'
import type {
  SelectEventHandler,
  MenuClickEventHandler,
  SelectInfo,
  MenuInfo,
} from 'ant-design-vue/es/menu/src/interface'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { MenuMode } from './typings'
import type { MenuDataItem, MenuTheme, FormatMessage, LayoutType, WithFalse } from '../../typings'
import type { MenuItemRender, SubMenuItemRender } from '../../RenderTypings'

import 'ant-design-vue/es/menu/style'
import './index.less'

export function useRootSubmenuKeys(menus: MenuDataItem[]): ComputedRef<string[]> {
  return computed(() => menus.map((it) => it.path))
}

// vue props
export const baseMenuProps = {
  ...defaultSettingProps,
  prefixCls: {
    type: String as PropType<string | undefined>,
    default: () => 'ant-pro',
  },
  locale: {
    type: [Function, Boolean] as PropType<WithFalse<FormatMessage>>,
    default: (t: string): string => t,
  },
  menuData: {
    type: Array as PropType<MenuDataItem[]>,
    default: () => [],
  },
  // top-nav-header: horizontal
  mode: {
    type: String as PropType<MenuMode>,
    default: 'inline',
  },
  theme: {
    type: String as PropType<MenuTheme | 'realDark'>,
    default: 'dark',
  },
  layout: {
    type: String as PropType<LayoutType>,
    default: 'side',
  },
  collapsed: {
    type: Boolean as PropType<boolean | undefined>,
    default: () => false,
  },
  openKeys: {
    type: Array as PropType<WithFalse<string[]>>,
    default: () => undefined,
  },
  selectedKeys: {
    type: Array as PropType<WithFalse<string[]>>,
    default: () => undefined,
  },
  menuProps: {
    type: Object as PropType<Record<string, any>>,
    default: () => null,
  },
  menuItemRender: {
    type: [Object, Function, Boolean] as PropType<MenuItemRender>,
    default: () => undefined,
  },
  subMenuItemRender: {
    type: [Object, Function, Boolean] as PropType<SubMenuItemRender>,
    default: () => undefined,
  },

  onClick: [Function, Object] as PropType<(...args: any) => void>,
}

export type BaseMenuProps = ExtractPropTypes<typeof baseMenuProps>

let IconFont = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl,
})

const LazyIcon: FunctionalComponent<{
  icon: VNodeChild | string
  iconPrefixes?: string
  prefixCls?: string
}> = (props) => {
  const { icon, iconPrefixes = 'icon-', prefixCls = 'ant-pro' } = props
  if (!icon) {
    return null
  }
  if (typeof icon === 'string' && icon !== '') {
    if (isUrl(icon) || isImg(icon)) {
      return <img src={icon} alt="icon" class={`${prefixCls}-sider-menu-icon`} />
    }
    if (icon.startsWith(iconPrefixes)) {
      return <IconFont type={icon} />
    }
  }
  if (isVNode(icon)) {
    return icon
  }
  const DynamicIcon = resolveComponent(icon as string) as any
  return (typeof LazyIcon === 'function' && <DynamicIcon />) || null
}

// LazyIcon.props = {
//   icon: {
//     type: [String, Function, Object] as PropType<string | Function | VNode | JSX.Element>,
//   },
//   iconPrefixes: String,
//   prefixCls: String,
// };

class MenuUtil {
  props: BaseMenuProps

  ctx: ComponentInternalInstance | null

  RouterLink: ConcreteComponent

  constructor(props: BaseMenuProps, ctx: ComponentInternalInstance | null) {
    this.props = props
    this.ctx = ctx
    this.RouterLink = resolveComponent('router-link') as ConcreteComponent
  }

  getNavMenuItems = (menusData: MenuDataItem[] = []) => {
    return menusData.map((item) => this.getSubMenuOrItem(item)).filter((item) => item)
  }

  getSubMenuOrItem = (item: MenuDataItem): VNode => {
    if (
      Array.isArray(item.children) &&
      item.children.length > 0 &&
      !item?.meta?.hideInMenu &&
      !item?.meta?.hideChildrenInMenu
    ) {
      if (this.props.subMenuItemRender) {
        const subMenuItemRender = withCtx(this.props.subMenuItemRender, this.ctx)
        return subMenuItemRender({
          item,
          children: this.getNavMenuItems(item.children),
        }) as VNode
      }
      const { prefixCls, locale } = this.props
      const menuTitle = (locale && locale(item.meta?.title)) || item.meta?.title
      const defaultTitle = item.meta?.icon ? (
        <span class={`${prefixCls}-menu-item`}>
          <span class={`${prefixCls}-menu-item-title`}>{menuTitle}</span>
        </span>
      ) : (
        <span class={`${prefixCls}-menu-item`}>{menuTitle}</span>
      )

      const hasGroup = item.meta?.type === 'group'

      const MenuComponent = hasGroup ? Menu.ItemGroup : Menu.SubMenu
      return (
        <MenuComponent
          title={defaultTitle}
          key={item.path}
          popupClassName={hasGroup ? undefined : `${prefixCls}-menu-popup`}
          icon={hasGroup ? null : <LazyIcon icon={item.meta?.icon} />}
        >
          {this.getNavMenuItems(item.children)}
        </MenuComponent>
      )
    }

    const menuItemRender = this.props.menuItemRender && withCtx(this.props.menuItemRender, this.ctx)

    const [title, icon] = this.getMenuItem(item)

    return (
      (menuItemRender && (menuItemRender({ item, title, icon }) as VNode)) || (
        <Menu.Item disabled={item.meta?.disabled} danger={item.meta?.danger} key={item.path}>
          {title}
        </Menu.Item>
      )
    )
  }

  getMenuItem = (item: MenuDataItem) => {
    const meta = { ...item.meta }
    const target = (meta.target || null) as string | null
    const hasUrl = isUrl(item.path)
    const CustomTag: any = (target && 'a') || this.RouterLink
    const props = { to: { name: item.name, ...item.meta } }
    const attrs = hasUrl || target ? { ...item.meta, href: item.path, target } : {}

    const { prefixCls, locale } = this.props
    const icon = (item.meta?.icon && <LazyIcon icon={item.meta.icon} />) || undefined
    const menuTitle = (locale && locale(item.meta?.title)) || item.meta?.title
    const defaultTitle = item.meta?.icon ? (
      <CustomTag {...attrs} {...props} class={`${prefixCls}-menu-item`}>
        {icon}
        <span class={`${prefixCls}-menu-item-title`}>{menuTitle}</span>
      </CustomTag>
    ) : (
      <CustomTag {...attrs} {...props} class={`${prefixCls}-menu-item`}>
        <span>{menuTitle}</span>
      </CustomTag>
    )

    return [defaultTitle, icon]
  }

  conversionPath = (path: string) => {
    if (path && path.indexOf('http') === 0) {
      return path
    }
    return `/${path || ''}`.replace(/\/+/g, '/')
  }
}

export type MenuOnSelect = {
  key: string | number
  keyPath: string[] | number[]
  item: VNodeChild | any
  domEvent: MouseEvent
  selectedKeys: string[]
}

export type MenuOnClick = {
  item: VNodeChild
  key: string | number
  keyPath: string | string[] | number | number[]
}

export default defineComponent({
  name: 'BaseMenu',
  props: baseMenuProps,
  emits: ['update:openKeys', 'update:selectedKeys', 'click'],
  setup(props, { emit }) {
    const ctx = getCurrentInstance()
    const menuUtil = new MenuUtil(props, ctx)
    // update iconfontUrl
    watchEffect(() => {
      if (props.iconfontUrl) {
        IconFont = createFromIconfontCN({
          scriptUrl: props.iconfontUrl,
        })
      }
    })

    const handleOpenChange = (openKeys: Key[]): void => {
      emit('update:openKeys', openKeys)
    }
    const handleSelect: SelectEventHandler = (args: SelectInfo): void => {
      // ignore https? link handle selectkeys
      if (isUrl(args.key as string)) {
        return
      }
      emit('update:selectedKeys', args.selectedKeys)
    }
    const handleClick: MenuClickEventHandler = (args: MenuInfo) => {
      emit('click', args)
    }

    return () => {
      return (
        <Menu
          key="Menu"
          inlineIndent={16}
          mode={props.mode}
          theme={props.theme as 'dark' | 'light'}
          openKeys={props.openKeys === false ? [] : props.openKeys}
          selectedKeys={props.selectedKeys || []}
          onOpenChange={handleOpenChange}
          onSelect={handleSelect}
          onClick={handleClick}
          {...props.menuProps}
        >
          {menuUtil.getNavMenuItems(props.menuData)}
        </Menu>
      )
    }
  },
})
