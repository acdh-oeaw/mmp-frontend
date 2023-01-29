import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

export function useFullScreen() {
  const route = useRoute();

  return computed(() => Boolean(route.name?.includes('Fullscreen')));
}
