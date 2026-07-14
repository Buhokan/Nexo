"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/cn";
import { useAllCategoriesAdmin, useCreateCategory, useDeleteCategory } from "@/features/categories/hooks";

const PRESET_EMOJIS = ["🍔", "🚗", "🏠", "💻", "🛒", "🎮", "📦", "✈️", "🏥", "📚", "🐶", "🎁"];
const PRESET_COLORS = ["#F59E0B", "#4DA3FF", "#22C55E", "#9B82FF", "#34D399", "#7C5CFF", "#EF4444", "#8B8B9E"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function CategoriesPage() {
  const { data: categories, isLoading } = useAllCategoriesAdmin();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading-2 mb-1" style={{ color: "var(--color-text)" }}>
            Categorías
          </h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Gestiona tus categorías de gastos
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{ background: "var(--color-primary)", color: "#fff" }}
        >
          <Plus size={16} />
          Nueva
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
            <CreateCategoryForm onClose={() => setIsCreating(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de Categorías */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-[var(--color-surface-2)] rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {categories?.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                variants={item}
                exit={{ opacity: 0, scale: 0.9 }}
                className="nexo-card p-4 relative group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: `${cat.color}20` }}
                    >
                      {cat.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-text)]">{cat.name}</h3>
                      {cat.isSystem && (
                        <span className="text-[10px] uppercase font-bold text-[var(--color-text-subtle)]">
                          Sistema
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {!cat.isSystem && (
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar categoría ${cat.name}?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg text-[var(--color-text-subtle)] hover:text-[var(--color-red)] hover:bg-[var(--color-red-subtle)] opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[var(--color-text-muted)]">Gastado este mes</span>
                    <span className="font-semibold text-[var(--color-text)]">
                      {formatCurrency(cat.spentThisMonth, "COP")}
                    </span>
                  </div>
                  <div className="nexo-progress h-1.5">
                    <div
                      className="nexo-progress-bar transition-all duration-700"
                      style={{
                        width: `${Math.min(cat.percentage ?? 0, 100)}%`,
                        background: cat.color,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function CreateCategoryForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🍔");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const { mutate: create, isPending } = useCreateCategory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    create({ name, emoji, color }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="nexo-card p-5 border border-[var(--color-primary-subtle)] mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--color-text)]">Nueva Categoría</h3>
        <button onClick={onClose} className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)]">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Mascotas"
            className="w-full h-11 px-3 text-sm rounded-xl outline-none"
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
            maxLength={20}
            required
          />
        </div>

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
          <div className="flex gap-3">
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

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPending || !name.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--color-primary)] text-white disabled:opacity-50"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            Guardar Categoría
          </button>
        </div>
      </form>
    </div>
  );
}
