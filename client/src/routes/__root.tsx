import { NotFound } from '@/components/not-found';
import { authClient } from '@/lib/auth-client';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

type RouterContext = {
  session: Awaited<ReturnType<typeof authClient.useSession>>['data'];
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
  notFoundComponent: NotFound,
});
