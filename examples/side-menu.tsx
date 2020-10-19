import { createApp, reactive } from 'vue';
import 'ant-design-vue/dist/antd.less';

import './side-menu.less';
import { Card, Space, Button, Layout } from 'ant-design-vue';
import { menus } from './menus';
import SiderMenuWrapper from '../src/SiderMenu';
import * as Icon from '@ant-design/icons-vue';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import { useMenuState } from '../src/SiderMenu/BaseMenu';

const DemoComponent = {
  setup() {
    const {
      state: menuState,
    } = useMenuState({
      collapsed: false,
      openKeys: ['/dashboard'] as string[],
      selectedKeys: ['/dashboard/monitor'] as string[],
    });

    const handleClick = () => {
      menuState.collapsed = !menuState.collapsed;
      console.log('handleClick', menuState.collapsed);
    };
    const handleOpenChange = (openKeys: string[]) => {
      menuState.openKeys = openKeys;
    }
    const handleSelect = (selectedKeys: string[]) => {
      menuState.selectedKeys = selectedKeys;
    }

    return () => (
      <div class="components">
        <h2># SideMenu</h2>
        <div class="demo" style="background: rgb(244,244,244); min-height: 400px;">
          <div class="container side-menu-demo">
            <Layout class="ant-pro-basicLayout">
              <SiderMenuWrapper
                title={'Pro Layout'}
                layout={'side'}
                theme={'dark'}
                isMobile={false}
                collapsed={menuState.collapsed}
                menuData={menus}
                openKeys={menuState.openKeys}
                selectedKeys={menuState.selectedKeys}
                onOpenChange={handleOpenChange}
                onSelect={handleSelect}
                matchMenuKeys={[]}
                contentWidth={'Fixed'}
                primaryColor={'#1890ff'}
                siderWidth={208}
              />
              <Layout>
                <Layout.Header style="background: #fff; padding: 0; height: 48px; line-height: 48px;">
                  {
                    menuState.collapsed
                      ? <MenuUnfoldOutlined class="trigger" onClick={handleClick} />
                      : <MenuFoldOutlined  class="trigger" onClick={handleClick} />
                  }
                </Layout.Header>
                <Layout.Content style={{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }}>
                  <div>Context</div>
                </Layout.Content>
              </Layout>
            </Layout>

          </div>
        </div>
      </div>
    );
  },
};

const app = createApp(DemoComponent);

const filterIcons = ['default', 'createFromIconfontCN', 'getTwoToneColor', 'setTwoToneColor']
Object.keys(Icon)
  .filter(k => !filterIcons.includes(k))
  .forEach(k => {
    app.component(Icon[k].displayName, Icon[k])
  })

app.mount('#__vue-content>div');
