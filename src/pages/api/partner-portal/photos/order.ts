export const prerender = false;

import type { APIRoute } from 'astro';
import { getUser } from '../../../../lib/auth';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

type ReorderPayload = {
  place_id?: string;
  photo_ids?: unknown;
};

function isMissingDisplayOrderColumn(message: string | undefined) {
  return (message ?? '').includes('column place_photos.display_order does not exist');
}

async function updatePhotoDisplayOrders(placeId: string, photoIds: string[]) {
  const results = await Promise.all(
    photoIds.map((id, index) => supabaseAdmin
      .from('place_photos')
      .update({ display_order: index })
      .eq('id', id)
      .eq('place_id', placeId))
  );

  return results.find(result => result.error)?.error ?? null;
}

export const PATCH: APIRoute = async ({ request, cookies }) => {
  const user = await getUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json().catch(() => null) as ReorderPayload | null;
  const placeId = body?.place_id?.trim();
  const photoIds = Array.isArray(body?.photo_ids)
    ? body?.photo_ids.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    : null;

  if (!placeId) {
    return new Response(JSON.stringify({ error: 'Invalid place id' }), { status: 400 });
  }

  if (!photoIds || photoIds.length === 0) {
    return new Response(JSON.stringify({ error: 'Photo order must include at least one photo id' }), { status: 400 });
  }

  if (new Set(photoIds).size !== photoIds.length) {
    return new Response(JSON.stringify({ error: 'Photo order contains duplicate photo ids' }), { status: 400 });
  }

  const { data: existingPhotos, error: loadError } = await supabaseAdmin
    .from('place_photos')
    .select('id')
    .eq('place_id', placeId);

  if (loadError) {
    console.error('Load place photos for reorder error:', loadError);
    return new Response(JSON.stringify({ error: loadError.message }), { status: 500 });
  }

  const existingIds = (existingPhotos ?? []).map(photo => photo.id);
  if (existingIds.length !== photoIds.length) {
    return new Response(JSON.stringify({ error: 'Photo order must include every photo for this POI' }), { status: 400 });
  }

  const existingSet = new Set(existingIds);
  if (!photoIds.every(id => existingSet.has(id))) {
    return new Response(JSON.stringify({ error: 'Photo order contains ids that do not belong to this POI' }), { status: 400 });
  }

  const updateError = await updatePhotoDisplayOrders(placeId, photoIds);

  if (updateError) {
    if (isMissingDisplayOrderColumn(updateError.message)) {
      return new Response(JSON.stringify({
        error: 'Photo reordering is not available until the place_photos.display_order migration is applied.',
      }), { status: 409 });
    }
    console.error('Persist place photo order error:', updateError);
    return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
