import './BasicLayoutTest.less';
import './BasicLayout.less';

import { App, FunctionalComponent } from 'vue';

import { Layout } from 'ant-design-vue';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { default as ProProvider } from './ProProvider';
import { default as GlobalFooter } from './GlobalFooter';
import { default as SiderMenuWrapper, SiderMenuWrapperProps } from './SiderMenu';
import { WrapContent } from './WrapContent';

const defaultI18nRender = (key: string) => key;

export type ProLayoutProps = SiderMenuWrapperProps;

const ProLayout: FunctionalComponent<ProLayoutProps> = (props, { emit, slots }) => {
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
      <Layout class="ant-pro-basicLayout">
        <SiderMenuWrapper
          {...props}
          onCollapse={(collapsed: boolean) => emit('update:collapsed', collapsed)}
        />
        <Layout>
          <Layout.Header style="background: #fff; padding: 0; height: 48px; line-height: 48px;">
            {props.collapsed ? (
              <MenuUnfoldOutlined class="trigger" onClick={handleClick} />
            ) : (
              <MenuFoldOutlined class="trigger" onClick={handleClick} />
            )}
          </Layout.Header>
          <WrapContent
            style={{
              margin: '24px 16px',
              padding: '24px',
              background: '#fff',
              minHeight: '280px',
            }}
          >
            {slots.default?.()}
          </WrapContent>
          <GlobalFooter
            links={[
              {
                key: '1',
                title: 'Pro Layout',
                href: 'https://www.github.com/vueComponent/pro-layout',
                blankTarget: true,
              },
              {
                key: '2',
                title: 'Github',
                href: 'https://www.github.com/vueComponent/ant-design-vue-pro',
                blankTarget: true,
              },
              {
                key: '3',
                title: '@Sendya',
                href: 'https://www.github.com/sendya/',
                blankTarget: true,
              },
            ]}
            copyright={
              <a href="https://github.com/vueComponent" target="_blank">
                vueComponent
              </a>
            }
          />
        </Layout>
      </Layout>
    </ProProvider>
  );
};

ProLayout.install = function(app: App) {
  app.component('pro-layout', ProLayout);
};

export default ProLayout;
