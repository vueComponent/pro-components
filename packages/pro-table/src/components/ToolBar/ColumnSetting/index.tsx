import type { FunctionalComponent, VNodeChild } from 'vue';
import { useSharedContext } from '../../../store/Provider';
import { Checkbox, Space, Popover, Tree, Tooltip } from 'ant-design-vue';
import {
  HolderOutlined,
  SettingOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons-vue';
import { genColumnKey } from '../../../utils';
import { omit } from 'lodash-es';
import type { DataNode } from 'ant-design-vue/es/tree';
import type {
  DefaultRecordType,
  ProColumnType,
  ProColumnGroupType,
  ProColumnsType,
  ColumnState,
} from '../../../typings';

import './index.less';

type LocalColumns<RecordType extends DefaultRecordType = DefaultRecordType> = (
  | (ProColumnType<RecordType> & ColumnState)
  | (ProColumnGroupType<RecordType> & ColumnState)
)[];

type ColumnSettingProps<RecordType extends DefaultRecordType = DefaultRecordType> = {
  columns: ProColumnsType<RecordType>;
  checkable?: boolean;
  checkedReset?: boolean;
  draggable?: boolean;
  listsHeight?: number;
  extra?: JSX.Element;
};

export const ToolTipIcon: FunctionalComponent<{
  columnKey: string | number;
  title: string;
  show: boolean;
  fixed?: 'left' | 'right';
}> = ({ columnKey, title, show, fixed }, { slots }) => {
  if (!show) return null;

  const { columnsMap = {}, setColumnsMap } = useSharedContext();

  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const config = columnsMap[columnKey] || {};
    const disableIcon = typeof config.disable === 'boolean' && config.disable;
    if (disableIcon) return;
    const newSetting = { ...config, fixed };
    setColumnsMap?.({
      ...columnsMap,
      [columnKey]: newSetting,
    });
  };

  const children = slots.default?.();

  return (
    <Tooltip title={title}>
      <span onClick={onClick}>{children}</span>
    </Tooltip>
  );
};

export const CheckboxListItem: FunctionalComponent<{
  columnKey: string | number;
  title?: VNodeChild;
  fixed?: 'left' | 'right';
  isLeaf?: boolean;
  className?: string;
}> = ({ columnKey, title, fixed, isLeaf, className }) => {
  const { getMessage: t } = useSharedContext();

  const children = (
    <span class={`${className}-list-item-option`}>
      <ToolTipIcon
        columnKey={columnKey}
        title={t('tableToolBar.leftPin', '固定在列首')}
        show={fixed !== 'left'}
        fixed="left"
      >
        <VerticalAlignTopOutlined />
      </ToolTipIcon>
      <ToolTipIcon columnKey={columnKey} title={t('tableToolBar.noPin', '不固定')} show={!!fixed}>
        <VerticalAlignMiddleOutlined />
      </ToolTipIcon>
      <ToolTipIcon
        columnKey={columnKey}
        title={t('tableToolBar.rightPin', '固定在列尾')}
        show={fixed !== 'right'}
        fixed="right"
      >
        <VerticalAlignBottomOutlined />
      </ToolTipIcon>
    </span>
  );

  return (
    <span class={`${className}-list-item`} key={columnKey}>
      <div class={`${className}-list-item-title`}>{title}</div>
      {!isLeaf ? children : null}
    </span>
  );
};

