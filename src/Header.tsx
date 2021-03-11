import { defineComponent, computed, toRefs } from 'vue';
import 'ant-design-vue/es/layout/style';
import Layout from 'ant-design-vue/es/layout';

import { GlobalHeader, GlobalHeaderProps } from './GlobalHeader';
import { TopNavHeader } from './TopNavHeader';
import { useRouteContext } from './RouteContext';
import { VNodeType, WithFalse } from './typings';
import { clearMenuItem } from './utils';
import './Header.less';

const { Header } = Layout;

interface HeaderViewState {
  visible: boolean;
}

export type HeaderViewProps = GlobalHeaderProps & {
  isMobile?: boolean;
  collapsed?: boolean;
  logo?: VNodeType;

  headerRender?: WithFalse<(props: HeaderViewProps, defaultDom: VNodeType) => VNodeType>;
  headerTitleRender?: WithFalse<(props: HeaderViewProps, defaultDom: VNodeType) => VNodeType>;
  headerContentRender?: WithFalse<(props: HeaderViewProps) => VNodeType>;
  siderWidth?: number;
  hasSiderMenu?: boolean;
};
export const headerProps = [
  'prefixCls',
  'collapsed',
  'onCollapse',
  'openKeys',
  'selectedKeys',
  'isMobile',
  'logo',
  'title',
  'menuRender',
  'rightContentRender',
  'menuData',
  'menuHeaderRender',
  'splitMenus',
  'headerRender',
  'headerTitleRender',
  'headerContentRender',
  'siderWidth',
  'hasSiderMenu',
  'fixedHeader',
  'headerHeight',
  'headerTheme',
  'layout',
  'navTheme',
  'onSelect',
  'onOpenChange',
  'onOpenKeys',
];

export const HeaderView = defineComponent({
  inheritAttrs: false,
  name: 'HeaderView',
  props: headerProps,
  setup(props: HeaderViewProps) {
    const {
      prefixCls,
      isMobile,
      fixedHeader,
      hasSiderMenu,
      headerHeight,
      layout,
      navTheme,
      onCollapse,
    } = toRefs(props);
    const context = useRouteContext();
    const needFixedHeader = computed(
      () => fixedHeader.value || context.fixedHeader || layout.value === 'mix',
    );
    const isTop = computed(() => layout.value === 'top');
    const needSettingWidth = computed(
      () => needFixedHeader.value && hasSiderMenu.value && !isTop.value && !isMobile.value,
    );
    // cache menu
    const clearMenuData = computed(
      () => (context.menuData && clearMenuItem(context.menuData)) || [],
    );

    const className = computed(() => {
      return {
        [`${prefixCls.value}-fixed-header`]: needFixedHeader.value,
        [`${prefixCls.value}-top-menu`]: isTop.value,
      };
    });
    const renderContent = () => {
      let defaultDom = (
        <GlobalHeader {...props} onCollapse={onCollapse.value} menuData={clearMenuData.value}>
          {props.headerContentRender && props.headerContentRender(props)}
        </GlobalHeader>
      );
      if (isTop.value && !isMobile.value) {
        defaultDom = (
          <TopNavHeader
            theme={navTheme.value as 'light' | 'dark'}
            mode="horizontal"
            {...props}
            onCollapse={onCollapse.value}
            menuData={clearMenuData.value}
          />
        );
      }
      if (props.headerRender) {
        return props.headerRender(props, defaultDom);
      }
      return defaultDom;
    };

    /**
     * 计算侧边栏的宽度，不然导致左边的样式会出问题
     */
    const width = computed(() => {
      return layout.value !== 'mix' && needSettingWidth.value
        ? `calc(100% - ${props.collapsed ? 48 : props.siderWidth}px)`
        : '100%';
    });
    const right = computed(() => (needFixedHeader.value ? 0 : undefined));
    return () => {
      return (
        <>
          {needFixedHeader.value && (
            <Header
              style={{
                height: `${headerHeight.value}px`,
                lineHeight: `${headerHeight.value}px`,
                background: 'transparent',
              }}
            />
          )}
          <Header
            style={{
              padding: 0,
              height: `${headerHeight.value}px`,
              lineHeight: `${headerHeight.value}px`,
              width: width.value,
              zIndex: layout.value === 'mix' ? 100 : 19,
              right: right.value,
            }}
            class={className.value}
          >
            {renderContent()}
          </Header>
        </>
      );
    };
  },
});

export default HeaderView;
