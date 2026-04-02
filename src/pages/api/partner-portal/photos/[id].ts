export const prerender = false;

import type { APIRoute } from 'astro';
import { getUser } from '../../../../lib/auth';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

type StorageObjectRef = {
  bucket: string;
  path: string;
};

function parseStorageObjectRef(rawUrl: string): StorageObjectRef | null {
  try {
    const url = new URL(rawUrl);
    const publicMarker = '/storage/v1/object/public/';
    const signMarker = '/storage/v1/object/sign/';
    const marker = url.pathname.includes(publicMarker) ? publicMarker : signMarker;

    if (!marker || !url.pathname.includes(marker)) {
      return null;
    }

    const afterMarker = url.pathname.split(marker)[1];
    if (!afterMarker) return null;

    const [bucket, ...pathParts] = afterMarker.split('/');
    const path = pathParts.join('/');

    if (!bucket || !path) return null;

    return {
      bucket: decodeURIComponent(bucket),
      path: decodeURIComponent(path),
    };
  } catch {
    return null;
  }
}

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const user = await getUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const id = params.id?.trim();
  if (!id) {
    return new Response(JSON.stringify({ error: 'Invalid photo id' }), { status: 400 });
  }

  const { data: photo, error: photoError } = await supabaseAdmin
    .from('place_photos')
    .select('id, url')
    .eq('id', id)
    .maybeSingle();

  if (photoError) {
    console.error('Load photo for deletion error:', photoError);
    return new Response(JSON.stringify({ error: photoError.message }), { status: 500 });
  }

  if (!photo) {
    return new Response(JSON.stringify({ error: 'Photo not found' }), { status: 404 });
  }

  const storageRef = parseStorageObjectRef(photo.url);
  if (!storageRef) {
    return new Response(JSON.stringify({ error: 'Could not resolve storage path for this photo' }), { status: 400 });
  }

  const { error: storageError } = await supabaseAdmin
    .storage
    .from(storageRef.bucket)
    .remove([storageRef.path]);

  if (storageError) {
    console.error('Delete photo storage object error:', storageError);
    return new Response(JSON.stringify({ error: 'Could not delete the underlying image file' }), { status: 500 });
  }

  const { error: deleteError } = await supabaseAdmin
    .from('place_photos')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Delete photo row error:', deleteError);
    return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 });
  }

  const { error: auditError } = await supabaseAdmin
    .from('deletion_events')
    .insert({
      source: 'partner_portal',
      kind: 'place_photo',
      deleted_id: id,
    });

  if (auditError) {
    console.error('Insert deletion audit error:', auditError);
  }

  return new Response(null, { status: 204 });
};
