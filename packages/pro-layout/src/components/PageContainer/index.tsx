import {
  computed,
  defineComponent,
  unref,
  toRefs,
  type FunctionalComponent,
  type VNode,
  type VNodeChild,
  type PropType,
  type ExtractPropTypes,
} from 'vue';
/* replace antd ts define */
import PageHeader, { pageHeaderProps } from 'ant-design-vue/es/page-header';
import { Tabs, Affix } from 'ant-design-vue';
import type { TabPaneProps } from './interfaces/TabPane';
import type { TabBarExtraContent /*, TabsProps */ } from './interfaces/Tabs';
import type { AffixProps } from './interfaces/Affix';
/* replace antd ts define end */
import { useRouteContext } from '../../RouteContext';
import { getSlot, getSlotVNode } from '../../utils';
import 'ant-design-vue/es/affix/style';
import 'ant-design-vue/es/page-header/style';
import 'ant-design-vue/es/breadcrumb/style';
import 'ant-design-vue/es/tabs/style';
import PageLoading from '../PageLoading';
import GridContent from '../GridContent';
import FooterToolbar from '../FooterToolbar';
import { withInstall } from 'ant-design-vue/es/_util/type';
import type { CustomRender } from '../../typings';
import type { DefaultPropRender, PageHeaderRender } from '../../RenderTypings';
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
  tabActiveKey: String, //PropTypes.string,
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
    type: Object, //as PropType<TabsProps>,
    default: () => undefined,
  },
  /**
   * @name 固定 PageHeader 到页面顶部
   */
  fixedHeader: Boolean, //PropTypes.looseBool,
  // events
  onTabChange: Function, //PropTypes.func,
};
export type PageHeaderTabConfig = Partial<ExtractPropTypes<typeof pageHeaderTabConfig>>;

export const pageContainerProps = {
  ...pageHeaderTabConfig,
  ...pageHeaderProps,
  prefixCls: {
    type: String,
    default: 'ant-pro',
  }, //PropTypes.string.def('ant-pro'),
  title: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  subTitle: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  content: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  extraContent: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  header: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  footer: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  pageHeaderRender: {
    type: [Object, Function, Boolean] as PropType<PageHeaderRender>,
    default: () => undefined,
  },
  affixProps: {
    type: [Object, Function] as PropType<AffixProps>,
  },
  ghost: {
    type: Boolean,
    default: () => false,
  }, //PropTypes.looseBool,
  loading: {
    type: Boolean,
    default: () => undefined,
  }, //PropTypes.looseBool,
  breadcrumb: {
    type: Boolean,
    default: () => undefined,
  },
};

export type PageContainerProps = Partial<ExtractPropTypes<typeof pageContainerProps>>;

const renderFooter = (
  props: Omit<
    PageContainerProps & {
      prefixedClassName: string;
    },
    'title'
  >
): VNodeChild | JSX.Element => {
  const { tabList, tabActiveKey, onTabChange, tabBarExtraContent, tabProps, prefixedClassName } = props;
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
        {tabList.map((item) => (
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
  prefixedClassName: string
): VNodeChild | JSX.Element | null => {
  if (!content && !extraContent) {
    return null;
  }
  return (
    <div class={`${prefixedClassName}-detail`}>
      <div class={`${prefixedClassName}-main`}>
        <div class={`${prefixedClassName}-row`}>
          {content && (
            <div class={`${prefixedClassName}-content`}>{(typeof content === 'function' && content()) || content}</div>
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

const ProPageHeader: FunctionalComponent<PageContainerProps & { prefixedClassName: string }> = (props) => {
  const {
    title,
    tabList,
    tabActiveKey,
    breadcrumb,
    content,
    pageHeaderRender,
    header,
    extraContent,
    prefixedClassName,
    prefixCls,
    fixedHeader: _,
    ...restProps
  } = props;

  if (pageHeaderRender === false) {
    return null;
  }
  if (pageHeaderRender) {
    return pageHeaderRender({ ...props });
  }

  const pageHeaderTitle = title !== false ? title : undefined;

  let pageHeaderBreadcrumb = {};
  if(breadcrumb !== false){
    const value = useRouteContext();
    const unrefBreadcrumb = unref(value.breadcrumb || {});
    pageHeaderBreadcrumb = {
      ...unrefBreadcrumb,
      routes: unrefBreadcrumb.routes,
      itemRender: unrefBreadcrumb.itemRender,
    };
  }

  return (
    <div class={`${prefixedClassName}-wrap`}>
      <PageHeader
        {...restProps}
        // {...value}
        title={pageHeaderTitle}
        breadcrumb={pageHeaderBreadcrumb}
        footer={renderFooter({
          ...restProps,
          tabList,
          tabActiveKey,
          prefixedClassName,
        })}
        prefixCls={prefixCls}
      >
        {header || renderPageHeader(content, extraContent, prefixedClassName)}
      </PageHeader>
    </div>
  );
};

const PageContainer = defineComponent({
  name: 'PageContainer',
  inheritAttrs: false,
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
    const headerDom = computed(() => {
      const tags = getSlotVNode<DefaultPropRender>(slots, props, 'tags');
      const headerContent = getSlotVNode<DefaultPropRender>(slots, props, 'content');
      const extra = getSlotVNode<DefaultPropRender>(slots, props, 'extra');
      const extraContent = getSlotVNode<DefaultPropRender>(slots, props, 'extraContent');
      // {
      //   ...props,
      //   tags,
      //   content: headerContent,
      //   extra,
      //   extraContent,
      //   prefixCls: undefined,
      //   prefixedClassName: prefixedClassName.value,
      // }
      return (
        <ProPageHeader
          {...props}
          prefixCls={undefined}
          prefixedClassName={prefixedClassName.value}
          ghost={ghost.value}
          content={headerContent}
          tags={tags}
          extra={extra}
          extraContent={extraContent}
        />
      );
    });

    return () => {
      const { fixedHeader } = props;
      const footer = getSlot(slots, props, 'footer');
      return (
        <div class={classNames.value}>
          {fixedHeader && headerDom.value ? (
            <Affix {...affixProps.value} offsetTop={value.hasHeader && value.fixedHeader ? value.headerHeight : 0}>
              {headerDom.value}
            </Affix>
          ) : (
            headerDom.value
          )}
          <GridContent>
            {loading.value ? (
              <PageLoading />
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
    };
  },
});
// <WaterMark content="Pro Layout"></WaterMark>
export default withInstall(PageContainer);
