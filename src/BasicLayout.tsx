import { computed, FunctionalComponent, CSSProperties, VNodeChild, VNode, ComputedRef } from 'vue';
import 'ant-design-vue/es/layout/style';
import Layout from 'ant-design-vue/es/layout';
import { withInstall } from 'ant-design-vue/es/_util/type';
import { default as ProProvider, ProProviderData } from './ProProvider';
import { default as SiderMenuWrapper, SiderMenuWrapperProps } from './SiderMenu';
import { WrapContent } from './WrapContent';
import { default as Header, HeaderViewProps } from './Header';
import { RenderVNodeType, WithFalse } from './typings';
import { getComponentOrSlot, PropRenderType, PropTypes } from './utils';
import useMergedState from './hooks/useMergedState';
import './BasicLayout.less';

const defaultI18nRender = (key: string) => key;

export type BasicLayoutProps = SiderMenuWrapperProps &
  HeaderViewProps & {
    pure?: boolean;
    /**
     *@name logo url
     */
    logo?: string | RenderVNodeType | WithFalse<string | RenderVNodeType>;

    loading?: boolean;

    i18n?: ProProviderData['i18n'];

    defaultCollapsed?: boolean;

    onCollapse?: (collapsed: boolean) => void;

    footerRender?: WithFalse<
      (props: any /* FooterProps */, defaultDom: RenderVNodeType) => RenderVNodeType
    >;

    headerRender?: WithFalse<(props: any /* HeaderProps */) => RenderVNodeType>;

    colSize?: string;
    /**
     * 是否禁用移动端模式，有的管理系统不需要移动端模式，此属性设置为true即可
     */
    disableMobile?: boolean;

    isChildrenLayout?: boolean;

    contentStyle?: CSSProperties;
    /**
     * 兼用 content的 margin
     */
    disableContentMargin?: boolean;
  };

const ProLayout: FunctionalComponent<BasicLayoutProps> = (props, { emit, slots, attrs }) => {
  const {
    onCollapse: propsOnCollapse,
    contentStyle,
    disableContentMargin,
    siderWidth = 208,
    menu,
    isChildrenLayout: propsIsChildrenLayout,
    loading,
    layout,
    matchMenuKeys,
    navTheme,
    menuData,
    isMobile,
    defaultCollapsed,
  } = props;
  const isTop = computed(() => layout === 'top');
  const isSide = computed(() => layout === 'side');
  const isMix = computed(() => layout === 'mix');

  const handleCollapse = (collapsed: boolean) => {
    emit('update:collapsed', collapsed);
  };
  const handleOpenKeys = (openKeys: string[] | false): void => {
    openKeys && emit('update:open-keys', openKeys);
  };
  const handleSelect = (selectedKeys: string[] | false): void => {
    selectedKeys && emit('update:selected-keys', selectedKeys);
  };
  const baseClassName = computed(() => `${props.prefixCls}-basicLayout`);
  // gen className
  const className = computed(() => {
    return {
      [baseClassName.value]: true,
      [`screen-${props.colSize}`]: props.colSize,
      [`${baseClassName.value}-top-menu`]: props.layout === 'top',
      [`${baseClassName.value}-is-children`]: props.isChildrenLayout,
      [`${baseClassName.value}-fix-siderbar`]: props.fixSiderbar,
      [`${baseClassName.value}-${props.layout}`]: props.layout,
    };
  });

  const [collapsed, onCollapse] = useMergedState<boolean>(defaultCollapsed || false, {
    value: props.collapsed,
    onChange: propsOnCollapse,
  });
  const headerRender = (
    props: BasicLayoutProps & {
      hasSiderMenu: boolean;
      customHeaderRender: VNodeChild | false;
      rightContentRender: VNodeChild | VNode | false;
    },
    matchMenuKeys: string[],
  ): RenderVNodeType => {
    if (props.headerRender === false || props.pure) {
      return null;
    }
    return <Header matchMenuKeys={matchMenuKeys} {...props} headerHeight={48} />;
  };
  const rightContentRender = getComponentOrSlot(props, slots, 'rightContentRender') as any;
  const customHeaderRender = getComponentOrSlot(props, slots, 'headerRender');
  const menuHeaderRenderFunc = props['menuHeaderRender'];
  const menuHeaderRenderSlot = slots['menuHeaderRender'];
  const headerDom = headerRender(
    {
      ...props,
      hasSiderMenu: !isTop.value,
      menuData,
      isMobile,
      collapsed,
      onCollapse,
      onSelect: handleSelect,
      onOpenKeys: handleOpenKeys,
      customHeaderRender,
      rightContentRender,
      headerTitleRender:
        menuHeaderRenderFunc || (menuHeaderRenderSlot && (() => menuHeaderRenderSlot())),
      theme: (navTheme || 'dark').toLocaleLowerCase().includes('dark') ? 'dark' : 'light',
    },
    matchMenuKeys,
  );

  const footerRender = getComponentOrSlot(props, slots, 'footerRender');
  const menuRender = getComponentOrSlot(props, slots, 'menuRender');
  // const menuHeaderRender = getComponentOrSlot(props, slots, 'menuHeaderRender');

  return (
    <ProProvider i18n={defaultI18nRender}>
      {props.pure ? (
        slots.default?.()
      ) : (
        <div class={className.value}>
          <Layout class={baseClassName.value}>
            {!isTop.value && (
              <SiderMenuWrapper
                {...props}
                menuHeaderRender={
                  menuHeaderRenderFunc || (menuHeaderRenderSlot && (() => menuHeaderRenderSlot()))
                }
                onCollapse={handleCollapse}
                onSelect={handleSelect}
                onOpenKeys={handleOpenKeys}
              />
            )}
            <Layout style={contentStyle}>
              {headerDom}
              <WrapContent style={props.contentStyle}>{slots.default?.()}</WrapContent>
              {footerRender !== false && footerRender && footerRender}
            </Layout>
          </Layout>
        </div>
      )}
    </ProProvider>
  );
};

