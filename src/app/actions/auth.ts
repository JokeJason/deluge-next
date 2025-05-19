'use server';

import 'server-only';

import { prisma } from '@/lib/db';
import { LoginSchema, LoginState } from '@/lib/definitions';
import { updateDelugePassword } from '@/lib/deluge-client';
import { redirect } from 'next/navigation';

async function savePassword(password: string) {
  await prisma.password.create({
    data: {
      value: password,
    },
  });
}

async function getPassword(): Promise<string | null> {
  const password = await prisma.password.findFirst();
  if (!password) {
    return null;
  }
  return password.value;
}

export async function enterDelugePassword(
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
      const success = await updateDelugePassword(password);
      if (!success) {
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
