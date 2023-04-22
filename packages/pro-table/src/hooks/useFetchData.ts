import { shallowReactive, isReactive, watch, watchEffect, shallowRef } from 'vue';
import { isNil, isEqual, omitBy } from 'lodash-es';
import type { SpinProps, PaginationProps } from 'ant-design-vue';
import type { FetchData } from '../typings';

const isEmpty = (value: unknown) => isEqual(value, '') || isNil(value);

const omitNil = (object: Record<string, unknown>) => omitBy(object, isEmpty);

export type FetchDataProps<RecordType> = Readonly<
  Partial<
    Context<RecordType> & {
      params: Record<string, unknown>;
      pagination: boolean | PaginationProps;
    }
  >
>;

export type Context<RecordType> = {
  loading: boolean | SpinProps;
  dataSource: RecordType[];
  pagination: PaginationProps;
};

export type FetchOptions<RecordType> = Partial<{
  onLoad: (dataSource: RecordType[]) => void;
  onRequestError: (e: Error) => void;
}>;

export const useFetchData = <T>(
  getData: FetchData<T> | undefined,
  props: FetchDataProps<T> = {},
  options?: FetchOptions<T>,
) => {
  const state = isReactive(props) ? props : shallowReactive(props);

  const { onLoad, onRequestError } = options ?? {};

  const context = shallowReactive<Context<T>>({
    loading: false,
    dataSource: [],
    pagination: { current: 1, pageSize: 10 },
  });

  // context is shallowReactive, only root-level properties are reactive,
  // so if u want to change 'pagination', must use 'setPageInfo'.
  // https://vuejs.org/api/reactivity-advanced.html#shallowreactive
  const setPageInfo = (pageInfo: PaginationProps) => {
    /**
     * 当total发生变化时，可能需要重新计算current。
     * 例如：在最后一页全选删除后，进行reload，则current应为上一页。
     */
    const validate = (pagination: PaginationProps) => {
      const { current = 1, pageSize = 10, total } = pagination;
      const overflow = total && current > Math.ceil(total / pageSize);
      return {
        ...pagination,
        current: overflow ? Math.ceil(total / pageSize) : current,
      };
    };

    context.pagination = validate({
      ...context.pagination,
      ...pageInfo,
    });
  };

  const queryFilter = shallowRef<Record<string, unknown>>({});

  const setQueryFilter = (params: Record<string, unknown>) => {
    queryFilter.value = omitNil(params);
  };

  const fetchData = async () => {
    // 没有请求函数直接返回
    if (getData === undefined) return;
    // 请求中禁止重复请求
    if (context.loading) return;
    try {
      context.loading = state.loading || true;
      const {
        pagination: { pageSize, current },
      } = context;

      const params = {
        ...queryFilter.value,
        ...state.params,
      };

      const { success, data, total = data.length } = await getData({ pageSize, current, ...params });
      if (success !== false) {
        context.dataSource = data;
        onLoad?.(data);
        setPageInfo({ total });
      }
    } catch (e: unknown) {
      // 如果没有传递这个方法的话，需要把错误抛出去，以免吞掉错误
      if (onRequestError === undefined) throw new Error(e as string);
      onRequestError(e as Error);
    } finally {
      context.loading = false;
    }
  };

  // If `request` is undefined, release the control of `loading`, `dataSource`, `pagination`.
  watchEffect(() => {
    getData === undefined &&
      Object.assign(
        context,
        omitNil({
          loading: state.loading,
          dataSource: state.dataSource,
          pagination: state.pagination,
        }),
      );
  });

  watch(
    () => context.pagination,
    (current, previous) => {
      // 如果两次页码相等是不需要查询的，但pageSize发生变化是需要查询的。
      if (previous?.current === current.current && previous?.pageSize === current.pageSize) {
        return;
      }
      // pageSize 修改后返回第一页。
      if (previous?.pageSize != current.pageSize) {
        setPageInfo({ current: 1 });
      }
      fetchData();
    },
    { immediate: true },
  );

  watch([() => state.params, queryFilter], async (current, previous) => {
    if (!isEqual(current, previous)) {
      setPageInfo({ current: 1 });
      await fetchData();
    }
  });

  const reload = async (resetPageIndex = false) => {
    resetPageIndex && setPageInfo({ current: 1 });
    await fetchData();
  };

  return { context, reload, setPageInfo, setQueryFilter };
};
