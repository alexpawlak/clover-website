export const prerender = false;

import type { APIRoute } from 'astro';
import { getUser } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase-admin';

type PhotoRow = {
  id: string;
  place_id: string;
  url: string;
  created_at: string;
  display_order: number | null;
  session_id: string | null;
  user_id: string | null;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isMissingDisplayOrderColumn(message: string | undefined) {
  return (message ?? '').includes('column place_photos.display_order does not exist');
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const user = await getUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const url = new URL(request.url);
  const placeId = url.searchParams.get('place_id')?.trim();
  let query = supabaseAdmin
    .from('place_photos')
    .select('id, place_id, url, created_at, display_order, session_id, user_id');

  if (placeId) {
    query = query.eq('place_id', placeId);
  } else {
    query = query.order('created_at', { ascending: false });
    query = query.limit(30);
  }

  let { data, error } = await query;

  if (error && placeId && isMissingDisplayOrderColumn(error.message)) {
    const fallback = await supabaseAdmin
      .from('place_photos')
      .select('id, place_id, url, created_at, session_id, user_id')
      .eq('place_id', placeId)
      .order('created_at', { ascending: false });

    data = fallback.data?.map(photo => ({
      ...photo,
      display_order: null,
    })) as PhotoRow[] | null;
    error = fallback.error;
  }

  if (error) {
    console.error('List place photos error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const photos = (data ?? []) as PhotoRow[];
  const placeIds = Array.from(new Set(
    photos
      .map(photo => photo.place_id)
      .filter((value): value is string => Boolean(value) && isUuid(value))
  ));

  let placeMap = new Map<string, { name: string; city: string | null }>();
  if (placeIds.length > 0) {
    const { data: places, error: placesError } = await supabaseAdmin
      .from('places')
      .select('id, name, city')
      .in('id', placeIds);

    if (placesError) {
      console.error('Load places for photos error:', placesError);
      return new Response(JSON.stringify({ error: placesError.message }), { status: 500 });
    }

    placeMap = new Map((places ?? []).map(place => [
      place.id,
      { name: place.name, city: place.city ?? null },
    ]));
  }

  if (placeId) {
    photos.sort((a, b) => {
      const aOrder = typeof a.display_order === 'number' ? a.display_order : Number.MAX_SAFE_INTEGER;
      const bOrder = typeof b.display_order === 'number' ? b.display_order : Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  const payload = photos.map(photo => ({
    ...photo,
    place_name: placeMap.get(photo.place_id)?.name ?? null,
    place_city: placeMap.get(photo.place_id)?.city ?? null,
  }));

  return new Response(JSON.stringify(payload), { status: 200 });
};
