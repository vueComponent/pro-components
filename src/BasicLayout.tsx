import './BasicLayoutTest.less';

import { h, App } from 'vue';

import { Layout, Menu } from 'ant-design-vue';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import ProProvider from './ProProvider';

const defaultI18nRender = (key: string) => key

const BasicLayout = (props, { emit, slots }) => {
  const handleClick = () => {
    emit('collapsed', !props.collapsed)
  }
  return (
    <ProProvider {...props} i18n={defaultI18nRender}>
      <Layout class="ant-pro-basicLayout">
        <Layout.Sider collapsed={props.collapsed} trigger={null} collapsible>
          <div class="logo" />
          <Menu theme="dark" mode="inline" selectedKeys={props.selectedKeys}>
            <Menu.Item key="1">
              <span>nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <span>nav 3</span>
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        <Layout>
          <Layout.Header style="background: #fff; padding: 0">
            {
              props.collapsed
                ? <MenuUnfoldOutlined class="trigger" onClick={handleClick} />
                : <MenuFoldOutlined  class="trigger" onClick={handleClick} />
            }
          </Layout.Header>
          <Layout.Content style={{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }}>
            {slots.default && slots.default()}
          </Layout.Content>
        </Layout>
      </Layout>
    </ProProvider>
  )
};

BasicLayout.install = function (app: App) {
  app.component('pro-layout', BasicLayout)
};

export default BasicLayout
