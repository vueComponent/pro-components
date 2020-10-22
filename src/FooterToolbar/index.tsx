import { VNodeChild } from 'vue';
import './index.less';

export interface FooterToolbarProps {
  extra?: VNodeChild;
  renderContent?: (
    props: FooterToolbarProps & { leftWidth?: string },
    dom: JSX.Element,
  ) => VNodeChild | JSX.Element;
  prefixCls?: string;
}

const FooterToolbar = (props, context) => {
  const baseClassName = `${props.prefixCls}-footer-bar`;
};
