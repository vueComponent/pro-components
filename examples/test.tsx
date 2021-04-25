import { createApp, reactive } from 'vue';
import { default as ProLayout, RouteContextProps } from '../src/';

import { RouterLink } from './mock-router';
import { menus } from './menus';
import registerIcons from './_util/icons';

const SimpleDemo = {
  setup() {
    const appState = reactive<RouteContextProps>({
      collapsed: false,
      selectedKeys: [],
      openKeys: [],
      menuData: menus,
    });
    return () => (
      <ProLayout
        {...appState}
        title="Pro Tests"
        logo="https://alicdn.antdv.com/v2/assets/logo.1ef800a8.svg"
        onSelect={(selectedKeys: string[] | false) => {
          selectedKeys && (appState.selectedKeys = selectedKeys);
        }}
        onOpenKeys={(openKeys: string[] | false) => {
          console.log('onOpenKeys', openKeys);
          openKeys && (appState.openKeys = openKeys);
        }}
        onCollapse={collapsed => {
          appState.collapsed = collapsed;
        }}
        footerRender={() => <div>custom-footer</div>}
        v-slots={{
          rightContentRender: () => (
            <div class="custom-header-right-content">
              <span>custom-right-content</span>
            </div>
          ),
        }}
      >
        <div style="min-height: 300px;">content</div>
      </ProLayout>
    );
  },
};

const app = createApp(SimpleDemo);

app.use(ProLayout);
app.use(RouterLink);
app.use(registerIcons);
app.mount('#__vue-content>div');