export const CheckboxList: FunctionalComponent<{
  list: LocalColumns;
  title: string;
  showTitle?: boolean;
  checkable: boolean;
  draggable: boolean;
  className?: string;
  listHeight?: number;
}> = ({ title: listTitle, showTitle = true, checkable, draggable, list, className, listHeight = 280 }) => {
  const show = list && list.length > 0;

  if (!show) return null;

  const { columnsMap = {}, setColumnsMap } = useSharedContext();

  const checkedKeys: string[] = [];

  const loopData = (data: any[], parentConfig?: ColumnState): DataNode[] =>
    data.map(({ key, dataIndex, title, children, ...others }, index) => {
      const columnKey = genColumnKey(key ?? dataIndex, index);
      const config = columnsMap[columnKey || 'null'] || { show: true };
      if (config.show !== false && parentConfig?.show !== false && !children) {
        checkedKeys.push(columnKey);
      }
      const item: DataNode = {
        key: columnKey,
        title,
        ...omit(others, ['className']),
        selectable: false,
        disabled: config.disable === true,
        disableCheckbox: typeof config.disable === 'boolean' ? config.disable : config.disable?.checkbox,
        isLeaf: parentConfig ? true : undefined,
      };
      if (children) {
        item.children = loopData(children, config);
      }
      return item;
    });

  const treeDataConfig = { list: loopData(list), keys: checkedKeys };

  /** 移动到指定的位置 */
  const move = (id: string | number, targetId: string | number, dropPosition: number) => {
    const newMap = { ...columnsMap };
    const newColumns = Object.keys(columnsMap);
    // const newColumns = [...sortKeyColumns];
    const findIndex = newColumns.findIndex(columnKey => columnKey === id);
    const targetIndex = newColumns.findIndex(columnKey => columnKey === targetId);
    const isDownWord = dropPosition > targetIndex;
    if (findIndex < 0) return;
    const targetItem = newColumns[findIndex];
    newColumns.splice(findIndex, 1);

    if (dropPosition === 0) {
      newColumns.unshift(targetItem);
    } else {
      newColumns.splice(isDownWord ? targetIndex : targetIndex + 1, 0, targetItem);
    }
    // 重新生成排序数组
    newColumns.forEach((key, order) => {
      newMap[key] = { ...(newMap[key] || {}), order };
    });
    // 更新数组
    setColumnsMap?.(newMap);
    // setSortKeyColumns(newColumns);
  };

  /** 选中反选功能 */
  const onTreeNodeCheck = (columnKey: string | number, checked: boolean) => {
    const newSetting = { ...columnsMap[columnKey], show: checked };
    setColumnsMap?.({
      ...columnsMap,
      [columnKey]: newSetting,
    });
  };

  return (
    <>
      {showTitle && <span class={`${className}-list-title`}>{listTitle}</span>}
      <Tree
        checkable={checkable}
        draggable={draggable && !!treeDataConfig.list && treeDataConfig.list?.length > 1}
        blockNode
        showLine={false}
        itemHeight={24}
        height={listHeight}
        checkedKeys={treeDataConfig.keys}
        treeData={treeDataConfig.list}
        v-slots={{
          title: (node: DataNode) => (
            <>
              {/* <HolderOutlined /> */}
              <CheckboxListItem columnKey={node.key} title={node.title} className={className} />
            </>
          ),
        }}
        onCheck={(checked, info) => onTreeNodeCheck(info.node.key, info.checked)}
        onDrop={info => {
          const dropKey = info.node.key;
          const dragKey = info.dragNode.key;
          const { dropPosition, dropToGap } = info;
          const position = dropPosition === -1 || !dropToGap ? dropPosition + 1 : dropPosition;
          move(dragKey, dropKey, position);
        }}
      />
    </>
  );
};