ProLayout.inheritAttrs = false;
ProLayout.displayName = 'ProLayout';
ProLayout.emits = ['update:collapsed', 'update:open-keys', 'update:selected-keys'];
ProLayout.props = {
  prefixCls: PropTypes.string.def('ant-pro'),
  title: PropTypes.VNodeChild.def('Ant Design Pro'),
  logo: PropTypes.VNodeChild,
  /* 是否删除掉所有的自带界面 */
  pure: PropTypes.bool,
  /* layout 的加载态 */
  loading: PropTypes.bool,
  /* 用于生成菜单和面包屑 请从 RouterContext 注入 */
  // menuData: PropTypes.array,

  // location: PropTypes.string,
  // Custom render
  menuHeaderRender: PropRenderType,
  menuFooterRender: PropRenderType,
  menuExtraRender: PropRenderType,
  /* 自定义头的 render 方法 (props: BasicLayoutProps) => VNode */
  headerRender: PropRenderType,
  /* 自定义头标题的方法,mix 模式下生效 (props: BasicLayoutProps) => VNode */
  headerTitleRender: PropRenderType,
  /* 自定义头内容的方法 (props: BasicLayoutProps) => VNode */
  headerContentRender: PropRenderType,
  /* 自定义头右部的 render 方法 (props: HeaderViewProps) => VNode */
  rightContentRender: PropRenderType,
  /* 自定义 collapsed button 的方法 (collapsed: boolean) => VNode */
  collapsedButtonRender: PropRenderType,
  /* 自定义页脚的 render 方法 (props: BasicLayoutProps) => VNode */
  footerRender: PropRenderType,
  /* 自定义页面标题的显示方法 (props: BasicLayoutProps) => VNode */
  pageTitleRender: PropRenderType,
  /* 自定义菜单的 render 方法 (props: HeaderViewProps) => VNode */
  menuRender: PropRenderType,
  /* 自定义菜单项的 render 方法 */
  menuItemRender: PropRenderType,
  /* 自定义拥有子菜单菜单项的 render 方法 */
  subMenuItemRender: PropRenderType,
  /* 自定义面包屑的数据 */
  breadcrumbRender: PropRenderType,

  // Event
  onMenuHeaderClick: PropTypes.func,
  onTopMixMenuHeaderClick: PropTypes.func,

  // settings
  contentStyle: PropTypes.style,
  layout: PropTypes.string.def('side'),
  contentWidth: PropTypes.string.def('Fluid'),
  /* 导航的主题，side 和 mix 模式下是左侧菜单的主题，top 模式下是顶部菜单 */
  navTheme: PropTypes.string.def('dark'),
  /* 顶部导航的主题，mix 模式生效 */
  headerTheme: PropTypes.string.def('dark'),
  /* 是否固定导航 */
  fixSiderbar: PropTypes.bool,
  /* 是否固定 header 到顶部 */
  fixedHeader: PropTypes.bool,
  /* 触发响应式布局的断点 https://ant.design/components/grid-cn/#Col */
  breakpoint: PropTypes.string.def('lg'),
  /* 关于 menu 的配置，暂时只有 locale,locale 可以关闭 menu 的自带的全球化 */
  menu: PropTypes.object,
  /* 传递到 antd menu 组件的 props */
  menuProps: PropTypes.object,
  /* 使用 IconFont 的图标配置 */
  iconfontUrl: PropTypes.string,
  /* 当前 layout 的语言设置 */
  locale: PropTypes.func.def((key: string) => key),
  // settings
  /* 侧边菜单宽度 */
  siderWidth: PropTypes.number.def(208),
  /* 控制菜单的收起和展开 */
  collapsed: PropTypes.bool,
  /* 菜单的折叠收起事件 (collapsed: boolean) => void */
  onCollapse: PropTypes.func,
  // onPageChange // 请使用 vue-router 监听
  /* 禁止自动切换到移动页面 */
  disableMobile: PropTypes.bool,
} as any;

export default withInstall(ProLayout);
