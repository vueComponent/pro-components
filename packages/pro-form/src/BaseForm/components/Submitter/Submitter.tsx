import { defineComponent } from 'vue';
import { submitterProps } from './types';
import { Button, Space } from 'ant-design-vue';

const Submitter = defineComponent({
  props: submitterProps,
  slots: ['submitIcon', 'resetIcon'],
  setup(props, { slots }) {
    return () => {
      const { onSubmit, onReset, searchConfig, submitButtonProps, resetButtonProps = {} } = props;

      const { submitText = '提交', resetText = '重置' } = searchConfig || {};

      const submit = () => {
        onSubmit?.();
      };
      const reset = () => {
        onReset?.();
      };

      const doms: JSX.Element[] = [];
      if (submitButtonProps !== false) {
        doms.push(
          <Button
            type={'primary'}
            key="submit"
            {...submitButtonProps}
            icon={submitButtonProps.icon || slots.submitIcon?.()}
            onClick={(e) => {
              if (!submitButtonProps.preventDefault) {
                submit();
              }
              submitButtonProps?.onClick?.(e);
            }}
          >
            {submitText}
          </Button>
        );
      }

      if (resetButtonProps !== false) {
        doms.push(
          <Button
            key="reset"
            {...resetButtonProps}
            icon={resetButtonProps.icon || slots.resetIcon?.()}
            onClick={(e) => {
              if (!resetButtonProps.preventDefault) {
                reset();
              }
              resetButtonProps.onClick?.(e);
            }}
          >
            {resetText}
          </Button>
        );
      }

      if (Array.isArray(doms)) {
        if (doms.length === 0) {
          return undefined;
        }
        if (doms.length === 1) {
          return doms[0];
        }
        return <Space>{doms}</Space>;
      }
      return doms;
    };
  },
});

export { Submitter };
