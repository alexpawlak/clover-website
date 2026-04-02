export const prerender = false;

import type { APIRoute } from 'astro';
import { getUser } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const GET: APIRoute = async ({ request, cookies }) => {
  const user = await getUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const url = new URL(request.url);
  const placeId = url.searchParams.get('place_id')?.trim();

  if (!placeId) {
    return new Response(JSON.stringify({ error: 'place_id is required' }), { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('place_photos')
    .select('id, place_id, url, created_at, session_id, user_id')
    .eq('place_id', placeId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('List place photos error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data ?? []), { status: 200 });
};
