import type { ComponentPublicInstance, CSSProperties, Ref } from 'vue';
import type { TableProps, ColumnType } from 'ant-design-vue/es/table';
import type { SortOrder, FilterValue } from 'ant-design-vue/es/table/interface';
import type { CardProps } from 'ant-design-vue';
import type { ListToolBarProps } from './components/ListToolBar';
import type { OptionConfig } from './components/ToolBar';

export type WithFalse<T> = T | false;

export type MaybeRef<T> = T | Ref<T>;

export type VueInstance = ComponentPublicInstance;

export type MaybeElement = HTMLElement | VueInstance | undefined;

export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>;

export declare type DefaultRecordType = Record<string, unknown>;

export type ProColumnType<RecordType> = ColumnType<RecordType> & {
  valueType?: 'index' | 'indexBorder' | 'text' | 'select';
  search?: boolean;
};

export type ProColumnGroupType<RecordType> = Omit<ProColumnType<RecordType>, 'dataIndex'> & {
  chilren: ProColumnsType<RecordType>;
};

export type ProColumnsType<RecordType> = (ProColumnGroupType<RecordType> | ProColumnType<RecordType>)[];

export type RequestParams = {
  current?: number;
  pageSize?: number;
  [key: string]: unknown;
};

export type ResponseData<RecordType> = {
  success?: boolean;
  data: RecordType[];
  total?: number;
  [key: string]: unknown;
};

export type FetchData<RecordType> = (
  params?: RequestParams,
  sort?: Record<string, SortOrder>,
  filter?: Record<string, FilterValue | null>,
) => Promise<ResponseData<RecordType>>;

export type ProTableProps<RecordType extends DefaultRecordType = DefaultRecordType> = TableProps<RecordType> &
  Partial<{
    columns: ProColumnsType<RecordType>;
    request: FetchData<RecordType>;
    params: Record<string, unknown>;
    cardBordered: boolean | { search?: boolean; table?: boolean };
    cardProps: WithFalse<CardProps>;
    toolbar: WithFalse<ListToolBarProps>;
    options: WithFalse<OptionConfig>;
  }>;

export type SizeType = 'large' | 'middle' | 'small' | undefined;

export type ActionType = {
  /**
   * @deprecated 规划中，可能会被移除。
   * 建议使用双向绑定（v-model:size）
   */
  changeSize?: (size: SizeType) => void;
  fullScreen: () => void;
  reload: (resetPageIndex?: boolean) => Promise<void>;
};

export type FormatMessage = (message: string) => string;
