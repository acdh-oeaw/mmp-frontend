import { useRoute } from 'vue-router/composables';

export function useParentRoute() {
  const route = useRoute();

  return route.matched.at(-2);
}
