import { defineComponent, h } from 'vue';
import { Spin, SpinProps } from 'ant-design-vue';
import { getSpinProps } from 'ant-design-vue/es/spin/Spin';

export type PageLoadingProps = SpinProps;

const PageLoading = defineComponent({
  name: 'PageLoading',
  props: {
    ...getSpinProps(),
  },
  render() {
    return h(
      'div',
      { style: { paddingTop: '100px', textAlign: 'center' } },
      h(Spin, { ...this.$props }),
    );
  },
});

export default PageLoading;
