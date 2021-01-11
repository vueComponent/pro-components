import 'ant-design-vue/dist/antd.less';
import { createApp, defineComponent, onMounted, watch, ref, reactive } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { Button, Avatar, Space, message } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { default as ProLayout } from '../src/';
import { createRouteContext, RouteContextProps } from '../src/RouteContext';
import { menus } from './menus';
import registerIcons from './_util/icons';

// demo pages
import Page1 from './demo/page1';
import Welcome from './demo/welcome';
import FormPage from './demo/form';

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
                <Avatar icon={<UserOutlined />} /> Sendya
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
          <router-view />
        </ProLayout>
      </RouteContextProvider>
    );
  },
});

const SimpleDemo = {
  setup() {
    return () => (
      <div style={{ height: '100%' }}>
        <router-view />
      </div>
    );
  },
};

const RouteView = defineComponent({
  setup() {
    return () => <router-view />;
  },
});

const routes = [
  {
    path: '/welcome',
    name: 'welcome',
    meta: { title: 'Welcome' },
    component: Welcome,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: 'dashboard' },
    component: RouteView,
    children: [
      {
        path: '/dashboard/analysis',
        name: 'analysis',
        meta: { icon: 'SmileOutlined', title: 'Analysis' },
        component: Page1,
      },
      {
        path: '/dashboard/monitor',
        name: 'monitor',
        meta: { icon: 'SmileOutlined', title: 'Monitor' },
        component: Page1,
      },
      {
        path: '/dashboard/workplace',
        name: 'workplace',
        meta: { icon: 'SmileOutlined', title: 'Workplace' },
        component: Page1,
      },
    ],
  },
  {
    path: '/form',
    name: 'form',
    meta: { title: 'Form', icon: 'SmileOutlined' },
    component: RouteView,
    children: [
      {
        path: '/form/basic-form',
        name: 'basic-form',
        meta: { icon: 'SmileOutlined', title: 'Basic Form' },
        component: FormPage,
      },
      {
        path: '/form/step-form',
        name: 'step-form',
        meta: { icon: 'SmileOutlined', title: 'Step Form' },
        component: FormPage,
      },
      {
        path: '/form/advanced-form',
        name: 'advance-form',
        meta: { icon: 'SmileOutlined', title: 'Advanced Form' },
        component: FormPage,
      },
    ],
  },
];

const router = createRouter({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: { title: '' },
      component: BasicLayout,
      children: routes,
    },
  ],
  history: createWebHashHistory(),
});

const app = createApp(SimpleDemo);

registerIcons(app);

app.use(router).use(ProLayout).mount('#app');
