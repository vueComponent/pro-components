import { createApp, defineComponent } from 'vue';
import { Card } from 'ant-design-vue';
import GlobalFooter from '../src/GlobalFooter';
import 'ant-design-vue/dist/antd.less';

const GlobalFooterDemo = defineComponent({
  setup() {
    return () => (
      <div class="components" style={{ background: 'rgb(240, 240, 240)', paddingBottom: '20px' }}>
        <Card style={{ marginBottom: '24px', background: 'rgb(244,244,244)' }}>
          <h2># BasicLayout</h2>
        </Card>
        <GlobalFooter
          links={[
            {
              key: '1',
              title: 'Pro Layout',
              href: 'https://www.github.com/vueComponent/pro-layout',
              blankTarget: true,
            },
            {
              key: '2',
              title: 'Github',
              href: 'https://www.github.com/vueComponent/ant-design-vue-pro',
              blankTarget: true,
            },
            {
              key: '3',
              title: '@Sendya',
              href: 'https://www.github.com/sendya/',
              blankTarget: true,
            },
          ]}
          copyright={
            <a href="https://github.com/vueComponent" target="_blank">
              vueComponent
            </a>
          }
        />
      </div>
    );
  },
});

createApp(GlobalFooterDemo).mount('#__vue-content>div');
