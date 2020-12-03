import { defineComponent, computed, toRefs, toRaw } from 'vue';
import 'ant-design-vue/es/layout/style';
import Layout from 'ant-design-vue/es/layout';

import { GlobalHeader, GlobalHeaderProps } from './GlobalHeader';
import { TopNavHeader } from './TopNavHeader';
import { RenderVNodeType, WithFalse } from './typings';
import { clearMenuItem } from './utils';
import './Header.less';

const { Header } = Layout;

interface HeaderViewState {
  visible: boolean;
}

export type HeaderViewProps = GlobalHeaderProps & {
  isMobile?: boolean;
  collapsed?: boolean;
  logo?: RenderVNodeType;

  headerRender?: WithFalse<
    (props: HeaderViewProps, defaultDom: RenderVNodeType) => RenderVNodeType
  >;
  headerTitleRender?: WithFalse<
    (props: HeaderViewProps, defaultDom: RenderVNodeType) => RenderVNodeType
  >;
  headerContentRender?: WithFalse<(props: HeaderViewProps) => RenderVNodeType>;
  siderWidth?: number;
  hasSiderMenu?: boolean;
};

export const HeaderView = defineComponent<HeaderViewProps>({
  setup(props) {
    const { prefixCls, headerRender, headerContentRender, isMobile, fixedHeader, hasSiderMenu, headerHeight, layout, navTheme, onCollapse } = toRefs(props);
    const isTop = computed(() => props.layout === 'top');
    const needFixedHeader = computed(() => fixedHeader.value || layout.value === 'mix');
    const needSettingWidth = computed(() => needFixedHeader.value && hasSiderMenu.value && !isTop.value && !isMobile.value);
    const clearMenuData = computed(() => clearMenuItem(props.menuData || []));
    const className = computed(() => {
      return {
        [`${prefixCls.value}-fixed-header`]: needFixedHeader.value,
        [`${prefixCls.value}-top-menu`]: isTop.value,
      }
    })
    const renderContent = () => {
      let defaultDom = (
        <GlobalHeader {...props} onCollapse={onCollapse.value} menuData={clearMenuData.value}>
          {headerContentRender.value && headerContentRender.value(props)}
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
      if (headerRender.value && typeof headerRender.value === 'function') {
        return headerRender.value(props, defaultDom);
      }
      return defaultDom;
    }

    /**
     * 计算侧边栏的宽度，不然导致左边的样式会出问题
     */
    const width = computed(() => {
      return layout.value !== 'mix' && needSettingWidth.value
        ? `calc(100% - ${props.collapsed ? 48 : props.siderWidth}px)`
          : '100%';
    });
    const right = computed(() => needFixedHeader.value ? 0 : undefined);

    return () => (
      <>
        {needFixedHeader && (
          <Header
            style={{
              height: headerHeight.value,
              lineHeight: `${headerHeight.value}px`,
              background: 'transparent',
            }}
          />
        )}
        <Header
          style={{
            padding: 0,
            height: headerHeight,
            lineHeight: `${headerHeight}px`,
            width,
            zIndex: layout.value === 'mix' ? 100 : 19,
            right,
          }}
          class={className}
        >
          {renderContent()}
        </Header>
      </>
    );
  },
});

export default HeaderView;
