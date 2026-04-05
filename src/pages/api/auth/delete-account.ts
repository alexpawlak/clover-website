export const prerender = false;

import type { APIRoute } from 'astro';
import { clearAuthCookies, getUser } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase-admin';

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

export const POST: APIRoute = async ({ cookies }) => {
  const user = await getUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { data: photos, error: photosError } = await supabaseAdmin
    .from('place_photos')
    .select('id, url')
    .eq('user_id', user.id);

  if (photosError) {
    console.error('Load user photos for delete-account error:', photosError);
    return new Response(JSON.stringify({ error: photosError.message }), { status: 500 });
  }

  const groupedPaths = new Map<string, string[]>();
  for (const photo of photos ?? []) {
    const storageRef = parseStorageObjectRef(photo.url);
    if (!storageRef) continue;

    const existingPaths = groupedPaths.get(storageRef.bucket) ?? [];
    existingPaths.push(storageRef.path);
    groupedPaths.set(storageRef.bucket, existingPaths);
  }

  for (const [bucket, paths] of groupedPaths.entries()) {
    if (paths.length === 0) continue;

    const { error: storageError } = await supabaseAdmin.storage.from(bucket).remove(paths);
    if (storageError) {
      console.error('Delete-account storage cleanup error:', storageError);
      return new Response(
        JSON.stringify({ error: 'Could not remove uploaded photo files. Please retry.' }),
        { status: 500 }
      );
    }
  }

  const { error: photoDeleteError } = await supabaseAdmin
    .from('place_photos')
    .delete()
    .eq('user_id', user.id);

  if (photoDeleteError) {
    console.error('Delete-account photo rows cleanup error:', photoDeleteError);
    return new Response(JSON.stringify({ error: photoDeleteError.message }), { status: 500 });
  }

  const { error: userDeleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
  if (userDeleteError) {
    console.error('Delete-account auth user delete error:', userDeleteError);
    return new Response(
      JSON.stringify({
        error: 'Account deletion could not be completed. Please contact support.',
      }),
      { status: 500 }
    );
  }

  clearAuthCookies(cookies);

  return new Response(
    JSON.stringify({
      success: true,
      deletedPhotoCount: photos?.length ?? 0,
    }),
    { status: 200 }
  );
};