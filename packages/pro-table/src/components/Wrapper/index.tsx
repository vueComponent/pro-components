import { Card } from 'ant-design-vue';
import type { FunctionalComponent } from 'vue';
import type { ProTableProps } from '../../typings';

const Wrapper: FunctionalComponent<{
  cardBordered?: ProTableProps['cardBordered'];
  cardProps?: ProTableProps['cardProps'];
  toolbar?: ProTableProps['toolbar'];
}> = ({ cardProps, toolbar }, { slots }) => {
  const props = cardProps !== false && {
    bodyStyle: toolbar === false ? { padding: 0 } : { paddingTop: 0 },
    ...cardProps,
  };

  const Tag = cardProps !== false ? Card : 'div';

  return <Tag {...props}>{slots.default?.()}</Tag>;
};

export default Wrapper;
