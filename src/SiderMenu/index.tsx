import { FunctionalComponent } from 'vue';

import 'ant-design-vue/es/drawer/style';
import Drawer from 'ant-design-vue/es/drawer';

import SiderMenu, { SiderMenuProps, PrivateSiderMenuProps } from './SiderMenu';
import { DrawerSetting, useRouteContext } from '../RouteContext';
import { useProProvider } from '../ProProvider';

export type SiderMenuWrapperProps = SiderMenuProps & Partial<PrivateSiderMenuProps>;

const SiderMenuWrapper: FunctionalComponent<SiderMenuWrapperProps> = props => {
  const routeContext = useRouteContext();

  const proProvider = useProProvider();
  const { isMobile, drawerSetting } = routeContext;
  const drawerProps: DrawerSetting = {
    visible: drawerSetting.visible ?? !(routeContext.collapsed ?? false),
    placement: drawerSetting.placement ?? 'left',
    closable: drawerSetting.closable ?? false,
    width: drawerSetting.width || routeContext.siderWidth,
  };
  const onVisible = drawerSetting.onVisible;
  const className = proProvider.getPrefixCls('sider-drawer');
  return isMobile ? (
    <Drawer
      class={className}
      {...drawerProps}
      {...{
        'onUpdate:visible': (visible: boolean) => {
          onVisible && onVisible(visible);
        },
      }}
    >
      <SiderMenu {...props} />
    </Drawer>
  ) : (
    <SiderMenu {...props} />
  );
};

SiderMenuWrapper.inheritAttrs = false;
SiderMenuWrapper.displayName = 'SiderMenuWrapper';

export default SiderMenuWrapper;
