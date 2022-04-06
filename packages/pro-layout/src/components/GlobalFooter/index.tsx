import './index.less';

import { defineComponent, type PropType, type SetupContext } from 'vue';
import type { WithFalse, CustomRender } from '../../typings';

export type Links = WithFalse<
  {
    key?: string;
    title: CustomRender;
    href: string;
    blankTarget?: boolean;
  }[]
>;

export interface GlobalFooterProps {
  links?: Links;
  copyright?: CustomRender;
  prefixCls?: string;
}

export default defineComponent({
  name: 'GlobalFooter',
  props: {
    links: {
      type: [Array, Boolean] as PropType<Links>,
      required: true,
    },
    copyright: {
      type: [Object, Function, String, Boolean] as PropType<WithFalse<CustomRender>>,
      default: () => undefined,
    },
    prefixCls: {
      type: String,
      default: 'ant-pro',
    },
  },
  setup(props: GlobalFooterProps, { slots }: SetupContext) {
    if (
      (props.links == null || props.links === false || (Array.isArray(props.links) && props.links.length === 0)) &&
      (props.copyright == null || props.copyright === false)
    ) {
      return null;
    }

    return () => {
      const baseClassName = `${props.prefixCls}-global-footer`;
      const copyright = props.copyright || (slots.copyright && slots.copyright());

      return (
        <footer class={baseClassName}>
          {props.links && (
            <div class={`${baseClassName}-links`}>
              {props.links.map((link) => (
                <a key={link.key} title={link.key} target={link.blankTarget ? '_blank' : '_self'} href={link.href}>
                  {link.title}
                </a>
              ))}
            </div>
          )}
          {props.copyright && <div class={`${baseClassName}-copyright`}>{copyright}</div>}
        </footer>
      );
    };
  },
});
