import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-4"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold"
          style={{ background: "var(--color-primary)", boxShadow: "0 0 32px rgba(124,92,255,0.4)" }}
        >
          N
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Nexo
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            Empieza a controlar tu dinero
          </p>
        </div>
      </div>

      {/* Clerk Sign Up component */}
      <SignUp />
    </div>
  );
}
