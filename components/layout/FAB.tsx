"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";

/**
 * Floating Action Button (FAB) + Drawer de Nuevo Gasto.
 * Se posiciona arriba de la navegación móvil.
 */
export function FAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón FAB */}
      <motion.button
        className="fixed z-[var(--z-modal)] flex items-center justify-center rounded-2xl shadow-lg"
        style={{
          bottom: "calc(var(--mobile-nav-height) + 16px)",
          right: "16px",
          width: "56px",
          height: "56px",
          background: "var(--color-primary)",
          color: "#fff",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <Plus size={28} />
      </motion.button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[calc(var(--z-modal)+1)] bg-black/60 backdrop-blur-sm"
            />

            {/* Bottom Sheet / Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[calc(var(--z-modal)+2)] w-full max-w-md mx-auto bg-[var(--color-bg)] rounded-t-3xl md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:rounded-3xl border border-[var(--color-border)] shadow-2xl"
              style={{
                // En desktop centramos el modal. Framer motion overrides y transform, así que lo manejamos con clases de tailwind (md:...)
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              {/* Handlebar (Mobile) */}
              <div className="flex justify-center pt-3 pb-2 md:hidden">
                <div className="w-12 h-1.5 bg-[var(--color-surface-2)] rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-2 pb-4 md:pt-5">
                <h2 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
                  Nuevo Movimiento
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contenido (Formulario) */}
              <div className="px-1">
                <TransactionForm onSuccess={() => setIsOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
