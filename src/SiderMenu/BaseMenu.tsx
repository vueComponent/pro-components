import './index.less';

import { defineComponent, h, resolveDynamicComponent, resolveComponent, VNode, ref, reactive, computed, Ref, watch, ComputedRef, VNodeChild, WatchStopHandle, PropType, isVNode, toRefs, defineAsyncComponent, Component } from 'vue';
// import * as Icon from '@ant-design/icons-vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';

import 'ant-design-vue/es/menu/style'
import Menu from 'ant-design-vue/es/menu'

import defaultSettings, { PureSettings } from '../defaultSettings';
import { isImg, isUrl } from '../utils'
import { MenuMode, SelectInfo, OpenEventHandler } from './typings';
import { RouteProps, MenuTheme, WithFalse } from '../typings';

export { MenuMode, SelectInfo, OpenEventHandler }

export interface MenuState {
  collapsed?: boolean | false;
  selectedKeys?: string[];
  openKeys?: string[];
}

interface MenuStated {
  collapsed: boolean;
  selectedKeys: string[];
  openKeys: string[];
}

export interface MenuStateWatched {
  state: MenuStated;
  watchRef: WatchStopHandle;
}

export function useMenuState ({ collapsed = false, openKeys = [] as string[], selectedKeys = [] as string[], }: MenuState): MenuStateWatched {
  const state = reactive<MenuStated>({
    collapsed,
    selectedKeys,
    openKeys,
  })
  const cachedOpenKeys: Ref<string[]> = ref([] as string[])

  const watchRef = watch(() => state.collapsed, (collapsed) => {
    if (collapsed) {
      cachedOpenKeys.value = state.openKeys.concat()
      state.openKeys = []
    } else {
      state.openKeys = cachedOpenKeys.value.concat()
    }
  })

  return {
    state,
    watchRef,
  }
}

export function useRootSubmenuKeys (menus: RouteProps[]): ComputedRef<string[]> {
  return computed(() => menus.map(it => it.path))
}

// ts typo
export interface BaseMenuProps extends Partial<PureSettings> {
  prefixCls?: string;
  collapsed?: boolean;
  splitMenus?: boolean;
  isMobile?: boolean;
  menuData?: RouteProps[];
  mode?: MenuMode;
  onCollapse?: (collapsed: boolean) => void;
  openKeys?: WithFalse<string[]> | undefined;
  handleOpenChange?: (openKeys: string[]) => void;
  theme?: MenuTheme | 'realDark';
  i18n?: (t: string) => string | VNodeChild;
}

// vue props
export const VueBaseMenuProps = {
  locale: Boolean,
  menus: Array as PropType<RouteProps[]>,
  // top-nav-header: horizontal
  mode: {
    type: String as PropType<MenuMode>,
    default: 'inline',
  },
  theme: {
    type: String as PropType<MenuTheme | 'realDark'>,
    default: 'dark',
  },
  collapsed: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  openKeys: {
    type: Array as PropType<string[]>,
    required: true,
  },
  handleOpenChange: {
    type: Function as PropType<(openKeys: WithFalse<string[]>) => void>,
    default: () => undefined,
  },
  selectedKeys: {
    type: Array as PropType<string[]>,
    required: true,
  },
}

const renderMenu = (item, i18nRender) => {
  if (item && !item.hidden) {
    const hasChild = item.children && !item.hideChildrenInMenu
    return hasChild ? renderSubMenu(item, i18nRender) : renderMenuItem(item, i18nRender)
  }
  return null
}

const renderSubMenu = (item, i18nRender) => {
  const renderMenuContent = (
    <span>
      <LazyIcon icon={item.meta.icon} />
      <span>{renderTitle(item.meta.title, i18nRender)}</span>
    </span>
  )
  return (
    <Menu.SubMenu
      key={item.path}
      // @ts-ignore
      title={renderMenuContent}
    >
      {!item.hideChildrenInMenu && item.children.map(cd => renderMenu(cd, i18nRender))}
    </Menu.SubMenu>
  )
}

const renderMenuItem = (item, i18nRender) => {
  const meta = Object.assign({}, item.meta)
  const target = meta.target || null
  const CustomTag = target && 'a' || 'router-link'
  const props = { to: { name: item.name }, href: item.path, target: target }
  if (item.children && item.hideChildrenInMenu) {
    // 把有子菜单的 并且 父菜单是要隐藏子菜单的
    // 都给子菜单增加一个 hidden 属性
    // 用来给刷新页面时， selectedKeys 做控制用
    item.children.forEach(cd => {
      cd.meta = Object.assign(cd.meta || {}, { hidden: true })
    })
  }
  return (
    <Menu.Item key={item.path}>
      <CustomTag {...props}>
        <LazyIcon icon={meta.icon} />
        {renderTitle(meta.title, i18nRender)}
      </CustomTag>
    </Menu.Item>
  )
}

let IconFont = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl,
});


// const LazyIcon = (props, _) => {
//   const { icon } = toRefs(props)
//   if (typeof icon.value === 'string' && icon.value !== '') {
//     if (isUrl(icon.value) || isImg(icon.value)) {
//       return <img src={icon.value} alt="icon" class="ant-pro-sider-menu-icon" />
//     }
//     if (icon.value.startsWith('icon-')) {
//       return <IconFont type={icon.value}  />
//     }
//   }
//   if (isVNode(icon.value)) {
//     return icon.value
//   }
//   const IconComponent = resolveComponent(`${icon.value}`)
//   return h(IconComponent)
// }
const LazyIcon = defineComponent({
  props: {
    icon: {
      type: [String, Function, Object] as PropType<string|Function|VNodeChild|JSX.Element>,
    }
  },
  setup(props, _) {
    const { icon } = toRefs(props)
    if (typeof icon.value === 'string' && icon.value !== '') {
      if (isUrl(icon.value) || isImg(icon.value)) {
        return <img src={icon.value} alt="icon" class="ant-pro-sider-menu-icon" />
      }
      if (icon.value.startsWith('icon-')) {
        return <IconFont type={icon.value}  />
      }
    }
    if (isVNode(icon.value)) {
      return icon.value
    }
    const ALazyIcon = resolveComponent(`${icon.value}`)
    // return ALazyIcon && ALazyIcon
    return ALazyIcon && (() => (
      // @ts-ignore
      <ALazyIcon />
    )) || null
  }
})

const renderTitle = (title, i18nRender) => {
  return <span>{ i18nRender && i18nRender(title) || title }</span>
}


export default defineComponent({
  name: 'BaseMenu',
  props: Object.assign({}, {
    i18n: {
      type: Function,
      default: (t: string): string => t,
    },
  }, VueBaseMenuProps),
  emits: ['update:openKeys', 'update:selectedKeys'],
  setup (props, { emit } ) {
    console.log('props.mode', props.mode)
    const isInline = computed(() => props.mode === 'inline')
    const handleOpenChange: OpenEventHandler = (openKeys): void => {
      emit('update:openKeys', openKeys)
    }
    const handleSelect = ({ selectedKeys }: SelectInfo): void => {
      emit('update:selectedKeys', selectedKeys)
    }

    return () => (
      <Menu
        inlineCollapsed={isInline.value && props.collapsed || undefined}
        mode={props.mode}
        theme={props.theme}
        openKeys={props.openKeys}
        selectedKeys={props.selectedKeys}
        onOpenChange={handleOpenChange}
        onSelect={handleSelect}
      >
        {props.menus && props.menus.map(menu => {
          if (menu.hidden) {
            return null
          }
          return renderMenu(menu, props.i18n)
        })}
      </Menu>
    )
  }
})
