import { defineComponent, type App, DefineComponent, Plugin, ExtractPropTypes } from 'vue';
import { Form } from 'ant-design-vue';
import { commonFormProps } from '../BaseForm/types';
import { BaseForm } from '../BaseForm/index';
import ProFormItem from '../components/FormItem';

export const proFormPorps = {
    ...commonFormProps
};

export type ProFormPorps = Partial<ExtractPropTypes<typeof proFormPorps>>;

const ProForm = defineComponent({
    name: 'ProForm',
    inheritAttrs: false,
    props: proFormPorps,
    setup(props, { slots }) {
        return () => {
            return (
                <BaseForm
                    {...props}
                    layout={props.layout || 'vertical'}
                    contentRender={(items, submitter) => {
                        return (
                            <>
                                {items}
                                {submitter}
                            </>
                        );
                    }}
                >
                    {slots?.default?.()}
                </BaseForm>
            );
        };
    }
});

ProForm.useForm = Form.useForm;
ProForm.Item = ProFormItem;

ProForm.install = (app: App) => {
    app.component(ProForm.name, ProForm);
    return app;
};

export default ProForm as DefineComponent<ProFormPorps> & Plugin;
