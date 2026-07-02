import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left: Brand Panel (desktop only) ────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-shrink-0 relative overflow-hidden flex-col items-center justify-center p-14 bg-[#0f0b1e]">
        {/* Gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-violet-600/25 blur-[120px]" />
          <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[80px]" />
        </div>

        {/* Subtle dot-grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-14">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <svg
                className="h-6 w-6 text-violet-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">
                Business Portal
              </p>
              <p className="text-xs text-white/40 mt-0.5">India&apos;s #1 platform</p>
            </div>
          </Link>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white mb-5">
            Connect.{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Grow.
            </span>{" "}
            Succeed.
          </h1>

          <p className="text-white/50 text-base leading-relaxed mb-12">
            India&apos;s most trusted business listing platform. Join thousands of
            businesses growing their reach every day.
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              { value: "50K+", label: "Businesses" },
              { value: "2M+", label: "Visitors/mo" },
              { value: "98%", label: "Satisfaction" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/8 bg-white/4 px-3 py-4 backdrop-blur-sm"
              >
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="mt-0.5 text-xs text-white/40">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-10 rounded-2xl border border-white/8 bg-white/4 p-5 backdrop-blur-sm">
            <p className="text-sm text-white/60 leading-relaxed italic">
              &ldquo;Our enquiries doubled within 3 months of listing on this
              platform. The reach is unmatched.&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500" />
              <div>
                <p className="text-xs font-medium text-white/80">
                  Rahul Mehta
                </p>
                <p className="text-[11px] text-white/40">
                  Owner, Mehta Traders
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Right: Form Panel ─────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 sm:px-12">
        {/* Mobile logo */}
        <Link
          href="/"
          className="mb-10 flex items-center gap-2 lg:hidden"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <svg
              className="h-5 w-5 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <span className="font-semibold text-lg">Business Portal</span>
        </Link>

        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
