import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

export function useParentRoute() {
  const route = useRoute();

  return computed(() => route.matched.at(-2));
}
