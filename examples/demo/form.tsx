import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { PageContainer, Route } from '../../src';

export default defineComponent({
  setup() {
    const route = useRoute();
    return () => (
      <PageContainer
        title={route.meta.title}
        breadcrumb={{
          routes: [{ path: '/', breadcrumbName: 'home' }] as Route[],
        }}
      >
        <h1>Form: {route.meta.title}</h1>
        <pre>{JSON.stringify(route.meta, null, 4)}</pre>
      </PageContainer>
    );
  },
});
