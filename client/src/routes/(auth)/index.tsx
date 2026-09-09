import { LoginForm } from '@/components/login-form';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/')({
  beforeLoad: async ({ context }) => {
    if (context.session) throw redirect({ to: '/conversations' });
  },
  component: LoginForm,
});
