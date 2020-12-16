import { createApp, defineComponent, ref, h, onMounted } from 'vue';
import { RouterLink } from './mock-router';
import * as Icon from '@ant-design/icons-vue';
import './demoBox.less';

export const DemoBox = defineComponent({
  setup(_, { slots }) {
    const instance = ref();
    const frameRef = ref();

    const content = (): void => {
      const children = slots?.default();
      console.log('frameRef.value', frameRef.value);
      const body = frameRef.value.contentDocument.body;
      const head = frameRef.value.contentDocument.head;
      const el = document.createElement('div');
      el.className = 'demoBox'
      body.appendChild(el);

      // const styleLink = document.createElement('link');
      // styleLink.rel = 'stylesheet';
      // styleLink.type = 'text/css';
      // styleLink.href = './index.css';
      head.innerHTML = `
      <link href="/node_modules/normalize.css/normalize.css" type="text/css" rel="stylesheet">
      <link href="./index.css" type="text/css" rel="stylesheet">
      `

      const box = createApp({
        render() {
          return h('div', children);
        },
      }).use(RouterLink);

      const filterIcons = ['default', 'createFromIconfontCN', 'getTwoToneColor', 'setTwoToneColor'];
      Object.keys(Icon)
        .filter(k => !filterIcons.includes(k))
        .forEach(k => {
          box.component(Icon[k].displayName, Icon[k]);
        });

      box.mount(el);

      instance.value = box;
    }

    onMounted(() => {
      content();
    })
    return {
      frameRef,
      content,
    }
  },
  render () {
    return (
      <div class="browser-mockup with-url">
        <div class="browser-nav">
        </div>
        <iframe ref="frameRef" height="450px" width="100%" style="border: 0;" />
      </div>
    )
  }
});
