"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Filter,
  X,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/cn";
import { useCategories } from "@/features/transactions/hooks";
import {
  useTransactionsList,
  useTransactionStats,
  useDeleteTransaction,
} from "@/features/transactions/list-hooks";

// ─── Animaciones ───────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ─── Skeletons ──────────────────────────────────────────────────

function TransactionsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-20 bg-[var(--color-surface-2)] rounded-xl" />
        ))}
      </div>
      <div className="h-12 w-full bg-[var(--color-surface-2)] rounded-xl" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-24 bg-[var(--color-surface-2)] rounded-full" />
        ))}
      </div>
      <div className="space-y-4 mt-6">
        <div className="h-6 w-20 bg-[var(--color-surface-2)] rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full bg-[var(--color-surface-2)] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ─── Fila de Transacción con Confirmación Inline ───────────────

function TransactionRow({ tx }: { tx: any }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutate: deleteTx, isPending } = useDeleteTransaction();

  const isExpense = tx.type === "EXPENSE";

  if (confirmDelete) {
    return (
      <div
        className="flex items-center justify-between p-3 rounded-xl mb-1.5"
        style={{ background: "var(--color-red-subtle)" }}
      >
        <span className="text-sm font-medium" style={{ color: "var(--color-red)" }}>
          ¿Eliminar movimiento?
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfirmDelete(false)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-surface)] text-[var(--color-text)]"
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            onClick={() => deleteTx(tx.id)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-red)] text-white flex items-center gap-1"
            disabled={isPending}
          >
            {isPending && <Loader2 size={12} className="animate-spin" />}
            Sí, eliminar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group flex items-center justify-between p-3 rounded-xl mb-1.5 transition-colors hover:bg-[var(--color-surface-2)]"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          {tx.categoryEmoji}
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
            {tx.description}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {tx.categoryName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="text-sm font-semibold text-number"
          style={{
            color: isExpense ? "var(--color-text)" : "var(--color-green)",
          }}
        >
          {isExpense ? "-" : "+"}
          {formatCurrency(tx.amount, "COP")}
        </span>
        <button
          onClick={() => setConfirmDelete(true)}
          className="p-1.5 rounded-lg text-[var(--color-text-subtle)] hover:text-[var(--color-red)] hover:bg-[var(--color-surface)] opacity-0 group-hover:opacity-100 md:opacity-0 transition-all focus:opacity-100"
          aria-label="Eliminar"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"ALL" | "EXPENSE" | "INCOME">("ALL");
  const [categoryId, setCategoryId] = useState<string>("ALL");

  const { data: stats, isLoading: statsLoading } = useTransactionStats();
  const { data: categories } = useCategories();
  
  // Usamos un pequeño debounce visual manejado por react-query (se re-renderiza al tipear, pero es rápido)
  const { data: groupedTxs, isLoading: txsLoading } = useTransactionsList({
    search,
    type,
    categoryId,
  });

  const isLoading = statsLoading || txsLoading;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* ─── Encabezado ──────────────────────────────────────────── */}
      <div>
        <h2 className="text-heading-2 mb-1" style={{ color: "var(--color-text)" }}>
          Historial
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Todos tus movimientos
        </p>
      </div>

      {isLoading ? (
        <TransactionsSkeleton />
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          
          {/* ─── Stats Header ──────────────────────────────────────── */}
          <motion.div variants={item} className="grid grid-cols-3 gap-2">
            <div className="nexo-card p-3 flex flex-col items-center text-center">
              <span className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>Ingresos</span>
              <span className="text-sm font-semibold text-number flex items-center gap-1" style={{ color: "var(--color-green)" }}>
                <ArrowUpRight size={14} />
                {formatCurrency(stats?.income ?? 0, "COP")}
              </span>
            </div>
            <div className="nexo-card p-3 flex flex-col items-center text-center">
              <span className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>Gastos</span>
              <span className="text-sm font-semibold text-number flex items-center gap-1" style={{ color: "var(--color-red)" }}>
                <ArrowDownRight size={14} />
                {formatCurrency(stats?.expenses ?? 0, "COP")}
              </span>
            </div>
            <div className="nexo-card p-3 flex flex-col items-center text-center" style={{ background: "var(--color-surface-2)" }}>
              <span className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>Balance</span>
              <span className="text-sm font-semibold text-number" style={{ color: "var(--color-text)" }}>
                {formatCurrency(stats?.balance ?? 0, "COP")}
              </span>
            </div>
          </motion.div>

          {/* ─── Barra de Búsqueda ─────────────────────────────────── */}
          <motion.div variants={item} className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-text-subtle)" }}
            />
            <input
              type="text"
              placeholder="Buscar movimientos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-sm rounded-xl outline-none transition-all"
              style={{
                background: "var(--color-surface-2)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>

          {/* ─── Filtros (Chips scrolleables) ──────────────────────── */}
          <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setType(type === "EXPENSE" ? "ALL" : "EXPENSE")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all shrink-0",
                type === "EXPENSE"
                  ? "bg-[var(--color-red-subtle)] border-[var(--color-red)] text-[var(--color-red)]"
                  : "bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              )}
            >
              <ArrowDownRight size={14} /> Gastos
            </button>
            <button
              onClick={() => setType(type === "INCOME" ? "ALL" : "INCOME")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all shrink-0",
                type === "INCOME"
                  ? "bg-[var(--color-green-subtle)] border-[var(--color-green)] text-[var(--color-green)]"
                  : "bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              )}
            >
              <ArrowUpRight size={14} /> Ingresos
            </button>

            <div className="w-px h-6 bg-[var(--color-border)] shrink-0 mx-1 self-center" />

            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(categoryId === cat.id ? "ALL" : cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all shrink-0",
                  categoryId === cat.id
                    ? "bg-[var(--color-primary-subtle)] border-[var(--color-primary-light)] text-[var(--color-primary-light)]"
                    : "bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                )}
              >
                <span>{cat.emoji}</span> {cat.name}
              </button>
            ))}
          </motion.div>

          {/* ─── Lista Agrupada ────────────────────────────────────── */}
          <motion.div variants={item} className="mt-4">
            <AnimatePresence mode="popLayout">
              {groupedTxs && groupedTxs.length > 0 ? (
                groupedTxs.map((group) => (
                  <motion.div
                    key={group.date}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 last:mb-0"
                  >
                    <h3
                      className="text-xs font-semibold uppercase tracking-wider mb-3 sticky top-16 z-10 py-1"
                      style={{ color: "var(--color-text-subtle)", background: "var(--color-bg)" }}
                    >
                      {group.date}
                    </h3>
                    <div className="nexo-card p-1">
                      {group.items.map((tx: any) => (
                        <TransactionRow key={tx.id} tx={tx} />
                      ))}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
                    style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
                  >
                    🔍
                  </div>
                  <h3 className="text-base font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                    No hay resultados
                  </h3>
                  <p className="text-sm max-w-[250px]" style={{ color: "var(--color-text-muted)" }}>
                    No encontramos movimientos que coincidan con tu búsqueda.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </motion.div>
      )}
    </div>
  );
}
