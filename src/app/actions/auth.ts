'use server';

import { prisma } from '@/lib/db';
import { LoginSchema, LoginState } from '@/lib/definitions';
import { Deluge } from '@ctrl/deluge';
import { redirect } from 'next/navigation';
import 'server-only';

async function savePassword(password: string) {
  await prisma.password.create({
    data: {
      password: password,
    },
  });
}

async function getPassword(): Promise<string | null> {
  const password = await prisma.password.findFirst();
  if (!password) {
    return null;
  }
  return password.password;
}

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    const parsed = LoginSchema.safeParse({
      password: formData.get('password'),
    });

    if (!parsed.success) {
      return { errors: parsed.error.flatten().fieldErrors };
    }

    const { password } = parsed.data;

    const existingPassword = await getPassword();

    // Case 1: Password exists in DB
    if (existingPassword) {
      if (password !== existingPassword) {
        return {
          errors: {
            password: ['Invalid password. Please try again.'],
          },
        };
      }
    }
    // Case 2: Password does not exist in DB, verify with Deluge
    else {
      const deluge = new Deluge({
        baseUrl: process.env.DELUGE_URL,
        password: password,
        timeout: process.env.DELUGE_TIMEOUT
          ? Number(process.env.DELUGE_TIMEOUT)
          : undefined,
      });
      const loginSuccess = await deluge.login();
      if (!loginSuccess) {
        return {
          errors: {
            password: ['Invalid password. Please try again.'],
          },
        };
      }

      await savePassword(password);
    }
  } catch (error) {
    console.error('Login error: ', error);
    return {
      errors: {
        password: [
          `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ],
      },
    };
  }

  redirect('/');
}
