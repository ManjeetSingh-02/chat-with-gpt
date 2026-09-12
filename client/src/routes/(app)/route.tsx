import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)')({
  beforeLoad: async ({ context }) => {
    if (!context.session) throw redirect({ to: '/' });
    return { session: context.session };
  },
  loader: async ({ context }) => {
    return {
      conversations: [],
      user: {
        image: context.session.user.image,
        name: context.session.user.name,
        email: context.session.user.email,
      },
    };
  },
  component: function Layout() {
    const { conversations, user } = Route.useLoaderData();

    return (
      <SidebarProvider>
        <AppSidebar
          user={user}
          groups={[
            {
              label: 'Recents',
              conversations,
            },
          ]}
        />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    );
  },
});
