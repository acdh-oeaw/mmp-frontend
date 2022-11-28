import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

export function useFullScreen() {
  const route = useRoute();

  return computed(() => route.name?.includes('Fullscreen'));
}
