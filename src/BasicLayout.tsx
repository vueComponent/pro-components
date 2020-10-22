import './BasicLayoutTest.less';

import { App } from 'vue';

import { Layout } from 'ant-design-vue';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { default as ProProvider } from './ProProvider';
import { createRouteContext } from './RouteContext';
import SiderMenuWrapper from './SiderMenu';

const defaultI18nRender = (key: string) => key;

const { state, provider: RouteContextProvider } = createRouteContext({
  isMobile: false,
  menuData: [],
  sideWidth: 208,
  hasSideMenu: true,
  hasHeader: true,
});

const BasicLayout = (props, { emit, slots }) => {
  const handleClick = () => {
    emit('update:collapsed', !props.collapsed);
  };
  const handleOpenChange = (openKeys): void => {
    emit('update:openKeys', openKeys);
  };
  const handleSelect = (selectedKeys: string[]): void => {
    emit('update:selectedKeys', selectedKeys);
  };
  return (
    <ProProvider {...props} i18n={defaultI18nRender}>
      <RouteContextProvider>
        <Layout class="ant-pro-basicLayout">
          <SiderMenuWrapper {...props} />
          <Layout>
            <Layout.Header style="background: #fff; padding: 0; height: 48px; line-height: 48px;">
              {props.collapsed ? (
                <MenuUnfoldOutlined class="trigger" onClick={handleClick} />
              ) : (
                <MenuFoldOutlined class="trigger" onClick={handleClick} />
              )}
            </Layout.Header>
            <Layout.Content
              style={{
                margin: '24px 16px',
                padding: '24px',
                background: '#fff',
                minHeight: '280px',
              }}
            >
              {slots.default && slots.default()}
            </Layout.Content>
          </Layout>
        </Layout>
      </RouteContextProvider>
    </ProProvider>
  );
};

BasicLayout.install = function(app: App) {
  app.component('pro-layout', BasicLayout);
};

export default BasicLayout;
