import { ref, computed } from 'vue';
import type { FunctionalComponent, ExtractPropTypes } from 'vue';
import globalHeaderProps from '../GlobalHeader/headerProps';
import { siderMenuProps, defaultRenderLogoAndTitle } from '../SiderMenu/SiderMenu';
import type { SiderMenuProps } from '../SiderMenu/SiderMenu';
import BaseMenu from '../SiderMenu/BaseMenu';

import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer';
import type { FormatMessage } from '../typings';
import { useRouteContext } from '../RouteContext';
import './index.less';

export const topNavHeaderProps = Object.assign({}, siderMenuProps, globalHeaderProps);

export type TopNavHeaderProps = Partial<ExtractPropTypes<typeof topNavHeaderProps>> &
  Partial<SiderMenuProps>;

const RightContent: FunctionalComponent<TopNavHeaderProps> = ({ rightContentRender, ...props }) => {
  const rightSize = ref<number | string>('auto');

  return (
    <div
      style={{
        minWidth: rightSize.value,
      }}
    >
      <div
        style={{
          paddingRight: 8,
        }}
      >
        <ResizeObserver
          onResize={({ width }: { width: number }) => {
            rightSize.value = width;
          }}
        >
          {rightContentRender && typeof rightContentRender === 'function' ? (
            <div>
              {rightContentRender({
                ...props,
              })}
            </div>
          ) : (
            rightContentRender
          )}
        </ResizeObserver>
      </div>
    </div>
  );
};

export const TopNavHeader: FunctionalComponent<TopNavHeaderProps> = props => {
  const headerRef = ref();
  const {
    prefixCls: propPrefixCls,
    onMenuHeaderClick,
    onOpenKeys,
    onSelect,
    contentWidth,
    rightContentRender,
    layout,
    menuData,
  } = props;
  const context = useRouteContext();
  const prefixCls = `${propPrefixCls || 'ant-pro'}-top-nav-header`;
  const headerDom = defaultRenderLogoAndTitle(
    { ...props, collapsed: false } as SiderMenuProps,
    // REMARK:: Any time render header title
    // layout === 'mix' ? 'headerTitleRender' : undefined,
    layout !== 'side' ? 'headerTitleRender' : undefined,
  );
  const className = computed(() => {
    return {
      [prefixCls]: true,
      light: props.theme === 'light',
    };
  });
  return (
    <div class={className.value}>
      <div ref={headerRef} class={`${prefixCls}-main ${contentWidth === 'Fixed' ? 'wide' : ''}`}>
        {headerDom && (
          <div class={`${prefixCls}-main-left`} onClick={onMenuHeaderClick}>
            <div class={`${prefixCls}-logo`} key="logo" id="logo">
              {headerDom}
            </div>
          </div>
        )}
        <div style={{ flex: 1 }} class={`${prefixCls}-menu`}>
          <BaseMenu
            prefixCls={propPrefixCls}
            locale={props.locale || context.locale}
            theme={props.theme === 'realDark' ? 'dark' : props.theme}
            mode={props.mode}
            collapsed={props.collapsed}
            iconfontUrl={props.iconfontUrl}
            menuData={menuData}
            menuItemRender={props.menuItemRender}
            subMenuItemRender={props.subMenuItemRender}
            openKeys={context.openKeys}
            selectedKeys={context.selectedKeys}
            class={{ 'top-nav-menu': props.mode === 'horizontal' }}
            {...{
              'onUpdate:openKeys': ($event: string[]) => onOpenKeys && onOpenKeys($event),
              'onUpdate:selectedKeys': ($event: string[]) => onSelect && onSelect($event),
            }}
          />
        </div>
        {rightContentRender && <RightContent rightContentRender={rightContentRender} {...props} />}
      </div>
    </div>
  );
};

TopNavHeader.inheritAttrs = false;
