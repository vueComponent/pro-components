import { computed, createApp, defineComponent, inject, reactive, toRefs } from 'vue';
import { Card, Space, Button } from 'ant-design-vue';
import { ContentWidth } from '../src/typings';
import { warning } from '../src/utils';
import GridContent from '../src/GridContent';
import ProProvider, { injectProConfigKey, defaultProProviderProps } from '../src/ProProvider';

import 'ant-design-vue/dist/antd.less';

const trans = {
  'render.test.i18n.hello': 'Hello My Friends'
}

const i18nRender = (t: string): string => {
  warning(false, `i18n.key ${t}, value: ${trans[t]}`, )
  return trans[t];
}

const ProProviderDemo = defineComponent({
  setup () {
    const state = reactive({
      contentWidth: 'Fixed' as ContentWidth,
    })

    return () => (
      <>
        <ProProvider i18n={i18nRender} contentWidth={state.contentWidth}>
          <h2># BasicLayout</h2>
          <div class="components" style={{ background: 'rgb(240, 240, 240)', paddingBottom: '20px' }}>
            <Card style={{ marginBottom: '24px', background: 'rgb(244,244,244)' }}>
              <Space size="middle">
                ContentWidth:
                <Button
                  type="primary"
                  onClick={() => {
                    state.contentWidth = state.contentWidth === 'Fixed' ? 'Fluid' : 'Fixed';
                  }}
                >
                  {state.contentWidth}
                </Button>
              </Space>
              <div class="env">
                state.contentWidth: { JSON.stringify(state.contentWidth) }
              </div>
            </Card>
            <TestChildComponent style={{ background: 'rgb(220, 220, 220)', padding: '22px' }}/>
          </div>
        </ProProvider>
      </>
    )
  }
})

const TestChildComponent = defineComponent({
  setup () {
    const config = inject(injectProConfigKey, defaultProProviderProps)

    return () => {
      const { i18n, contentWidth } = config
      return (
        <div class="test-child-component">
          <p>TestChildComponent:</p>
          <div>
            i18n: {i18n.toString()}
          </div>
          <div>
            contentWidth: {contentWidth}
          </div>
          <p>{i18n('render.test.i18n.hello')}</p>
        </div>
      )
    }
  }
});

const app = createApp(ProProviderDemo);

app.mount('#__vue-content>div');
