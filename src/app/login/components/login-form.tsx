'use client';

import React, { useActionState } from 'react';

import { login } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginState } from '@/lib/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginFormSchema = z.object({
  password: z.string(),
});

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      password: '',
    },
  });

  return (
    <Form {...form}>
      <form action={formAction} className='space-y-4'>
        <FormField
          name={'password'}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <Input placeholder={'password'} {...field} />
            </FormItem>
          )}
        />
        {state?.errors?.password && (
          <div className='text-destructive text-sm mt-1'>
            {state.errors.password.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        )}

        <Button type='submit' className='w-full' disabled={pending}>
          {pending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Loading...
            </>
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </Form>
  );
}
