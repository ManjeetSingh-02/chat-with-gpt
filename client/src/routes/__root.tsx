import { NotFound } from '@/components/not-found';
import { authClient } from '@/lib/auth-client';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

type RouterContext = {
  session: Awaited<ReturnType<typeof authClient.useSession>>['data'];
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
  notFoundComponent: NotFound,
});
