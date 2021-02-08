import { computed, CSSProperties, FunctionalComponent } from 'vue';
import { PureSettings } from '../defaultSettings';
import { RenderVNodeType, MenuDataItem, WithFalse } from '../typings';
import {
  SiderMenuProps,
  PrivateSiderMenuProps,
  defaultRenderLogo,
  defaultRenderLogoAndTitle,
  defaultRenderCollapsedButton,
} from '../SiderMenu/SiderMenu';
import { TopNavHeader } from '../TopNavHeader';
import { clearMenuItem } from '../utils';
import type { HeaderViewProps } from '../Header';
import './index.less';
import { useProProvider } from '../ProProvider';

export interface GlobalHeaderProps extends Partial<PureSettings> {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean;
  logo?: RenderVNodeType;
  menuRender?: WithFalse<(props: HeaderViewProps, defaultDom: RenderVNodeType) => RenderVNodeType>;
  rightContentRender?: WithFalse<(props: HeaderViewProps) => RenderVNodeType>;
  className?: string;
  prefixCls?: string;
  menuData?: MenuDataItem[];
  onMenuHeaderClick?: (e: MouseEvent) => void;
  style?: CSSProperties;
  menuHeaderRender?: SiderMenuProps['menuHeaderRender'];
  collapsedButtonRender?: SiderMenuProps['collapsedButtonRender'];
  splitMenus?: boolean;
  onOpenKeys?: (openKeys: WithFalse<string[]>) => void;
  onSelect?: (selectedKeys: WithFalse<string[]>) => void;
}

const renderLogo = (
  menuHeaderRender: SiderMenuProps['menuHeaderRender'],
  logoDom: RenderVNodeType,
) => {
  if (menuHeaderRender === false) {
    return null;
  }
  if (menuHeaderRender) {
    return menuHeaderRender(logoDom, null);
  }
  return logoDom;
};

export const GlobalHeader: FunctionalComponent<GlobalHeaderProps & PrivateSiderMenuProps> = (
  props,
  { slots },
) => {
  const {
    isMobile,
    logo,
    collapsed,
    onCollapse,
    collapsedButtonRender = defaultRenderCollapsedButton,
    rightContentRender,
    menuHeaderRender,
    onMenuHeaderClick,
    // className: propClassName,
    layout,
    headerTheme = 'dark',
    splitMenus,
    menuData,
    prefixCls: customPrefixCls,
  } = props;
  const { getPrefixCls } = useProProvider();
  const prefixCls = customPrefixCls || getPrefixCls();
  const baseClassName = computed(() => `${prefixCls}-global-header`);
  const className = computed(() => {
    return {
      [baseClassName.value]: true,
      [`${baseClassName.value}-layout-${layout}`]: layout && headerTheme === 'dark',
    };
  });
  if (layout === 'mix' && !isMobile && splitMenus) {
    const noChildrenMenuData = (menuData || []).map(item => ({
      ...item,
      children: undefined,
    }));
    const clearMenuData = clearMenuItem(noChildrenMenuData);
    return (
      <TopNavHeader
        mode="horizontal"
        {...props}
        splitMenus={false}
        menuData={clearMenuData}
        theme={headerTheme as 'light' | 'dark'}
      />
    );
  }

  const logoDom = (
    <span class={`${baseClassName.value}-logo`} key="logo">
      <a>{defaultRenderLogo(logo)}</a>
    </span>
  );

  return (
    <div class={className.value}>
      {isMobile && renderLogo(menuHeaderRender, logoDom)}
      {isMobile && collapsedButtonRender && (
        <span
          class={`${baseClassName.value}-collapsed-button`}
          onClick={() => {
            if (onCollapse) {
              onCollapse(!collapsed);
            }
          }}
        >
          {collapsedButtonRender(collapsed)}
        </span>
      )}
      {layout === 'mix' && !isMobile && (
        <>
          <div class={`${baseClassName.value}-logo`} onClick={onMenuHeaderClick}>
            {defaultRenderLogoAndTitle({ ...props, collapsed: false }, 'headerTitleRender')}
          </div>
        </>
      )}
      <div style={{ flex: 1 }}>{slots.default?.()}</div>
      {rightContentRender && typeof rightContentRender === 'function'
        ? rightContentRender(props)
        : rightContentRender}
    </div>
  );
};

export default GlobalHeader;
