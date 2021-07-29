import { computed, reactive, unref, provide, defineComponent, toRefs, watch } from 'vue';
import type { CSSProperties, PropType, ExtractPropTypes } from 'vue';

import 'ant-design-vue/es/layout/style';
import Layout from 'ant-design-vue/es/layout';
import omit from 'omit.js';
import { withInstall } from 'ant-design-vue/es/_util/type';
import useMediaQuery from './hooks/useMediaQuery';

import { defaultSettingProps } from './defaultSettings';
import { getPrefixCls, defaultRouteContext } from './RouteContext';
import type { BreadcrumbProps } from './RouteContext';
import { default as SiderMenuWrapper, siderMenuProps } from './SiderMenu';
import { WrapContent } from './WrapContent';
import globalHeaderProps from './GlobalHeader/headerProps';
import { HeaderView as Header, headerViewProps } from './Header';
import { getPropsSlot, PropTypes } from './utils';

import type { CustomRender, FormatMessage, WithFalse } from './typings';

import './BasicLayout.less';
import PageLoading from '@/PageLoading';

export const basicLayoutProps = {
  ...defaultSettingProps,
  ...siderMenuProps,
  ...globalHeaderProps,
  ...headerViewProps,

  pure: PropTypes.looseBool,
  loading: PropTypes.looseBool,
  locale: {
    type: [Function, Boolean] as PropType<WithFalse<FormatMessage>>,
    default() {
      return (s: string) => s;
    },
  },
  /**
   * 是否禁用移动端模式，有的管理系统不需要移动端模式，此属性设置为true即可
   */
  disableMobile: PropTypes.looseBool,
  isChildrenLayout: PropTypes.looseBool,
  /**
   * 兼用 content的 margin
   */
  disableContentMargin: PropTypes.looseBool,
  breadcrumb: {
    type: [Object, Function] as PropType<BreadcrumbProps>,
    default: () => null,
  },
  collapsedButtonRender: {
    type: [Function, Object, Boolean] as PropType<WithFalse<(collapsed?: boolean) => CustomRender>>,
    default: () => undefined,
  },
  breadcrumbRender: {
    type: [Object, Function, Boolean] as PropType<WithFalse<BreadcrumbProps['itemRender']>>,
    default: () => {},
  },
  headerContentRender: {
    type: [Function, Object, Boolean] as PropType<WithFalse<() => CustomRender>>,
    default: () => undefined,
  },
  headerRender: {
    type: [Object, Function, Boolean] as PropType<
      WithFalse<(props: any /* HeaderProps */) => CustomRender>
    >,
    default: () => undefined,
  },
  footerRender: {
    type: [Object, Function, Boolean] as PropType<
      WithFalse<(props: any /* FooterProps */) => CustomRender>
    >,
    default: () => undefined,
  },
  colSize: PropTypes.string,
  contentStyle: PropTypes.style,
};

export type BasicLayoutProps = Partial<ExtractPropTypes<typeof basicLayoutProps>>;

