import { createApp, defineComponent, reactive } from 'vue';
import 'ant-design-vue/dist/antd.less';
import { Button, message } from 'ant-design-vue';
import { default as ProLayout } from '../src/BasicLayout';
import { menus } from './menus';
import { useMenuState } from '../src/SiderMenu/BaseMenu';
import * as Icon from '@ant-design/icons-vue';
import { createRouteContext } from '../src/RouteContext';

const BasicLayout = defineComponent({
  name: 'BasicLayout',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const [menuState] = useMenuState({
      collapsed: false,
      openKeys: [],
      selectedKeys: ['/welcome'],
    });

    const { state: routeContext, Provider: RouteContextProvider } = createRouteContext({
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
          layout={'side'}
          theme={'dark'}
          isMobile={false}
          menuData={menus}
          matchMenuKeys={[]}
          contentWidth={'Fixed'}
          primaryColor={'#1890ff'}
          siderWidth={208}
          openKeys={menuState.openKeys}
          selectedKeys={menuState.selectedKeys}
          onOpenChange={$event => {
            $event && (menuState.openKeys = $event);
          }}
          onSelect={$event => {
            $event && (menuState.selectedKeys = $event);
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

app.use(BasicLayout).mount('#__vue-content>div');
