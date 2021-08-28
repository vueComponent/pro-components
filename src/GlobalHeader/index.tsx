import { computed } from 'vue';
import type { FunctionalComponent, ExtractPropTypes } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import type { CustomRender } from '../typings';
import {
  defaultRenderLogo,
  defaultRenderLogoAndTitle,
  defaultRenderCollapsedButton,
} from '../SiderMenu/SiderMenu';
import type { SiderMenuProps } from '../SiderMenu/SiderMenu';
import { TopNavHeader } from '../TopNavHeader';
import { clearMenuItem } from '../utils';
import { useRouteContext } from '../RouteContext';
import globalHeaderProps from './headerProps';

import './index.less';

export type GlobalHeaderProps = ExtractPropTypes<typeof globalHeaderProps>;

const renderLogo = (
  menuHeaderRender: SiderMenuProps['menuHeaderRender'],
  logoDom: CustomRender,
) => {
  if (menuHeaderRender === false) {
    return null;
  }
  if (menuHeaderRender) {
    return menuHeaderRender(logoDom, null);
  }
  return logoDom;
};

export const GlobalHeader: FunctionalComponent<GlobalHeaderProps> = (props, { slots, emit }) => {
  const {
    isMobile,
    logo,
    collapsed,
    collapsedButtonRender = defaultRenderCollapsedButton,
    rightContentRender,
    menuHeaderRender,
    onMenuHeaderClick,
    layout,
    headerTheme = 'dark',
    splitMenus,
    menuData,
    prefixCls: customPrefixCls,
  } = props;
  const { getPrefixCls } = useRouteContext();
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
    })) as RouteRecordRaw[];
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
  const onCollapse = () => {
    emit('collapse', !props.collapsed)
  }

  return (
    <div class={className.value}>
      {isMobile && renderLogo(menuHeaderRender, logoDom)}
      {isMobile && collapsedButtonRender && (
        <span
          class={`${baseClassName.value}-collapsed-button`}
          onClick={onCollapse}
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
GlobalHeader.inheritAttrs = false
GlobalHeader.emits = ['menuHeaderClick', 'collapse', 'openKeys', 'select'];
