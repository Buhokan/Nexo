import { z } from "zod";

// ─── Transacción ─────────────────────────────────────────────

export const createTransactionSchema = z.object({
  amount: z
    .number({ message: "El monto es requerido" })
    .positive("El monto debe ser mayor a 0")
    .max(999_999_999, "El monto es demasiado alto"),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  type: z.enum(["EXPENSE", "INCOME", "TRANSFER"]).default("EXPENSE"),
  description: z
    .string({ message: "La descripción es requerida" })
    .min(1, "La descripción es requerida")
    .max(100, "Máximo 100 caracteres"),
  notes: z.string().max(500, "Máximo 500 caracteres").optional(),
  date: z.date().default(() => new Date()),
  paymentMethod: z
    .enum(["CASH", "DEBIT_CARD", "CREDIT_CARD", "TRANSFER", "DIGITAL_WALLET", "OTHER"])
    .optional(),
  tags: z.array(z.string()).default([]),
  isRecurring: z.boolean().default(false),
});

export const updateTransactionSchema = createTransactionSchema.partial().extend({
  id: z.string(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

// ─── Categoría ───────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z
    .string({ message: "El nombre es requerido" })
    .min(1, "El nombre es requerido")
    .max(50, "Máximo 50 caracteres"),
  emoji: z.string().min(1, "Selecciona un emoji").default("📦"),
  icon: z.string().default("package"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color inválido")
    .default("#7C5CFF"),
  description: z.string().max(200).optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

// ─── Objetivo ────────────────────────────────────────────────

export const createGoalSchema = z.object({
  name: z
    .string({ message: "El nombre es requerido" })
    .min(1, "El nombre es requerido")
    .max(100),
  description: z.string().max(500).optional(),
  targetAmount: z
    .number({ message: "La meta es requerida" })
    .positive("La meta debe ser mayor a 0"),
  currentAmount: z.number().min(0).default(0),
  deadline: z.date().optional(),
  emoji: z.string().default("🎯"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .default("#7C5CFF"),
});

export const updateGoalSchema = createGoalSchema.partial().extend({
  id: z.string(),
  currentAmount: z.number().min(0).optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "PAUSED", "CANCELLED"]).optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;

// ─── Filtros de transacciones ─────────────────────────────────

export const transactionFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.enum(["EXPENSE", "INCOME", "TRANSFER"]).optional(),
  paymentMethod: z
    .enum(["CASH", "DEBIT_CARD", "CREDIT_CARD", "TRANSFER", "DIGITAL_WALLET", "OTHER"])
    .optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(["date", "amount", "description"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type TransactionFiltersInput = z.infer<typeof transactionFiltersSchema>;
