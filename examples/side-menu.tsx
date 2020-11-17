import { createApp } from 'vue';
import 'ant-design-vue/dist/antd.less';

import './side-menu.less';
import { Layout, Input, message } from 'ant-design-vue';
import { menus } from './menus';
import { default as SiderMenuWrapper } from '../src/SiderMenu';
import { useMenuState } from '../src/SiderMenu/BaseMenu';
import * as Icon from '@ant-design/icons-vue';

const DemoComponent = {
  setup() {
    const { state: menuState } = useMenuState({
      collapsed: false,
      openKeys: [''],
      selectedKeys: ['/welcome'],
    });

    const handleCollapse = (collapsed: boolean) => {
      menuState.collapsed = collapsed;
    };
    const handleOpenChange = (openKeys: string[]) => {
      menuState.openKeys = openKeys;
    };
    const handleSelect = (selectedKeys: string[]) => {
      menuState.selectedKeys = selectedKeys;
    };

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
                onCollapse={handleCollapse}
                matchMenuKeys={[]}
                contentWidth={'Fixed'}
                primaryColor={'#1890ff'}
                siderWidth={208}
                menuExtraRender={(props) => !props.collapsed ? (
                  <div>
                    <Input.Search placeholder="Search.." style={{ width: '100%' }} onSearch={(value: string) => {
                      message.info(`Search click: ${value}`)
                    }} />
                  </div>
                ) : null}
                menuFooterRender={(props) => (
                  <div style="color: #fff; padding: 8px 16px; overflow: hidden;">
                    <span>状态：{JSON.stringify(props.collapsed)}</span>
                  </div>
                )}
              />
              <Layout>
                <Layout.Header style="background: #fff; padding: 0; height: 48px; line-height: 48px;"></Layout.Header>
                <Layout.Content
                  style={{
                    margin: '24px 16px',
                    padding: '24px',
                    background: '#fff',
                    minHeight: '280px',
                  }}
                >
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

const filterIcons = ['default', 'createFromIconfontCN', 'getTwoToneColor', 'setTwoToneColor'];
Object.keys(Icon)
  .filter(k => !filterIcons.includes(k))
  .forEach(k => {
    app.component(Icon[k].displayName, Icon[k]);
  });

app.mount('#__vue-content>div');
