import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { ThemeProvider } from '@/providers/theme-provider';
import { routeTree } from '@/routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';

// create a new queryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
    },
  },
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    session: undefined,
    queryClient,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { data: session, isPending } = authClient.useSession();

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
          context={{ session, queryClient }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
