import { FunctionalComponent, toRefs } from "vue"

import 'ant-design-vue/es/drawer/style';
import Drawer from 'ant-design-vue/es/drawer';

import SiderMenu, { SiderMenuProps, PrivateSiderMenuProps } from './SiderMenu';

const SiderMenuWrapper: FunctionalComponent<SiderMenuProps & PrivateSiderMenuProps> =
  (props, ctx) => {
    return props.isMobile ? (
      <Drawer>
        <SiderMenu
          {...props}
        />
      </Drawer>
    ) : (
      <SiderMenu
        {...props}
      />
    )
};

SiderMenuWrapper.inheritAttrs = false

export default SiderMenuWrapper;
