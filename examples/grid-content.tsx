import { createApp, defineComponent, reactive } from 'vue';
import { Card, Space, Button } from 'ant-design-vue';
import { ContentWidth } from '../src/typings';
import GridContent, { GridContentProps } from '../src/GridContent';

import 'ant-design-vue/dist/antd.less';

const GridContentDemo = defineComponent({
  setup() {
    const state = reactive<GridContentProps>({
      contentWidth: 'Fixed',
    });

    return () => (
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
        </Card>
        <GridContent
          contentWidth={state.contentWidth}
          style={{ background: 'rgb(220, 220, 220)', padding: '22px' }}
        >
          Content
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
        </GridContent>
      </div>
    );
  },
});

createApp(GridContentDemo).mount('#__vue-content>div');
