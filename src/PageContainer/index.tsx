import { FunctionalComponent, VNodeChild, ref, computed, toRefs } from 'vue';
import { TabPaneProps } from './interfaces/TabPane';
import { TabBarExtraContent, TabsProps } from './interfaces/Tabs';
import { PageHeaderProps } from './interfaces/PageHeader';
import { AffixProps } from './interfaces/Affix';
import { useRouteContext, RouteContextProps } from '../RouteContext';
import { useProProvider } from '../ProProvider';
import { PageHeader } from 'ant-design-vue';

export interface Tab {
  key: string;
  tab: string | VNodeChild | JSX.Element;
}

export interface PageHeaderTabConfig {
  /**
   * @name tabs 的列表
   */
  tabList?: TabPaneProps & Tab & { key?: string | VNodeChild };
  /**
   * @name 当前选中 tab 的 key
   */
  tabActiveKey?: string;
  /**
   * @name tab 修改时触发
   */
  onTabChange?: () => void;
  /**
   * @name tab 上多余的区域
   */
  tabBarExtraContent?: TabBarExtraContent;
  /**
   * @name tabs 的其他配置
   */
  tabProps?: TabsProps;
  /**
   * @name 固定 PageHeader 到页面顶部
   * @deprecated 请使用 fixedHeader
   */
  fixHeader?: boolean;
  /**
   * @name 固定 PageHeader 到页面顶部
   */
  fixedHeader?: boolean;
}

export interface PageContainerProps extends PageHeaderTabConfig, Omit<PageHeaderProps, 'title'> {
  title?: VNodeChild | JSX.Element | false;
  content?: VNodeChild | JSX.Element;
  extraContent?: VNodeChild | JSX.Element;
  prefixCls?: string;
  footer?: VNodeChild | VNodeChild[] | JSX.Element;
  ghost?: boolean;
  header?: PageHeaderProps | VNodeChild;
  pageHeaderRender?: (props: PageContainerProps) => VNodeChild | JSX.Element;
  affixProps?: AffixProps;
  loading?: boolean;
}

const defaultPageHeaderRender = (
  props: PageContainerProps,
  value: RouteContextProps & { prefixedClassName: string },
): VNodeChild | JSX.Element => {
  const {
    title,
    content,
    pageHeaderRender,
    header,
    extraContent,
    style,
    prefixCls,
    ...restProps
  } = props;

  if (pageHeaderRender) {
    return pageHeaderRender({ ...props, ...value });
  }
  let pageHeaderTitle = title;
  if (!title && title !== false) {
    pageHeaderTitle = value.title;
  }
  if
  return (
    <PageHeader
      {...value}
      title={pageHeaderTitle}
      {...restProps}
      footer={renderFooter({
        ...restProps,
        prefixedClassName: value.prefixedClassName,
      })}
      {...header}
      preifxCls={prefixCls}
    >
      {header ||}
    </PageHeader>
  );
};

export const PageContainer: FunctionalComponent<PageContainerProps> = (props, { slots }) => {
  const { loading, style, footer, affixProps, ghost, fixedHeader } = toRefs(props);
  const { getPrefixCls } = useProProvider();
  const value = useRouteContext();

  const prefixCls = props.prefixCls || getPrefixCls();
  const prefixedClassName = `${prefixCls}-page-container`; // computed(() => `${prefixCls}-page-container`);

  const classNames = ref({
    [prefixedClassName]: true,
    [`${prefixCls}-page-container-ghost`]: ghost,
  });

  const content = slots.default ? (
    <div>
      <div class={`${prefixedClassName}-children-content`}>{slots.default()}</div>
      {value.hasFooterToolbar && (
        <div
          style={{
            height: 48,
            marginTop: 24,
          }}
        />
      )}
    </div>
  ) : null;

  const headerDom = <div class={`${prefixedClassName}-warp`}></div>;
};
