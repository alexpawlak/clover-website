export const prerender = false;

import type { APIRoute } from 'astro';
import { clearAuthCookies } from '../../../lib/auth';

export const POST: APIRoute = ({ cookies }) => {
  clearAuthCookies(cookies);
  return new Response(null, { status: 204 });
};
