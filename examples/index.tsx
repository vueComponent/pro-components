import 'ant-design-vue/dist/antd.less';
import { createApp, defineComponent, onMounted, watch, ref, reactive } from 'vue';
import { RouterLink } from './mock-router';
import { Button, Avatar, Space, message } from 'ant-design-vue';
import { default as ProLayout } from '../src/';
import { menus } from './menus';
import * as Icon from '@ant-design/icons-vue';
import { createRouteContext, RouteContextProps } from '../src/RouteContext';

const BasicLayout = defineComponent({
  name: 'BasicLayout',
  inheritAttrs: false,
  setup() {
    const state = reactive<RouteContextProps>({
      collapsed: false,

      openKeys: ['/dashboard'],
      setOpenKeys: (keys: string[]) => (state.openKeys = keys),
      selectedKeys: ['/welcome'],
      setSelectedKeys: (keys: string[]) => {
        console.log('keys', keys);
        state.selectedKeys = keys;
      },
      navTheme: 'dark',
      isMobile: false,
      fixSiderbar: false,
      fixedHeader: false,
      menuData: menus,
      sideWidth: 208,
      splitMenus: true,
      hasSideMenu: true,
      hasHeader: true,
      hasFooterToolbar: false,
      setHasFooterToolbar: (has: boolean) => (state.hasFooterToolbar = has),
    });
    const [RouteContextProvider] = createRouteContext();

    const cacheOpenKeys = ref<string[]>([]);
    watch(
      () => state.collapsed,
      (collapsed: boolean) => {
        console.log('post watch', collapsed, state.collapsed);
        if (collapsed) {
          cacheOpenKeys.value = state.openKeys;
          state.openKeys = [];
        } else {
          state.openKeys = cacheOpenKeys.value;
        }
      },
      {
        flush: 'pre',
      },
    );

    return () => (
      <RouteContextProvider value={state}>
        <ProLayout
          v-model={[state.collapsed, 'collapsed']}
          layout={'mix'}
          navTheme={state.navTheme}
          i18n={(key: string) => key}
          isMobile={state.isMobile}
          fixSiderbar={state.fixSiderbar}
          fixedHeader={state.fixedHeader}
          contentWidth={'Fixed'}
          primaryColor={'#1890ff'}
          contentStyle={{ minHeight: '300px' }}
          siderWidth={state.sideWidth}
          splitMenus={state.splitMenus}
          v-slots={{
            rightContentRender: () => (
              <div style="margin-right: 16px;">
                <Avatar icon={<Icon.UserOutlined />} /> Sendya
              </div>
            ),
            menuHeaderRender: () => (
              <a>
                <img src="https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg" />
                {state.collapsed ? null : <h1>Pro Preview</h1>}
              </a>
            ),
          }}
        >
          <Space>
            <Button
              type="primary"
              onClick={() => {
                message.info('clicked.');
              }}
            >
              Click Me!!
            </Button>
            <Button
              onClick={() => {
                state.navTheme = state.navTheme === 'light' ? 'dark' : 'light';
              }}
            >
              Switch Theme
            </Button>
          </Space>

        </ProLayout>
      </RouteContextProvider>
    );
  },
});

const SimpleDemo = {
  setup() {
    return () => (
      <div class="components">
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

app.use(RouterLink).use(ProLayout).mount('#app');
