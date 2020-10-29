import { FunctionalComponent, VNodeChild, ref, computed, toRefs } from 'vue';
import { TabPaneProps } from './interfaces/TabPane';
import { TabBarExtraContent, TabsProps } from './interfaces/Tabs';
import { PageHeaderProps } from './interfaces/PageHeader';
import { AffixProps } from './interfaces/Affix';
import { useRouteContext, RouteContextProps } from '../RouteContext';
import { useProProvider } from '../ProProvider';
import { Affix, PageHeader, Tabs } from 'ant-design-vue';
import GridContent from '../GridContent';
import FooterToolbar from '../FooterToolbar';
import './index.less';

export interface Tab {
  key: string;
  tab: string | VNodeChild | JSX.Element;
}

export interface PageHeaderTabConfig {
  /**
   * @name tabs 的列表
   */
  tabList?: (Omit<TabPaneProps, 'id'> & { key?: string })[];
  /**
   * @name 当前选中 tab 的 key
   */
  tabActiveKey?: string;
  /**
   * @name tab 修改时触发
   */
  onTabChange?: (key: string | number | any) => void;
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

const renderFooter = (
  props: Omit<
    PageContainerProps & {
      prefixedClassName: string;
    },
    'title'
  >,
) => {
  const {
    tabList,
    tabActiveKey,
    onTabChange,
    tabBarExtraContent,
    tabProps,
    prefixedClassName,
  } = props;
  if (tabList && tabList.length) {
    return (
      <Tabs
        class={`${prefixedClassName}-tabs`}
        activeKey={tabActiveKey}
        onChange={key => {
          if (onTabChange) {
            onTabChange(key);
          }
        }}
        tabBarExtraContent={tabBarExtraContent}
        {...tabProps}
      >
        {tabList.map((item, index) => (
          <Tabs.TabPane {...item} tab={item.tab} key={item.key} />
        ))}
      </Tabs>
    );
  }
  return null;
};

const renderPageHeader = (
  content: VNodeChild | JSX.Element,
  extraContent: VNodeChild | JSX.Element,
  prefixedClassName: string,
): VNodeChild | JSX.Element => {
  if (!content && !extraContent) {
    return null;
  }
  return (
    <div class={`${prefixedClassName}-detail`}>
      <div class={`${prefixedClassName}-main`}>
        <div class={`${prefixedClassName}-row`}>
          {content && <div class={`${prefixedClassName}-content`}>{content}</div>}
          {extraContent && <div class={`${prefixedClassName}-extraContent`}>{extraContent}</div>}
        </div>
      </div>
    </div>
  );
};

const defaultPageHeaderRender = (
  props: PageContainerProps,
  value: RouteContextProps & { prefixedClassName: string },
): VNodeChild | JSX.Element => {
  const { title, content, pageHeaderRender, header, extraContent, prefixCls, ...restProps } = props;
  console.log('restProps', restProps);
  console.log('routeContext.value', value);
  if (pageHeaderRender) {
    return pageHeaderRender({ ...props, ...value });
  }
  let pageHeaderTitle = title;
  if (!title && title !== false) {
    pageHeaderTitle = value.title;
  }
  // inject value
  return (
    <PageHeader
      title={pageHeaderTitle}
      {...restProps}
      footer={renderFooter({
        ...restProps,
        prefixedClassName: value.prefixedClassName,
      })}
      {...header}
      preifxCls={prefixCls}
    >
      {header || renderPageHeader(content, extraContent, value.prefixedClassName)}
    </PageHeader>
  );
};

export const PageContainer: FunctionalComponent<PageContainerProps> = (props, { slots }) => {
  const { loading, footer, affixProps, ghost, fixedHeader } = props; // toRefs(props);
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

  const headerDom = (
    <div class={`${prefixedClassName}-warp`}>
      {defaultPageHeaderRender(props, {
        ...value,
        prefixCls: undefined,
        prefixedClassName,
      })}
    </div>
  );

  return (
    <div class={classNames}>
      {fixedHeader ? (
        <Affix
          offsetTop={value.hasHeader && value.fixedHeader ? value.headerHeight : 0}
          {...affixProps}
        >
          {headerDom}
        </Affix>
      ) : (
        headerDom
      )}
      <GridContent>{loading ? <Spin /> : content}</GridContent>
      {footer && <FooterToolbar>{footer}</FooterToolbar>}
    </div>
  );
};
