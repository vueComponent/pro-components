import {
  computed,
  reactive,
  unref,
  defineComponent,
  toRefs,
  provide,
  type App,
  type Plugin,
  type CSSProperties,
  type PropType,
  type ExtractPropTypes,
  type DefineComponent,
  watchEffect,
} from 'vue';

import 'ant-design-vue/es/layout/style';
import { Layout } from 'ant-design-vue';
import useConfigInject from 'ant-design-vue/es/_util/hooks/useConfigInject';
import useMediaQuery from './hooks/useMediaQuery';

import { defaultSettingProps } from './defaultSettings';
import { routeContextInjectKey, defaultRouteContext, type RouteContextProps } from './RouteContext';
import SiderMenuWrapper, { siderMenuProps } from './components/SiderMenu';
import { WrapContent } from './WrapContent';
import { HeaderView as Header, headerViewProps } from './Header';
import { getSlot, getMenuFirstChildren, pick } from './utils';
import globalHeaderProps from './components/GlobalHeader/headerProps';

import type { BreadcrumbProps } from './RouteContext';
import type { CustomRender, FormatMessage, WithFalse } from './typings';
import type {
  BreadcrumbRender,
  HeaderContentRender,
  HeaderRender,
  FooterRender,
  RightContentRender,
  MenuItemRender,
  SubMenuItemRender,
  MenuContentRender,
  MenuFooterRender,
  MenuExtraRender,
  MenuHeaderRender,
  CollapsedButtonRender,
} from './RenderTypings';

import PageLoading from './components/PageLoading';
import './BasicLayout.less';

export const basicLayoutProps = {
  ...defaultSettingProps,
  ...siderMenuProps,
  ...globalHeaderProps,
  ...headerViewProps,

  pure: Boolean,
  loading: Boolean,
  locale: {
    type: [Function, Boolean] as PropType<WithFalse<FormatMessage>>,
    default() {
      return (s: string) => s;
    },
  },
  /**
   * 是否禁用移动端模式，有的管理系统不需要移动端模式，此属性设置为true即可
   */
  disableMobile: {
    type: Boolean,
    required: false,
  },
  isChildrenLayout: {
    type: Boolean,
    required: false,
  },
  /**
   * 兼用 content 的 margin
   */
  disableContentMargin: {
    type: Boolean,
    required: false,
  },
  colSize: {
    type: Number,
    required: false,
  },
  contentStyle: {
    type: [String, Object] as PropType<CSSProperties>,
    default: () => {
      return null;
    },
  },
  breadcrumb: {
    type: [Object, Function] as PropType<BreadcrumbProps>,
    default: () => null,
  },
  collapsedButtonRender: {
    type: [Function, Object, Boolean] as PropType<WithFalse<(collapsed?: boolean) => CustomRender>>,
    default: () => undefined,
  },
  breadcrumbRender: {
    type: [Object, Function, Boolean] as PropType<BreadcrumbRender>,
    default() {
      return null;
    },
  },
  headerContentRender: {
    type: [Function, Object, Boolean] as PropType<HeaderContentRender>,
    default: () => undefined,
  },
  headerRender: {
    type: [Object, Function, Boolean] as PropType<HeaderRender>,
    default: () => undefined,
  },
  footerRender: {
    type: [Object, Function, Boolean] as PropType<FooterRender>,
    default: () => undefined,
  },
};

export type BasicLayoutProps = Partial<ExtractPropTypes<typeof basicLayoutProps>>;

