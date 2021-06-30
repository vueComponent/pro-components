import {
  computed,
  defineComponent,
  unref,
  toRefs,
  VNode,
  VNodeChild,
  PropType,
  ExtractPropTypes,
} from 'vue';
/* replace antd ts define */
import { TabPaneProps } from './interfaces/TabPane';
import { TabBarExtraContent, TabsProps } from './interfaces/Tabs';
import { AffixProps } from './interfaces/Affix';
/* replace antd ts define end */
import { RouteContextProps, useRouteContext } from '../RouteContext';
import { getPropsSlot } from '../utils';
import { withInstall } from 'ant-design-vue/es/_util/type';
import 'ant-design-vue/es/affix/style';
import Affix from 'ant-design-vue/es/affix';
import 'ant-design-vue/es/page-header/style';
import PageHeader, { pageHeaderProps } from 'ant-design-vue/es/page-header';
import 'ant-design-vue/es/tabs/style';
import Tabs from 'ant-design-vue/es/tabs';
import 'ant-design-vue/es/spin/style';
import Spin from 'ant-design-vue/es/spin';
import GridContent from '../GridContent';
import FooterToolbar from '../FooterToolbar';
import { PropTypes } from '../utils';
import { CustomRender, WithFalse } from '../typings';
import omit from 'omit.js';
import './index.less';

export interface Tab {
  key: string;
  tab: string | VNode | JSX.Element;
}

export const pageHeaderTabConfig = {
  /**
   * @name tabs 的列表
   */
  tabList: {
    type: [Object, Function, Array] as PropType<(Omit<TabPaneProps, 'id'> & { key?: string })[]>,
    default: () => undefined,
  },
  /**
   * @name 当前选中 tab 的 key
   */
  tabActiveKey: PropTypes.string,
  /**
   * @name tab 上多余的区域
   */
  tabBarExtraContent: {
    type: [Object, Function] as PropType<TabBarExtraContent>,
    default: () => undefined,
  },
  /**
   * @name tabs 的其他配置
   */
  tabProps: {
    type: Object as PropType<TabsProps>,
    default: () => undefined,
  },
  /**
   * @name 固定 PageHeader 到页面顶部
   */
  fixedHeader: PropTypes.looseBool,
  // events
  onTabChange: PropTypes.func,
};
export type PageHeaderTabConfig = Partial<ExtractPropTypes<typeof pageHeaderTabConfig>>;

export const pageContainerProps = {
  ...pageHeaderTabConfig,
  ...pageHeaderProps,
  prefixCls: PropTypes.string.def('ant-pro'),
  title: {
    type: [Object, String, Boolean, Function] as PropType<
      WithFalse<VNodeChild | JSX.Element | string>
    >,
    default: () => null,
  },
  subTitle: {
    type: [Object, String, Boolean, Function] as PropType<
      WithFalse<VNodeChild | JSX.Element | string>
    >,
    default: () => null,
  },
  content: {
    type: [Object, String, Boolean, Function] as PropType<
      WithFalse<VNodeChild | JSX.Element | string>
    >,
    default: () => null,
  },
  extraContent: {
    type: [Object, String, Boolean, Function] as PropType<
      WithFalse<VNodeChild | JSX.Element | string>
    >,
    default: () => null,
  },
  header: {
    type: [Object, String, Boolean, Function] as PropType<
      WithFalse<VNodeChild | JSX.Element | string>
    >,
    default: () => null,
  },
  footer: {
    type: [Object, String, Boolean, Function] as PropType<
      WithFalse<VNodeChild | JSX.Element | string>
    >,
    default: () => null,
  },
  pageHeaderRender: {
    type: [Object, Function, Boolean] as PropType<
      (
        props: any | /* PageContainerProps */ Record<string, any>,
      ) => VNodeChild | VNode | JSX.Element
    >,
  },
  affixProps: {
    type: [Object, Function] as PropType<AffixProps>,
  },
  ghost: PropTypes.looseBool,
  loading: PropTypes.looseBool,
};

export type PageContainerProps = Partial<ExtractPropTypes<typeof pageContainerProps>>;

