import { FunctionalComponent } from 'vue';

import 'ant-design-vue/es/drawer/style';
import Drawer from 'ant-design-vue/es/drawer';

import SiderMenu, { SiderMenuProps, PrivateSiderMenuProps } from './SiderMenu';

export type SiderMenuWrapperProps = SiderMenuProps & Partial<PrivateSiderMenuProps>;

const SiderMenuWrapper: FunctionalComponent<SiderMenuWrapperProps> = props => {
  return props.isMobile ? (
    <Drawer
      visible={!props.collapsed}
      closable={false}
      placement={'left'}
      style={{
        padding: 0,
        height: '100vh',
      }}
      onClose={() => props.onCollapse(true)}
      width={props.siderWidth}
      bodyStyle={{ height: '100vh', padding: 0, display: 'flex', flexDirection: 'row' }}
    >
      <SiderMenu
        {...props}
        collapsed={props.isMobile ? false : props.collapsed}
        splitMenus={false}
      />
    </Drawer>
  ) : (
    <SiderMenu {...props} />
  );
};

SiderMenuWrapper.inheritAttrs = true;
SiderMenuWrapper.displayName = 'SiderMenuWrapper';

export default SiderMenuWrapper;
