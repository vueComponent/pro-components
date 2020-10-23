import { createApp, defineComponent, inject, reactive, toRefs } from 'vue';
import { Card, Space, Button } from 'ant-design-vue';
import { ContentWidth } from '../src/typings';
import { warning } from '../src/utils';
import { default as ProProvider, useProProvider } from '../src/ProProvider';

import 'ant-design-vue/dist/antd.less';
import GridContent from '../src/GridContent';

const trans = {
  'render.test.i18n.hello': 'Hello My Friends',
};
const trans2 = {
  'render.test.i18n.hello': 'Hello My Dear Friends',
};

const i18nRender = (t: string): string => {
  return trans[t];
};
const i18nRender2 = (t: string): string => {
  return trans2[t];
};

const ProProviderDemo = defineComponent({
  setup() {
    const state = reactive({
      i18nRender,
      contentWidth: 'Fixed' as ContentWidth,
    });

    return () => (
      <>
        <ProProvider i18n={state.i18nRender} contentWidth={state.contentWidth}>
          <h2># BasicLayout</h2>
          <div
            class="components"
            style={{ background: 'rgb(240, 240, 240)', paddingBottom: '20px' }}
          >
            <Card style={{ marginBottom: '24px', background: 'rgb(244,244,244)' }}>
              <Space size="middle">
                Change Current Config:
                <Button
                  type="primary"
                  onClick={() => {
                    state.i18nRender = (Math.random() > 0.5 && i18nRender2) || i18nRender;
                    state.contentWidth = state.contentWidth === 'Fixed' ? 'Fluid' : 'Fixed';
                  }}
                >
                  {state.contentWidth}
                </Button>
              </Space>
              <div class="env">state.contentWidth: {JSON.stringify(state.contentWidth)}</div>
            </Card>
            <TestChildComponent style={{ background: 'rgb(220, 220, 220)', padding: '22px' }} />
          </div>
        </ProProvider>
      </>
    );
  },
});

const TestChildComponent = defineComponent({
  setup() {
    const config = useProProvider();
    const prefixCls = config.getPrefixCls('child-component');

    return () => {
      const { i18n, contentWidth } = config;
      return (
        <GridContent contentWidth={contentWidth}>
          <div class={prefixCls}>
            <p>TestChildComponent:</p>
            <div>contentWidth: {contentWidth} , <a>Fixed: 1200px; Fluid: auto width;</a></div>
            <p>{i18n('render.test.i18n.hello')}</p>
          </div>
        </GridContent>
      );
    };
  },
});

const app = createApp(ProProviderDemo);

app.mount('#__vue-content>div');
