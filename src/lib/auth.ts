import type { AstroCookies } from 'astro';
import { supabaseAuth } from './supabase-admin';

const ACCESS_COOKIE = 'sb-access-token';
const REFRESH_COOKIE = 'sb-refresh-token';

/** Set auth cookies after successful login */
export function setAuthCookies(
  cookies: AstroCookies,
  accessToken: string,
  refreshToken: string,
) {
  const baseOpts = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
  };
  cookies.set(ACCESS_COOKIE, accessToken, {
    ...baseOpts,
    maxAge: 60 * 60, // 1 hour
  });
  cookies.set(REFRESH_COOKIE, refreshToken, {
    ...baseOpts,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/** Clear auth cookies on sign-out */
export function clearAuthCookies(cookies: AstroCookies) {
  cookies.delete(ACCESS_COOKIE, { path: '/' });
  cookies.delete(REFRESH_COOKIE, { path: '/' });
}

/** Verify the access token cookie and return the user, or null if invalid */
export async function getUser(cookies: AstroCookies) {
  const accessToken = cookies.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  const { data, error } = await supabaseAuth.auth.getUser(accessToken);
  if (error || !data.user) return null;
  return data.user;
}

/** Require auth — returns user or redirects to login */
export async function requireAuth(cookies: AstroCookies) {
  const user = await getUser(cookies);
  if (!user) {
    return { user: null, redirect: '/partner-portal/login' };
  }
  return { user, redirect: null };
}

export { ACCESS_COOKIE, REFRESH_COOKIE };
