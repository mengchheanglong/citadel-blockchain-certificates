import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const issueCertificateSchema = z.object({
  recipientName: z
    .string()
    .min(2, 'Recipient name must be at least 2 characters')
    .max(200, 'Recipient name must be at most 200 characters'),
  recipientEmail: z.string().email('Please enter a valid recipient email address'),
  courseName: z
    .string()
    .min(2, 'Course name must be at least 2 characters')
    .max(200, 'Course name must be at most 200 characters'),
  courseDescription: z
    .string()
    .max(1000, 'Course description must be at most 1000 characters')
    .optional()
    .nullable(),
  expiryDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        const d = new Date(val);
        return !isNaN(d.getTime());
      },
      { message: 'Invalid date format. Expected a valid date string.' }
    ),
});

export const revokeCertificateSchema = z.object({
  reason: z
    .string()
    .min(5, 'Revocation reason must be at least 5 characters')
    .max(500, 'Revocation reason must be at most 500 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type IssueCertificateInput = z.infer<typeof issueCertificateSchema>;
export type RevokeCertificateInput = z.infer<typeof revokeCertificateSchema>;
