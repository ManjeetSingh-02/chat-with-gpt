import { authClient } from '@/lib/auth-client';

export const auth = {
  login: async () =>
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}`,
    }),

  logout: async () => await authClient.signOut(),
};