const ProLayout = defineComponent({
  name: 'ProLayout',
  inheritAttrs: false,
  props: basicLayoutProps,
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
  setup(props, { emit, attrs, slots }) {
    const { prefixCls } = useConfigInject('layout', {});

    const isTop = computed(() => props.layout === 'top');
    const hasSide = computed(() => props.layout === 'mix' || props.layout === 'side' || false);
    const hasSplitMenu = computed(() => props.layout === 'mix' && props.splitMenus);
    const hasFlatMenu = computed(() => {
      return hasSide.value && hasSplitMenu.value;
    });

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
    const isMobile = computed(() => (colSize.value === 'sm' || colSize.value === 'xs') && !props.disableMobile);
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
    watchEffect(() => {
      if (props.isChildrenLayout || (props.contentStyle && props.contentStyle.minHeight)) {
        genLayoutStyle.minHeight = 0;
      }
    });

    const headerRender = (
      p: BasicLayoutProps & {
        hasSiderMenu: boolean;
        headerRender: HeaderRender;
        rightContentRender: RightContentRender;
      },
      matchMenuKeys?: string[]
    ): CustomRender | null => {
      if (p.headerRender === false || p.pure) {
        return null;
      }
      return <Header {...p} matchMenuKeys={matchMenuKeys || []} />;
    };

    const breadcrumb = computed<BreadcrumbProps>(() => ({
      ...props.breadcrumb,
      itemRender: getSlot<BreadcrumbRender>(slots, props, 'breadcrumbRender') as BreadcrumbRender,
    }));

    const flatMenuData = computed(
      () =>
        (hasFlatMenu.value && props.selectedKeys && getMenuFirstChildren(props.menuData, props.selectedKeys[0])) || []
    );

    const routeContext = reactive<RouteContextProps>({
      ...defaultRouteContext,
      ...(pick(toRefs(props), [
        'locale',
        'menuData',
        'openKeys',
        'selectedKeys',
        'contentWidth',
        'disableMobile',
        'fixSiderbar',
        'fixedHeader',
        'headerHeight',
        // 'hasSideMenu',
        // 'hasHeader',
        // 'hasFooter',
        // 'hasFooterToolbar',
        // 'setHasFooterToolbar',
      ]) as any),
      isMobile,
      siderWidth,
      breadcrumb,
      flatMenuData,
      hasSide,
      hasHeader: true,
      flatMenu: hasFlatMenu,
    });
    provide(routeContextInjectKey, routeContext);

    return () => {
      const {
        pure,
        onCollapse: propsOnCollapse,
        onOpenKeys: propsOnOpenKeys,
        onSelect: propsOnSelect,
        onMenuClick: propsOnMenuClick,
        ...restProps
      } = props;

      const collapsedButtonRender = getSlot<CollapsedButtonRender>(slots, props, 'collapsedButtonRender');
      const headerContentRender = getSlot<HeaderContentRender>(slots, props, 'headerContentRender');
      const rightContentRender = getSlot<RightContentRender>(slots, props, 'rightContentRender');
      const customHeaderRender = getSlot<HeaderRender>(slots, props, 'headerRender');
      const footerRender = getSlot<FooterRender>(slots, props, 'footerRender');

      // menu
      const menuHeaderRender = getSlot<MenuHeaderRender>(slots, props, 'menuHeaderRender');
      const menuExtraRender = getSlot<MenuExtraRender>(slots, props, 'menuExtraRender');
      const menuContentRender = getSlot<MenuContentRender>(slots, props, 'menuContentRender');
      const menuFooterRender = getSlot<MenuFooterRender>(slots, props, 'menuFooterRender');
      const menuItemRender = getSlot<MenuItemRender>(slots, props, 'menuItemRender');
      const subMenuItemRender = getSlot<SubMenuItemRender>(slots, props, 'subMenuItemRender');

      const headerDom = computed(() =>
        headerRender(
          {
            ...props,
            menuItemRender,
            subMenuItemRender,
            hasSiderMenu: !isTop.value,
            menuData: props.menuData,
            isMobile: unref(isMobile),
            onCollapse,
            onOpenKeys,
            onSelect,
            onMenuHeaderClick,
            rightContentRender,
            collapsedButtonRender,
            headerTitleRender: menuHeaderRender,
            menuExtraRender,
            menuContentRender,
            headerContentRender,
            headerRender: customHeaderRender,
            theme: (props.navTheme || 'dark').toLocaleLowerCase().includes('dark') ? 'dark' : 'light',
          },
          props.matchMenuKeys
        )
      );

      routeContext.hasHeader = !!headerDom.value;

      const contentClassName = computed(() => {
        return {
          [`${baseClassName.value}-content`]: true,
          [`${baseClassName.value}-has-header`]: headerDom,
          [`${baseClassName.value}-content-disable-margin`]: props.disableContentMargin,
        };
      });

      return (
        <>
          {pure ? (
            slots.default?.()
          ) : (
            <div class={className.value}>
              <Layout
                style={{
                  minHeight: '100%',
                  ...((attrs.style as CSSProperties) || {}),
                }}
              >
                {(!isTop.value || isMobile.value) && (
                  <SiderMenuWrapper
                    {...restProps}
                    isMobile={isMobile.value}
                    menuHeaderRender={menuHeaderRender}
                    menuExtraRender={menuExtraRender}
                    menuContentRender={menuContentRender}
                    menuFooterRender={menuFooterRender}
                    menuItemRender={menuItemRender}
                    subMenuItemRender={subMenuItemRender}
                    collapsedButtonRender={collapsedButtonRender}
                    onCollapse={onCollapse}
                    onSelect={onSelect}
                    onOpenKeys={onOpenKeys}
                    onMenuClick={onMenuClick}
                  />
                )}
                <div style={genLayoutStyle} class={prefixCls.value}>
                  {headerDom.value}
                  <WrapContent
                    isChildrenLayout={props.isChildrenLayout}
                    class={contentClassName.value}
                    style={props.contentStyle}
                  >
                    {props.loading ? <PageLoading /> : slots.default?.()}
                  </WrapContent>
                  {footerRender && footerRender(props)}
                </div>
              </Layout>
            </div>
          )}
        </>
      );
    };
  },
});

ProLayout.install = (app: App) => {
  app.component(ProLayout.name, ProLayout);
  return app;
};

export default ProLayout as DefineComponent<BasicLayoutProps> & Plugin;