export const CheckboxListGroup: FunctionalComponent<{
  localColumns: LocalColumns;
  checkable: boolean;
  draggable: boolean;
  className?: string;
  listsHeight?: number;
}> = ({ localColumns, checkable, draggable, className, listsHeight }) => {
  const { getMessage: t } = useSharedContext();

  const rightList: LocalColumns = [];
  const leftList: LocalColumns = [];
  const list: LocalColumns = [];

  localColumns.forEach(column => {
    /** 不在 setting 中展示的 */
    // if (column.hideInSetting) {
    //   return;
    // }
    const { fixed } = column;
    if (fixed === 'left') {
      leftList.push(column);
      return;
    }
    if (fixed === 'right') {
      rightList.push(column);
      return;
    }
    list.push(column);
  });

  const showRight = rightList && rightList.length > 0;
  const showLeft = leftList && leftList.length > 0;

  return (
    <div class={[`${className}-list`, { [`${className}-list-group`]: showRight || showLeft }]}>
      <CheckboxList
        list={leftList}
        title={t('tableToolBar.leftFixedTitle', '固定在左侧')}
        checkable={checkable}
        draggable={draggable}
        className={className}
        listHeight={listsHeight}
      />
      {/* 如果没有任何固定，不需要显示title */}
      <CheckboxList
        list={list}
        title={t('tableToolBar.noFixedTitle', '不固定')}
        showTitle={showLeft || showRight}
        checkable={checkable}
        draggable={draggable}
        className={className}
        listHeight={listsHeight}
      />
      <CheckboxList
        list={rightList}
        title={t('tableToolBar.rightFixedTitle', '固定在右侧')}
        checkable={checkable}
        draggable={draggable}
        className={className}
        listHeight={listsHeight}
      />
    </div>
  );
};

const ColumnSetting: FunctionalComponent<ColumnSettingProps> = (props, { slots }) => {
  const { columns, checkable = true, checkedReset = true, draggable = true, listsHeight, extra } = props;

  const { columnsMap = {}, setColumnsMap, getMessage: t, getPrefixCls } = useSharedContext();

  const localColumns: LocalColumns = columns;

  /**
   * 设置全部选中，或全部未选中
   */
  const setAllSelectAction = (show = true) => {
    const columnKeyMap: Record<string, ColumnState> = {};
    const loopColumns = (columns: LocalColumns) => {
      columns.forEach(({ key, dataIndex, fixed, index, children }: any) => {
        const columnKey = genColumnKey(key ?? dataIndex, index);
        if (columnKey) {
          columnKeyMap[columnKey] = {
            show,
            fixed,
          };
        }
        if (children) {
          loopColumns(children);
        }
      });
    };
    loopColumns(localColumns);
    setColumnsMap?.(columnKeyMap);
  };

  /**
   * 全选和反选
   */
  const checkAll = (checked: boolean) => {
    if (checked) {
      setAllSelectAction();
    } else {
      setAllSelectAction(false);
    }
  };

  /**
   * 重置项目
   */
  const clearClick = () => {
    // setColumnsMap(columnRef.current);
  };

  // 未选中的 key 列表
  const unCheckedKeys = Object.values(columnsMap).filter(value => !value || value.show === false);

  // 是否已经选中
  const indeterminate = unCheckedKeys.length > 0 && unCheckedKeys.length !== localColumns.length;

  const className = getPrefixCls('column-setting');

  const title = (
    <div class={`${className}-title`}>
      <Checkbox
        indeterminate={indeterminate}
        checked={unCheckedKeys.length === 0 && unCheckedKeys.length !== localColumns.length}
        onChange={e => checkAll(e.target.checked)}
      >
        {t('tableToolBar.columnDisplay', '列展示')}
      </Checkbox>
      {checkedReset ? (
        <a onClick={clearClick} class={`${className}-action-rest-button`}>
          {t('tableToolBar.reset', '重置')}
        </a>
      ) : null}
      {extra ? (
        <Space size={12} align="center">
          {extra}
        </Space>
      ) : null}
    </div>
  );

  const children = slots.default ? (
    slots.default()
  ) : (
    <Tooltip title={t('tableToolBar.columnSetting', '列设置')}>
      <SettingOutlined />
    </Tooltip>
  );

  return (
    <Popover
      title={title}
      overlayClassName={`${className}-overlay`}
      trigger="click"
      placement="bottomRight"
      content={
        <CheckboxListGroup
          checkable={checkable}
          draggable={draggable}
          className={className}
          localColumns={localColumns}
          listsHeight={listsHeight}
        />
      }
    >
      {children}
    </Popover>
  );
};

export default ColumnSetting;
