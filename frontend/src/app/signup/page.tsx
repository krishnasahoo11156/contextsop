"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            org_name: orgName,
            role: "owner",
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // Check if user session is active (meaning email confirmation is disabled)
      if (data.session) {
        router.push("/dashboard");
      } else {
        // If email confirmation is enabled, guide the user to verify
        setSuccess(true);
        setLoading(false);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to sign up. Please try again.";
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
            Create a workspace for your engineering team
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#43e8a626] text-[#43e8a6] mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#eff6ff]">
              Check your email
            </h2>
            <p className="text-sm text-[#91a3b9] leading-relaxed">
              We sent a verification link to{" "}
              <strong className="text-[#eff6ff]">{email}</strong>. Please
              confirm your email to activate your workspace.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="text-sm text-[#43e8a6] hover:underline font-semibold"
              >
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[.15em] text-[#91a3b9] mb-2">
                Organization Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Ops"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full rounded-lg border border-[#1d324b] bg-[#07111f] px-4 py-3 text-sm text-[#eff6ff] outline-none transition focus:border-[#b69cff] focus:ring-1 focus:ring-[#b69cff]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[.15em] text-[#91a3b9] mb-2">
                Work Email
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
              <label className="block text-xs font-semibold uppercase tracking-[.15em] text-[#91a3b9] mb-2">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
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
              className="w-full rounded-lg bg-[#b69cff] py-3.5 text-sm font-semibold text-[#07111f] hover:bg-[#cbb8ff] transition disabled:opacity-50 shadow-[0_8px_32px_rgba(182,156,255,0.15)]"
            >
              {loading ? "Creating workspace..." : "Create Free Workspace"}
            </button>
          </form>
        )}

        {!success && (
          <p className="mt-8 text-center text-xs text-[#91a3b9]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#43e8a6] hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
