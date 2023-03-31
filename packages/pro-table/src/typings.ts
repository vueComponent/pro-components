import type { ComponentPublicInstance, ShallowRef, Ref } from 'vue';
import type { TableProps, ColumnType } from 'ant-design-vue/es/table';
import type { SortOrder, FilterValue } from 'ant-design-vue/es/table/interface';
import type { CardProps } from 'ant-design-vue';
import type { ListToolBarProps } from './components/ListToolBar';
import type { OptionConfig } from './components/ToolBar';

// fork from https://github.com/vueComponent/ant-design-vue/blob/main/components/vc-table/interface.ts
export declare type Key = number | string;
export declare type FixedType = 'left' | 'right' | boolean;
export declare type DataIndex = string | number | readonly (string | number)[];

export type WithFalse<T> = T | false;

export type VueInstance = ComponentPublicInstance;

export type MaybeElement = Element | HTMLElement | VueInstance | undefined;

export type MaybeRef<T> = T | ShallowRef<T> | Ref<T>;

export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>;

export declare type DefaultRecordType = Record<string, unknown>;

export type ProColumnType<RecordType> = ColumnType<RecordType> & {
  valueType?: 'index' | 'indexBorder' | 'text' | 'select';
  search?: boolean;
};

export type ProColumnGroupType<RecordType extends DefaultRecordType> = Omit<ProColumnType<RecordType>, 'dataIndex'> & {
  chilren: ProColumnsType<RecordType>;
};

export type ProColumnsType<RecordType extends DefaultRecordType = DefaultRecordType> = (
  | ProColumnGroupType<RecordType>
  | ProColumnType<RecordType>
)[];

export type RequestParams = {
  current: number;
  pageSize: number;
  [key: string]: unknown;
};

export type ResponseData<RecordType> = {
  success?: boolean;
  data: RecordType[];
  total?: number;
  [key: string]: unknown;
};

export type FetchData<RecordType> = (
  params: RequestParams,
  sort?: Record<string, SortOrder>,
  filter?: Record<string, FilterValue | null>,
) => Promise<ResponseData<RecordType>>;

export type ProTableProps<RecordType extends DefaultRecordType = DefaultRecordType> = TableProps<RecordType> &
  Partial<{
    // editable: boolean;
    columns: ProColumnsType<RecordType>;
    request: FetchData<RecordType>;
    params: Record<string, unknown>;
    cardBordered: boolean | { search?: boolean; table?: boolean };
    cardProps: WithFalse<CardProps>;
    toolbar: WithFalse<ListToolBarProps>;
    options: WithFalse<OptionConfig>;
  }>;

export type ActionType = {
  fullScreen: () => void;
  reload: (resetPageIndex?: boolean) => Promise<void>;
};

export type SizeType = 'large' | 'middle' | 'small' | undefined;

export type ColumnState = {
  show?: boolean;
  fixed?: FixedType;
  order?: number;
  disable?:
    | boolean
    | {
        checkbox: boolean;
      };
};
