import { createApp, reactive } from 'vue';
import { default as ProLayout, createRouteContext, RouteContextProps } from '../src/';

import { RouterLink } from './mock-router';
import { menus } from './menus';
import registerIcons from './_util/icons';

const SimpleDemo = {
  setup() {
    const [RouteContextProvider] = createRouteContext();

    const appState = reactive<RouteContextProps>({
      selectedKeys: [],
      openKeys: [],
      collapsed: true,
      menuData: menus,
    });
    return () => (
      <RouteContextProvider value={appState}>
        <ProLayout
          title="Pro Tests"
          logo="https://alicdn.antdv.com/v2/assets/logo.1ef800a8.svg"
          layout="side"
          navTheme="light"
          contentWidth="Fluid"
          contentStyle={{ minHeight: '300px' }}
          collapsed={appState.collapsed}
          onCollapse={collapsed => {
            appState.collapsed = collapsed;
          }}
          onSelect={(selectedKeys: string[] | false) => {
            selectedKeys && (appState.selectedKeys = selectedKeys);
          }}
          onOpenKeys={(openKeys: string[] | false) => {
            console.log('onOpenKeys', openKeys);
            openKeys && (appState.openKeys = openKeys);
          }}
          footerRender={() => <div>custom-footer</div>}
          v-slots={{
            rightContentRender: props => (
              <div class="custom-header-right-content">
                <span>custom-right-content</span>
              </div>
            ),
          }}
        >
          <div>content</div>
        </ProLayout>
      </RouteContextProvider>
    );
  },
};

const app = createApp(SimpleDemo);

app.use(ProLayout);
app.use(RouterLink);
app.use(registerIcons);
app.mount('#__vue-content>div');
