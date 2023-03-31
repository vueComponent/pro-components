import { useSharedContext } from '../../store/Provider';
import { Alert, Space } from 'ant-design-vue';
import type { FunctionalComponent } from 'vue';

import './index.less';

type TableAlertProps = {
  selectedRowKeys?: (number | string)[];
  selectedRows?: Record<string, unknown>[];
  alwaysShowAlert?: boolean;
};

const TableAlert: FunctionalComponent<TableAlertProps> = ({ selectedRowKeys = [] }) => {
  const { getPrefixCls, getMessage: t } = useSharedContext();

  const className = getPrefixCls('alert');

  const alertInfo = (
    <Space>{`${t('alert.selected', '已选择')}${selectedRowKeys.length}${t('alert.item', '项')}`}</Space>
  );

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
