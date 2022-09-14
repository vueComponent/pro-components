import { defineComponent, type App, DefineComponent, Plugin } from 'vue';
import SearchSelect from './SearchSelect';

const FieldSelect = defineComponent({
  setup() {
    return () => {
      return <SearchSelect />;
    };
  },
});

FieldSelect.install = (app: App) => {
  app.component(FieldSelect.name, FieldSelect);
  return app;
};

export default FieldSelect as DefineComponent & Plugin;
