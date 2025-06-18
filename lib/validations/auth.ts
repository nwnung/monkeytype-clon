import { z } from "zod";

export const AuthSchemas = {
  email: z.string().email("Email inválido"),

  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),

  signUp: z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    name: z.string().min(2, "Nombre muy corto").optional(),
  }),

  signIn: z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Contraseña requerida"),
  }),

  resetPassword: z.object({
    email: z.string().email("Email inválido"),
  }),

  updatePassword: z
    .object({
      password: z.string().min(8, "Mínimo 8 caracteres"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }),

  emailTemplate: z.object({
    email: z.string().email(),
    url: z.string().url(),
    name: z.string().optional(),
  }),
} as const;

// Types derivados automáticamente
export type SignUpData = z.infer<typeof AuthSchemas.signUp>;
export type SignInData = z.infer<typeof AuthSchemas.signIn>;
export type ResetPasswordData = z.infer<typeof AuthSchemas.resetPassword>;
export type UpdatePasswordData = z.infer<typeof AuthSchemas.updatePassword>;
