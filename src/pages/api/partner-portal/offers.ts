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

  const { place_id, description, code, valid_from, valid_to, hours_note, max_per_family, stock_note } = body;

  if (!place_id || !description) {
    return new Response(JSON.stringify({ error: 'place_id and description are required' }), { status: 400 });
  }

  // Derive partner from place name — find or create a partner with the same name
  const { data: place } = await supabaseAdmin
    .from('places')
    .select('name')
    .eq('id', String(place_id))
    .single();

  if (!place) {
    return new Response(JSON.stringify({ error: 'Place not found' }), { status: 400 });
  }

  const { data: existingPartner } = await supabaseAdmin
    .from('partners')
    .select('id')
    .eq('name', place.name)
    .maybeSingle();

  let partner_id: number;
  if (existingPartner) {
    partner_id = existingPartner.id;
  } else {
    const { data: newPartner, error: partnerError } = await supabaseAdmin
      .from('partners')
      .insert({ name: place.name })
      .select('id')
      .single();
    if (partnerError || !newPartner) {
      console.error('Create partner error:', partnerError);
      return new Response(JSON.stringify({ error: 'Could not create partner' }), { status: 500 });
    }
    partner_id = newPartner.id;
  }

  const { data, error } = await supabaseAdmin
    .from('partner_offers')
    .insert({
      partner_id,
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
