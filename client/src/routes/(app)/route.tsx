import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)')({
  beforeLoad: async ({ context }) => {
    if (!context.session) throw redirect({ to: '/' });
    return {
      user: {
        image: context.session.user.image,
        name: context.session.user.name,
        email: context.session.user.email,
      },
    };
  },

  component: function Layout() {
    const { user } = Route.useRouteContext();

    return (
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    );
  },
});
