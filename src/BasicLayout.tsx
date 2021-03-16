import {
  computed,
  FunctionalComponent,
  CSSProperties,
  reactive,
  unref,
  provide,
  defineComponent,
} from 'vue';
import 'ant-design-vue/es/layout/style';
import Layout from 'ant-design-vue/es/layout';
import { withInstall } from 'ant-design-vue/es/_util/type';
import RouteContext, { RouteContextProps } from './RouteContext';
import { default as SiderMenuWrapper, SiderMenuWrapperProps } from './SiderMenu';
import { WrapContent } from './WrapContent';
import { default as Header, HeaderViewProps } from './Header';
import { VNodeType, CustomRender, WithFalse } from './typings';
import { getCustomRender, PropRenderType, PropTypes } from './utils';
import useMediaQuery from './hooks/useMediaQuery';
import './BasicLayout.less';

export const defaultPrefixCls = 'ant-pro';

const defaultI18nRender = (key: string) => key;

export type BasicLayoutProps = SiderMenuWrapperProps &
  HeaderViewProps & {
    pure?: boolean;
    /**
     *@name logo url
     */
    logo?: VNodeType;

    loading?: boolean;

    i18n?: RouteContextProps['i18n'];

    defaultCollapsed?: boolean;

    onCollapse?: (collapsed: boolean) => void;

    footerRender?: WithFalse<(props: any /* FooterProps */) => VNodeType>;

    headerRender?: WithFalse<(props: any /* HeaderProps */) => VNodeType>;

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

const ProLayout = defineComponent({
  setup(props: BasicLayoutProps, { emit, slots }) {
    const {
      onCollapse: propsOnCollapse,
      onOpenKeys: propsOnOpenKeys,
      onSelect: propsOnSelect,
      contentStyle,
      disableContentMargin,
      isChildrenLayout: propsIsChildrenLayout,
      // loading,
      layout,
      matchMenuKeys,
      navTheme,
      menuData,
      // defaultCollapsed,
    } = props;
    const isTop = computed(() => layout === 'top');
    // const isSide = computed(() => layout === 'side');
    // const isMix = computed(() => layout === 'mix');
    const pure = computed(() => props.pure);
    // if on event and @event
    const onCollapse =
      (propsOnCollapse && propsOnCollapse) ||
      ((collapsed: boolean) => emit('update:collapsed', collapsed));
    const onOpenKeys =
      (propsOnOpenKeys && propsOnOpenKeys) ||
      ((openKeys: string[] | false) => emit('update:open-keys', openKeys));
    const onSelect =
      (propsOnSelect && propsOnSelect) ||
      ((selectedKeys: string[] | false) => emit('update:selected-keys', selectedKeys));
    const colSize = useMediaQuery();
    const isMobile = computed(
      () => (colSize.value === 'sm' || colSize.value === 'xs') && !props.disableMobile,
    );
    const baseClassName = computed(() => `${props.prefixCls}-basicLayout`);
    // gen className
    const className = computed(() => {
      return {
        [baseClassName.value]: true,
        [`screen-${colSize.value}`]: colSize.value,
        [`${baseClassName.value}-top-menu`]: isTop.value,
        [`${baseClassName.value}-is-children`]: props.isChildrenLayout,
        [`${baseClassName.value}-fix-siderbar`]: props.fixSiderbar,
        [`${baseClassName.value}-${props.layout}`]: props.layout,
      };
    });

    // siderMenuDom 为空的时候，不需要 padding
    const genLayoutStyle: CSSProperties = {
      position: 'relative',
    };

    // if is some layout children, don't need min height
    if (propsIsChildrenLayout || (contentStyle && contentStyle.minHeight)) {
      genLayoutStyle.minHeight = 0;
    }

    // const [collapsed, onCollapse] = useMergedState<boolean>(defaultCollapsed || false, {
    //   value: props.collapsed,
    //   onChange: propsOnCollapse,
    // });
    const headerRender = (
      props: BasicLayoutProps & {
        hasSiderMenu: boolean;
        customHeaderRender: WithFalse<CustomRender>;
        rightContentRender: WithFalse<CustomRender>;
      },
      matchMenuKeys: string[],
    ): VNodeType => {
      if (props.headerRender === false || props.pure) {
        return null;
      }
      return <Header matchMenuKeys={matchMenuKeys} {...props} headerHeight={48} />;
    };
    const rightContentRender = getCustomRender(props, slots, 'rightContentRender');
    const customHeaderRender = getCustomRender(props, slots, 'headerRender');
    const menuHeaderRender = getCustomRender(props, slots, 'menuHeaderRender');
    const footerRender = getCustomRender(props, slots, 'footerRender');
    // const menuRender = getCustomRender(props, slots, 'menuRender');

    const headerDom = headerRender(
      {
        ...props,
        hasSiderMenu: !isTop.value,
        menuData,
        isMobile: unref(isMobile),
        onCollapse,
        onOpenKeys,
        onSelect,
        customHeaderRender,
        rightContentRender,
        headerTitleRender: menuHeaderRender,
        theme: (navTheme || 'dark').toLocaleLowerCase().includes('dark') ? 'dark' : 'light',
      },
      matchMenuKeys,
    );

    const routeContext: RouteContextProps = {
      getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
        if (customizePrefixCls) return customizePrefixCls;
        return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls;
      },
      i18n: (t: string): string => t,
      contentWidth: 'Fluid',
      menuData,
      selectedKeys: props.selectedKeys || [],
      openKeys: props.openKeys || [],
    };

    console.log('BasicLayout.routeContext', routeContext);
    console.log('pure', pure.value);
    provide('route-context', routeContext);

    return () => (
      <>
        {pure.value ? (
          slots.default?.()
        ) : (
          <div class={className.value}>
            <Layout class={baseClassName.value}>
              {!isTop.value && (
                <SiderMenuWrapper
                  {...props}
                  isMobile={isMobile.value}
                  menuHeaderRender={menuHeaderRender}
                  onCollapse={onCollapse}
                  onSelect={onSelect}
                  onOpenKeys={onOpenKeys}
                />
              )}
              <Layout style={genLayoutStyle}>
                {headerDom}
                <WrapContent
                  isChildrenLayout={propsIsChildrenLayout}
                  style={disableContentMargin ? null : contentStyle}
                >
                  {slots.default?.()}
                </WrapContent>
                {footerRender && footerRender(props)}
              </Layout>
            </Layout>
          </div>
        )}
      </>
    );
  },
});

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
  /* 使用 IconFont 的图标配置 */
  iconfontUrl: PropTypes.string,
  /* 当前 layout 的语言设置 */
  locale: PropTypes.func.def((key: string) => key),
  // settings
  /* 侧边菜单宽度 */
  siderWidth: PropTypes.number.def(208),
  /* 侧边栏收起宽度 */
  collapsedWidth: PropTypes.number.def(48),
  /* 关于 menu 的配置，暂时只有 locale,locale 可以关闭 menu 的自带的全球化 */
  menu: PropTypes.object,
  /* 传递到 antd menu 组件的 props */
  menuProps: PropTypes.object,
  /* 菜单数组 */
  menuData: PropTypes.object,
  /* 是否分割菜单 (仅 mix 模式有效) */
  splitMenus: PropTypes.bool,
  selectedKeys: PropTypes.array,
  openKeys: PropTypes.array,
  /* 控制菜单的收起和展开 */
  collapsed: PropTypes.bool,
  /* 菜单的折叠收起事件 (collapsed: boolean) => void */
  onCollapse: PropTypes.func,
  onSelect: PropTypes.func,
  onOpenKeys: PropTypes.func,
  // onPageChange // 请使用 vue-router 监听
  /* 禁止自动切换到移动页面 */
  disableMobile: PropTypes.bool,
} as any;

export default withInstall(ProLayout);
