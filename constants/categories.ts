// Categorías del sistema — Nexo
// Cada categoría tiene emoji, icono (Lucide), color y descripción

import type { Category } from "@/types";

export const SYSTEM_CATEGORIES: Omit<
  Category,
  "id" | "userId" | "parentId" | "isArchived" | "createdAt"
>[] = [
  {
    name: "Comida",
    emoji: "🍔",
    icon: "utensils",
    color: "#F59E0B",
    description: "Restaurantes, comida rápida, delivery",
    isSystem: true,
    sortOrder: 1,
  },
  {
    name: "Transporte",
    emoji: "🚗",
    icon: "car",
    color: "#4DA3FF",
    description: "Taxi, bus, gasolina, parqueadero",
    isSystem: true,
    sortOrder: 2,
  },
  {
    name: "Ocio",
    emoji: "🎮",
    icon: "gamepad-2",
    color: "#7C5CFF",
    description: "Entretenimiento, streaming, salidas",
    isSystem: true,
    sortOrder: 3,
  },
  {
    name: "Hogar",
    emoji: "🏠",
    icon: "home",
    color: "#22C55E",
    description: "Arriendo, servicios, mantenimiento",
    isSystem: true,
    sortOrder: 4,
  },
  {
    name: "Tecnología",
    emoji: "💻",
    icon: "laptop",
    color: "#4DA3FF",
    description: "Software, apps, gadgets",
    isSystem: true,
    sortOrder: 5,
  },
  {
    name: "Salud",
    emoji: "❤️",
    icon: "heart-pulse",
    color: "#EF4444",
    description: "Médico, medicamentos, gym",
    isSystem: true,
    sortOrder: 6,
  },
  {
    name: "Educación",
    emoji: "📚",
    icon: "book-open",
    color: "#F59E0B",
    description: "Cursos, libros, capacitaciones",
    isSystem: true,
    sortOrder: 7,
  },
  {
    name: "Compras",
    emoji: "🛒",
    icon: "shopping-cart",
    color: "#22C55E",
    description: "Ropa, mercado, supermercado",
    isSystem: true,
    sortOrder: 8,
  },
  {
    name: "Otros",
    emoji: "📦",
    icon: "package",
    color: "#8B8B9E",
    description: "Gastos varios sin categoría",
    isSystem: true,
    sortOrder: 9,
  },
  {
    name: "Ingreso",
    emoji: "💰",
    icon: "trending-up",
    color: "#22C55E",
    description: "Salario, freelance, ingresos varios",
    isSystem: true,
    sortOrder: 10,
  },
];

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Efectivo",
  DEBIT_CARD: "Tarjeta débito",
  CREDIT_CARD: "Tarjeta crédito",
  TRANSFER: "Transferencia",
  DIGITAL_WALLET: "Billetera digital",
  OTHER: "Otro",
};

export const PAYMENT_METHOD_ICONS: Record<string, string> = {
  CASH: "banknote",
  DEBIT_CARD: "credit-card",
  CREDIT_CARD: "credit-card",
  TRANSFER: "arrow-right-left",
  DIGITAL_WALLET: "smartphone",
  OTHER: "circle-help",
};

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  EXPENSE: "Gasto",
  INCOME: "Ingreso",
  TRANSFER: "Transferencia",
};
