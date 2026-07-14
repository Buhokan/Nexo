"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Trash2, X, Loader2, Check, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/cn";
import { useGoals, useCreateGoal, useContributeGoal, useDeleteGoal } from "@/features/goals/hooks";
import { GoalStatus } from "@prisma/client";

const PRESET_EMOJIS = ["💻", "🏖️", "🚗", "🏠", "💍", "✈️", "📱", "🎓", "💊", "🛡️"];
const PRESET_COLORS = ["#7C5CFF", "#4DA3FF", "#22C55E", "#F59E0B", "#EF4444", "#8B8B9E"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const [isCreating, setIsCreating] = useState(false);

  const activeGoals = goals?.filter((g) => g.status === "ACTIVE") ?? [];
  const completedGoals = goals?.filter((g) => g.status === "COMPLETED") ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading-2 mb-1" style={{ color: "var(--color-text)" }}>
            Objetivos
          </h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Ahorra para lo que más quieres
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{ background: "var(--color-primary)", color: "#fff" }}
        >
          <Plus size={16} />
          Nuevo
        </button>
      </div>

      {/* Formulario Inline Animado */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <CreateGoalForm onClose={() => setIsCreating(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2].map(i => <div key={i} className="h-48 bg-[var(--color-surface-2)] rounded-3xl" />)}
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          
          {/* Activos */}
          {activeGoals.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] px-1">
                En progreso
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {activeGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Completados */}
          {completedGoals.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] px-1 flex items-center gap-2">
                <Check size={14} /> Completados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </div>
          )}

          {activeGoals.length === 0 && completedGoals.length === 0 && !isCreating && (
            <motion.div variants={item} className="nexo-card p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center text-3xl mb-4 border border-[var(--color-border)]">
                🎯
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
                Sin objetivos aún
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto mb-6">
                Crear metas de ahorro es el primer paso para alcanzarlas. ¿Para qué te gustaría ahorrar?
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ background: "var(--color-surface-2)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
              >
                Crear mi primer objetivo
              </button>
            </motion.div>
          )}

        </motion.div>
      )}
    </div>
  );
}

// ─── Componentes Hijos ──────────────────────────────────────────────────

function GoalCard({ goal }: { goal: any }) {
  const [amount, setAmount] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  
  const { mutate: contribute, isPending: isContributingMut } = useContributeGoal();
  const { mutate: deleteGoal, isPending: isDeleting } = useDeleteGoal();

  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isCompleted = goal.status === "COMPLETED";

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount.replace(/\D/g, ""));
    if (isNaN(num) || num <= 0) return;
    
    contribute({ goalId: goal.id, amount: num }, {
      onSuccess: () => {
        setIsContributing(false);
        setAmount("");
      }
    });
  };

  return (
    <motion.div
      layout
      variants={item}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "nexo-card p-5 relative group overflow-hidden transition-colors",
        isCompleted ? "border border-[var(--color-green)]/30" : ""
      )}
    >
      {isCompleted && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-green)]/10 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: `${goal.color}20` }}
          >
            {goal.emoji}
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text)]">{goal.name}</h3>
            {goal.description && (
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{goal.description}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm(`¿Eliminar objetivo ${goal.name}?`)) deleteGoal(goal.id);
          }}
          disabled={isDeleting}
          className="p-1.5 rounded-lg text-[var(--color-text-subtle)] hover:text-[var(--color-red)] hover:bg-[var(--color-red-subtle)] opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-2 relative z-10">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">Acumulado</span>
            <p className="font-bold text-[var(--color-text)] mt-0.5 text-lg">
              {formatCurrency(goal.currentAmount, "COP")}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-[var(--color-text-subtle)] font-medium">Meta</span>
            <p className="font-semibold text-[var(--color-text-muted)] mt-0.5 text-sm">
              {formatCurrency(goal.targetAmount, "COP")}
            </p>
          </div>
        </div>

        <div className="nexo-progress h-2 mt-2 bg-[var(--color-surface-2)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="nexo-progress-bar transition-all relative overflow-hidden"
            style={{ background: isCompleted ? "var(--color-green)" : goal.color }}
          >
             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </motion.div>
        </div>
      </div>

      {!isCompleted && (
        <div className="mt-5 relative z-10">
          <AnimatePresence mode="wait">
            {!isContributing ? (
              <motion.button
                key="btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsContributing(true)}
                className="w-full py-2 rounded-xl text-xs font-bold transition-all hover:bg-[var(--color-surface-2)] flex items-center justify-center gap-1.5"
                style={{ color: goal.color, border: `1px solid ${goal.color}30` }}
              >
                <ArrowUpRight size={14} /> Contribuir
              </motion.button>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleContribute}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="$ Monto"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 h-9 px-3 text-sm rounded-xl outline-none"
                  style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isContributingMut || !amount}
                  className="px-3 h-9 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                  style={{ background: goal.color }}
                >
                  {isContributingMut ? <Loader2 size={14} className="animate-spin" /> : "Añadir"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsContributing(false)}
                  className="px-3 h-9 rounded-xl text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-all bg-[var(--color-surface-2)]"
                >
                  <X size={14} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {isCompleted && (
        <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-center gap-1 text-[var(--color-green)] text-xs font-bold uppercase tracking-wider relative z-10">
          <Check size={14} /> Logrado
        </div>
      )}
    </motion.div>
  );
}

function CreateGoalForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("💻");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [targetAmount, setTargetAmount] = useState("");
  const [description, setDescription] = useState("");

  const { mutate: create, isPending } = useCreateGoal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const amount = parseFloat(targetAmount.replace(/\D/g, ""));
    if (isNaN(amount) || amount <= 0) return;

    create({ name, emoji, color, targetAmount: amount, description }, {
      onSuccess: () => onClose()
    });
  };

  return (
    <div className="nexo-card p-5 border border-[var(--color-primary-subtle)] mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--color-text)]">Nuevo Objetivo</h3>
        <button onClick={onClose} className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)]">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">Nombre del objetivo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. MacBook Pro"
              className="w-full h-11 px-3 text-sm rounded-xl outline-none"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
              maxLength={30}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">Meta de ahorro (COP)</label>
            <input
              type="text"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="$ 0"
              className="w-full h-11 px-3 text-sm rounded-xl outline-none"
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">Descripción corta (opcional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej. Para trabajar más rápido"
            className="w-full h-11 px-3 text-sm rounded-xl outline-none"
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
            maxLength={50}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
          <div>
            <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">Icono</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={cn(
                    "w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all",
                    emoji === e ? "bg-[var(--color-primary-subtle)] border border-[var(--color-primary-light)]" : "bg-[var(--color-surface-2)] border border-transparent"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">Color</label>
            <div className="flex gap-3 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ background: c }}
                >
                  {color === c && <div className="w-3 h-3 bg-white rounded-full" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isPending || !name.trim() || !targetAmount}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[var(--color-primary)] text-white disabled:opacity-50 hover:opacity-90"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            Guardar Objetivo
          </button>
        </div>
      </form>
    </div>
  );
}
