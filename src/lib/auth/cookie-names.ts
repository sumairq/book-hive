/**
 * Cookie name constants — kept in their own file (no Node imports) so the
 * Edge runtime middleware can import them without dragging `node:crypto`.
 */
export const ACCESS_COOKIE = 'bh_at';
export const REFRESH_COOKIE = 'bh_rt';
export const CSRF_COOKIE = 'bh_csrf';
