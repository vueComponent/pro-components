import './index.less';

import { WithFalse } from '../typings';
import { defineComponent, PropType, SetupContext, VNodeChild } from 'vue';

export type Links = WithFalse<
  {
    key?: string;
    title: VNodeChild | JSX.Element;
    href: string;
    blankTarget?: boolean;
  }[]
>;

export interface GlobalFooterProps {
  links?: Links;
  copyright?: VNodeChild | JSX.Element;
  prefixCls?: string;
}

export default defineComponent({
  name: 'GlobalFooter',
  props: {
    links: [Array, Boolean] as PropType<Links>,
    copyright: {
      type: [Object, Function, Boolean] as PropType<VNodeChild | JSX.Element>,
      default: () => undefined,
    },
    prefixCls: {
      type: String,
      default: 'ant-pro',
    },
  },
  setup(props: GlobalFooterProps, { slots }: SetupContext) {
    if (
      (props.links == null ||
        props.links === false ||
        (Array.isArray(props.links) && props.links.length === 0)) &&
      (props.copyright == null || props.copyright === false)
    ) {
      console.warn('[pro-layout]: GlobalFooter required `links` or `copyright`');
      return () => null;
    }

    const baseClassName = `${props.prefixCls}-global-footer`;
    const copyright = props.copyright || (slots.copyright && slots.copyright());

    return () => (
      <footer class={baseClassName}>
        {props.links && (
          <div class={`${baseClassName}-links`}>
            {props.links.map(link => (
              <a
                key={link.key}
                title={link.key}
                target={link.blankTarget ? '_blank' : '_self'}
                href={link.href}
              >
                {link.title}
              </a>
            ))}
          </div>
        )}
        {props.copyright && <div class={`${baseClassName}-copyright`}>{copyright}</div>}
      </footer>
    );
  },
});
