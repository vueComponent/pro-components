import { createApp, reactive } from 'vue';
import { Button, message } from 'ant-design-vue';
import { default as BasicLayout } from '../src/BasicLayout';
import 'ant-design-vue/dist/antd.less';

import { menus } from './menus';
import BaseMenu, { useMenuState } from '../src/SiderMenu/BaseMenu';
import * as Icon from '@ant-design/icons-vue';

const SimpleDemo = {
  setup() {
    const { state: menuState } = useMenuState({
      collapsed: false,
      openKeys: [],
      selectedKeys: [],
    })

    return () => (
      <div class="components">
        <h2># BasicLayout</h2>
        <BasicLayout
          menus={menus}
          collapsed={menuState.collapsed}
          openKeys={menuState.openKeys}
          selectedKeys={menuState.selectedKeys}
          {...{
            'onUpdate:collapsed': $event => {
              menuState.collapsed = $event;
            },
            'onUpdate:openKeys': $event => {
              menuState.openKeys = $event
            },
            'onUpdate:selectedKeys': $event => {
              menuState.selectedKeys = $event
            }
          }}
        >
          <Button
            onClick={() => {
              message.info('clicked.');
            }}
          >
            Click Me!!
          </Button>
        </BasicLayout>
      </div>
    );
  },
};

const app = createApp(SimpleDemo);

const filterIcons = ['default', 'createFromIconfontCN', 'getTwoToneColor', 'setTwoToneColor']
Object.keys(Icon)
  .filter(k => !filterIcons.includes(k))
  .forEach(k => {
    app.component(Icon[k].displayName, Icon[k])
  })

app.use(BasicLayout).mount('#__vue-content>div');
