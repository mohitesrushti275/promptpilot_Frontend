/** Empty in dev → same-origin `/api` + Vite proxy. Set for prod builds via `VITE_API_BASE_URL`. */
const raw = (import.meta.env.VITE_API_BASE_URL ?? '').trim();

export const API_BASE = raw.replace(/\/+$/, '');

/** Prefix `/api/...` paths with `API_BASE` when configured (production cross-origin API). */
export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${normalized}` : normalized;
}
