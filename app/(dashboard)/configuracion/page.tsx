"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Settings, CreditCard, Bell, Shield, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const handleExport = () => {
    window.location.href = `/api/export/transactions?months=12`;
    toast.success("Descargando historial completo (últimos 12 meses)");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-heading-2 mb-1" style={{ color: "var(--color-text)" }}>
          Configuración
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Configura tu cuenta y preferencias
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left",
              activeTab === "profile" 
                ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]" 
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
            )}
          >
            <Settings size={18} />
            Perfil y Cuenta
          </button>
          
          <button
            onClick={() => setActiveTab("preferences")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left",
              activeTab === "preferences" 
                ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]" 
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
            )}
          >
            <CreditCard size={18} />
            Preferencias
          </button>

          <button
            onClick={() => setActiveTab("data")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left",
              activeTab === "data" 
                ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]" 
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
            )}
          >
            <Shield size={18} />
            Datos y Privacidad
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <UserProfile 
                appearance={{
                  baseTheme: dark,
                  variables: {
                    colorPrimary: "#7C5CFF",
                    colorBackground: "#17171F",
                    colorInputBackground: "#1F1F2E",
                    colorText: "#F0F0F5",
                  },
                  elements: {
                    card: "bg-transparent shadow-none border-0 p-0",
                    navbar: "hidden",
                    pageScrollBox: "p-0",
                    headerTitle: "text-heading-3",
                    headerSubtitle: "text-[var(--color-text-muted)]",
                  }
                }}
              />
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="nexo-card p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">Preferencias Regionales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">Moneda Principal</label>
                    <select className="w-full nexo-input bg-[var(--color-surface-2)] border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]">
                      <option value="COP">Peso Colombiano (COP)</option>
                      <option value="USD">Dólar Estadounidense (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">Idioma</label>
                    <select className="w-full nexo-input bg-[var(--color-surface-2)] border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]">
                      <option value="es">Español (Colombia)</option>
                      <option value="en">English (US)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-[var(--color-border)]">
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">Notificaciones</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[var(--color-text)]">Recordatorios de presupuesto</p>
                      <p className="text-sm text-[var(--color-text-subtle)]">Recibe alertas cuando superes el 80%</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-[var(--color-surface-2)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[var(--color-text)]">Resumen Semanal</p>
                      <p className="text-sm text-[var(--color-text-subtle)]">Recibe un correo con tus gastos del mes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-[var(--color-surface-2)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="nexo-card p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">Exportar Datos</h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  Descarga un archivo CSV con todas tus transacciones de los últimos 12 meses.
                </p>
                <button 
                  onClick={handleExport}
                  className="nexo-btn flex items-center justify-center gap-2 w-full sm:w-auto"
                  style={{ background: "var(--color-surface-2)", color: "var(--color-text)" }}
                >
                  <Download size={18} />
                  Descargar historial (CSV)
                </button>
              </div>

              <div className="pt-6 border-t border-[var(--color-border)]">
                <h3 className="text-lg font-bold text-[var(--color-red)] mb-2">Zona Peligrosa</h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  Borrar tu cuenta eliminará permanentemente todos tus datos, incluyendo transacciones, categorías y metas. Esta acción no se puede deshacer.
                </p>
                <button 
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium transition-colors bg-[var(--color-red-subtle)] text-[var(--color-red)] hover:opacity-80"
                >
                  <Trash2 size={18} />
                  Eliminar cuenta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
