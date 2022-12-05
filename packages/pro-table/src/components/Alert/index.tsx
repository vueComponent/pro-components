import type { FunctionalComponent } from 'vue';
import { Alert, Space } from 'ant-design-vue';
import { useSharedContext } from '../../shared/Context';

import 'ant-design-vue/es/alert/style';
import 'ant-design-vue/es/space/style';
import './index.less';

type TableAlertProps = {
  selectedRowKeys?: (number | string)[];
  selectedRows?: Record<string, unknown>[];
  alwaysShowAlert?: boolean;
};

const TableAlert: FunctionalComponent<TableAlertProps> = ({ selectedRowKeys = [] }) => {
  const { getPrefixCls } = useSharedContext();

  const className = getPrefixCls('alert');

  // TODO: t('alert.selected', '已选择'), t('alert.item', '项')
  const alertInfo = <Space>{`已选择${selectedRowKeys.length}项`}</Space>;

  return (
    <div class={className}>
      <Alert
        message={
          <div class={`${className}-info`}>
            <div class={`${className}-info-content`}>{alertInfo}</div>
          </div>
        }
      />
    </div>
  );
};

export default TableAlert;
