export const prerender = false;

import type { APIRoute } from 'astro';
import { getUser } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = await getUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { gbptm_id, name, lat, lon, town, address1, postcode } = body;
  if (!gbptm_id || !name || lat == null || lon == null) {
    return new Response(JSON.stringify({ error: 'gbptm_id, name, lat and lon are required' }), { status: 400 });
  }

  // Check if this GBPTM place was already imported
  const { data: existing } = await supabaseAdmin
    .from('places')
    .select('id')
    .filter('metadata->>gbptm_id', 'eq', String(gbptm_id))
    .maybeSingle();

  if (existing) {
    return new Response(JSON.stringify({ id: existing.id }), { status: 200 });
  }

  // Insert as a new approved place
  const { data: inserted, error } = await supabaseAdmin
    .from('places')
    .insert({
      name: String(name),
      category: 'other',
      location: `SRID=4326;POINT(${Number(lon)} ${Number(lat)})`,
      address_line1: address1 ? String(address1) : null,
      city: town ? String(town) : null,
      postal_code: postcode ? String(postcode) : null,
      status: 'approved',
      source: 'import_gbptm',
      amenities: { changing_table: true },
      metadata: { gbptm_id: String(gbptm_id) },
    })
    .select('id')
    .single();

  if (error) {
    console.error('Insert place error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ id: inserted.id }), { status: 201 });
};
