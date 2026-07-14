import type { SVGProps } from "react";

interface NexoLogoProps extends SVGProps<SVGSVGElement> {
  showWordmark?: boolean;
  size?: number;
}

/**
 * Logo de Nexo — Isotipo + Wordmark
 * El isotipo es una N estilizada con nodos conectados,
 * representando conexiones financieras (Nexo = nexo/conexión).
 * Usa gradiente púrpura→azul del design system.
 */
export function NexoLogo({
  showWordmark = true,
  size = 32,
  className,
  ...props
}: NexoLogoProps) {
  return (
    <svg
      width={showWordmark ? size * 3.8 : size}
      height={size}
      viewBox={showWordmark ? "0 0 122 32" : "0 0 32 32"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Nexo"
      role="img"
      {...props}
    >
      <defs>
        <linearGradient id="nexo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#4DA3FF" />
        </linearGradient>
        <linearGradient id="nexo-gradient-text" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9B82FF" />
          <stop offset="100%" stopColor="#4DA3FF" />
        </linearGradient>
        <filter id="nexo-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Isotipo — Hexágono con nodos conectados */}
      <g filter="url(#nexo-glow)">
        {/* Fondo del isotipo */}
        <rect x="1" y="1" width="30" height="30" rx="9" fill="#17171F" />
        <rect
          x="1" y="1" width="30" height="30" rx="9"
          fill="url(#nexo-gradient)"
          fillOpacity="0.12"
        />
        <rect
          x="1" y="1" width="30" height="30" rx="9"
          stroke="url(#nexo-gradient)"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />

        {/* Nodos del isotipo — N estilizada con puntos de conexión */}
        {/* Línea diagonal principal */}
        <line
          x1="9" y1="22" x2="23" y2="10"
          stroke="url(#nexo-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Vertical izquierda */}
        <line
          x1="9" y1="10" x2="9" y2="22"
          stroke="url(#nexo-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Vertical derecha */}
        <line
          x1="23" y1="10" x2="23" y2="22"
          stroke="url(#nexo-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Nodos (puntos de conexión) */}
        <circle cx="9"  cy="10" r="2.5" fill="url(#nexo-gradient)" />
        <circle cx="9"  cy="22" r="2.5" fill="url(#nexo-gradient)" />
        <circle cx="23" cy="10" r="2.5" fill="url(#nexo-gradient)" />
        <circle cx="23" cy="22" r="2.5" fill="url(#nexo-gradient)" />
        {/* Nodo central en la diagonal */}
        <circle cx="16" cy="16" r="2" fill="url(#nexo-gradient)" fillOpacity="0.7" />
      </g>

      {/* Wordmark — "nexo" */}
      {showWordmark && (
        <text
          x="40"
          y="21"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="18"
          fontWeight="700"
          letterSpacing="-0.5"
          fill="url(#nexo-gradient-text)"
        >
          nexo
        </text>
      )}
    </svg>
  );
}

/**
 * Solo el isotipo de Nexo (cuadrado)
 */
export function NexoIsotype({ size = 32, className, ...props }: Omit<NexoLogoProps, "showWordmark">) {
  return <NexoLogo showWordmark={false} size={size} className={className} {...props} />;
}
