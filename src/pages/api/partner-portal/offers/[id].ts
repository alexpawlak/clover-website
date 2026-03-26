export const prerender = false;

import type { APIRoute } from 'astro';
import { getUser } from '../../../../lib/auth';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const user = await getUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const id = Number(params.id);
  if (!id) {
    return new Response(JSON.stringify({ error: 'Invalid offer id' }), { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (typeof body.active === 'boolean') updates.active = body.active;
  if (body.description !== undefined) updates.description = body.description;
  if (body.code !== undefined) updates.code = body.code;
  if (body.valid_from !== undefined) updates.valid_from = body.valid_from;
  if (body.valid_to !== undefined) updates.valid_to = body.valid_to;
  if (body.hours_note !== undefined) updates.hours_note = body.hours_note;
  if (body.max_per_family !== undefined) updates.max_per_family = body.max_per_family;
  if (body.stock_note !== undefined) updates.stock_note = body.stock_note;

  const { data, error } = await supabaseAdmin
    .from('partner_offers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Update offer error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const user = await getUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const id = Number(params.id);
  if (!id) {
    return new Response(JSON.stringify({ error: 'Invalid offer id' }), { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('partner_offers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete offer error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(null, { status: 204 });
};
