import { defineComponent, toRefs, PropType } from 'vue';
import { withInstall } from 'ant-design-vue/es/_util/type';

export const useRoute = () => {
  console.log('path', location.pathname);
  return {
    matched: [],
  };
};

export const RouterLink = withInstall(
  defineComponent({
    name: 'RouterLink',
    props: {
      href: {
        type: String,
        default: null,
      },
      to: {
        type: [Object, String] as PropType<Record<string, any> | string>,
        default: () => undefined,
      },
    },
    setup(props, { slots }) {
      const { to, href } = toRefs(props);
      const curHref =
        (href.value && href.value) || typeof to.value === 'string'
          ? to.value
          : to.value.name || to.value.path;
      return () => <a href={`#${curHref}`}>{slots.default?.()}</a>;
    },
  }),
);

export const RouterView = withInstall(
  defineComponent({
    name: 'RouterView',
    setup(_, { slots }) {
      return () => slots.default?.();
    },
  }),
);
