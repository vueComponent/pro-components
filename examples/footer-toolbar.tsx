import { Button, Card, Space, Switch } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import { createApp, reactive } from 'vue';
import FooterToolbar, { FooterToolbarProps } from '../src/FooterToolbar';
import { createRouteContext } from '../src/RouteContext';

const DemoComponent = {
  setup() {
    const state = reactive({
      name: 'value',
      hasFooterToolbar: 'unset' as string | boolean,
      toolbarProps: {} as FooterToolbarProps,
    });
    const setToolbarProps = tProps => {
      state.toolbarProps = { ...state.toolbarProps, ...tProps };
    };

    const { state: routeContext, provider: RouteContextProvider } = createRouteContext({
      hasFooterToolbar: false,
      setHasFooterToolbar: v => {
        state.hasFooterToolbar = v;
        routeContext.hasFooterToolbar = v;
      },
    });

    return () => (
      <div class="components">
        <h2># Template</h2>
        <Card style={{ marginBottom: '24px', background: 'rgb(244,244,244)' }}>
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => {
                state.name = new Date().getTime().toString();
                routeContext.setHasFooterToolbar(!routeContext.hasFooterToolbar);
              }}
            >
              {!routeContext.hasFooterToolbar ? 'Open' : 'Close'}
            </Button>
            <Switch
              checkedChildren="w/ extra"
              unCheckedChildren="w/o extra"
              checked={!!state.toolbarProps.extra}
              onClick={() => {
                state.name = new Date().getTime().toString();
                const extra = !state.toolbarProps.extra ? (
                  <img
                    src="https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg"
                    alt="logo"
                    width="32"
                    height="32"
                  />
                ) : (
                  undefined
                );
                setToolbarProps({ extra });
              }}
            />
            <Switch
              checkedChildren="w/ renderContent"
              unCheckedChildren="w/o renderContent"
              checked={!!state.toolbarProps.renderContent}
              onClick={() => {
                state.name = new Date().getTime().toString();
                const renderContent = !state.toolbarProps.renderContent
                  ? () => 'home_toolbar'
                  : undefined;
                setToolbarProps({ renderContent });
              }}
            />
          </Space>
          <div style={{ margin: '12px 0' }}>
            state
            <pre>
              {JSON.stringify(
                {
                  name: state.name,
                  toolbarProps: Object.fromEntries(
                    Object.entries(state.toolbarProps).map(([k, v]) => [k, typeof v]),
                  ),
                },
                null,
                2,
              )}
            </pre>
            routeContext:
            <pre>{JSON.stringify(routeContext, null, 2)}</pre>
          </div>
        </Card>
        <div>
          <RouteContextProvider>
            {routeContext.hasFooterToolbar && (
              <FooterToolbar {...state.toolbarProps}>
                <button key="button" type="button">
                  right
                </button>
              </FooterToolbar>
            )}
          </RouteContextProvider>
        </div>
      </div>
    );
  },
};

const app = createApp(DemoComponent);

app.mount('#__vue-content>div');
