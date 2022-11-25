import { useVuetify } from '@/lib/use-vuetify';

export function useDrawerWidth() {
  const vuetify = useVuetify();

  switch (vuetify.breakpoint.name) {
    case 'xs':
    case 'sm':
      return '100vw';
    case 'md':
      return '50w';
    default:
      return '33vw';
  }
}
