import { computed, reactive, unref, provide, defineComponent, toRefs } from 'vue';
import type { CSSProperties, PropType, ExtractPropTypes } from 'vue';
import 'ant-design-vue/es/layout/style';
import Layout from 'ant-design-vue/es/layout';
import { withInstall } from 'ant-design-vue/es/_util/type';
import { defaultSettingProps } from './defaultSettings';
import { BreadcrumbProps, getPrefixCls } from './RouteContext';
import { default as SiderMenuWrapper, siderMenuProps } from './SiderMenu';
import { WrapContent } from './WrapContent';
import { default as Header, headerViewProps } from './Header';
import { CustomRender, FormatMessage, WithFalse } from './typings';
import { getPropsSlot, PropTypes } from './utils';
import omit from 'omit.js';
import useMediaQuery from './hooks/useMediaQuery';
import './BasicLayout.less';

export const basicLayoutProps = {
  ...defaultSettingProps,
  ...siderMenuProps,
  ...headerViewProps,

  pure: PropTypes.looseBool,
  loading: PropTypes.looseBool,
  locale: {
    type: [Function, Object, Boolean] as PropType<WithFalse<FormatMessage>>,
    default: (s: string) => s,
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
  breadcrumbRender: {
    type: [Object, Function, Boolean] as PropType<WithFalse<BreadcrumbProps['itemRender']>>,
    default: () => {},
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

export type BasicLayoutProps = ExtractPropTypes<typeof basicLayoutProps>;

const ProLayout = defineComponent({
  name: 'ProLayout',
  inheritAttrs: false,
  emits: [
    'update:collapsed',
    'update:open-keys',
    'update:selected-keys',
    'collapse',
    'openKeys',
    'select',
    'menuHeaderClick',
  ],
  props: basicLayoutProps,
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
        customHeaderRender: WithFalse<CustomRender>;
        rightContentRender: WithFalse<CustomRender>;
      },
      matchMenuKeys?: string[],
    ): CustomRender | null => {
      if (p.headerRender === false || p.pure) {
        return null;
      }
      return <Header {...p} matchMenuKeys={matchMenuKeys || []} />;
    };
    const rightContentRender = getPropsSlot(slots, props, 'rightContentRender');
    const customHeaderRender = getPropsSlot(slots, props, 'headerRender');
    const menuHeaderRender = getPropsSlot(slots, props, 'menuHeaderRender');
    const footerRender = getPropsSlot(slots, props, 'footerRender');
    // const menuRender = getPropsSlot(slots, props, 'menuRender');
    const breadcrumbRender = getPropsSlot(slots, props, 'breadcrumbRender');

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
          customHeaderRender,
          rightContentRender,
          headerTitleRender: menuHeaderRender,
          theme: (props.navTheme || 'dark').toLocaleLowerCase().includes('dark') ? 'dark' : 'light',
        },
        props.matchMenuKeys,
      ),
    );

    const routeContext = reactive({
      getPrefixCls,
      ...props,
      locale: refProps.locale,
      breadcrumb: computed(() => {
        return {
          ...refProps.breadcrumb,
          itemRender: breadcrumbRender,
        };
      }),
      contentWidth: 'Fluid',
      layout: refProps.layout,
      navTheme: refProps.navTheme,
      splitMenus: refProps.splitMenus,
      fixedHeader: refProps.fixSiderbar,
      fixSiderbar: refProps.fixSiderbar,
      sideWidth: siderWidth,
      hasFooterToolbar: false,
      menuData: refProps.menuData,
      selectedKeys: refProps.selectedKeys,
      openKeys: refProps.openKeys,
    });

    const restProps = computed(() => omit(props, ['onCollapse', 'onOpenKeys', 'onSelect']));
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
                  onCollapse={onCollapse}
                  onSelect={onSelect}
                  onOpenKeys={onOpenKeys}
                />
              )}
              <Layout style={genLayoutStyle}>
                {headerDom.value}
                <WrapContent
                  isChildrenLayout={props.isChildrenLayout}
                  style={props.disableContentMargin ? undefined : props.contentStyle}
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

export default withInstall(ProLayout);
