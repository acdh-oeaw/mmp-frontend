import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

export function useHomePage() {
  const route = useRoute();

  return computed(() => route.path === '/');
}
