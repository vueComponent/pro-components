import 'ant-design-vue/dist/antd.less';
import { createApp, defineComponent, reactive } from 'vue';
import { RouterLink } from './mock-router';
import { Button, Avatar, message } from 'ant-design-vue';
import { default as ProLayout } from '../src/';
import { menus } from './menus';
import { useMenuState } from '../src/SiderMenu/BaseMenu';
import * as Icon from '@ant-design/icons-vue';
import { createRouteContext } from '../src/RouteContext';

const BasicLayout = defineComponent({
  name: 'BasicLayout',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const [menuState] = useMenuState({
      collapsed: false,
      openKeys: [],
      selectedKeys: ['/welcome'],
    });

    const [ routeContext, RouteContextProvider ] = createRouteContext({
      isMobile: false,
      menuData: [],
      sideWidth: 208,
      hasSideMenu: true,
      hasHeader: true,
      hasFooterToolbar: false,
      setHasFooterToolbar: (has: boolean) => (routeContext.hasFooterToolbar = has),
    });

    return () => (
      <RouteContextProvider>
        <ProLayout
          {...attrs}
          v-model={[menuState.collapsed, 'collapsed']}
          title={'Pro Layout'}
          layout={'mix'}
          theme={'light'}
          navTheme={'dark'}
          i18n={(key: string) => key}
          isMobile={false}
          menuData={menus}
          matchMenuKeys={[]}
          contentWidth={'Fixed'}
          primaryColor={'#1890ff'}
          contentStyle={{ minHeight: '500px' }}
          siderWidth={208}
          openKeys={menuState.openKeys}
          selectedKeys={menuState.selectedKeys}
          {...{
            'onUpdate:openKeys':$event => {
              $event && (menuState.openKeys = $event);
            },
            'onUpdate:selectedKeys': $event => {
              $event && (menuState.selectedKeys = $event);
            }
          }}
          v-slots={{
            rightContentRender: () => (
              <div style="color: #FFF;margin-right: 16px;">
                <Avatar icon={(<Icon.UserOutlined />)} /> Sendya
              </div>
            ),
            menuHeaderRender: () => (
              <a>
                <img src="https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg" />
                {menuState.collapsed ? null : (<h1>Pro Layout</h1>)}
              </a>
            ),
            footerRender: () => (
              <div>123</div>
            )
          }}
        >
          <Button
            onClick={() => {
              message.info('clicked.');
            }}
          >
            Click Me!!
          </Button>
        </ProLayout>
      </RouteContextProvider>
    );
  },
});

const SimpleDemo = {
  setup() {
    return () => (
      <div class="components">
        <h2># BasicLayout</h2>
        <BasicLayout />
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

app.use(RouterLink).use(ProLayout).mount('#__vue-content>div');
