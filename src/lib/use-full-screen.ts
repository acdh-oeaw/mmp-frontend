import { useRoute } from 'vue-router/composables';

export function useFullScreen() {
  const route = useRoute();

  return route.name?.includes('Fullscreen');
}
