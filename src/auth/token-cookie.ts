import { CookieOptions, Request } from 'express';

export const AUTH_COOKIE_NAME = 'tokenut';
export const AUTH_COOKIE_MAX_AGE_MS = 12 * 60 * 60 * 1000;

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE !== 'false',
  sameSite: 'strict',
  maxAge: AUTH_COOKIE_MAX_AGE_MS,
  path: '/',
};

export function getTokenFromCookie(request: Request): string | undefined {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) {
    return undefined;
  }

  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!cookie) {
    return undefined;
  }

  return decodeURIComponent(cookie.slice(AUTH_COOKIE_NAME.length + 1));
}
