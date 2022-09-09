import { defineComponent } from 'vue';
import { Space, Button } from 'ant-design-vue';
import type { CSSProperties, PropType } from '@vue/runtime-dom';
import { SearchOutlined, UndoOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue';
import { useFormInstance } from '../../../BaseForm/hooks/useFormInstance';
import { Submitter } from '../../../BaseForm/components/Submitter';
import type { ButtonProps } from 'ant-design-vue/es/button';
import './action.less';

export const Action = defineComponent({
  inheritAttrs: false,
  props: {
    // 样式
    style: {
      type: Object as PropType<CSSProperties>,
      default: undefined,
    },
    // 是否展开
    collapsed: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    // 收起按钮的 render
    collapseRender: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    /** 提交按钮的props*/
    submitButtonProps: {
      type: Object as PropType<ButtonProps>,
      default: undefined,
    },
    prefixCls: {
      type: String as PropType<string>,
      default: 'ant-pro',
    },
  },
  emits: ['collapsed'],
  setup(props, { emit }) {
    const { submit, resetForm } = useFormInstance();
    const onCollapsed = () => {
      emit('collapsed', !props.collapsed);
    };
    return () => {
      return (
        <Space style={props.style} class={`${props.prefixCls}-form-query-filter-btn-search`}>
          <Submitter
            resetButtonProps={{}}
            submitButtonProps={props.submitButtonProps || {}}
            onSubmit={submit}
            onReset={resetForm}
            searchConfig={{
              submitText: '查询',
            }}
            v-slots={{
              submitIcon: () => <SearchOutlined />,
              resetIcon: () => <UndoOutlined />,
            }}
          ></Submitter>
          {props.collapseRender && (
            <Button type={'link'} onClick={onCollapsed}>
              {!props.collapsed ? '收起' : '展开'}
              {props.collapsed ? <DownOutlined /> : <UpOutlined />}
            </Button>
          )}
        </Space>
      );
    };
  },
});
