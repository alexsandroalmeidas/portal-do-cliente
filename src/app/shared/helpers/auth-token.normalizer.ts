import { IdentityToken } from '@/root-store/auth-store/auth.models';

export function normalizeAuthToken(token: IdentityToken): IdentityToken {
  return {
    ...token,
    expiresIn: new Date(token.expiresAt as unknown as string).getTime()
  };
}
