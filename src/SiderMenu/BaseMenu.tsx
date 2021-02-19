import {
  defineComponent,
  resolveComponent,
  computed,
  ComputedRef,
  VNodeChild,
  VNode,
  PropType,
  isVNode,
  toRefs,
} from 'vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
import 'ant-design-vue/es/menu/style';
import Menu from 'ant-design-vue/es/menu';
import defaultSettings, { PureSettings } from '../defaultSettings';
import { isImg, isUrl } from '../utils';
import { MenuMode, SelectInfo, OpenEventHandler } from './typings';
import { MenuDataItem, MenuTheme, FormatMessage, WithFalse } from '../typings';
import { PrivateSiderMenuProps } from './SiderMenu';
import './index.less';

export { MenuMode, SelectInfo, OpenEventHandler };

export function useRootSubmenuKeys(menus: MenuDataItem[]): ComputedRef<string[]> {
  return computed(() => menus.map(it => it.path));
}

// ts typo
export interface BaseMenuProps extends Partial<PureSettings>, PrivateSiderMenuProps {
  prefixCls?: string;
  collapsed?: boolean;
  splitMenus?: boolean;
  isMobile?: boolean;
  menuData?: MenuDataItem[];
  mode?: MenuMode;
  onCollapse?: (collapsed: boolean) => void;
  openKeys?: WithFalse<string[]> | undefined;
  selectedKeys?: WithFalse<string[]> | undefined;
  handleOpenChange?: (openKeys: string[]) => void;
  theme?: MenuTheme | 'realDark';
  i18n?: FormatMessage;
}

// vue props
export const baseMenuProps = {
  locale: Boolean,
  i18n: {
    type: Function as PropType<FormatMessage>,
    default: (t: string): string => t,
  },
  menuData: Array as PropType<MenuDataItem[]>,
  // top-nav-header: horizontal
  mode: {
    type: String as PropType<MenuMode>,
    default: 'inline',
  },
  theme: {
    type: String as PropType<BaseMenuProps['theme']>,
    default: 'dark',
  },
  layout: {
    type: String as PropType<BaseMenuProps['layout']>,
    default: 'side',
  },
  collapsed: {
    type: Boolean as PropType<boolean | undefined>,
    default: false,
  },
  openKeys: {
    type: Array as PropType<WithFalse<string[]>>,
    default: undefined,
  },
  selectedKeys: {
    type: Array as PropType<WithFalse<string[]>>,
    default: undefined,
  },
};

const httpReg = /(http|https|ftp):\/\/([\w.]+\/?)\S*/;

const renderTitle = (title: string | undefined, i18nRender: FormatMessage) => {
  return <span>{(i18nRender && title && i18nRender(title)) || title}</span>;
};

const renderMenuItem = (item: MenuDataItem, i18nRender: FormatMessage) => {
  const meta = Object.assign({}, item.meta);
  const target = meta.target || null;
  const hasRemoteUrl = httpReg.test(item.path);
  const CustomTag: any = resolveComponent((target && 'a') || 'router-link');
  const props = { to: { name: item.name } };
  const attrs = hasRemoteUrl || target ? { href: item.path, target: target } : {};
  if (item.children && item.meta?.hideChildInMenu) {
    // 把有子菜单的 并且 父菜单是要隐藏子菜单的
    // 都给子菜单增加一个 hidden 属性
    // 用来给刷新页面时， selectedKeys 做控制用
    item.children.forEach(cd => {
      cd.meta = Object.assign(cd.meta || {}, { hidden: true });
    });
  }
  // @ts-nocheck
  return (
    <Menu.Item key={item.path}>
      <CustomTag {...attrs} {...props}>
        <LazyIcon icon={meta.icon} />
        {renderTitle(meta.title, i18nRender)}
      </CustomTag>
    </Menu.Item>
  );
};

const renderSubMenu = (item: MenuDataItem, i18nRender: FormatMessage) => {
  const renderMenuContent = (
    <span>
      <LazyIcon icon={item.meta?.icon} />
      <span>{renderTitle(item.meta?.title, i18nRender)}</span>
    </span>
  ) as string & VNode;
  return (
    <Menu.SubMenu key={item.path} title={renderMenuContent}>
      {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
      {!item.meta?.hideChildInMenu && item.children.map(cd => renderMenu(cd, i18nRender))}
    </Menu.SubMenu>
  );
};

const renderMenu = (item: MenuDataItem, i18nRender: FormatMessage) => {
  if (item && !item.meta.hidden) {
    const hasChild = item.children && !item.meta?.hideChildInMenu;
    return hasChild ? renderSubMenu(item, i18nRender) : renderMenuItem(item, i18nRender);
  }
  return null;
};

const IconFont = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl,
});

