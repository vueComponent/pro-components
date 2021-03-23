import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { PageContainer } from '../../src';

export default defineComponent({
  setup() {
    const route = useRoute();
    return () => (
      <PageContainer>
        <h1>Form: {route.meta.title}</h1>
        <pre>{JSON.stringify(route.meta, null, 4)}</pre>
      </PageContainer>
    );
  },
});
