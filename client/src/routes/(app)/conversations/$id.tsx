import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/conversations/$id')({
  component: () => <div>Hello "/(app)/conversations/$id"!</div>,
});
