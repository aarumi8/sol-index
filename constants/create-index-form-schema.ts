import { z } from "zod";

export const createIndexSchema = z.object({
  indexName: z.string().min(1, "Index name is required"),
  indexTicker: z.string().min(1, "Index ticker is required").max(5, "Index ticker must be 5 characters or less"),
  tokens: z.array(z.object({
    address: z.string().min(1, "Token address is required"),
    percentage: z.number().min(0, "Percentage must be positive").max(100, "Percentage must be 100 or less")
  }))
    .min(2, "At least two tokens are required")
    .refine((tokens) => tokens.reduce((sum, token) => sum + token.percentage, 0) === 100, {
      message: "The sum of all token percentages must equal 100%"
    }),
});

export type CreateIndexFormData = z.infer<typeof createIndexSchema>;