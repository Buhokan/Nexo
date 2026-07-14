"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, type TransactionInput } from "../schema";
import { useCategories, useCreateTransaction } from "../hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface TransactionFormProps {
  onSuccess?: () => void;
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const { data: categories, isLoading: loadingCats } = useCategories();
  const { mutate: createTx, isPending } = useCreateTransaction();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      date: new Date(),
      paymentMethod: "DEBIT_CARD",
    },
  });

  const selectedCategory = watch("categoryId");
  const selectedType = watch("type");

  const onSubmit = (data: TransactionInput) => {
    createTx(data, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-4 pb-4">
      {/* Tipo de transacción */}
      <div className="flex bg-[var(--color-surface-2)] p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setValue("type", "EXPENSE")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            selectedType === "EXPENSE"
              ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm"
              : "text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]"
          }`}
        >
          Gasto
        </button>
        <button
          type="button"
          onClick={() => setValue("type", "INCOME")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            selectedType === "INCOME"
              ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm"
              : "text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]"
          }`}
        >
          Ingreso
        </button>
      </div>

      {/* Monto */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
          Monto (COP)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]">
            $
          </span>
          <Input
            type="number"
            {...register("amount", { valueAsNumber: true })}
            placeholder="0"
            className="pl-8 text-lg font-semibold"
            error={!!errors.amount}
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-xs text-[var(--color-red)]">{errors.amount.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
          ¿En qué fue?
        </label>
        <Input
          {...register("description")}
          placeholder="Ej. Almuerzo, Uber, Spotify..."
          error={!!errors.description}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-[var(--color-red)]">{errors.description.message}</p>
        )}
      </div>

      {/* Categorías */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
          Categoría
        </label>
        {loadingCats ? (
          <div className="flex gap-2 overflow-x-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-20 rounded-xl bg-[var(--color-surface-2)] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories?.filter(c => selectedType === "INCOME" ? c.name === "Ingreso" : c.name !== "Ingreso").map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setValue("categoryId", cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap text-sm border transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[var(--color-primary-subtle)] border-[var(--color-primary-light)] text-[var(--color-primary-light)]"
                    : "bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-subtle)]"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        )}
        {errors.categoryId && (
          <p className="mt-1 text-xs text-[var(--color-red)]">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Fecha oculta (MVP usa hoy siempre por simplicidad, pero se puede añadir un picker luego) */}
      <input type="hidden" {...register("date", { valueAsDate: true })} />

      <Button
        type="submit"
        className="w-full h-12 rounded-xl text-base font-semibold mt-4"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar transacción"
        )}
      </Button>
    </form>
  );
}
