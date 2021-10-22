import { defineComponent, computed, toRefs } from 'vue';
import type { PropType, ExtractPropTypes } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import 'ant-design-vue/es/layout/style';
import { Layout } from 'ant-design-vue';

import { GlobalHeader } from './GlobalHeader';
import type { GlobalHeaderProps } from './GlobalHeader';
import globalHeaderProps from './GlobalHeader/headerProps';
import { TopNavHeader } from './TopNavHeader';
import { useRouteContext } from './RouteContext';
import type { CustomRender, WithFalse } from './typings';
import { clearMenuItem, PropTypes } from './utils';
import './Header.less';

const { Header } = Layout;

export const headerViewProps = {
  ...globalHeaderProps,
  headerRender: {
    type: [Object, Function, Boolean] as PropType<
      WithFalse<(props: any, defaultDom: CustomRender) => CustomRender>
    >,
    default: () => undefined,
  },
  headerTitleRender: {
    type: [Object, Function, Boolean] as PropType<
      WithFalse<(props: any, defaultDom: CustomRender) => CustomRender>
    >,
    default: () => undefined,
  },
  headerContentRender: {
    type: [Object, Function, Boolean] as PropType<WithFalse<(props: any) => CustomRender>>,
    default: () => undefined,
  },
  hasSiderMenu: PropTypes.looseBool,
  siderWidth: PropTypes.number.def(208),
};

export type HeaderViewProps = Partial<ExtractPropTypes<typeof headerViewProps> & GlobalHeaderProps>;

export const HeaderView = defineComponent({
  name: 'HeaderView',
  inheritAttrs: false,
  props: headerViewProps,
  setup(props) {
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
    const isMix = computed(() => layout.value === 'mix');
    const isTop = computed(() => layout.value === 'top');
    const needSettingWidth = computed(
      () => needFixedHeader.value && hasSiderMenu.value && !isTop.value && !isMobile.value,
    );
    // cache menu
    const clearMenuData = computed(
      () => (context.menuData && clearMenuItem(context.menuData as RouteRecordRaw[])) || [],
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
          {!isMix.value
            ? props.headerContentRender && typeof props.headerContentRender === 'function'
              ? props.headerContentRender(props)
              : props.headerContentRender
            : null}
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
