import { z } from "zod";
import { TransactionType, PaymentMethod } from "@prisma/client";

export const transactionSchema = z.object({
  amount: z
    .number({ message: "El monto es requerido" })
    .positive("El monto debe ser mayor a 0"),
  description: z
    .string()
    .min(2, "La descripción debe tener al menos 2 caracteres")
    .max(100, "La descripción no puede exceder 100 caracteres"),
  categoryId: z.string().min(1, "Debes seleccionar una categoría"),
  date: z.date({ message: "La fecha es requerida" }),
  type: z.nativeEnum(TransactionType).default("EXPENSE"),
  paymentMethod: z.nativeEnum(PaymentMethod).default("DEBIT_CARD"),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