const renderFooter = (
  props: Omit<
    PageContainerProps & {
      prefixedClassName: string;
    },
    'title'
  >,
): VNodeChild | JSX.Element => {
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
        onChange={(key: string | number) => {
          if (onTabChange) {
            onTabChange(key);
          }
        }}
        tabBarExtraContent={tabBarExtraContent}
        {...tabProps}
      >
        {tabList.map(item => (
          <Tabs.TabPane {...item} tab={item.tab} key={item.key} />
        ))}
      </Tabs>
    );
  }
  return null;
};

const renderPageHeader = (
  content: CustomRender,
  extraContent: CustomRender,
  prefixedClassName: string,
): VNodeChild | JSX.Element | null => {
  if (!content && !extraContent) {
    return null;
  }
  return (
    <div class={`${prefixedClassName}-detail`}>
      <div class={`${prefixedClassName}-main`}>
        <div class={`${prefixedClassName}-row`}>
          {content && (
            <div class={`${prefixedClassName}-content`}>
              {(typeof content === 'function' && content()) || content}
            </div>
          )}
          {extraContent && (
            <div class={`${prefixedClassName}-extraContent`}>
              {(typeof extraContent === 'function' && extraContent()) || extraContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const defaultPageHeaderRender = (
  props: PageContainerProps,
  value: RouteContextProps & { prefixedClassName: string },
): VNodeChild | JSX.Element => {
  const {
    title,
    tabList,
    tabActiveKey,
    content,
    pageHeaderRender,
    header,
    extraContent,
    ...restProps
  } = omit(props, ['prefixCls']);
  if (pageHeaderRender) {
    return pageHeaderRender({ ...props, ...value });
  }
  let pageHeaderTitle = title;
  if (!title && title !== false) {
    pageHeaderTitle = value.title;
  }

  const breadcrumb = restProps.breadcrumb || {
    routes: unref(value.breadcrumb?.routes),
    itemRender: value.breadcrumb?.itemRender,
  };

  //
  // inject value
  return (
    <PageHeader
      {...restProps}
      title={pageHeaderTitle}
      breadcrumb={breadcrumb}
      footer={renderFooter({
        ...restProps,
        tabList,
        tabActiveKey,
        prefixedClassName: value.prefixedClassName,
      })}
    >
      {header || renderPageHeader(content, extraContent, value.prefixedClassName)}
    </PageHeader>
  );
};

const PageContainer = defineComponent({
  name: 'PageContainer',
  props: pageContainerProps,
  setup(props, { slots }) {
    const { loading, affixProps, ghost } = toRefs(props);
    const value = useRouteContext();
    const { getPrefixCls } = value;
    const prefixCls = props.prefixCls || getPrefixCls();
    const prefixedClassName = computed(() => `${prefixCls}-page-container`);
    const classNames = computed(() => {
      return {
        [prefixedClassName.value]: true,
        [`${prefixCls}-page-container-ghost`]: ghost.value,
      };
    });

    const tags = getPropsSlot(slots, props, 'tags');
    const headerContent = getPropsSlot(slots, props, 'content');
    const extra = getPropsSlot(slots, props, 'extra');
    const extraContent = getPropsSlot(slots, props, 'extraContent');
    const footer = getPropsSlot(slots, props, 'footer');

    const headerDom = computed(() => (
      <div class={`${prefixedClassName.value}-warp`}>
        {defaultPageHeaderRender(
          {
            ...props,
            tags,
            content: headerContent,
            extra,
            extraContent,
          },
          {
            ...value,
            prefixCls: undefined,
            prefixedClassName: prefixedClassName.value,
          },
        )}
      </div>
    ));

    return () => (
      <div class={classNames.value}>
        {value.fixedHeader ? (
          <Affix offsetTop={value.fixedHeader ? value.headerHeight : 0} {...affixProps.value}>
            {headerDom.value}
          </Affix>
        ) : (
          headerDom.value
        )}
        <GridContent>
          {loading.value ? (
            <Spin />
          ) : slots.default ? (
            <div>
              <div class={`${prefixedClassName.value}-children-content`}>{slots.default()}</div>
              {value.hasFooterToolbar && (
                <div
                  style={{
                    height: 48,
                    marginTop: 24,
                  }}
                />
              )}
            </div>
          ) : null}
        </GridContent>
        {value.hasFooterToolbar && <FooterToolbar>{footer}</FooterToolbar>}
      </div>
    );
  },
});
// <WaterMark content="Pro Layout"></WaterMark>
export default withInstall(PageContainer);
