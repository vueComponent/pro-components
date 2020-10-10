import { createApp, defineComponent, inject, reactive, watchEffect } from 'vue';
import { Card, Space, Button, Tag } from 'ant-design-vue';
import { useContext, createContext } from '../src/RouteContext';

import 'ant-design-vue/dist/antd.less';

const DemoComponent = {
  setup() {
    const state = reactive({
      name: 'value',
    });

    const { state: routeContext, provider: RouteContextProvider } = createContext({
      hasSiderMenu: true,
      collapsed: true,
      isMobile: false,
      menuData: []
    })

    return () => (
      <div class="components">
        <h2># Template</h2>
        <Card style={{ marginBottom: '24px', background: 'rgb(244,244,244)' }}>
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => {
                state.name = new Date().getTime().toString()
                routeContext.collapsed = !routeContext.collapsed
                routeContext.menuData = [
                  {
                    path: `/dashboard/${state.name}`,
                    name: `${state.name}`,
                    meta: { title: `custom title - ${state.name}` },
                  }
                ]
              }}
            >
              Change Value
            </Button>

          </Space>
          <div style={{ margin: '12px 0' }}>
            <p>state.name: { JSON.stringify(state.name) }</p>
          </div>
        </Card>
        <div class="demo" style="background: rgb(244,244,244);">
          <RouteContextProvider>
            <TestChildComponent />
          </RouteContextProvider>
        </div>
      </div>
    );
  },
};

const TestChildComponent = defineComponent({
  setup () {
    const routeContext = useContext();
    console.log('TestChildComponent.routeContext', routeContext)

    return () => {
      const { menuData, collapsed } = routeContext
      return (
        <div class="test-child-component">
          menuData: {JSON.stringify(menuData)}
          <p>
            collapsed: {collapsed.toString()}
          </p>
        </div>
      )
    }
  }
});

const app = createApp(DemoComponent);

app.mount('#__vue-content>div');
