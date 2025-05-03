'use server';

import { LoginSchema, LoginState } from '@/lib/definitions';
import { Deluge } from '@ctrl/deluge';
import { redirect } from 'next/navigation';
import 'server-only';

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({ password: formData.get('password') });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { password } = parsed.data;

  const deluge = new Deluge({
    baseUrl: process.env.DELUGE_URL,
    password: password,
    timeout: process.env.DELUGE_TIMEOUT
      ? Number(process.env.DELUGE_TIMEOUT)
      : undefined,
  });

  const loginSuccess = await deluge.login();
  if (loginSuccess) {
    redirect('/');
  }
}
