import Image from "next/image";

interface NexoLogoProps {
  showWordmark?: boolean;
  size?: number;
  className?: string;
}

/**
 * Logo de Nexo usando el ícono PNG generado
 */
export function NexoLogo({
  showWordmark = true,
  size = 32,
  className = "",
}: NexoLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/icons/icon-512.png"
        alt="Nexo Icon"
        width={size}
        height={size}
        className="rounded-[25%]"
      />
      {showWordmark && (
        <span
          className="font-bold tracking-tight"
          style={{
            fontSize: size * 0.55,
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            background: "linear-gradient(to right, #9B82FF, #4DA3FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          nexo
        </span>
      )}
    </div>
  );
}

/**
 * Solo el isotipo de Nexo
 */
export function NexoIsotype({ size = 32, className }: Omit<NexoLogoProps, "showWordmark">) {
  return <NexoLogo showWordmark={false} size={size} className={className} />;
}
