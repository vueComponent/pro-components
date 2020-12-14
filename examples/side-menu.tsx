import { createApp, reactive } from 'vue';
import 'ant-design-vue/dist/antd.less';

import './side-menu.less';
import { Layout, Input, Space, Switch, message } from 'ant-design-vue';
import { menus } from './menus';
import { default as SiderMenuWrapper } from '../src/SiderMenu';
import { useMenu } from '../src/hooks/useMenu';
import * as Icon from '@ant-design/icons-vue';
import { MenuTheme } from '../src/typings';

const DemoComponent = {
  setup() {
    const [menuState] = useMenu({
      collapsed: false,
      openKeys: [''],
      selectedKeys: ['/welcome'],
    });
    const state = reactive({
      theme: 'light',
    });
    const handleCollapse = (collapsed: boolean) => {
      menuState.collapsed = collapsed;
    }
    return () => (
      <div class="components">
        <h2># SideMenu</h2>
        <div>
          <Space>
            <Switch checked-children="dark" un-checked-children="light" checked={state.theme === 'dark'} onChange={() => { (state.theme = state.theme === 'dark' ? 'light' : 'dark')}} />
          </Space>
        </div>
        <div class="demo" style="background: rgb(244,244,244); min-height: 400px;">
          <div class="container side-menu-demo">
            <Layout class="ant-pro-basicLayout">
              <SiderMenuWrapper
                title={'Pro Layout'}
                layout={'side'}
                theme={state.theme as MenuTheme}
                isMobile={false}
                collapsed={menuState.collapsed}
                menuData={menus}
                // openKeys={menuState.openKeys}
                // selectedKeys={menuState.selectedKeys}
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
                // menuFooterRender={(props) => props.collapsed ? undefined : (
                //   <div style="color: #fff; padding: 8px 16px; overflow: hidden;">
                //     <span>自定义页脚</span>
                //   </div>
                // )}
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
