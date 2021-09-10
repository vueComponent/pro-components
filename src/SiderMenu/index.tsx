import { FunctionalComponent as FC } from 'vue';

import 'ant-design-vue/es/drawer/style';
import { Drawer } from 'ant-design-vue';

import SiderMenu, { siderMenuProps, SiderMenuProps, PrivateSiderMenuProps } from './SiderMenu';

export type SiderMenuWrapperProps = Partial<SiderMenuProps> & Partial<PrivateSiderMenuProps>;

const SiderMenuWrapper: FC<SiderMenuWrapperProps> = (props, { attrs }) => {
  return props.isMobile ? (
    <Drawer
      visible={!props.collapsed}
      closable={false}
      placement={'left'}
      style={{
        padding: 0,
        height: '100vh',
      }}
      onClose={() => props.onCollapse && props.onCollapse(true)}
      width={props.siderWidth}
      bodyStyle={{ height: '100vh', padding: 0, display: 'flex', flexDirection: 'row' }}
    >
      <SiderMenu
        {...attrs}
        {...props}
        collapsed={props.isMobile ? false : props.collapsed}
        splitMenus={false}
      />
    </Drawer>
  ) : (
    <SiderMenu {...attrs} {...props} />
  );
};

SiderMenuWrapper.inheritAttrs = false;
SiderMenuWrapper.displayName = 'SiderMenuWrapper';

export {
  SiderMenu,
  // vue props
  siderMenuProps,
};

export default SiderMenuWrapper;
