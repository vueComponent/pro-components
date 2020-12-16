import 'ant-design-vue/dist/antd.less';
import { createApp, defineComponent, onMounted, watch, ref, reactive } from 'vue';
import { RouterLink } from './mock-router';
import { Button, Avatar, message } from 'ant-design-vue';
import { default as ProLayout } from '../src/';
import { menus } from './menus';
import * as Icon from '@ant-design/icons-vue';
import { createRouteContext, RouteContextProps } from '../src/RouteContext';
import { DemoBox } from './demoBox';

const BasicLayout = defineComponent({
  name: 'BasicLayout',
  inheritAttrs: false,
  setup() {
    const state = reactive<RouteContextProps>({
      collapsed: false,

      openKeys: ['/dashboard'],
      setOpenKeys: (keys: string[]) => (state.openKeys = keys),
      selectedKeys: ['/welcome'],
      setSelectedKeys: (keys: string[]) => (state.selectedKeys = keys),

      isMobile: false,
      fixSiderbar: false,
      fixedHeader: false,
      menuData: menus,
      sideWidth: 208,
      hasSideMenu: true,
      hasHeader: true,
      hasFooterToolbar: false,
      setHasFooterToolbar: (has: boolean) => (state.hasFooterToolbar = has),
    })
    const [ RouteContextProvider ] = createRouteContext();

    const cacheOpenKeys = ref<string[]>([]);
    watch(
      () => state.collapsed,
      (collapsed: boolean) => {
        if (collapsed) {
          cacheOpenKeys.value = state.openKeys;
          state.openKeys = [];
        } else {
          state.openKeys = cacheOpenKeys.value;
        }
      }
    );

    return () => (
      <RouteContextProvider value={state}>
        <ProLayout
          v-model={[state.collapsed, 'collapsed']}
          title={'Pro Layout'}
          layout={'side'}
          navTheme={'dark'}
          i18n={(key: string) => key}
          isMobile={state.isMobile}
          fixSiderbar={state.fixSiderbar}
          fixedHeader={state.fixedHeader}
          contentWidth={'Fixed'}
          primaryColor={'#1890ff'}
          contentStyle={{ minHeight: '300px' }}
          siderWidth={state.sideWidth}
          v-slots={{
            rightContentRender: () => (
              <div style="color: #FFF;margin-right: 16px;">
                <Avatar icon={(<Icon.UserOutlined />)} /> Sendya
              </div>
            ),
            menuHeaderRender: () => (
              <a>
                <img src="https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg" />
                {state.collapsed ? null : (<h1>Pro Layout</h1>)}
              </a>
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
        <div>
          <BasicLayout />
        </div>
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
