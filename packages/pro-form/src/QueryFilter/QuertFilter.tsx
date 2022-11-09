import { defineComponent, unref, type App, type Plugin, type DefineComponent } from 'vue';
import { Row, Col, Form } from 'ant-design-vue';
import { Action } from './components/form-action/action';
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer';
import { BaseForm } from '../BaseForm';
import { useQueryFilterState } from './hooks/useQueryFilterState';
import { queryFilterProps, type QueryFilterProps } from './types';

const QueryFilter = defineComponent({
  name: 'QueryFilter',
  inheritAttrs: false,
  props: queryFilterProps,
  emits: ['collapsed'],
  setup(props, { attrs, expose, slots, emit }) {
    const state = useQueryFilterState({ props, attrs, slots });

    const { formWidth, baseFromRef, getFormProps, collapsed, spanSize, offset, doms, needCollapseRender } = state;

    const onCollapsed = (_collapsed: boolean) => {
      if (typeof props.onCollapsed === 'function') {
        emit('collapsed', _collapsed);
      }
      collapsed.value = _collapsed;
    };

    const instance = {
      ...state,
    };

    expose(instance);

    const FormContent = () => {
      return (
        <ResizeObserver
          onResize={({ width }: { width: number }) => {
            formWidth.value = width;
          }}
        >
          <Row gutter={props.searchGutter}>
            {unref(doms)}
            <Col offset={unref(offset)} span={unref(spanSize).span}>
              <Form.Item colon={false}>
                <Action
                  collapsed={unref(collapsed)}
                  collapseRender={unref(needCollapseRender)}
                  submitButtonProps={getFormProps.value.submitButtonProps}
                  onCollapsed={onCollapsed}
                />
              </Form.Item>
            </Col>
          </Row>
        </ResizeObserver>
      );
    };

    return () => {
      return (
        <BaseForm
          style={props.style}
          ref={baseFromRef}
          v-slots={{
            default: FormContent,
          }}
          {...unref(getFormProps)}
        ></BaseForm>
      );
    };
  },
});

QueryFilter.install = (app: App) => {
  app.component(QueryFilter.name, QueryFilter);
  return app;
};

export default QueryFilter as DefineComponent<QueryFilterProps> & Plugin;
