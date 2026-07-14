"use client";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
      >
        <span className="text-3xl">🤖</span>
      </div>
      <h2 className="text-heading-2 mb-2" style={{ color: "var(--color-text)" }}>
        Asistente IA
      </h2>
      <p style={{ color: "var(--color-text-muted)" }} className="text-sm max-w-xs">
        Esta sección está en desarrollo activo.
      </p>
      <div
        className="mt-6 px-4 py-2 rounded-full text-xs font-semibold"
        style={{ background: "var(--color-primary-subtle)", color: "var(--color-primary-light)", border: "1px solid rgba(124,92,255,0.2)" }}
      >
        En desarrollo · Módulo Futuro
      </div>
    </motion.div>
  );
}
