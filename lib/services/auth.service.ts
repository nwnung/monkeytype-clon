import { createClient } from "@/lib/supabase/client";
import {
  AuthSchemas,
  type SignUpData,
  type SignInData,
  type ResetPasswordData,
} from "@/lib/validations/auth";

export class AuthService {
  private supabase = createClient();

  async signUp(data: SignUpData, redirectTo?: string) {
    const validated = AuthSchemas.signUp.parse(data);

    const { data: authData, error } = await this.supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          name: validated.name,
        },
      },
    });

    if (error) {
      console.error("SignUp error:", error);
      throw new Error("AUTH_SIGNUP_FAILED");
    }

    return authData;
  }

  async signIn(data: SignInData) {
    const validated = AuthSchemas.signIn.parse(data);

    const { data: authData, error } =
      await this.supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

    if (error) {
      console.error("SignIn error:", error);
      throw new Error("AUTH_SIGNIN_FAILED");
    }

    return authData;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      console.error("SignOut error:", error);
      throw new Error("AUTH_SIGNOUT_FAILED");
    }

    return { success: true };
  }

  async resetPassword(data: ResetPasswordData, redirectTo: string) {
    const validated = AuthSchemas.resetPassword.parse(data);

    // Siempre devolver success por seguridad (no revelar si el email existe)
    const { error } = await this.supabase.auth.resetPasswordForEmail(
      validated.email,
      {
        redirectTo,
      }
    );

    // Solo loggear el error pero siempre devolver success
    if (error) {
      console.error("Password reset error:", error);
    }

    return { success: true };
  }

  async updatePassword(newPassword: string) {
    const validated = AuthSchemas.password.parse(newPassword);

    const { data, error } = await this.supabase.auth.updateUser({
      password: validated,
    });

    if (error) {
      console.error("Password update error:", error);
      throw new Error("AUTH_UPDATE_PASSWORD_FAILED");
    }

    return data;
  }

  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();

    if (error) {
      // Si el error es de sesión faltante, no es un error fatal - solo retornamos null
      if (
        error.message.includes("Auth session missing") ||
        error.message.includes("session_not_found") ||
        error.name === "AuthSessionMissingError"
      ) {
        return { user: null };
      }

      // Para otros tipos de error, sí loggeamos y lanzamos
      console.error("Get user error:", error);
      throw new Error("AUTH_GET_USER_FAILED");
    }

    return data;
  }
}

export const authService = new AuthService();
