'use client';

import { enterDelugePassword } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginState } from '@/lib/definitions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useActionState, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginFormSchema = z.object({
  password: z.string(),
});

export function PasswordForm() {
  const [showPassword, setShowPassword] = useState(true);
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    enterDelugePassword,
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
              <div className='relative'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={'password'}
                  {...field}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute top-0 right-0 h-full px-3 py-1'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                  <span className='sr-only'>
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
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
            'Verify'
          )}
        </Button>
      </form>
    </Form>
  );
}
