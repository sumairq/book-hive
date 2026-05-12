'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { registerSchema, type RegisterInput } from '@/schemas/auth.schema';
import { useAuthStore } from '@/store/auth.store';
import type { PublicUser } from '@/types';

type RegisterResponse = {
  ok: boolean;
  data?: { user: PublicUser };
  error?: { code: string; message: string; details?: { field?: string } };
};

export function RegisterForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', username: '', password: '' },
    mode: 'onBlur',
  });

  async function onSubmit(values: RegisterInput) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const body = (await res.json().catch(() => null)) as RegisterResponse | null;

    if (!res.ok || !body?.ok || !body.data) {
      const code = body?.error?.code;
      const field = body?.error?.details?.field as 'email' | 'username' | undefined;
      if (code === 'CONFLICT' && field) {
        form.setError(field, { message: body?.error?.message });
      }
      toast.error(body?.error?.message ?? 'Could not create your account.');
      return;
    }

    setUser(body.data.user);
    toast.success(`Welcome to the hive, ${body.data.user.username}.`);
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" placeholder="reader@hive.co" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Username
              </FormLabel>
              <FormControl>
                <Input autoComplete="username" placeholder="silent_reader" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <p className="pt-1 text-xs text-muted-foreground">
                Must include an uppercase letter, a lowercase letter, and a number.
              </p>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="brand"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Create my shelf
              <ArrowRight />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
