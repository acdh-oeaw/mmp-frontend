import type { Author, Place } from '@/api';

export function getAuthorLabel(
  value:
    | Pick<Author, 'name' | 'name_en' | 'name_lat' | 'name_fr' | 'name_gr' | 'name_it'>
    | null
    | undefined
): string {
  if (value == null) return 'Unknown author';

  return (
    value.name_en || value.name_lat || value.name || value.name_fr || value.name_it || value.name_gr
  );
}

export function getPlaceLabel(
  value:
    | Pick<Place, 'name' | 'name_antik' | 'name_de' | 'name_fr' | 'name_gr' | 'name_it'>
    | null
    | undefined
): string {
  if (value == null) return 'Unknown place';

  return (
    value.name_antik ||
    value.name ||
    value.name_de ||
    value.name_fr ||
    value.name_it ||
    value.name_gr
  );
}