const LazyIcon = (props: {
  icon: VNode | string;
  iconPrefixes?: string;
  prefixCls?: string;
}) => {
  const { icon, iconPrefixes = 'icon-', prefixCls = 'ant-pro' } = props;
  if (!icon) {
    return null;
  }
  if (typeof icon === 'string' && icon !== '') {
    if (isUrl(icon) || isImg(icon)) {
      return <img src={icon} alt="icon" class={`${prefixCls}-sider-menu-icon`} />;
    }
    if (icon.startsWith(iconPrefixes)) {
      return <IconFont type={icon} />;
    }
  }
  if (isVNode(icon)) {
    return icon;
  }
  const DynamicIcon = resolveComponent(icon) as any;
  return (typeof LazyIcon === 'function' && <DynamicIcon />) || null;
};

LazyIcon.props = {
  icon: {
    type: [String, Function, Object] as PropType<string | Function | VNode | JSX.Element>,
  },
  iconPrefixes: String,
  prefixCls: String,
};

class MenuUtil {
  props: BaseMenuProps;

  constructor(props: BaseMenuProps) {
    this.props = props;
  }

  getNavMenuItems = (menusData: MenuDataItem[] = [], isChildren: boolean) => {
    return menusData.map(item => this.getSubMenuOrItem(item, isChildren)).filter(item => item);
  }

  getSubMenuOrItem = (item: MenuDataItem, isChildren: boolean) => {
    if (Array.isArray(item.children)
          && item.children.length > 0
          && !item?.meta?.hideInMenu) {
      const { prefixCls, i18n } = this.props;
      const menuTitle = i18n && i18n(item.meta?.title) || item.meta?.title;
      const defaultTitle = item?.meta.icon ? (
        <span class={`${prefixCls}-menu-item`}>
          {!isChildren && <LazyIcon icon={item.meta.icon} />}
          <span class={`${prefixCls}-menu-item-title`}>{menuTitle}</span>
        </span>
      ) : (
        <span class={`${prefixCls}-menu-item`}>{menuTitle}</span>
      );
      const MenuComponent = item.meta?.type === 'group' ? Menu.ItemGroup : Menu.SubMenu;
      return (
        <MenuComponent title={defaultTitle} key={item.path}>
          {this.getNavMenuItems(item.children, true)}
        </MenuComponent>
      );
    }

    return (
      <Menu.Item
        inlineIndent={24}
        disabled={item.meta?.disabled}
        key={item.path}
        // onClick={}
      >
        {this.getMenuItem(item, isChildren)}
      </Menu.Item>
    );
  }

  getMenuItem = (item: MenuDataItem, isChildren: boolean) => {
    const meta = Object.assign({}, item.meta);
    const target = meta.target || null;
    const hasUrl = isUrl(item.path);
    const CustomTag: any = resolveComponent((target && 'a') || 'router-link');
    const props = { to: { name: item.name } };
    const attrs = hasUrl || target ? { href: item.path, target: target } : {};

    const { prefixCls, i18n } = this.props;
    const menuTitle = i18n && i18n(item.meta?.title) || item.meta?.title;
    const defaultTitle = item?.meta.icon ? (
      <span class={`${prefixCls}-menu-item`}>
        <CustomTag {...attrs} {...props}>
          {!isChildren && <LazyIcon icon={item.meta.icon} />}
          <span class={`${prefixCls}-menu-item-title`}>{menuTitle}</span>
        </CustomTag>
      </span>
    ) : (
      <span class={`${prefixCls}-menu-item`}>{menuTitle}</span>
    );

    return defaultTitle;
  }

  conversionPath = (path: string) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };
}

export default defineComponent({
  name: 'BaseMenu',
  props: baseMenuProps,
  emits: ['update:openKeys', 'update:selectedKeys'],
  setup(props, { emit }) {
    const { mode, i18n } = toRefs(props);
    const isInline = computed(() => mode.value === 'inline');

    const handleOpenChange: OpenEventHandler = (openKeys: string[]): void => {
      emit('update:openKeys', openKeys);
    };
    const handleSelect = (params: {
      key: string | number;
      keyPath: string[] | number[];
      item: VNodeChild | any;
      domEvent: MouseEvent;
      selectedKeys: string[];
    }): void => {
      emit('update:selectedKeys', params.selectedKeys);
    };
    // TODO :: add `Menu` onClick custom handle.

    return () => (
      <Menu
        key="Menu"
        inlineCollapsed={(isInline.value && props.collapsed) || undefined}
        inlineIndent={16}
        mode={props.mode}
        theme={props.theme as 'dark' | 'light'}
        openKeys={props.openKeys === false ? [] : props.openKeys}
        selectedKeys={props.selectedKeys || []}
        onOpenChange={handleOpenChange}
        onSelect={handleSelect}
      >
        {props.menuData &&
          props.menuData.map(menu => {
            if (menu.meta.hidden) {
              return null;
            }
            return renderMenu(menu, i18n.value);
          })}
      </Menu>
    );
  },
});
