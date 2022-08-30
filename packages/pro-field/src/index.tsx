import { defineComponent } from 'vue';
import FieldText from './components/Text';

// type
import {} from './components/typings';

// style
import './default.less';
import './style.less';

const ProField = defineComponent({
  setup() {
    return () => {
      return <></>;
    };
  },
});

export { FieldText };

export default ProField;
