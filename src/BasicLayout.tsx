import { computed, FunctionalComponent, CSSProperties, VNodeChild } from 'vue';
import 'ant-design-vue/es/layout/style';
import Layout from 'ant-design-vue/es/layout';
import { withInstall } from 'ant-design-vue/es/_util/type';
import { default as ProProvider, ProProviderData } from './ProProvider';
import { default as GlobalFooter } from './GlobalFooter';
import { default as SiderMenuWrapper, SiderMenuWrapperProps } from './SiderMenu';
import { WrapContent } from './WrapContent';
import { default as Header, HeaderViewProps } from './Header';
import { RenderVNodeType, WithFalse } from './typings';
import { getComponentOrSlot } from './utils';
import useMergedState from './hooks/useMergedState';
import './BasicLayout.less';

const defaultI18nRender = (key: string) => key;

export type BasicLayoutProps = SiderMenuWrapperProps & HeaderViewProps & {
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
  const handleOpenChange = (openKeys: string[] | false): void => {
    openKeys && emit('update:openKeys', openKeys);
  };
  const handleSelect = (selectedKeys: string[] | false): void => {
    selectedKeys && emit('update:selectedKeys', selectedKeys);
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
      rightContentRender: VNodeChild | false;
    },
    matchMenuKeys: string[]
  ): RenderVNodeType => {
    if (props.headerRender === false || props.pure) {
      return null;
    }
    return <Header matchMenuKeys={matchMenuKeys} {...props} headerHeight={48} />;
  }
  const rightContentRender = getComponentOrSlot(props, slots, 'rightContentRender');
  const customHeaderRender = getComponentOrSlot(props, slots, 'headerRender');;
  const headerDom = headerRender({
    ...props,
    hasSiderMenu: isTop.value,
    menuData,
    isMobile,
    collapsed,
    onCollapse,
    onSelect: handleSelect,
    onOpenChange: handleOpenChange,
    customHeaderRender,
    rightContentRender,
    theme: (navTheme || 'dark').toLocaleLowerCase().includes('dark') ? 'dark' : 'light',
  }, matchMenuKeys);

  const footerRender = getComponentOrSlot(props, slots, 'footerRender');
  const menuRender = getComponentOrSlot(props, slots, 'menuRender');
  // const menuHeaderRender = getComponentOrSlot(props, slots, 'menuHeaderRender');
  const menuHeaderRenderFunc = props['menuHeaderRender'];
  const menuHeaderRenderSlot = slots['menuHeaderRender'];

  return (
    <ProProvider i18n={defaultI18nRender}>
      { props.pure
        ? (slots.default?.())
        : (
          <div class={className.value}>
            <Layout class={baseClassName.value}>
              { !isTop.value && (<SiderMenuWrapper
                {...props}
                menuHeaderRender={menuHeaderRenderFunc || (menuHeaderRenderSlot && (() => menuHeaderRenderSlot()))}
                onSelect={handleSelect}
                onOpenChange={handleOpenChange}
                onCollapse={handleCollapse}
              />)}
              <Layout>
                {headerDom}
                <WrapContent style={props.contentStyle}>
                  {slots.default?.()}
                </WrapContent>
                { footerRender && footerRender || footerRender !== false && (
                  <GlobalFooter
                    links={[
                      {
                        key: '1',
                        title: 'Pro Layout',
                        href: 'https://www.github.com/vueComponent/pro-layout',
                        blankTarget: true,
                      },
                      {
                        key: '2',
                        title: 'Github',
                        href: 'https://www.github.com/vueComponent/ant-design-vue-pro',
                        blankTarget: true,
                      },
                      {
                        key: '3',
                        title: '@Sendya',
                        href: 'https://www.github.com/sendya/',
                        blankTarget: true,
                      },
                    ]}
                    copyright={
                      <a href="https://github.com/vueComponent" target="_blank">
                        vueComponent
                      </a>
                    }
                  />
                )}
              </Layout>
            </Layout>
          </div>
        )}
    </ProProvider>
  );
};

ProLayout.inheritAttrs = false;
ProLayout.displayName = 'ProLayout';
ProLayout.emits = ['update:collapsed', 'update:openKeys', 'update:selectedKeys'];
ProLayout.props = {
  prefixCls: {
    type: String,
    default: 'ant-pro',
  },
  title: String,
  colSize: String,
  isChildrenLayout: Boolean,
  isMobile: Boolean,
  fixSiderbar: {
    type: Boolean,
    default: () => false,
  },
  fixedHeader: {
    type: Boolean,
    default: () => false,
  },
  layout: String,
  openKeys: Array,
  selectedKeys: Array,
  collapsed: Boolean,
  menuData: Array,
  contentStyle: Object,
  theme: String,
  headerTheme: {
    type: String,
    defualt: 'light',
  },
  navTheme: {
    type: String,
    default: 'light',
  },
  headerRender: {
    type: [Function, Boolean],
    default: () => undefined,
  },
  footerRender: {
    type: [Function, Boolean],
    default: () => undefined,
  },
  menuRender: {
    type: [Function, Boolean],
    default: () => undefined,
  },
  menuHeaderRender: {
    type: [Function, Boolean],
    default: () => undefined,
  },
  rightContentRender: {
    type: [Function, Boolean],
    default: () => undefined,
  },
  rightContent: {
    type: [Function, Boolean],
    default: () => undefined,
  },
} as any;

export default withInstall(ProLayout);
