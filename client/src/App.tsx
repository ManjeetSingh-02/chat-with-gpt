import { Spinner } from '@/components/ui/spinner';
import { Toaster } from '@/components/ui/toast';
import { authClient } from '@/lib/auth-client';
import { queryClient } from '@/lib/query';
import { ThemeProvider } from '@/providers/theme-provider';
import { routeTree } from '@/routeTree.gen';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { useEffect } from 'react';

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    session: null,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
  interface HistoryState {
    message?: string;
  }
}

export default function App() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) router.invalidate();
  }, [session, isPending]);

  if (isPending)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider
          router={router}
          context={{ session }}
        />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
