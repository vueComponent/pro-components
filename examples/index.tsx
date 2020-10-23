import { createApp, reactive } from 'vue';
import 'ant-design-vue/dist/antd.less';
import { Button, message } from 'ant-design-vue';
import { default as BasicLayout } from '../src/BasicLayout';
import { menus } from './menus';
import { useMenuState } from '../src/SiderMenu/BaseMenu';
import * as Icon from '@ant-design/icons-vue';

const SimpleDemo = {
  setup() {
    const { state: menuState } = useMenuState({
      collapsed: false,
      openKeys: [],
      selectedKeys: [],
    });

    return () => (
      <div class="components">
        <h2># BasicLayout</h2>
        <BasicLayout
          v-model={[menuState.collapsed, 'collapsed']}
          title={'Pro Layout'}
          layout={'side'}
          theme={'dark'}
          isMobile={false}
          menuData={menus}
          matchMenuKeys={[]}
          contentWidth={'Fixed'}
          primaryColor={'#1890ff'}
          siderWidth={208}
          openKeys={menuState.openKeys}
          selectedKeys={menuState.selectedKeys}
          onOpenChange={$event => {
            menuState.openKeys = $event;
          }}
          onSelect={$event => {
            menuState.selectedKeys = $event;
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

const filterIcons = ['default', 'createFromIconfontCN', 'getTwoToneColor', 'setTwoToneColor'];
Object.keys(Icon)
  .filter(k => !filterIcons.includes(k))
  .forEach(k => {
    app.component(Icon[k].displayName, Icon[k]);
  });

app.use(BasicLayout).mount('#__vue-content>div');