const ProLayout = defineComponent({
  name: 'ProLayout',
  props: basicLayoutProps,
  // inheritAttrs: false,
  emits: [
    'update:collapsed',
    'update:open-keys',
    'update:selected-keys',
    'collapse',
    'openKeys',
    'select',
    'menuHeaderClick',
    'menuClick',
  ],
  setup(props, { emit, slots }) {
    const refProps = toRefs(props);
    const isTop = computed(() => props.layout === 'top');
    // const isSide = computed(() => layout === 'side');
    // const isMix = computed(() => layout === 'mix');
    const pure = computed(() => props.pure);
    const siderWidth = computed(() => (props.collapsed ? props.collapsedWidth : props.siderWidth));
    // if on event and @event
    const onCollapse = (collapsed: boolean) => {
      emit('update:collapsed', collapsed);
      emit('collapse', collapsed);
    };
    const onOpenKeys = (openKeys: string[] | false) => {
      emit('update:open-keys', openKeys);
      emit('openKeys', openKeys);
    };
    const onSelect = (selectedKeys: string[] | false) => {
      emit('update:selected-keys', selectedKeys);
      emit('select', selectedKeys);
    };
    const onMenuHeaderClick = (e: MouseEvent) => {
      emit('menuHeaderClick', e);
    };
    const onMenuClick = (args: any) => {
      emit('menuClick', args);
    };

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
    const genLayoutStyle = reactive<CSSProperties>({
      position: 'relative',
    });

    // if is some layout children, don't need min height
    if (props.isChildrenLayout || (props.contentStyle && props.contentStyle.minHeight)) {
      genLayoutStyle.minHeight = 0;
    }

    // const [collapsed, onCollapse] = useMergedState<boolean>(defaultCollapsed || false, {
    //   value: props.collapsed,
    //   onChange: propsOnCollapse,
    // });
    const headerRender = (
      p: BasicLayoutProps & {
        hasSiderMenu: boolean;
        headerRender: WithFalse<CustomRender>;
        rightContentRender: WithFalse<CustomRender>;
      },
      matchMenuKeys?: string[],
    ): CustomRender | null => {
      if (p.headerRender === false || p.pure) {
        return null;
      }
      return <Header {...p} matchMenuKeys={matchMenuKeys || []} />;
    };
    const collapsedButtonRender =
      props.collapsedButtonRender === false
        ? false
        : getPropsSlot(slots, props, 'collapsedButtonRender');
    const headerContentRender = getPropsSlot(slots, props, 'headerContentRender');
    const rightContentRender = getPropsSlot(slots, props, 'rightContentRender');
    const customHeaderRender = getPropsSlot(slots, props, 'headerRender');
    const menuHeaderRender = getPropsSlot(slots, props, 'menuHeaderRender');
    const footerRender = getPropsSlot(slots, props, 'footerRender');
    // const menuRender = getPropsSlot(slots, props, 'menuRender');
    const breadcrumbRender = props.breadcrumbRender || slots.breadcrumbRender;

    const headerDom = computed(() =>
      headerRender(
        {
          ...props,
          hasSiderMenu: !isTop.value,
          menuData: props.menuData,
          isMobile: unref(isMobile),
          onCollapse,
          onOpenKeys,
          onSelect,
          onMenuHeaderClick,
          rightContentRender,
          headerTitleRender: menuHeaderRender,
          headerContentRender,
          headerRender: customHeaderRender,
          theme: (props.navTheme || 'dark').toLocaleLowerCase().includes('dark') ? 'dark' : 'light',
        },
        props.matchMenuKeys,
      ),
    );

    const routeContext = reactive({
      getPrefixCls,
      // ...props,
      locale: refProps.locale.value || defaultRouteContext.locale,
      breadcrumb: computed(() => {
        return {
          ...props.breadcrumb,
          itemRender: breadcrumbRender,
        };
      }),
      contentWidth: refProps.contentWidth, // 'Fluid',
      layout: refProps.layout,
      navTheme: refProps.navTheme,
      splitMenus: refProps.splitMenus,
      fixedHeader: refProps.fixSiderbar,
      fixSiderbar: refProps.fixSiderbar,
      sideWidth: siderWidth,
      headerHeight: refProps.headerHeight,
      hasFooterToolbar: false,
      menuData: refProps.menuData,
      selectedKeys: refProps.selectedKeys,
      openKeys: refProps.openKeys,
    });

    const restProps = computed(() =>
      omit(props, ['onCollapse', 'onOpenKeys', 'onSelect', 'onMenuClick', 'menuHeaderRender']),
    );
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
                  {...restProps.value}
                  isMobile={isMobile.value}
                  menuHeaderRender={menuHeaderRender}
                  collapsedButtonRender={collapsedButtonRender}
                  onCollapse={onCollapse}
                  onSelect={onSelect}
                  onOpenKeys={onOpenKeys}
                  onMenuClick={onMenuClick}
                />
              )}
              <Layout style={genLayoutStyle}>
                {headerDom.value}
                <WrapContent
                  isChildrenLayout={props.isChildrenLayout}
                  style={props.disableContentMargin ? undefined : props.contentStyle}
                >
                  {props.loading ? <PageLoading /> : slots.default?.()}
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

export default withInstall(ProLayout);
