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

  const { partner_id, place_id, description, code, valid_from, valid_to, hours_note, max_per_family, stock_note } = body;

  if (!partner_id || !place_id || !description) {
    return new Response(JSON.stringify({ error: 'partner_id, place_id and description are required' }), { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('partner_offers')
    .insert({
      partner_id: Number(partner_id),
      place_id: String(place_id),
      description: String(description),
      code: code ? String(code) : null,
      valid_from: valid_from ? String(valid_from) : null,
      valid_to: valid_to ? String(valid_to) : null,
      hours_note: hours_note ? String(hours_note) : null,
      max_per_family: max_per_family ? Number(max_per_family) : null,
      stock_note: stock_note ? String(stock_note) : null,
      active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Insert offer error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
};
