alter table public.place_photos
add column if not exists display_order integer;

with ranked as (
  select
    id,
    row_number() over (
      partition by place_id
      order by created_at desc, id asc
    ) - 1 as new_display_order
  from public.place_photos
)
update public.place_photos as place_photos
set display_order = ranked.new_display_order
from ranked
where place_photos.id = ranked.id
  and (place_photos.display_order is null or place_photos.display_order <> ranked.new_display_order);

create index if not exists place_photos_place_id_display_order_idx
on public.place_photos (place_id, display_order);
