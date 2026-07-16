"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to log in. Please check your credentials.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#07111f] p-6 text-[#eff6ff]">
      <div className="top-glow" />
      <div className="w-full max-w-md rounded-2xl border border-[#1d324b] bg-[#0c1929] p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link
            className="brand text-2xl font-bold tracking-tight mb-2"
            href="/"
          >
            Context<span className="text-[#43e8a6]">SOP</span>
          </Link>
          <p className="text-sm text-[#91a3b9]">
            Sign in to access your incident workspace
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[.15em] text-[#91a3b9] mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#1d324b] bg-[#07111f] px-4 py-3 text-sm text-[#eff6ff] outline-none transition focus:border-[#b69cff] focus:ring-1 focus:ring-[#b69cff]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-[.15em] text-[#91a3b9]">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#1d324b] bg-[#07111f] px-4 py-3 text-sm text-[#eff6ff] outline-none transition focus:border-[#b69cff] focus:ring-1 focus:ring-[#b69cff]"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-[#f8717133] bg-[#f8717111] p-4 text-xs text-[#f87171] leading-relaxed">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#43e8a6] py-3.5 text-sm font-semibold text-[#06150f] hover:bg-[#7cf3c3] transition disabled:opacity-50 shadow-[0_8px_32px_rgba(67,232,166,0.15)]"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[#91a3b9]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#43e8a6] hover:underline font-semibold"
          >
            Create an organization
          </Link>
        </p>
      </div>
    </main>
  );
}
