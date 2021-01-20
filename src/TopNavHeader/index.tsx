import { ref, computed, FunctionalComponent } from 'vue';
import {
  SiderMenuProps,
  defaultRenderLogoAndTitle,
  PrivateSiderMenuProps,
} from '../SiderMenu/SiderMenu';
import BaseMenu from '../SiderMenu/BaseMenu';
import { GlobalHeaderProps } from '../GlobalHeader';
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer';

import './index.less';
import { useRouteContext } from '../RouteContext';

export type TopNavHeaderProps = SiderMenuProps & GlobalHeaderProps & PrivateSiderMenuProps & {};

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
    { ...props, collapsed: false },
    layout === 'mix' ? 'headerTitleRender' : undefined,
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
            theme={props.theme === 'realDark' ? 'dark' : props.theme}
            mode={props.mode}
            collapsed={props.collapsed}
            menuData={menuData}
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
