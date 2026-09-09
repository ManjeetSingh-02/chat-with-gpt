import { Outlet } from '@tanstack/react-router';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)')({
  beforeLoad: async ({ context }) => {
    if (!context.session) throw redirect({ to: '/' });
  },
  component: Outlet,
});
