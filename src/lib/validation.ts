import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const imageUploadSchema = z.object({
  files: z.array(z.instanceof(File)).min(1).max(50),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type ImageUploadFormValues = z.infer<typeof imageUploadSchema>
