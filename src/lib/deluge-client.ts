// src/lib/deluge-client.ts
import { prisma } from '@/lib/db';
import { Deluge } from '@ctrl/deluge';

class DelugeClientService {
  private static instance: Deluge | null = null;
  private static isInitialized = false;
  private static password: string | null = null;

  // Get the current password from the database
  private static async getStoredPassword(): Promise<string | null> {
    const password = await prisma.password.findFirst();
    return password?.value || null;
  }

  // Initialize the service
  private static async initialize() {
    if (!this.isInitialized) {
      this.password = await this.getStoredPassword();
      this.isInitialized = true;
    }
  }

  // Get or create the Deluge client instance
  public static async getClient(): Promise<Deluge | null> {
    await this.initialize();

    // Can't create a client without a password
    if (!this.password) {
      return null;
    }

    // Create new instance if it doesn't exist
    if (!this.instance) {
      this.instance = new Deluge({
        baseUrl: process.env.DELUGE_URL,
        password: this.password,
        timeout: process.env.DELUGE_TIMEOUT
          ? Number(process.env.DELUGE_TIMEOUT)
          : undefined,
      });

      // Verify authentication
      try {
        const isAuthenticated = await this.instance.checkSession();
        if (!isAuthenticated) {
          await this.instance.login();
        }
      } catch (error) {
        console.error('Failed to authenticate with Deluge', error);
        this.instance = null;
      }
    }

    return this.instance;
  }

  // Update the password and reset the client
  public static async updatePassword(newPassword: string): Promise<boolean> {
    try {
      // Test the new password with a temporary client
      const tempClient = new Deluge({
        baseUrl: process.env.DELUGE_URL,
        password: newPassword,
        timeout: process.env.DELUGE_TIMEOUT
          ? Number(process.env.DELUGE_TIMEOUT)
          : undefined,
      });

      const loginSuccess = await tempClient.login();

      if (loginSuccess) {
        // Update the stored password
        this.password = newPassword;
        // Reset so next getClient() creates a fresh instance
        this.instance = null;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to update password', error);
      return false;
    }
  }

  // Reset the client instance
  public static reset(): void {
    this.instance = null;
  }
}

export async function getDelugeClient(): Promise<Deluge | null> {
  return DelugeClientService.getClient();
}

export async function updateDelugePassword(
  newPassword: string,
): Promise<boolean> {
  return DelugeClientService.updatePassword(newPassword);
}

export function resetDelugeClient(): void {
  DelugeClientService.reset();
}
