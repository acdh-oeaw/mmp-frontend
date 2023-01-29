import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

export function useDetailsPage() {
  const route = useRoute();

  return computed(() => Boolean(route.name?.includes('Detail')));
}
