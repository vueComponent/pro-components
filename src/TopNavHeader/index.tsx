import { ref, computed, FunctionalComponent } from "vue";
import {
  SiderMenuProps,
  defaultRenderLogoAndTitle,
  PrivateSiderMenuProps,
} from '../SiderMenu/SiderMenu';
import BaseMenu from '../SiderMenu/BaseMenu';
import { GlobalHeaderProps } from '../GlobalHeader';
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer';

import './index.less';

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
          {rightContentRender && (
            <div>
              {rightContentRender({
                ...props,
              })}
            </div>
          )}
        </ResizeObserver>
      </div>
    </div>
  );
};

export const TopNavHeader: FunctionalComponent<TopNavHeaderProps> = (props) => {
  const headerRef = ref();
  const {
    theme,
    onMenuHeaderClick,
    contentWidth,
    rightContentRender,
    layout,
  } = props;
  const prefixCls = `${props.prefixCls || 'ant-pro'}-top-nav-header`;
  const headerDom = defaultRenderLogoAndTitle(
    { ...props, collapsed: false },
    layout === 'mix' ? 'headerTitleRender' : undefined,
  );
  const className = computed(() => {
    return {
      [prefixCls]: true,
      light: theme === 'light',
    }
  });
  return (
    <div class={className}>
    <div ref={headerRef} class={`${prefixCls}-main ${contentWidth === 'Fixed' ? 'wide' : ''}`}>
      {headerDom && (
        <div class={`${prefixCls}-main-left`} onClick={onMenuHeaderClick}>
          <div class={`${prefixCls}-logo`} key="logo" id="logo">
            {headerDom}
          </div>
        </div>
      )}
      <div style={{ flex: 1 }} class={`${prefixCls}-menu`}>
        <BaseMenu {...props} />
      </div>
      {rightContentRender && <RightContent rightContentRender={rightContentRender} {...props} />}
    </div>
  </div>
  )
};
